"""Third pass: 12 new photos confirmed by research agent for Copa page gaps."""
import urllib.request, time
from pathlib import Path

OUT = Path("site/public/copa")
HEADERS = {"User-Agent": "WorldBeachTour/1.0 (+https://worldbeachtour.com; erinrose451@gmail.com)"}

NEW = [
    ("golden-hour-arpoador.jpg", "https://upload.wikimedia.org/wikipedia/commons/b/b0/Amanhecer_no_Arpoador_-_rio_de_Janeiro..jpg"),
    ("frigatebird-flight.jpg",   "https://upload.wikimedia.org/wikipedia/commons/a/a1/Magnificent_frigatebird_%28Fregata_magnificens%29_in_flight_from_behind_Panama_0771.jpg"),
    ("surfer-copa.jpg",          "https://upload.wikimedia.org/wikipedia/commons/4/42/Woman_in_Surf_-_Copacabana_Beach_-_Rio_de_Janeiro_-_Brazil_%285984385853%29.jpg"),
    ("plano-inclinado.jpg",      "https://upload.wikimedia.org/wikipedia/commons/8/85/Plano_Inclinado_do_Pav%C3%A3o-Pav%C3%A3ozinho.jpg"),
    ("mirante-cantagalo.jpg",    "https://upload.wikimedia.org/wikipedia/commons/b/b0/Cantagalo%E2%80%93Pav%C3%A3o%E2%80%93Pav%C3%A3ozinho.jpg"),
    ("kiosk-drinkstall.jpg",     "https://upload.wikimedia.org/wikipedia/commons/8/80/CopacabanaDrinkStall.JPG"),
    ("caipirinha.jpg",           "https://upload.wikimedia.org/wikipedia/commons/a/ae/Caipirinha_2.jpg"),
    ("tom-jobim.jpg",            "https://upload.wikimedia.org/wikipedia/commons/f/fc/Ant%C3%B4nio_Carlos_Jobim.jpg"),
    ("ipanema-dois-irmaos.jpg",  "https://upload.wikimedia.org/wikipedia/commons/7/74/Praia_de_Ipanema%2C_morro_Dois_Irm%C3%A3os_e_Pedra_da_G%C3%A1vea_ao_fundo_%28002054VIAN000%29.jpg"),
    ("leblon-beach.jpg",         "https://upload.wikimedia.org/wikipedia/commons/a/aa/Leblon_beach.jpg"),
    ("arpoador-sunset.jpg",      "https://upload.wikimedia.org/wikipedia/commons/d/d1/Arpoador%2C_p%C3%B4r_do_sol.jpg"),
    ("humpback-breach.jpg",      "https://upload.wikimedia.org/wikipedia/commons/b/ba/001_Humpback_whale_breaching_in_Ballena_Marine_National_Park_Photo_by_Giles_Laurent.jpg"),
]

ok = 0
for fn, url in NEW:
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
print(f"\n{ok}/{len(NEW)}")
