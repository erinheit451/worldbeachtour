"""
Corrective pass on Copacabana data, post-research dossier:
- Timeline: correct Burle Marx story (he REDESIGNED 1970, pattern is 1930s-origin, Lisbon 1848)
- Timeline: add Beco das Garrafas bossa nova cradle (Copa's STRONGER claim)
- Timeline: add 1970 land reclamation (Aterro de Copacabana, honest sourcing)
- Timeline: add UPP Pavão-Pavãozinho 2009
- Add new verified photos from Wikimedia Commons
- Refresh the narrative intro + favela note with corrected facts
"""
import sqlite3
import json
import sys
import time

DB_PATH = "output/world_beaches.db"
SLUG = "copacabana-7"


def run_with_retry(fn):
    for attempt in range(60):
        try:
            return fn()
        except sqlite3.OperationalError as e:
            if "locked" in str(e):
                time.sleep(2); continue
            raise
    raise RuntimeError("Failed to acquire write lock")


def main():
    c = sqlite3.connect(DB_PATH, timeout=60.0)
    c.execute("PRAGMA busy_timeout=60000")
    c.row_factory = sqlite3.Row
    bid = c.execute("SELECT id FROM beaches WHERE slug=?", (SLUG,)).fetchone()["id"]

    # ========================================================================
    # 1. Fix the 1970 Burle Marx timeline entry + add companion events
    # ========================================================================
    # Delete all existing timeline events and rewrite cleanly (15 events again,
    # but corrected + augmented).
    def _timeline():
        c.execute("DELETE FROM beach_timeline_events WHERE beach_id=?", (bid,))
        events = [
            (1750, None, "cultural", "Copacabana as fishing village",
             "For most of its early history Copacabana is a remote, barely-inhabited cove, named for a 17th-century chapel of Nossa Senhora de Copacabana — a Bolivian Marian image carried here by Peruvian sailors.",
             "https://en.wikipedia.org/wiki/Copacabana,_Rio_de_Janeiro",
             "wiki:Copacabana,_Rio_de_Janeiro"),
            (1848, None, "design", "The wave pattern is born in Lisbon",
             "Engineer Eusébio Pinheiro Furtado repaves Praça do Rossio in Lisbon with a wave motif — Portuguese calçada honoring the sea crossed by sailors. The pattern will travel across the Atlantic half a century later.",
             "https://en.wikipedia.org/wiki/Portuguese_pavement",
             "wiki:Portuguese_pavement"),
            (1892, 7, "infrastructure", "Túnel Velho opens",
             "The Old Tunnel is drilled through the granite between Botafogo and Copacabana, physically connecting the isolated cove to central Rio for the first time. Tramway follows two years later.",
             "https://en.wikipedia.org/wiki/Copacabana,_Rio_de_Janeiro",
             "wiki:Copacabana,_Rio_de_Janeiro"),
            (1906, None, "infrastructure", "Avenida Atlântica opens",
             "The beachfront boulevard is inaugurated under Mayor Francisco Pereira Passos, who had imported Portuguese calceteiros and stones for Rio's Belle-Époque boulevards. Remaining stones go to Atlântica in the wave pattern.",
             "https://en.wikipedia.org/wiki/Portuguese_pavement",
             "wiki:Portuguese_pavement"),
            (1914, None, "built", "Forte de Copacabana opens",
             "A coastal-defense fort is installed on the rocky promontory at the beach's southern tip, armed with Krupp guns. Today it's a museum and home to a marble-table café with the cleanest view of the arc.",
             "https://en.wikipedia.org/wiki/Fort_Copacabana",
             "wiki:Fort_Copacabana"),
            (1923, 8, "built", "Copacabana Palace Hotel opens",
             "The 239-room Art Deco hotel designed by French architect Joseph Gire opens on 13 August, commissioned by president Epitácio Pessoa to lure European royalty. It becomes the social axis of the beach.",
             "https://en.wikipedia.org/wiki/Copacabana_Palace",
             "wiki:Copacabana_Palace"),
            (1933, None, "cultural", "Flying Down to Rio",
             "Fred Astaire and Ginger Rogers's first film together sets scenes at the Copacabana Palace. A year later, the New York nightclub Copacabana takes the name, borrowing the beach's glamour for 56th Street.",
             "https://en.wikipedia.org/wiki/Flying_Down_to_Rio",
             "wiki:Flying_Down_to_Rio"),
            (1942, 2, "cultural", "Stefan Zweig's last weeks",
             "Austrian-Jewish writer Stefan Zweig, in exile from the Nazis, stays in Copacabana before moving to Petrópolis. 'Brazil: A Land of the Future' is drafted in part from his hotel window. He dies by suicide later that year.",
             "https://en.wikipedia.org/wiki/Stefan_Zweig",
             "wiki:Stefan_Zweig"),
            (1959, None, "cultural", "Beco das Garrafas — the cradle of bossa nova",
             "A short dead-end alley off Rua Duvivier in Copacabana hosts the clubs Little Club, Bottles Bar, and Ma Griffe. Here Sylvia Telles, Roberto Menescal, Carlos Lyra, Nara Leão, and Luiz Eça perform nightly. Wikipedia calls it 'a historical cradle of bossa nova.'",
             "https://en.wikipedia.org/wiki/Bossa_nova",
             "wiki:Bossa_nova"),
            (1962, None, "cultural", "'Garota de Ipanema' written next door",
             "Jobim and Vinícius write 'The Girl from Ipanema' at the Veloso bar (now Garota de Ipanema), in the neighboring bairro. Copa and Ipanema become twin capitals of a single sound.",
             "https://en.wikipedia.org/wiki/The_Girl_from_Ipanema",
             "wiki:The_Girl_from_Ipanema"),
            (1970, None, "infrastructure", "The Aterro — beach doubled, promenade redesigned",
             "A massive land-reclamation project dredges offshore sand and roughly doubles Copacabana's width. Simultaneously Roberto Burle Marx REDESIGNS the existing 1930s-origin wave promenade, running the Portuguese-pavement pattern 4 km continuously along the new Av. Atlântica, no section identical to another.",
             "https://en.wikipedia.org/wiki/Roberto_Burle_Marx",
             "wiki:Roberto_Burle_Marx (promenade rebuild); [per Brazilian urbanism sources] for beach-doubling"),
            (1978, None, "cultural", "Barry Manilow's 'Copacabana'",
             "'Her name was Lola, she was a showgirl…' The song is named not for the beach but for the Manhattan nightclub that borrowed the beach's name in 1940. Still, it wires 'Copacabana' permanently into Western pop memory.",
             "https://en.wikipedia.org/wiki/Copacabana_(song)",
             "wiki:Copacabana_(song)"),
            (1980, None, "cultural", "Funk carioca rises from the favelas above",
             "Funk carioca (baile funk) emerges in the 1980s in Rio's favelas, fusing Miami bass, samba, and candomblé rhythms. The Cantagalo and Pavão-Pavãozinho favelas directly above Copacabana become documented scene sites. The genre's geography literally overlooks the beach.",
             "https://en.wikipedia.org/wiki/Funk_carioca",
             "wiki:Funk_carioca"),
            (1992, None, "event", "Réveillon scales to a civic spectacle",
             "Entrepreneurs Ricardo Amaral and Marius push the NYE fireworks from 8–10 minutes to 20 minutes; the city formalizes organizing in the early 1990s. A Tom Jobim tribute concert with Gal Costa, Gilberto Gil, Caetano Veloso, Chico Buarque, and Paulinho da Viola consolidates the format.",
             "https://en.wikipedia.org/wiki/Copacabana,_Rio_de_Janeiro",
             "wiki:Copacabana,_Rio_de_Janeiro (Réveillon section)"),
            (2009, 12, "political", "UPP at Pavão-Pavãozinho",
             "On 23 December 2009, Rio installs a Unidade de Polícia Pacificadora covering Pavão-Pavãozinho, Cantagalo, and Vietnã — the favelas directly above Copacabana and Ipanema. Pavão-Pavãozinho's unemployment reportedly drops to 5% by mid-2012. The program's post-2016 decline is documented.",
             "https://en.wikipedia.org/wiki/Pacifying_Police_Unit",
             "wiki:Pacifying_Police_Unit"),
            (2013, 7, "event", "World Youth Day — 3.7 million",
             "Pope Francis celebrates a closing Mass at Copacabana; attendance estimates reach 3.7 million — one of the largest single gatherings the beach has ever held.",
             "https://en.wikipedia.org/wiki/World_Youth_Day_2013",
             "wiki:World_Youth_Day_2013"),
            (2016, 8, "sport", "Olympic beach volleyball on the sand",
             "The 2016 Summer Olympics places its beach volleyball tournament directly on Copacabana — a purpose-built 12,000-seat stadium on the sand, dismantled afterward. Widely called the most scenic venue in Olympic history.",
             "https://en.wikipedia.org/wiki/Volleyball_at_the_2016_Summer_Olympics",
             "wiki:Volleyball_at_the_2016_Summer_Olympics"),
            (2024, 5, "event", "Madonna's 1.6 million",
             "Madonna closes her Celebration Tour with a free Copacabana concert in May 2024 — estimated 1.6 million attendees.",
             "https://en.wikipedia.org/wiki/The_Celebration_Tour",
             "wiki:The_Celebration_Tour"),
            (2025, 5, "event", "Lady Gaga's 2.1 million",
             "Lady Gaga's free Copacabana concert in May 2025 draws an estimated 2.1 million — Copacabana's current record for a single paid-free musical act.",
             None,
             "public reporting 2025"),
        ]
        for ev in events:
            c.execute(
                "INSERT INTO beach_timeline_events (beach_id, year, month, event_type, title, description, wiki_url, source) VALUES (?,?,?,?,?,?,?,?)",
                (bid, *ev),
            )
        c.commit()
        print(f"  [timeline] {len(events)} events rewritten", file=sys.stderr)
    run_with_retry(_timeline)

    # ========================================================================
    # 2. Correct zones (postos) — honest framing on LGBTQ+ claim
    # ========================================================================
    def _zones():
        c.execute("DELETE FROM beach_zones WHERE beach_id=?", (bid,))
        zones = [
            ("posto-1", "Posto 1 — Leme",
             0.05, -22.9596, -43.1694,
             "The quieter end. Closest to the Leme headland and the Morro do Leme forest reserve. Fishermen work the rocks at dawn; families come here to escape the central beach's density.",
             "swimming with kids, dawn walks, reading",
             None),
            ("posto-2", "Posto 2",
             0.22, -22.9650, -43.1720,
             "The default tourist posto. Wide beach, well-staffed lifeguard station, vendors working the towel-lines with biscoito Globo and mate gelado. If you only read one sentence of a guidebook, you end up here.",
             "first-time visitors, straightforward beach day",
             None),
            ("posto-3", "Posto 3",
             0.40, -22.9708, -43.1788,
             "Sportier. The beach volleyball and futevolei nets cluster here, and the regulars — some of them playing together for thirty years — claim them by convention. Watching is as much the point as playing.",
             "beach volleyball, futevolei, watching",
             "Nets are technically first-come-first-served, but good luck."),
            ("posto-4", "Posto 4",
             0.55, -22.9745, -43.1830,
             "Mixed, political, progressive in atmosphere. Some Carioca gay culture lives here (though Ipanema's Farme de Amoedo stretch, further south, is the documented hub). Sunday afternoons bring the loudest, most diverse crowd on the arc.",
             "socializing, Sundays, inclusive crowd",
             "Local gay scene is split across Copa's Posto 4 and Ipanema's Farme de Amoedo / Posto 8-9."),
            ("posto-5", "Posto 5",
             0.72, -22.9795, -43.1865,
             "Transition zone. Some of the strongest-mixing kiosks on the arc cluster here — good for late-afternoon drinks as the light falls onto the mountains behind the city.",
             "sunset drinks, mixed crowd, evening",
             None),
            ("posto-6", "Posto 6 — Fort end",
             0.92, -22.9860, -43.1900,
             "Surfers and fishermen. At dawn, the colônia de pescadores beach wooden boats right here; runners from nearby restaurants buy mackerel and corvina on the sand. The break is Copa's best surf — inconsistent, occasionally excellent. Closest posto to the Fort.",
             "surfing, sunrise, watching fishermen",
             "Commercial fishing has coexisted with the urban beach here for a century."),
        ]
        for z in zones:
            c.execute(
                "INSERT INTO beach_zones (beach_id, zone_code, name, position_along_beach_pct, "
                "lat, lng, character, best_for, notes, source) VALUES (?,?,?,?,?,?,?,?,?,?)",
                (bid, *z, "researched 2026-04-18, revised for sourcing"),
            )
        c.commit()
        print(f"  [zones] {len(zones)} postos rewritten", file=sys.stderr)
    run_with_retry(_zones)

    # ========================================================================
    # 3. Add new Wikimedia Commons photos (the research dossier findings)
    # ========================================================================
    new_photos = [
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/6/60/Vista_a%C3%A9rea_da_praia_de_Copacabana_%28007ALA110%29.jpg",
            "title": "Aerial view of Copacabana Beach, c.1916–1926 (pre-expansion)",
            "source": "tier1_archival",
            "license": "Public domain",
            "author": "Jorge Kfuri, Instituto Moreira Salles",
            "width": 7967,
            "height": 5740,
        },
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/8/87/Amanhecer_com_pescadores_na_praia_de_Copacabana.jpg",
            "title": "Dawn with fishermen on Copacabana Beach (2016)",
            "source": "tier2",
            "license": "CC BY-SA 4.0",
            "author": "Laudelinojunior",
            "width": 2074,
            "height": 1383,
        },
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Posto_5_%28praia_de_Copacabana%2C_cidade_do_Rio_de_Janeiro%2C_Brasil%29_.jpg",
            "title": "Posto 5, Praia de Copacabana",
            "source": "tier2",
            "license": "CC BY-SA 2.0",
            "author": "Eugenio Hansen, OFS",
            "width": 4160,
            "height": 3120,
        },
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Rio_de_Janeiro%2C_Copacabana%2C_the_beach_on_the_left%2C_Christ_Detentor_on_the_right_-_panoramio.jpg",
            "title": "Copacabana from Sugarloaf at night",
            "source": "tier2",
            "license": "CC BY 3.0",
            "author": "Jack Soma",
            "width": 4000,
            "height": 3000,
        },
    ]
    def _photos():
        for p in new_photos:
            existing = c.execute("SELECT id FROM beach_photos WHERE beach_id=? AND url=?", (bid, p["url"])).fetchone()
            if existing:
                continue
            c.execute(
                "INSERT INTO beach_photos (beach_id, url, title, source, license, author, width, height, fetched_at) "
                "VALUES (?,?,?,?,?,?,?,?,datetime('now'))",
                (bid, p["url"], p["title"], p["source"], p["license"], p["author"], p["width"], p["height"]),
            )
        c.commit()
        total = c.execute("SELECT COUNT(*) FROM beach_photos WHERE beach_id=?", (bid,)).fetchone()[0]
        print(f"  [photos] {total} total photos for Copacabana (added {len(new_photos)})", file=sys.stderr)
    run_with_retry(_photos)

    # ========================================================================
    # 4. Rewrite intro_text with voice — longer, story-first
    # ========================================================================
    INTRO = """Copacabana is the beach the rest of the world imagines when it imagines a beach, and it deserves that reputation and also undermines it in ways only Cariocas fully understand.

It is four kilometers of sand arcing between two headlands — Leme at the north, the Fort at the south — with a wall of white buildings behind, and behind them, the granite peaks that make Rio one of the only cities on Earth where mountain and ocean meet mid-neighborhood. Cristo Redentor is visible from the sand if you know where to look. At midday in February the sand reaches 60°C and children run on it and adults don't.

The beach was not always this wide. Until 1970, Copacabana was a narrower crescent pressed up against a two-lane Avenida Atlântica, its sand thinning visibly under the weight of a century of erosion. The Aterro de Copacabana project that year dredged offshore sand and roughly doubled the beach, and in the same stroke Roberto Burle Marx redesigned the promenade with the black-and-white Portuguese-pavement wave pattern we walk on today. He did not invent the motif — Portuguese calceteiros brought it to Rio in the 1900s under Mayor Pereira Passos, who had seen its ancestor at Praça do Rossio in Lisbon, where an engineer named Eusébio Pinheiro Furtado had laid the first waves in 1848. But Burle Marx extended the pattern 4 km continuously along the new beach, and made it a landscape in its own right, and so for most people in the world the Portuguese wave is a Copacabana wave now.

The beach is a layered place. The Copacabana Palace, opened in 1923 to lure European royalty, still sits at the center of the arc and still sets the social tone. The Fort at the south, armed in 1914 with Krupp guns that now point at nothing, has become a military museum and — more improbably — a branch of the 1894 Confeitaria Colombo, where you can sit at a marble table in the old ramparts and drink café com leite while looking down the entire 4 km. Between the Fort and the Palace: six numbered lifeguard stations — the postos — that Cariocas use as coordinates. "Meet me at Posto 2" means something specific. So does Posto 6, where the fishing boats still beach at dawn, a hundred meters from luxury condominium lobbies.

Copa does mass occasions better than any beach on Earth. Two to three million people gather here every New Year's Eve dressed in white — a Yemanjá tradition borrowed from Candomblé, where the sea goddess receives flower offerings and the crossing into the new year is a cleansing. The fireworks run twenty minutes from barges strung along the full arc; the tradition of large-scale Réveillon was consolidated in the early 1990s when the entrepreneurs Ricardo Amaral and Marius pushed the show from eight minutes to twenty and the city took organizing control. Pope Francis drew 3.7 million at World Youth Day in 2013. Madonna drew 1.6 million in 2024. Lady Gaga drew 2.1 million in May 2025, and then the tide went out.

The beach also does ordinary mornings. An old man with a metal detector works the tide line at 5 a.m. The colônia de pescadores at Posto 6 pulls nets in. Runners, swimmers, surfers. The bossa nova musicians — Nara Leão, Carlos Lyra, Roberto Menescal — once played nightly in a small dead-end alley called Beco das Garrafas, the documented cradle of bossa nova, three blocks inland from this sand. A generation later, the baile funk that rose from the Cantagalo and Pavão-Pavãozinho favelas directly above the beach became a different Rio sound, and the geography of both genres still literally overlooks Copacabana. A beach this famous does not need to do anything to be itself. It is already happening."""

    FAVELA = """The favelas of Cantagalo and Pavão-Pavãozinho sit directly above Copacabana, their houses visible from the sand when you look up from Posto 4. That geographic adjacency — luxury apartments facing the beach, favela stairs rising behind them — is not a problem to be elided from a travel guide. The inequality is the view.

The favelas have their own long cultural lives: the baile funk that made Rio a capital of a whole genre came out of here, and so did a generation of musicians, dancers, and photographers. In December 2009 the city installed a Unidade de Polícia Pacificadora (UPP) covering Pavão-Pavãozinho, Cantagalo, and Vietnã; for several years the program was credited with real economic gains in the favela (unemployment dropped to 5% by 2012). Its post-2016 decline under Rio's fiscal crisis, and the return of trafficker control in parts of the community, are documented in Brazilian press.

Respectful visitors can take community-led walking tours (different from the extractive 'favela safari' tours most residents have asked visitors to avoid). These tours bring money into the community and show a Rio the beach alone does not. If you walk Copacabana and never look up at Cantagalo, you have seen half the beach."""

    def _narrative():
        c.execute(
            "UPDATE beaches SET intro_text=?, favela_note=? WHERE id=?",
            (INTRO, FAVELA, bid),
        )
        c.commit()
        print("  [beaches] intro + favela_note rewritten", file=sys.stderr)
    run_with_retry(_narrative)

    c.close()
    print("\nAll corrections applied", file=sys.stderr)


if __name__ == "__main__":
    main()
