"""Second pass: download the images that failed with corrected URLs from the research agent."""
import urllib.request, time
from pathlib import Path

OUT = Path("site/public/copa")
HEADERS = {"User-Agent": "WorldBeachTour/1.0 (+https://worldbeachtour.com; erinrose451@gmail.com)"}

CORRECTED = [
    ("nye-fireworks.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/ed/Rio_New_Year_Fireworks.jpg"),
    ("fishermen-dawn.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/7b/Amanhecer_com_pescadores_na_praia_de_copacabana.jpg"),
    ("posto-5-sign.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/40/Posto_5_%28praia_de_Copacabana%2C_cidade_do_Rio_de_Janeiro%2C_Brasil%29_.jpg"),
    ("beach-soccer-night.jpg", "https://upload.wikimedia.org/wikipedia/commons/d/d9/Lascar_Beach_soccer_-_Copacabana_beach_at_night_%284551137949%29.jpg"),
    ("mosaic-pattern-detail.jpg", "https://upload.wikimedia.org/wikipedia/commons/f/f3/Lascar_Famous_Portuguese_pavement_wave_pattern_at_Copacabana_beach_%284551834064%29.jpg"),
    ("stefan-zweig.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/13/Stefan_Zweig_1900.jpg"),
    ("flying-down-to-rio-poster.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/9a/Poster_-_Flying_Down_to_Rio_01.jpg"),
    ("forte-1930.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/45/Alfredo_Storni_-_Washington_Lu%C3%ADs_no_Forte_de_Copacabana.jpg"),
]

for fn, url in CORRECTED:
    out = OUT / fn
    if out.exists() and out.stat().st_size > 5000:
        print(f"  [skip] {fn}")
        continue
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        out.write_bytes(data)
        print(f"  [ok] {fn} ({len(data)//1024}KB)")
    except Exception as e:
        print(f"  [FAIL] {fn}: {e}")
    time.sleep(1.2)
