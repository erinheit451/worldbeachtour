"""
Computed enrichment: best_months and swim_suitability.

Both derived from climate profiles already stored on the beach row.
No API calls — pure computation.
"""

import json
from tqdm import tqdm

MONTH_NAMES = ["jan", "feb", "mar", "apr", "may", "jun",
               "jul", "aug", "sep", "oct", "nov", "dec"]


def compute_best_months(
    air_temp_high: list | None,
    rain_mm: list | None,
    sun_hours: list | None,
    wind_speed: list | None,
) -> list[str] | None:
    """Compute best months to visit from climate arrays.

    Scores each month 0-100 based on:
    - Temperature: ideal range 22-30°C (40% weight)
    - Rain: less is better (25% weight)
    - Sunshine: more is better (25% weight)
    - Wind: less is better (10% weight)

    Returns month names with score >= 60% of the best month's score.
    """
    if not air_temp_high:
        return None

    scores = []
    for m in range(12):
        score = 0.0
        components = 0

        # Temperature score (0-40): ideal is 22-30°C
        if air_temp_high and air_temp_high[m] is not None:
            t = air_temp_high[m]
            if 22 <= t <= 30:
                temp_score = 40
            elif t < 22:
                temp_score = max(0, 40 - (22 - t) * 4)
            else:
                temp_score = max(0, 40 - (t - 30) * 4)
            score += temp_score
            components += 1

        # Rain score (0-25): 0mm = 25, 200mm+ = 0
        if rain_mm and rain_mm[m] is not None:
            rain_score = max(0, 25 - rain_mm[m] / 8)
            score += rain_score
            components += 1

        # Sunshine score (0-25): 300hrs = 25, 0hrs = 0
        if sun_hours and sun_hours[m] is not None:
            sun_score = min(25, sun_hours[m] / 12)
            score += sun_score
            components += 1

        # Wind score (0-10): 0km/h = 10, 30+ = 0
        if wind_speed and wind_speed[m] is not None:
            wind_score = max(0, 10 - wind_speed[m] / 3)
            score += wind_score
            components += 1

        scores.append(score if components > 0 else 0)

    if not scores or max(scores) == 0:
        return None

    threshold = max(scores) * 0.7
    return [MONTH_NAMES[m] for m in range(12) if scores[m] >= threshold]


def compute_swim_suitability(
    water_body_type: str,
    wave_height_m: list | None,
    water_quality: str | None,
    tide_range_m: float | None,
) -> tuple[str, str]:
    """Compute swim suitability rating and confidence.

    Returns (rating, confidence) where:
    - rating: excellent, good, fair, poor, dangerous
    - confidence: high (ocean w/ full data), medium (partial), low (sparse)
    """
    score = 50  # Start at neutral
    data_points = 0

    # Water quality (strong signal)
    if water_quality:
        data_points += 1
        quality_scores = {"excellent": 30, "good": 15, "sufficient": 0, "poor": -30}
        score += quality_scores.get(water_quality, 0)

    # Wave height (ocean only — use summer average)
    if wave_height_m and water_body_type == "ocean":
        data_points += 1
        avg_wave = sum(h for h in wave_height_m if h is not None) / max(
            1, sum(1 for h in wave_height_m if h is not None)
        )
        if avg_wave < 0.5:
            score += 20  # Calm
        elif avg_wave < 1.0:
            score += 10
        elif avg_wave < 2.0:
            score += 0
        elif avg_wave < 3.0:
            score -= 15
        else:
            score -= 30  # Dangerous

    # Tide range (ocean only)
    if tide_range_m is not None and water_body_type == "ocean":
        data_points += 1
        if tide_range_m < 2:
            score += 5
        elif tide_range_m > 6:
            score -= 10

    # Lake/river: generally swimmable if water quality is OK
    if water_body_type in ("lake", "river") and not water_quality:
        score += 10  # Assume decent for inland

    # Determine rating
    if score >= 80:
        rating = "excellent"
    elif score >= 60:
        rating = "good"
    elif score >= 40:
        rating = "fair"
    elif score >= 20:
        rating = "poor"
    else:
        rating = "dangerous"

    # Determine confidence
    if water_body_type == "ocean" and data_points >= 3:
        confidence = "high"
    elif data_points >= 1:
        confidence = "medium"
    else:
        confidence = "low"

    return rating, confidence


def enrich_best_months_and_swim(conn) -> int:
    """Compute best_months and swim_suitability for all beaches with climate data."""
    rows = conn.execute(
        """SELECT id, water_body_type, climate_air_temp_high, climate_rain_mm,
           climate_sun_hours, climate_wind_speed, ocean_wave_height_m,
           water_quality_rating, tide_range_spring_m
           FROM beaches WHERE climate_air_temp_high IS NOT NULL AND best_months IS NULL"""
    ).fetchall()

    count = 0
    for row in tqdm(rows, desc="Computing best months + swim suitability"):
        temp_high = json.loads(row["climate_air_temp_high"]) if row["climate_air_temp_high"] else None
        rain = json.loads(row["climate_rain_mm"]) if row["climate_rain_mm"] else None
        sun = json.loads(row["climate_sun_hours"]) if row["climate_sun_hours"] else None
        wind = json.loads(row["climate_wind_speed"]) if row["climate_wind_speed"] else None
        waves = json.loads(row["ocean_wave_height_m"]) if row["ocean_wave_height_m"] else None

        best = compute_best_months(temp_high, rain, sun, wind)
        swim_rating, swim_conf = compute_swim_suitability(
            row["water_body_type"], waves, row["water_quality_rating"], row["tide_range_spring_m"]
        )

        conn.execute(
            """UPDATE beaches SET best_months = ?, swim_suitability = ?,
               swim_suitability_confidence = ?, updated_at = datetime('now')
               WHERE id = ?""",
            (json.dumps(best) if best else None, swim_rating, swim_conf, row["id"]),
        )
        count += 1
        if count % 10000 == 0:
            conn.commit()

    conn.commit()
    print(f"Best months + swim suitability: computed for {count} beaches")
    return count


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    enrich_best_months_and_swim(conn)
    conn.close()
