import overpy
import time
import os
import sys
import json
import random
import logging
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
import argparse
from functools import wraps
try:
    from tqdm import tqdm
except ImportError:
    # Fallback if tqdm is not installed
    def tqdm(iterable, **kwargs):
        return iterable

# --- Setup Logging ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("beach_tile_finder.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("beach_finder")

# --- CLI Arguments ---
parser = argparse.ArgumentParser(description="Beach tile finder - identifies tiles worth searching for beaches")
parser.add_argument("--test", action="store_true", help="Run in test mode with a small region")
parser.add_argument("--debug", action="store_true", help="Enable detailed debug output")
parser.add_argument("--output", type=str, default="beach_tiles.txt", help="Output file for beach-viable tiles")
parser.add_argument("--clear-cache", action="store_true", help="Clear existing negative tile cache")
parser.add_argument("--reset-progress", action="store_true", help="Reset progress and scan all tiles again")
parser.add_argument("--max-threads", type=int, default=4, help="Maximum number of parallel threads")
parser.add_argument("--rate-limit", type=float, default=0.5, help="Maximum requests per second to Overpass API")
args = parser.parse_args()

# --- Setup ---
import atexit  # Add this import at the top of your file

api = overpy.Overpass()
debug_mode = args.debug
output_file = args.output
output_lock = threading.Lock()
negative_cache_file = "negative_tiles.json"
request_lock = threading.Lock()  # For rate limiting
tile_query_cache = {}  # Dictionary for query result caching (both positive and negative)
viable_tile_set = set()  # Keep track of already identified viable tiles
cache_save_lock = threading.Lock()
last_saved_time = time.time()  # For time-based negative cache saving

# Set logging level based on debug flag
if debug_mode:
    logger.setLevel(logging.DEBUG)

# Add this to your imports and setup section:
progress_file = "tile_progress.json"
completed_5deg_tiles = set()

# Load progress from file - MOVED AFTER args is defined
if os.path.exists(progress_file) and not args.reset_progress:
    try:
        with open(progress_file, 'r') as f:
            completed_5deg_tiles = set(json.load(f))
        logger.info(f"Loaded {len(completed_5deg_tiles)} completed 5-degree tiles from progress file")
        if debug_mode and completed_5deg_tiles:
            logger.debug(f"First 5 completed tiles: {list(completed_5deg_tiles)[:5]}")
    except Exception as e:
        logger.error(f"Error loading progress file: {e}")
else:
    # Create new progress file
    with open(progress_file, 'w') as f:
        json.dump([], f)
    logger.info("Created new progress tracking file")
    
# Load viable tiles from existing output file
if os.path.exists(output_file):
    try:
        with open(output_file, "r") as f:
            next(f)  # Skip header
            for line in f:
                viable_tile_set.add(line.strip())
        logger.info(f"Loaded {len(viable_tile_set)} existing viable tiles from {output_file}")
    except Exception as e:
        logger.error(f"Error loading existing viable tiles: {e}")

# Load negative tile cache
negative_tiles = set()
if os.path.exists(negative_cache_file) and not args.clear_cache:
    try:
        with open(negative_cache_file, 'r') as f:
            negative_tiles = set(json.load(f))
        logger.info(f"Loaded {len(negative_tiles)} negative tiles from cache")
    except Exception as e:
        logger.error(f"Error loading negative tile cache: {e}")
else:
    if args.clear_cache and os.path.exists(negative_cache_file):
        os.remove(negative_cache_file)
        logger.info("Cleared negative tile cache")
    # Create new cache file
    with open(negative_cache_file, 'w') as f:
        json.dump([], f)
    logger.info("Created new negative tile cache")

# Add this function to save progress
def save_progress():
    """Save the progress of completed 5-degree tiles to disk"""
    with output_lock:  # Use the same lock for thread safety
        try:
            # Always save tile IDs as strings
            with open(progress_file, 'w') as f:
                json.dump(list(completed_5deg_tiles), f)
            logger.info(f"Saved progress: {len(completed_5deg_tiles)} completed 5-degree tiles")
        except Exception as e:
            logger.error(f"Error saving progress: {e}")

