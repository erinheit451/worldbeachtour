"""Download Brighton photos from Wikimedia Commons to site/public/brighton/."""
import urllib.request, time
from pathlib import Path

OUT = Path("site/public/brighton")
OUT.mkdir(parents=True, exist_ok=True)
HEADERS = {"User-Agent": "WorldBeachTour/1.0 (+https://worldbeachtour.com; erinrose451@gmail.com)"}

IMAGES = [
    # Using thumb URLs where originals are oversized (>5MB)
    ("hero-seafront-dusk.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Brighton_seafront_panorama_at_dusk_in_September_2013.jpeg/3840px-Brighton_seafront_panorama_at_dusk_in_September_2013.jpeg"),
    ("palace-pier.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Brighton_Palace_Pier_2023-07-09_174604.jpg/2560px-Brighton_Palace_Pier_2023-07-09_174604.jpg"),
    ("west-pier-ruin.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Brighton_Pier_-_View_WNW_on_remainder_of_West_Pier_1872_-_Destroyed_by_fire_in_March_2003.jpg/2560px-Brighton_Pier_-_View_WNW_on_remainder_of_West_Pier_1872_-_Destroyed_by_fire_in_March_2003.jpg"),
    ("royal-pavilion.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/6/69/Brighton_Royal_Pavilion.jpg"),
    ("pride-2022.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/7/77/BrightonPride2022.jpg"),
    ("mod-scooter-rally.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Scooter_rally_%286910749772%29.jpg/2048px-Scooter_rally_%286910749772%29.jpg"),
    ("pebble-beach.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/6/65/Only_pebbles_-_geograph.org.uk_-_2962633.jpg"),
    ("the-lanes.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/b/b2/TheLanes-Brighton.jpg"),
    ("i360.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Brighton_i360_with_the_moon_2025-07-02.jpg/2560px-Brighton_i360_with_the_moon_2025-07-02.jpg"),
    ("volks-railway.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/1/1a/Brighton_MMB_06_Volks_Electric_Railway.jpg"),
    ("grand-hotel.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/a/a2/Grand_Hotel%2C_King%27s_Road%2C_Brighton_%28IoE_Code_482017%29.jpg"),
    ("saltdean-lido.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Saltdean_Lido_-_geograph.org.uk_-_2105537.jpg/2560px-Saltdean_Lido_-_geograph.org.uk_-_2105537.jpg"),
    ("west-pier-fire-2003.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/2/26/West_Pier_fire_with_boat_20030328.jpg"),
    ("kemptown-street.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/9/93/Scene_in_Kemptown%2C_Brighton_-_geograph.org.uk_-_6384380.jpg"),
    ("sunset-pier.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/1/18/Brighton_sunset_with_Brighton_%28Palace%29_Pier%2C_East_Sussex_-_geograph.org.uk_-_835463.jpg"),
]

ok = 0
for fn, url in IMAGES:
    out = OUT / fn
    if out.exists() and out.stat().st_size > 5000:
        print(f"  [skip] {fn}"); ok += 1; continue
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=60) as r: data = r.read()
        out.write_bytes(data); ok += 1
        print(f"  [ok] {fn} ({len(data)//1024}KB)")
    except Exception as e:
        print(f"  [FAIL] {fn}: {e}")
    time.sleep(1.2)
print(f"\n{ok}/{len(IMAGES)}")
