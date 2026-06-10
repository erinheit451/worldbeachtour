"""
Download Wikimedia images for Copacabana to site/public/copa/ so the page
doesn't rely on hotlinks. Wikimedia rate-limits hotlinked img requests (429s).
"""
import urllib.request
import time
import os
from pathlib import Path

OUT = Path("site/public/copa")
OUT.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": "WorldBeachTour/1.0 (+https://worldbeachtour.com; erinrose451@gmail.com) curator/copacabana-showcase",
}

# Format: (local_filename, wikimedia_thumb_URL_or_file_URL)
# Using thumb paths where possible (smaller files, faster page loads)
IMAGES = [
    # Hero + section images we already use
    ("hero-aerial.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Praia_de_Copacabana_rio.jpg/2560px-Praia_de_Copacabana_rio.jpg"),
    ("mosaic-walkway.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Cal%C3%A7ad%C3%A3o_de_Copacabana.JPG/2048px-Cal%C3%A7ad%C3%A3o_de_Copacabana.JPG"),
    ("pre-expansion-1916.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Vista_a%C3%A9rea_da_praia_de_Copacabana_%28007ALA110%29.jpg/2560px-Vista_a%C3%A9rea_da_praia_de_Copacabana_%28007ALA110%29.jpg"),
    ("copacabana-palace.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Copacabana_Palace_Hotel_Rio.jpg/2048px-Copacabana_Palace_Hotel_Rio.jpg"),
    ("rooftop-night.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Copacabana_Rooftop_View.jpg/2560px-Copacabana_Rooftop_View.jpg"),
    ("historic-1971.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/1/1d/Copacabana_Beach_1971.jpg"),
    ("nye-fireworks.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Rio_New_Year_Fireworks.jpg/2048px-Rio_New_Year_Fireworks.jpg"),
    ("fishermen-dawn.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Amanhecer_com_pescadores_na_praia_de_Copacabana.jpg/2048px-Amanhecer_com_pescadores_na_praia_de_Copacabana.jpg"),
    ("posto-5-sign.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Posto_5_%28praia_de_Copacabana%2C_cidade_do_Rio_de_Janeiro%2C_Brasil%29_.jpg/1920px-Posto_5_%28praia_de_Copacabana%2C_cidade_do_Rio_de_Janeiro%2C_Brasil%29_.jpg"),
    ("olympic-2016.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Parque_Ol%C3%ADmpico_Rio_2016_%28cropped%29.jpg/2048px-Parque_Ol%C3%ADmpico_Rio_2016_%28cropped%29.jpg"),
    ("sugarloaf-night.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Rio_de_Janeiro%2C_Copacabana%2C_the_beach_on_the_left%2C_Christ_Detentor_on_the_right_-_panoramio.jpg/2048px-Rio_de_Janeiro%2C_Copacabana%2C_the_beach_on_the_left%2C_Christ_Detentor_on_the_right_-_panoramio.jpg"),
    ("beach-midday.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Copacabana_Beach.jpg/2048px-Copacabana_Beach.jpg"),
    ("panorama-arc.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Panorama_of_Copacabana_Beach_-_Rio_de_Janeiro_-_Brazil.jpg/3840px-Panorama_of_Copacabana_Beach_-_Rio_de_Janeiro_-_Brazil.jpg"),
    ("beach-soccer-night.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Lascar_Beach_soccer_-_Copacabana_beach_at_night_%284551137949%29.jpg/1920px-Lascar_Beach_soccer_-_Copacabana_beach_at_night_%284551137949%29.jpg"),
    ("mosaic-pattern-detail.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Lascar_Famous_Portuguese_pavement_wave_pattern_at_Copacabana_beach_-_Rio_de_Janeiro_%284551834064%29.jpg/1920px-Lascar_Famous_Portuguese_pavement_wave_pattern_at_Copacabana_beach_-_Rio_de_Janeiro_%284551834064%29.jpg"),
    # Period-appropriate timeline photos
    ("stefan-zweig-1912.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Stefan_Zweig_1900_-_2.png/800px-Stefan_Zweig_1900_-_2.png"),
    ("flying-down-to-rio-poster.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Flying_Down_to_Rio_poster.jpg/800px-Flying_Down_to_Rio_poster.jpg"),
    ("posto-salvamento-1930s.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Posto_de_salvamento_na_Praia_de_Copacabana.tif/lossy-page1-1920px-Posto_de_salvamento_na_Praia_de_Copacabana.tif.jpg"),
    ("av-atlantica-archival.jpg",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Trecho_da_avenida_Atl%C3%A2ntica_%28001ANV022009%29.jpg/2048px-Trecho_da_avenida_Atl%C3%A2ntica_%28001ANV022009%29.jpg"),
]

def download(filename: str, url: str) -> bool:
    out = OUT / filename
    if out.exists() and out.stat().st_size > 5000:
        print(f"  [skip] {filename} ({out.stat().st_size//1024}KB)")
        return True
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        out.write_bytes(data)
        print(f"  [ok]   {filename} ({len(data)//1024}KB)")
        return True
    except Exception as e:
        print(f"  [FAIL] {filename}: {e}")
        return False

if __name__ == "__main__":
    ok = 0
    for fn, url in IMAGES:
        if download(fn, url):
            ok += 1
        time.sleep(1.2)  # be polite to Wikimedia
    print(f"\n{ok}/{len(IMAGES)} downloaded to {OUT}")