# --- Circuit Breaker Implementation ---
class CircuitBreaker:
    def __init__(self, failure_threshold=5, reset_timeout=600):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.reset_timeout = reset_timeout  # in seconds
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
        self.last_failure_time = 0
        self.lock = threading.Lock()
        
    def record_failure(self):
        with self.lock:
            self.failure_count += 1
            self.last_failure_time = time.time()
            if self.failure_count >= self.failure_threshold:
                self.state = "OPEN"
                logger.warning(f"Circuit breaker OPEN after {self.failure_count} failures. Pausing for {self.reset_timeout/60} minutes.")
                
    def record_success(self):
        with self.lock:
            if self.state == "HALF_OPEN":
                self.state = "CLOSED"
                self.failure_count = 0
                logger.info("Circuit breaker reset to CLOSED after successful request.")
                
    def can_execute(self):
        with self.lock:
            if self.state == "CLOSED":
                return True
            
            if self.state == "OPEN":
                # Check if timeout period has elapsed
                if time.time() - self.last_failure_time > self.reset_timeout:
                    self.state = "HALF_OPEN"
                    logger.info("Circuit breaker entering HALF-OPEN state. Attempting a test request.")
                    return True
                return False
                
            if self.state == "HALF_OPEN":
                return True
                
        return False

# Initialize circuit breaker
circuit_breaker = CircuitBreaker(failure_threshold=5, reset_timeout=600)  # 10 minutes timeout

# Register with atexit to ensure progress is saved on exit
atexit.register(save_progress)

# --- Rate Limiting ---
def rate_limited(max_per_second):
    """
    Decorator to rate limit function calls
    """
    min_interval = 1.0 / max_per_second
    last_time_called = [0.0]
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            with request_lock:
                elapsed = time.time() - last_time_called[0]
                if elapsed < min_interval:
                    time.sleep(min_interval - elapsed)
                result = func(*args, **kwargs)
                last_time_called[0] = time.time()
                return result
        return wrapper
    return decorator

