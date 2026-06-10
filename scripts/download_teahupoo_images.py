"""Download Teahupoʻo images from Wikimedia Commons via Special:FilePath thumbnails.

Uses Special:FilePath?width=N which serves from the thumbnailing infrastructure
(distinct from the upload.wikimedia.org rate-limit pool that 429s on bulk
direct downloads). Adds 1.2s pacing between requests per Wikimedia etiquette.
"""
from __future__ import annotations
import urllib.request, urllib.parse
import time
from pathlib import Path

OUT = Path("site/public/teahupoo")
OUT.mkdir(parents=True, exist_ok=True)

# (filename_local, commons_filename, width)
IMAGES = [
    ("hero-laird.jpg", "TeahupooLaird.jpg", 2400),
    ("wave-aerial-1.jpg", "Vague_de_Teahupoo_(Tahiti)_(Ifremer_00783-89469_-_49353).jpg", 2400),
    ("wave-aerial-2.jpg", "Surf_sur_la_Vague_de_Teahupoo_(Tahiti)_(Ifremer_00783-89468_-_49343).jpg", 2400),
    ("wave-aerial-3.jpg", "Surf_sur_la_Vague_de_Teahupoo_(Tahiti)_(Ifremer_00783-89468_-_49346).jpg", 2400),
    ("wave-aerial-4.jpg", "Surf_sur_la_Vague_de_Teahupoo_(Tahiti)_(Ifremer_00783-89468_-_49349).jpg", 2400),
    ("wave-channel.jpg", "Teahupoo_Wave.jpg", 2000),
    ("pk-marker.jpg", "Teahupoo_pk.jpg", 1800),
    ("village-sign.jpg", "Teahupoo.JPG", 1600),
    ("village-arrival.jpg", "Teahupoo2011.jpg", 1800),
    ("tahiti-from-orbit.png", "Tahiti_seen_from_above!_(Copernicus_2024-07-30).png", 2400),
    ("tahiti-iti-coast.jpg", "Tahiti,_French_Polynesia_-_Teahupo'o_(48041249403).jpg", 2000),
    ("lagoon-mountains.jpg", "Tahiti,_French_Polynesia_-_Teahupo'o_(48059019436).jpg", 2000),
    ("channel-view.jpg", "Tahiti,_French_Polynesia_-_Teahupo'o_(48041311167).jpg", 2000),
    ("shoreline.jpg", "Tahiti,_French_Polynesia_-_Teahupo'o_(48041216271).jpg", 2000),
    ("vahine-fierro.jpg", "Vahine_Fierro_à_Teahupoo.jpg", 1600),
    ("paea-multi-surfers.jpg", "La_horde_-_Surfers_riding_a_wave_in_Paea,_Tahiti.jpg", 2000),
    ("tahiti-surf-cult.jpg", "Le_culte_du_surf_à_Tahiti.jpg", 1800),
    ("surf-riding-1858.jpg", "Surf-riding_1858.jpg", 1600),
    ("olo-board.jpg", "Olo_board.jpg", 1200),
    ("tahitian-canoes-martin.jpg", "Tahitian_sailing_canoes,_painting_by_Henry_Byam_Martin.jpg", 1800),
    ("tahitian-canoes-1827.jpg", "Tahitian_warrior_dugouts,_Le_Costume_Ancien_et_Moderne_by_Giulio_Ferrario,_1827.jpg", 1800),
    ("aranui-5.jpg", "Aranui_5.jpg", 1800),
]

ua = "WorldBeachTour/1.0 (https://worldbeachtour.com; admin contact via site)"
base = "https://commons.wikimedia.org/wiki/Special:FilePath/"

ok = fail = skipped = 0
for fname, commons_name, width in IMAGES:
    out_path = OUT / fname
    if out_path.exists():
        print(f"SKIP {fname} (exists)")
        skipped += 1
        continue
    url = base + urllib.parse.quote(commons_name) + f"?width={width}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": ua})
        with urllib.request.urlopen(req, timeout=45) as r:
            data = r.read()
        out_path.write_bytes(data)
        print(f"OK   {fname}  ({len(data)//1024} KB)")
        ok += 1
    except Exception as e:
        print(f"FAIL {fname}: {e}")
        fail += 1
    time.sleep(1.2)

print(f"\nDone: {ok} ok / {fail} fail / {skipped} skip")