# --- Retry Logic ---
def with_retry(max_tries=3, base_delay=1):
    """
    Decorator to retry function calls with exponential backoff
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            tries = 0
            while tries < max_tries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    tries += 1
                    if tries == max_tries:
                        logger.warning(f"All retries failed for {func.__name__}: {e}")
                        raise
                    delay = base_delay * (2 ** (tries - 1)) * (0.5 + random.random())
                    logger.warning(f"Retry {tries}/{max_tries} for {func.__name__} in {delay:.2f}s: {e}")
                    time.sleep(delay)
        return wrapper
    return decorator

# --- Debug Helper ---
def debug_print(msg):
    if debug_mode:
        logger.debug(msg)

# --- Basic exclusion functions ---
def is_deep_ocean(lat, lon):
    """Expanded deep ocean detection"""
    # Original deep ocean areas
    if -15 <= lat <= 15 and (170 <= lon or lon <= -140):
        return True
    if -15 <= lat <= 30 and -45 <= lon <= -20:
        return True
    if -20 <= lat <= 10 and 60 <= lon <= 90:
        return True
    if -60 <= lat <= -45 and not (-75 <= lon <= -45):
        return True
    if lat >= 80:
        return True
        
    # Additional deep ocean regions
    # North Pacific
    if 30 <= lat <= 50 and 160 <= lon <= 180:
        return True
    if 30 <= lat <= 50 and -180 <= lon <= -160:
        return True
        
    # South Pacific
    if -50 <= lat <= -30 and (170 <= lon or lon <= -100):
        return True
        
    # South Atlantic
    if -50 <= lat <= -30 and -40 <= lon <= -10:
        return True
        
    # Indian Ocean South
    if -50 <= lat <= -30 and 20 <= lon <= 120:
        return True
    
    return False

def is_remote_desert(lat, lon):
    """Determine if a coordinate pair is in a large desert area far from water bodies"""
    # Central Sahara Desert (far from oases and wadis)
    if 18 <= lat <= 30 and 5 <= lon <= 25:
        return True
        
    # Central Arabian Desert
    if 18 <= lat <= 28 and 45 <= lon <= 55:
        return True
        
    # Central Australian Desert
    if -28 <= lat <= -22 and 128 <= lon <= 138:
        return True
        
    # Gobi Desert core
    if 40 <= lat <= 45 and 95 <= lon <= 105:
        return True
        
    return False

def is_high_mountain(lat, lon):
    """Determine if a coordinate pair is in a high mountain region far from water bodies"""
    # Central Himalayas
    if 28 <= lat <= 36 and 80 <= lon <= 95:
        return True
        
    # Central Andes
    if -22 <= lat <= -15 and -72 <= lon <= -65:
        return True
        
    # Central Rockies (without major lakes)
    if 40 <= lat <= 45 and -115 <= lon <= -105:
        return True
        
    return False

# --- API Query Function (Rate Limited + Retry) ---
import concurrent.futures

@rate_limited(max_per_second=args.rate_limit)
@with_retry(max_tries=3, base_delay=10)
def query_api(query):
    """Manually enforce timeout on Overpass API query with circuit breaker protection"""
    # Check if circuit is open
    if not circuit_breaker.can_execute():
        logger.warning("Circuit breaker OPEN, skipping query")
        raise Exception("Circuit breaker OPEN, API temporarily disabled")
    
    # Add explicit timeout to the query if not already present
    if "[timeout:" not in query:
        query = query.replace("[out:json];", "[out:json][timeout:90];")
        
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(api.query, query)
        try:
            result = future.result(timeout=90)
            circuit_breaker.record_success()
            return result
        except concurrent.futures.TimeoutError:
            circuit_breaker.record_failure()
            logger.error("Overpass query timed out after 90 seconds")
            raise
        except Exception as e:
            circuit_breaker.record_failure()
            logger.error(f"Overpass query failed: {e}")
            raise
  

# --- Water detection functions ---
def has_water_features(min_lat, min_lon, max_lat, max_lon):
    """Check for water features with optimized query approach"""
    tile_key = f"{min_lat}_{min_lon}_{max_lat}_{max_lon}_water"
    if tile_key in tile_query_cache:
        return tile_query_cache[tile_key]

    # Try the whole tile first instead of subdividing immediately
    query = f"""
    [out:json][timeout:90];
    (
      way["natural"="water"]({min_lat},{min_lon},{max_lat},{max_lon});
      way["waterway"~"river|canal"]({min_lat},{min_lon},{max_lat},{max_lon});
      way["natural"="coastline"]({min_lat},{min_lon},{max_lat},{max_lon});
    );
    out count;
    """

    try:
        result = query_api(query)
        # Check if the query returned any results based on the count
        if hasattr(result, 'count') and result.count.get('ways', 0) > 0:
            tile_query_cache[tile_key] = True
            return True
            
        # If no results in count query, double-check with a more thorough but limited query
        if max_lat - min_lat > 2.5:  # Only for larger tiles
            # Try a smaller query with actual results to be sure
            center_lat = min_lat + (max_lat - min_lat) / 2
            center_lon = min_lon + (max_lon - min_lon) / 2
            
            # Create a 2-degree buffer around center point
            buffer_size = min(1.0, (max_lat - min_lat) / 2)
            
            small_query = f"""
            [out:json][timeout:90];
            (
              way["natural"="water"]({center_lat-buffer_size},{center_lon-buffer_size},{center_lat+buffer_size},{center_lon+buffer_size});
              way["waterway"~"river|canal"]({center_lat-buffer_size},{center_lon-buffer_size},{center_lat+buffer_size},{center_lon+buffer_size});
              way["natural"="coastline"]({center_lat-buffer_size},{center_lon-buffer_size},{center_lat+buffer_size},{center_lon+buffer_size});
            );
            out body;
            """
            
            result = query_api(small_query)
            if len(result.ways) > 0:
                tile_query_cache[tile_key] = True
                return True
    except Exception as e:
        logger.warning(f"Water feature query failed: {e}")
        # If we get an error, default to requiring further investigation
        # This prevents false negatives due to API issues
        return True

    tile_query_cache[tile_key] = False
    return False

def is_land_present(min_lat, min_lon, max_lat, max_lon):
    """Check if there's any land in the tile to avoid deep ocean processing"""
    tile_key = f"{min_lat}_{min_lon}_{max_lat}_{max_lon}_land"
    if tile_key in tile_query_cache:
        return tile_query_cache[tile_key]
        
    # For deep ocean checks, we only need a simple query to see if there's any land
    query = f"""
    [out:json][timeout:90];
    (
      node["place"~"city|town|village"]({min_lat},{min_lon},{max_lat},{max_lon});
      way["landuse"]({min_lat},{min_lon},{max_lat},{max_lon});
      way["natural"="coastline"]({min_lat},{min_lon},{max_lat},{max_lon});
    );
    out count;
    """
    
    try:
        result = query_api(query)
        has_land = hasattr(result, 'count') and (
            result.count.get('nodes', 0) > 0 or 
            result.count.get('ways', 0) > 0
        )
        tile_query_cache[tile_key] = has_land
        return has_land
    except Exception as e:
        logger.warning(f"Land detection query failed: {e}")
        # If query fails, assume there might be land to be safe
        return True

# --- Tile qualification function ---
def is_viable_beach_tile(min_lat, min_lon, max_lat, max_lon):
    """
    Determine if a tile is likely to contain beaches
    Returns True if this tile should be searched for beaches
    """
    # First check if this is a known negative tile
    tile_id = f"{min_lat}_{min_lon}_{max_lat}_{max_lon}"
    if tile_id in negative_tiles:
        debug_print(f"Tile {tile_id} is cached as negative, skipping")
        return False
    
    # Skip deep ocean areas that are obvious non-candidates
    if is_deep_ocean(min_lat, min_lon) and not is_land_present(min_lat, min_lon, max_lat, max_lon):
        # Cache this as a negative tile
        add_to_negative_cache(tile_id)
        return False
    
    # Skip remote desert areas unless they have water features
    if is_remote_desert(min_lat, min_lon):
        if has_water_features(min_lat, min_lon, max_lat, max_lon):
            return True
        else:
            add_to_negative_cache(tile_id)
            return False
    
    # Skip high mountain areas unless they have water features
    if is_high_mountain(min_lat, min_lon):
        if has_water_features(min_lat, min_lon, max_lat, max_lon):
            return True
        else:
            add_to_negative_cache(tile_id)
            return False
    
    # For all other areas, check for water features as a basic requirement
    if has_water_features(min_lat, min_lon, max_lat, max_lon):
        return True
    else:
        add_to_negative_cache(tile_id)
        return False

# --- Negative tile caching with time-based saving ---
def add_to_negative_cache(tile_id):
    """Add a tile to the negative cache with time-based saving"""
    global last_saved_time
    
    if tile_id in negative_tiles:
        return  # Already cached
    
    negative_tiles.add(tile_id)
    
    # Save cache every 5 minutes
    if time.time() - last_saved_time > 300:  # 300 seconds = 5 minutes
        with cache_save_lock:
            if time.time() - last_saved_time > 300:  # Double check inside lock
                save_negative_cache()
                last_saved_time = time.time()

def save_negative_cache():
    """Save the negative tile cache to disk"""
    with output_lock:  # Use the same lock for thread safety
        try:
            with open(negative_cache_file, 'w') as f:
                json.dump(list(negative_tiles), f)
            logger.info(f"Saved {len(negative_tiles)} tiles to negative cache")
        except Exception as e:
            logger.error(f"Error saving negative tile cache: {e}")

# --- Process a single 5-degree tile and subdivide if viable ---
def process_large_tile(tile_5deg):
    """
    Process a 5-degree tile and subdivide into 1-degree tiles if viable
    Returns list of viable 1-degree tiles
    """
    min_lat, min_lon, max_lat, max_lon = tile_5deg
    tile_id = f"{min_lat}_{min_lon}_{max_lat}_{max_lon}"
    display_id = f"{min_lat}_{min_lon}_5deg"

    # ✅ EXIT EARLY: Already done
    if tile_id in completed_5deg_tiles:
        logger.info(f"Tile {display_id} already completed, skipping")
        return []
        
    if tile_id in negative_tiles:
        logger.info(f"Tile {display_id} cached as negative, skipping")
        completed_5deg_tiles.add(tile_id)
        return []

    logger.info(f"Processing 5° tile {display_id}")

    # Quickly check obvious exclusions first
    if is_deep_ocean((min_lat + max_lat)/2, (min_lon + max_lon)/2):
        try:
            # Only do an API call if we're in a potential deep ocean area
            if not is_land_present(min_lat, min_lon, max_lat, max_lon):
                logger.info(f"Tile {display_id}: Deep ocean with no land, skipping")
                add_to_negative_cache(tile_id)
                completed_5deg_tiles.add(tile_id)
                return []
        except Exception as e:
            # If the land check fails, proceed with water check to be safe
            logger.warning(f"Land check failed, proceeding with water check: {e}")

    # Now check for any water features in the entire 5-degree tile
    try:
        if not has_water_features(min_lat, min_lon, max_lat, max_lon):
            logger.info(f"Tile {display_id}: No water features, skipping")
            add_to_negative_cache(tile_id)
            completed_5deg_tiles.add(tile_id)
            return []
    except Exception as e:
        logger.error(f"Error checking water features for tile {display_id}: {e}")
        # Don't mark as completed if we couldn't check properly
        return []

    logger.info(f"Tile {display_id}: Found water features, subdividing...")
    viable_tiles = []
    
    # Process 1-degree tiles with a more targeted approach
    # Use a queue system to prioritize promising areas
    tiles_to_check = []
    
    for lat in range(int(min_lat), int(max_lat)):
        for lon in range(int(min_lon), int(max_lon)):
            full_tile_id = f"{lat}_{lon}_{lat+1}_{lon+1}"
            output_line = f"{lat},{lon},{lat+1},{lon+1}"
            small_tile_id = f"{lat}_{lon}_1deg"

            if full_tile_id in negative_tiles:
                logger.info(f"  Subtile {small_tile_id}: Cached as negative, skipping")
                continue

            if output_line in viable_tile_set:
                logger.info(f"  Subtile {small_tile_id}: Already identified as viable, skipping")
                viable_tiles.append((lat, lon, lat+1, lon+1))
                continue
                
            # Add to queue for processing
            tiles_to_check.append((lat, lon, lat+1, lon+1, small_tile_id))
    
    # Process the queue with some throttling to avoid overwhelming the API
    for i, (lat, lon, lat_max, lon_max, small_tile_id) in enumerate(tiles_to_check):
        # Add small pauses between batches to avoid overwhelming API
        if i > 0 and i % 5 == 0:
            time.sleep(3)  # Small pause every 5 tiles
            
        full_tile_id = f"{lat}_{lon}_{lat_max}_{lon_max}"
        output_line = f"{lat},{lon},{lat_max},{lon_max}"
        
        try:
            if is_viable_beach_tile(lat, lon, lat_max, lon_max):
                logger.info(f"  Subtile {small_tile_id}: Viable for beach search")
                viable_tiles.append((lat, lon, lat_max, lon_max))
                with output_lock:
                    try:
                        with open(output_file, "a") as f:
                            f.write(f"{output_line}\n")
                        viable_tile_set.add(output_line)
                    except Exception as e:
                        logger.error(f"Error writing to output file: {e}")
            else:
                logger.info(f"  Subtile {small_tile_id}: Not viable for beach search")
        except Exception as e:
            logger.error(f"Error processing subtile {small_tile_id}: {e}")
            # Skip but don't mark as done if we encounter an error

    completed_5deg_tiles.add(tile_id)

    # Save progress every 5 tiles
    if len(completed_5deg_tiles) % 5 == 0:
        save_progress()

    return viable_tiles



# --- Main execution ---
def main():
    """Main execution function with batch processing"""
    logger.info(f"=== Beach Tile Finder - Starting ===")
    logger.info(f"Debug mode: {debug_mode}")
    logger.info(f"Test mode: {args.test}")
    logger.info(f"Threads: {args.max_threads}")
    logger.info(f"Output file: {output_file}")
    logger.info(f"Existing viable tiles: {len(viable_tile_set)}")
    logger.info(f"Negative tile cache: {len(negative_tiles)} entries")

    # Check if we should reset progress
    if args.reset_progress:
        completed_5deg_tiles.clear()
        if os.path.exists(progress_file):
            os.remove(progress_file)
        logger.info("Progress reset, will scan all tiles")

    # Create fresh output file with header if needed
    if not os.path.exists(output_file) or args.clear_cache:
        with open(output_file, "w") as f:
            f.write("min_lat,min_lon,max_lat,max_lon\n")
        viable_tile_set.clear()

    # Determine which tiles to process
    if args.test:
        logger.info("Running in test mode (Hawaii)")
        tiles_5deg = [(20, -160, 25, -155)]
    else:
        tiles_5deg = []
        total_possible = 0
        for lat in range(-90, 90, 5):
            for lon in range(-180, 180, 5):
                total_possible += 1
                tile_id = f"{lat}_{lon}_{lat + 5}_{lon + 5}"
                if tile_id not in completed_5deg_tiles:
                    tiles_5deg.append((lat, lon, lat + 5, lon + 5))
        skipped = total_possible - len(tiles_5deg)
        logger.info(f"Skipping {len(completed_5deg_tiles)} tiles already completed. Scanning {len(tiles_5deg)} new tiles...")

    if len(tiles_5deg) == 0:
        logger.info("All tiles already processed! Nothing to do.")
        return

    start_time = time.time()
    viable_tiles = []
    
    # New: Add batch processing
    batch_size = 20  # Process 20 tiles at a time
    for batch_start in range(0, len(tiles_5deg), batch_size):
        batch_end = min(batch_start + batch_size, len(tiles_5deg))
        batch = tiles_5deg[batch_start:batch_end]
        
        logger.info(f"Processing batch {batch_start//batch_size + 1}/{(len(tiles_5deg) + batch_size - 1)//batch_size}: "
                   f"tiles {batch_start+1}-{batch_end} of {len(tiles_5deg)}")
        
        batch_viable_tiles = []
        with ThreadPoolExecutor(max_workers=args.max_threads) as executor:
            future_to_tile = {executor.submit(process_large_tile, tile): tile for tile in batch}
            for future in tqdm(as_completed(future_to_tile), total=len(batch), desc="Scanning Batch", unit="tile"):
                tile = future_to_tile[future]
                try:
                    result = future.result()
                    batch_viable_tiles.extend(result)
                except Exception as e:
                    logger.error(f"Error processing tile {tile}: {e}")
        
        viable_tiles.extend(batch_viable_tiles)
        
        # After each batch, save state and pause briefly
        save_negative_cache()
        save_progress()
        logger.info(f"Batch completed. Found {len(batch_viable_tiles)} viable tiles in this batch.")
        logger.info(f"Pausing for 30 seconds before next batch to let API recover...")
        time.sleep(30)  # Give the API a break between batches

    save_negative_cache()
    save_progress()

    elapsed = time.time() - start_time
    if viable_tiles:
        logger.info(f"Scan completed in {elapsed:.2f} seconds")
        logger.info(f"Found {len(viable_tiles)} new viable 1-degree tiles for beach searching")
    else:
        logger.info(f"Scan completed in {elapsed:.2f} seconds, no new tiles found")

    logger.info(f"Total viable tiles in output: {len(viable_tile_set)}")
    logger.info(f"Negative cache entries: {len(negative_tiles)}")
    logger.info(f"Completed 5-degree tiles: {len(completed_5deg_tiles)}")
    logger.info(f"=== Beach Tile Finder - Finished ===")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("Program interrupted by user")
        # Save both caches on interrupt
        save_negative_cache()
        save_progress()  # Add this line
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unhandled exception: {e}", exc_info=True)
        # Save both caches on error
        save_negative_cache()
        save_progress()  # Add this line
        sys.exit(1)