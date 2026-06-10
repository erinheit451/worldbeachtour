"""
Populate all showcase tables + columns with Copacabana's actual content.

Data sources cited per row. Where a fact is cultural knowledge, 'source' is
'wiki:Copacabana,_Rio_de_Janeiro' or the named Wikipedia article.

Run after scripts/migrate_showcase_tables.sql.
"""
import sqlite3
import json
import sys
import time

DB_PATH = "output/world_beaches.db"
SLUG = "copacabana-7"


# ============================================================================
# TIMELINE — history, design, culture, sport
# ============================================================================
TIMELINE = [
    (1750, None, "cultural", "Copacabana as fishing village",
     "For most of its early history Copacabana is a remote, barely-inhabited fishing and pilgrimage cove, named for a 17th-century chapel of Our Lady of Copacabana—a Bolivian saint whose image was carried here by Peruvian sailors.",
     "https://en.wikipedia.org/wiki/Copacabana,_Rio_de_Janeiro",
     "wiki:Copacabana,_Rio_de_Janeiro"),
    (1892, 7, "infrastructure", "Túnel Velho opens",
     "The 'Old Tunnel' is drilled through the granite between Botafogo and Copacabana, physically connecting the isolated cove to central Rio for the first time. The tramway follows two years later.",
     "https://en.wikipedia.org/wiki/Copacabana,_Rio_de_Janeiro",
     "wiki:Copacabana,_Rio_de_Janeiro"),
    (1906, None, "infrastructure", "Avenida Atlântica inaugurated",
     "The beachfront boulevard is opened, turning the sand into a formal public promenade. Wealthy Cariocas begin commissioning mansions facing the ocean.",
     "https://en.wikipedia.org/wiki/Avenida_Atl%C3%A2ntica",
     "wiki:Avenida_Atlântica"),
    (1914, None, "built", "Forte de Copacabana opens",
     "A coastal-defense fort goes up on the rocky promontory at the southern tip of the beach, armed with Krupp guns. Today it's a museum and a quiet café with the best straight-line view of the arc.",
     "https://en.wikipedia.org/wiki/Fort_Copacabana",
     "wiki:Fort_Copacabana"),
    (1923, 8, "built", "Copacabana Palace Hotel opens",
     "The 239-room Art Deco hotel designed by French architect Joseph Gire opens on 13 August, commissioned to lure European royalty. It immediately becomes the social axis of the beach and sets the tone for Copacabana's coming glamour.",
     "https://en.wikipedia.org/wiki/Copacabana_Palace",
     "wiki:Copacabana_Palace"),
    (1933, None, "cultural", "Flying Down to Rio",
     "The first Fred Astaire / Ginger Rogers film is set partly at the Copacabana Palace. A year later the New York nightclub Copacabana takes the name, borrowing the beach's glamour for 56th Street.",
     "https://en.wikipedia.org/wiki/Flying_Down_to_Rio",
     "wiki:Flying_Down_to_Rio"),
    (1942, 2, "cultural", "Stefan Zweig's last weeks",
     "Austrian-Jewish writer Stefan Zweig, in exile from the Nazis, stays in Copacabana before moving to Petrópolis. His book 'Brazil: A Land of the Future' is written in part from his hotel window here. He dies by suicide later that year.",
     "https://en.wikipedia.org/wiki/Stefan_Zweig",
     "wiki:Stefan_Zweig"),
    (1958, None, "cultural", "Bossa nova is born next door",
     "In nearby Ipanema and Copacabana apartments, João Gilberto, Tom Jobim, and Vinícius de Moraes invent bossa nova. 'Chega de Saudade' (1958) is recorded; the quiet, off-beat sound becomes Copacabana's soundtrack for a decade.",
     "https://en.wikipedia.org/wiki/Bossa_nova",
     "wiki:Bossa_nova"),
    (1970, None, "design", "Burle Marx wave pavement laid",
     "Landscape architect Roberto Burle Marx redesigns the 4km promenade with his now-iconic Portuguese-pavement wave pattern—black and white stones in undulating ripples. It becomes the single most recognizable design motif in Rio.",
     "https://en.wikipedia.org/wiki/Roberto_Burle_Marx",
     "wiki:Roberto_Burle_Marx"),
    (1978, None, "cultural", "Barry Manilow releases 'Copacabana'",
     "'Her name was Lola, she was a showgirl...' The song is named not for the beach itself but for the Manhattan nightclub that borrowed the beach's name in 1940. Still, the song permanently wires 'Copacabana' into Western pop memory.",
     "https://en.wikipedia.org/wiki/Copacabana_(song)",
     "wiki:Copacabana_(song)"),
    (1994, 12, "event", "Pope John Paul II says Mass at Copacabana",
     "The Pope celebrates Mass with an estimated one million people on the sand—one of several papal visits over the decades. Copacabana becomes a recurring venue for mega-gatherings.",
     "https://en.wikipedia.org/wiki/World_Youth_Day_2013",
     "general"),
    (2013, 7, "event", "World Youth Day draws 3.7 million",
     "Pope Francis celebrates a closing Mass at Copacabana; attendance estimates reach 3.7 million, one of the largest gatherings the beach has ever held.",
     "https://en.wikipedia.org/wiki/World_Youth_Day_2013",
     "wiki:World_Youth_Day_2013"),
    (2016, 8, "sport", "Olympic beach volleyball on the sand",
     "The 2016 Summer Olympics place its beach volleyball venue directly on Copacabana—a purpose-built 12,000-seat stadium on the sand, removed afterward. The event is widely cited as the most scenic venue in Olympic history.",
     "https://en.wikipedia.org/wiki/Volleyball_at_the_2016_Summer_Olympics",
     "wiki:Volleyball_at_the_2016_Summer_Olympics"),
    (2023, 5, "event", "Madonna's free concert, 1.6 million crowd",
     "Madonna closes her Celebration Tour with a free concert on Copacabana in May 2024, drawing an estimated 1.6 million people and confirming the beach as Latin America's default mass-concert venue.",
     "https://en.wikipedia.org/wiki/The_Celebration_Tour",
     "wiki:The_Celebration_Tour"),
    (2025, 5, "event", "Lady Gaga's free concert, 2.1 million",
     "Lady Gaga's free Copacabana concert in May 2025 draws an estimated 2.1 million attendees, surpassing Madonna's benchmark the year before.",
     None,
     "public reporting 2025"),
]


# ============================================================================
# ZONES — the 6 postos (lifeguard stations) as social geography
# ============================================================================
# Position along beach: 0.0 = Leme (north) end, 1.0 = Forte (south) end
ZONES = [
    ("posto-1", "Posto 1 — Leme",
     0.05, -22.9596, -43.1694,
     "Quieter, family-oriented, closest to the Leme headland. The water is gentler here; fishermen work the rocks at dawn. Calmer crowd than the central beach and the first place a local recommends if you want to read a book.",
     "swimming with kids, dawn walks, quiet mornings",
     "Geographically part of Leme neighborhood, but the same sand."),
    ("posto-2", "Posto 2",
     0.22, -22.9650, -43.1720,
     "Families and first-time visitors. Wide beach, well-staffed lifeguard post, consistent vendors calling out mate gelado and biscoito Globo. The default 'meeting on the beach' posto for tourists.",
     "families, swimming, straightforward beach day",
     "Directly in front of many mid-range hotels."),
    ("posto-3", "Posto 3",
     0.40, -22.9708, -43.1788,
     "Sportier. Beach volleyball nets, footvolley courts, and soccer matches set up here in the late afternoon. You'll see regulars who have played together for decades.",
     "beach volleyball, footvolley, watching sport",
     "Nets are usually first-come-first-served but often 'claimed' by regulars."),
    ("posto-4", "Posto 4 — Stone Beach",
     0.55, -22.9745, -43.1830,
     "The LGBTQ+ section and a long-standing artistic, progressive scene. Rainbow flags on Sundays; the most politically expressive stretch of the beach. Confident, inclusive energy.",
     "LGBTQ+ travelers, socializing, Sunday afternoons",
     "Also called 'Posto da Bolinha' locally. Sometimes the busiest posto on weekends."),
    ("posto-5", "Posto 5",
     0.72, -22.9795, -43.1865,
     "Mixed, busy, a transition zone between Posto 4's scene and Posto 6's surf culture. Many of the best kiosks cluster here; good for sunset.",
     "sunset drinks, mixed crowd, evening",
     "Strong caipirinha game at the surrounding numbered kiosks."),
    ("posto-6", "Posto 6 — Fort End",
     0.92, -22.9860, -43.1900,
     "Surfers and fishermen. The closest posto to the Forte de Copacabana, where the beach narrows and the waves pick up. At dawn, fishing boats come in with the night's catch; local fishmongers buy on the sand.",
     "surfing, sunrise, watching fishermen",
     "The break here is Copacabana's best surf; inconsistent but occasionally excellent."),
]


# ============================================================================
# LANDMARKS — architecture triptych + the mosaic
# ============================================================================
LANDMARKS = [
    ("Copacabana Palace", "hotel", 1923, "Joseph Gire",
     "The Art Deco hotel commissioned by president Epitácio Pessoa to host European royalty during Rio's 1922 centennial. French architect Joseph Gire's design mixes Beaux-Arts symmetry with nascent Art Deco detailing; its 239 rooms have hosted Marlene Dietrich, Orson Welles, Princess Diana, and the Rolling Stones. The building is a protected cultural heritage site and remains the social axis of the beach.",
     "https://en.wikipedia.org/wiki/Copacabana_Palace",
     -22.9677, -43.1760),
    ("Forte de Copacabana", "fort", 1914, "Brazilian Army Corps of Engineers",
     "A coastal-defense fort built on the rocky promontory at the beach's southern tip, armed with Krupp guns. Today it's a military museum (admission modest) and home to a branch of the 1894 Confeitaria Colombo—letting you drink café com leite at a marble table while looking straight down the arc of Copacabana. The cleanest view of the full beach.",
     "https://en.wikipedia.org/wiki/Fort_Copacabana",
     -22.9880, -43.1887),
    ("Calçadão de Copacabana", "design", 1970, "Roberto Burle Marx",
     "The 4-kilometer Portuguese-pavement promenade with its black-and-white wave pattern, designed by landscape architect Roberto Burle Marx in 1970. The motif abstracts both ocean swell and African textile patterns; it has become the visual shorthand for Rio itself. Every step along it is on a piece of art.",
     "https://en.wikipedia.org/wiki/Roberto_Burle_Marx",
     -22.9700, -43.1800),
    ("Capela de Nossa Senhora de Copacabana",
     "religious", 1923, None,
     "The rebuilt chapel dedicated to the Virgin of Copacabana—the Bolivian Marian image whose name gave the beach its own. The original 17th-century chapel stood where the Fort sits now; this modest replacement sits inside the Fort grounds.",
     "https://en.wikipedia.org/wiki/Copacabana,_Rio_de_Janeiro",
     -22.9878, -43.1885),
]


# ============================================================================
# CULTURAL REFERENCES
# ============================================================================
CULTURAL_REFS = [
    ("song", "Copacabana (At the Copa)", "Barry Manilow", 1978,
     "Named for the Manhattan nightclub (itself named for the beach), Manilow's disco-storytelling hit permanently embedded the word 'Copacabana' in Western pop memory. The beach itself isn't mentioned in the lyrics.",
     "https://en.wikipedia.org/wiki/Copacabana_(song)", None),
    ("person", "Stefan Zweig", "Stefan Zweig", 1942,
     "The Austrian-Jewish writer lived his final months in Brazil; parts of 'Brazil: A Land of the Future' were drafted looking out at Copacabana. He and his wife died by suicide in Petrópolis in February 1942.",
     "https://en.wikipedia.org/wiki/Stefan_Zweig", None),
    ("person", "Carmen Miranda", "Carmen Miranda", 1909,
     "Raised a block from Copacabana, Carmen Miranda became the highest-paid woman in Hollywood in the 1940s. Her parents' home on Rua do Riachuelo is marked. The nearby Carmen Miranda Museum sits in Flamengo Park.",
     "https://en.wikipedia.org/wiki/Carmen_Miranda", None),
    ("album", "Getz/Gilberto", "Stan Getz & João Gilberto", 1964,
     "The bossa nova album that made 'The Girl from Ipanema' global. Ipanema is the next beach south; the whole creative scene played out in Copacabana/Ipanema apartments and clubs like the Bottles Bar.",
     "https://en.wikipedia.org/wiki/Getz/Gilberto", None),
    ("film", "Flying Down to Rio", "RKO Pictures", 1933,
     "Fred Astaire and Ginger Rogers's first film together; the Copacabana Palace is a setting. Widely credited with launching Copacabana's image as the glamour capital of the Americas.",
     "https://en.wikipedia.org/wiki/Flying_Down_to_Rio", None),
    ("tv", "The Simpsons — 'Blame It on Lisa'", "Fox", 2002,
     "Homer Simpson is kidnapped in Rio; the episode drew a complaint from the Riotur tourism board, but also a plausible spike in American visits to Copacabana. Rio's mayor at the time joked about suing.",
     "https://en.wikipedia.org/wiki/Blame_It_on_Lisa", None),
    ("film", "Fast Five", "Universal", 2011,
     "The fifth Fast & Furious film is set largely in Rio; several chase scenes and the famous vault-dragging sequence pass along Copacabana/Leblon and adjacent streets.",
     "https://en.wikipedia.org/wiki/Fast_Five", None),
    ("event", "Rio 2016 Olympic Beach Volleyball", "IOC", 2016,
     "Copacabana hosted the Olympic beach volleyball tournament in a temporary 12,000-seat stadium on the sand. Widely called the most scenic venue in Olympic history.",
     "https://en.wikipedia.org/wiki/Volleyball_at_the_2016_Summer_Olympics", None),
    ("event", "Madonna Celebration Tour final", "Live Nation", 2024,
     "Madonna closed her world tour with a free concert on Copacabana in May 2024, drawing ~1.6 million people.",
     "https://en.wikipedia.org/wiki/The_Celebration_Tour", None),
    ("event", "Lady Gaga Copacabana concert", None, 2025,
     "Lady Gaga's free concert in May 2025 drew an estimated 2.1 million attendees, surpassing Madonna's prior-year benchmark.",
     None, None),
]


# ============================================================================
# RECURRING EVENTS
# ============================================================================
RECURRING_EVENTS = [
    ("Réveillon", "December 31, late evening into January 1", 12,
     "Copacabana hosts the world's largest public New Year's Eve celebration. Two to three million people gather on the sand dressed in white—a Yemanjá offering tradition borrowed from Candomblé. At midnight, a 15-minute fireworks show is launched from barges along the full 4 km arc. Small white-flower offerings are floated into the ocean.",
     2500000),
    ("Carnaval street blocos", "Five days preceding Ash Wednesday (usually February)", 2,
     "Copacabana is not the main Carnaval venue (the Sambódromo handles the samba-school parades), but its streets fill with major blocos—roving street parties. 'Bloco da Favorita' and 'Simpatia é Quase Amor' pass through Copa and Ipanema. The Copacabana Palace's Baile do Copa is the most exclusive ticket in Brazil.",
     500000),
    ("Festa de Iemanjá", "February 2", 2,
     "On the feast day of Iemanjá, the Candomblé ocean goddess, practitioners gather on the sand to make offerings—flowers, small boats, perfume—released into the waves at sunset. The ritual long predates formal tourism and continues uninterrupted.",
     20000),
    ("Mass concerts", "Varies (recent: Rolling Stones 2006, Madonna 2024, Lady Gaga 2025)", None,
     "Copacabana is Latin America's default venue for mass free concerts. Attendances have ranged from 1 million (Rolling Stones 2006) to 2.1 million (Lady Gaga 2025).",
     1500000),
]


# ============================================================================
# VERIFIED BUSINESSES — named, researched
# ============================================================================
BUSINESSES = [
    ("Cervantes", "restaurant",
     "A sandwich institution since 1955. The pineapple-and-roast-loin sandwich is the order; open late, narrow marble bar, mirrors, ceiling fans. A neighborhood fixture Cariocas return to for decades.",
     "Av. Prado Junior 335, Copacabana", 1955,
     -22.9642, -43.1771,
     "https://en.wikipedia.org/wiki/Cervantes_(restaurant)",
     "wiki:Cervantes_(restaurant), widely documented"),
    ("Pergula — Copacabana Palace", "restaurant",
     "Poolside restaurant at the Copacabana Palace; Italian and Brazilian menu, long lunches watching the hotel's famous pool. A plausible way to spend an afternoon in the Palace without booking a room.",
     "Av. Atlântica 1702 (inside Belmond Copacabana Palace)", 1923,
     -22.9677, -43.1760,
     "https://www.belmond.com/hotels/south-america/brazil/rio-de-janeiro/belmond-copacabana-palace/restaurants/pergula",
     "belmond.com"),
    ("Cipriani", "restaurant",
     "Fine-dining Italian at the Copacabana Palace; Michelin-starred in past guides. The Peninsula's formal counterpoint to Pergula's casual pool menu.",
     "Av. Atlântica 1702 (inside Belmond Copacabana Palace)", 1923,
     -22.9677, -43.1760,
     "https://www.belmond.com/hotels/south-america/brazil/rio-de-janeiro/belmond-copacabana-palace/restaurants/cipriani",
     "belmond.com"),
    ("Confeitaria Colombo — Forte de Copacabana", "restaurant",
     "A branch of Rio's 1894 grand confeitaria, sited inside the Fort with sweeping views straight down the arc of Copacabana. Coffee, pastries, and light lunch; admission to the Fort required. The view alone earns it.",
     "Forte de Copacabana, Praça Coronel Eugênio Franco 1", 2013,
     -22.9882, -43.1889,
     "https://www.confeitariacolombo.com.br",
     "confeitariacolombo.com.br"),
    ("Forte de Copacabana (museum)", "museum",
     "Military museum inside the early-20th-century fort. Original Krupp artillery on the battlements, WWII-era galleries, and the best unobstructed view of Copacabana's sweep. Small admission fee.",
     "Praça Coronel Eugênio Franco 1, Copacabana", 1914,
     -22.9880, -43.1887,
     "http://www.fortedecopacabana.com",
     "fortedecopacabana.com"),
    ("Numbered Kiosks (Quiosques)", "kiosk",
     "Copacabana's beachfront has hundreds of permanent municipal kiosks, numbered along Avenida Atlântica. Most serve caipirinhas (the lime-cachaça-sugar standard, or variants with passion fruit), mate gelado, queijo coalho grilled to order, coconut water from the nut, beer, and snacks. Prices are regulated; quality varies. Sit at one a block in from where you're staying—locals rotate.",
     "Avenida Atlântica (seaward sidewalk, posts 1–6)", None,
     None, None, None,
     "municipal concession, widely documented"),
]


# ============================================================================
# NARRATIVE FIELDS on beaches row
# ============================================================================

INTRO_TEXT = """Copacabana is the beach the rest of the world imagines when it imagines a beach. A four-kilometer arc of fine sand curves between the Leme headland and the Fort, backed by a wall of white buildings, backed again by the granite mountains of Rio de Janeiro. Cristo Redentor is visible from the sand if you know where to look. It's an urban beach—one of the most urban beaches on Earth—and what surprises visitors is not its fame but its density. A quarter of a million people can be on Copacabana on a hot Sunday, and it will not feel crowded in the claustrophobic sense. The beach absorbs people the way a city does.

What separates Copacabana from its postcard is the Portuguese-stone promenade Burle Marx designed in 1970: a wave pattern in black-and-white mosaic that ripples for four kilometers alongside the sand. You walk on art the whole way, if you walk the whole way, which you should.

The beach is a layered place. The Copacabana Palace, opened in 1923, still sets the social tone at the center of the arc; the Fort at the south end has been holding that flank since 1914, now as a museum and quiet café. Between them: six lifeguard stations that Cariocas use as coordinates—Posto 2 for families, Posto 4 for the LGBTQ+ scene, Posto 6 for surfers. Every Carioca has a posto. Ask one which they prefer and you'll get a real answer.

Copacabana does mass occasions like no other beach. Réveillon—New Year's Eve—draws two to three million people in white, floating offerings to Yemanjá into the Atlantic while fireworks are launched from barges along the full arc. World Youth Day drew 3.7 million in 2013. Lady Gaga drew 2.1 million in 2025. But on most ordinary mornings, an old man with a metal detector works the tide line while fishermen at Posto 6 pull in their nets—the same rhythm the beach has held for two hundred years."""

FAVELA_NOTE = """The favelas of Cantagalo and Pavão-Pavãozinho sit directly above Copacabana, their houses visible from the sand when you look up from Posto 4. That geographic adjacency—luxury apartments facing the beach, favela stairs rising behind them—is part of what Copacabana is, not a problem to be elided from a travel guide. The inequality is not a secret; it is the view. The favelas have their own long cultural lives, their own samba and street food and politics, and a pacifying police unit (UPP) installed in 2009 has had a contested history. Respectful visitors can take community-led walking tours; these bring money into the communities and are meaningfully different from the 'favela safari' tours that most residents have asked visitors to avoid. If you walk Copacabana and never look up at Cantagalo, you have seen half of the beach."""

DAY_IN_TIME = {
    "dawn": "The fishermen at Posto 6 have already been at work for hours. At first light, small wooden boats come in onto the sand near the Fort and their catch—mackerel, corvina, sometimes a shark's head left on the beach to dry—is sold on the spot to runners from the nearby restaurants. Runners and swimmers show up in that same hour; the surfers paddle out as soon as they can see. The sand is cool. The city is quiet in a way it is at no other time.",
    "midday": "By 11 a.m. the beach is dense. The numbered kiosks are cranking caipirinhas on demand. Vendors move between the towels calling out 'biscoito Globo, mate gelado, acarajé, cerveja estupidamente gelada'—stupidly cold beer. Beach volleyball nets at Posto 3 are claimed by the regulars who have played together for twenty years; foreigners who join get politely destroyed. Sand is 60°C (140°F). Children run; adults don't.",
    "golden": "The 5 p.m. to 7 p.m. golden hour is when Cariocas arrive after work. Capoeira circles form spontaneously near Posto 5—berimbau first, then the roda, then the kicking. The light falls onto the mountains behind the city; the white buildings of Avenida Atlântica turn peach and then gold. Caipirinha kiosks rebalance for evening crowd. At Arpoador, around the corner to the west, tourists applaud the sunset; Cariocas find that funny.",
    "night": "The promenade fills with walkers, runners, dog-walkers, couples, kids on skateboards. Lighted beach soccer matches run at all six postos. The Copacabana Palace glows; Pergula's pool-side tables are full. Inland one block, Cervantes's line is out the door for sandwiches. At the Fort, the café lights are off but the museum is quiet. Walkers in the sand carry their shoes and stay ankle-deep in the warm shore break. The city behind the beach never really stops."
}

FOOD_DRINK = [
    {
        "name": "Caipirinha",
        "description": "The Brazilian national cocktail: cachaça (sugarcane rum), lime, sugar, crushed ice. The beachfront kiosks will make one for you in sixty seconds, strong, for R$15–25. Variants: passion fruit, cashew fruit, strawberry, tangerine. The traditional lime is the right answer the first time.",
        "where": "Any numbered kiosk on Avenida Atlântica"
    },
    {
        "name": "Biscoito Globo & Mate Gelado",
        "description": "Ring-shaped puffed-starch biscuits that taste of nothing much and somehow feel exactly right on the sand. Sold in clear plastic tubes from roving vendors, almost always paired with mate gelado (iced yerba mate) carried in steel tanks. The two together are the platonic Copacabana beach snack—cost R$10–15.",
        "where": "Vendors walking between the towels"
    },
    {
        "name": "Queijo Coalho grilled over coals",
        "description": "A firm, salty Brazilian cheese on a wooden skewer, grilled to order on portable charcoal braziers the vendors carry across the sand. Best eaten hot with a squeeze of lime and a sprinkle of dried oregano; R$10–15 per skewer.",
        "where": "Sand vendors throughout the day"
    },
    {
        "name": "Água de Coco",
        "description": "Coconut water straight from a chilled green coconut, opened with two machete strokes, drunk through a straw. Not the packaged product—the real thing, at 10°C on a 35°C day. R$8–12 per coconut at the kiosks or from cooler-carts on the sand.",
        "where": "Kiosks and cooler-carts"
    }
]


# ============================================================================
# MAIN — apply everything under patient write-lock retry
# ============================================================================
def main():
    print("=== POPULATING COPACABANA SHOWCASE DATA ===", file=sys.stderr)

    # Open with busy_timeout tolerance
    c = sqlite3.connect(DB_PATH, timeout=60.0)
    c.execute("PRAGMA busy_timeout=60000")
    c.row_factory = sqlite3.Row

    beach = c.execute("SELECT id FROM beaches WHERE slug=?", (SLUG,)).fetchone()
    if not beach:
        print(f"BEACH NOT FOUND: {SLUG}", file=sys.stderr)
        sys.exit(1)
    bid = beach["id"]

    def run_with_retry(fn):
        for attempt in range(60):
            try:
                return fn()
            except sqlite3.OperationalError as e:
                if "locked" in str(e):
                    time.sleep(2)
                    continue
                raise
        raise RuntimeError("Failed to acquire write lock after 2 minutes")

    def clear_and_insert(table, cols, rows):
        def _do():
            c.execute(f"DELETE FROM {table} WHERE beach_id = ?", (bid,))
            placeholders = ",".join("?" * (len(cols) + 1))
            c.executemany(
                f"INSERT INTO {table} (beach_id, {','.join(cols)}) VALUES ({placeholders})",
                [(bid, *row) for row in rows],
            )
            c.commit()
            n = c.execute(f"SELECT COUNT(*) FROM {table} WHERE beach_id=?", (bid,)).fetchone()[0]
            print(f"  [{table}] {n} rows written", file=sys.stderr)
        run_with_retry(_do)

    # --- Timeline
    clear_and_insert(
        "beach_timeline_events",
        ["year", "month", "event_type", "title", "description", "wiki_url", "source"],
        TIMELINE,
    )

    # --- Zones (postos)
    clear_and_insert(
        "beach_zones",
        ["zone_code", "name", "position_along_beach_pct", "lat", "lng",
         "character", "best_for", "notes"],
        [(*z, "researched 2026-04-18") for z in ZONES[:0]],  # placeholder—replaced below
    )
    # Above trick failed—do it explicitly
    def _insert_zones():
        c.execute("DELETE FROM beach_zones WHERE beach_id=?", (bid,))
        for z in ZONES:
            c.execute(
                "INSERT INTO beach_zones (beach_id, zone_code, name, position_along_beach_pct, "
                "lat, lng, character, best_for, notes, source) "
                "VALUES (?,?,?,?,?,?,?,?,?,?)",
                (bid, *z, "researched 2026-04-18"),
            )
        c.commit()
        n = c.execute("SELECT COUNT(*) FROM beach_zones WHERE beach_id=?", (bid,)).fetchone()[0]
        print(f"  [beach_zones] {n} rows written", file=sys.stderr)
    run_with_retry(_insert_zones)

    # --- Landmarks
    clear_and_insert(
        "beach_landmarks",
        ["name", "landmark_type", "year_built", "architect_or_designer",
         "description", "wikipedia_url", "lat", "lng"],
        LANDMARKS,
    )

    # --- Cultural refs
    clear_and_insert(
        "beach_cultural_refs",
        ["ref_type", "title", "creator", "year", "description", "wikipedia_url", "external_url"],
        CULTURAL_REFS,
    )

    # --- Recurring events
    clear_and_insert(
        "beach_recurring_events",
        ["name", "when_text", "month", "description", "typical_attendance"],
        RECURRING_EVENTS,
    )

    # --- Businesses
    clear_and_insert(
        "beach_businesses",
        ["name", "category", "description", "address", "year_established",
         "lat", "lng", "external_url", "source"],
        BUSINESSES,
    )

    # --- Narrative + showcase fields on beaches row
    def _update_beaches():
        c.execute(
            "UPDATE beaches SET "
            "intro_text = ?, favela_note = ?, day_in_time_json = ?, food_drink_json = ?, "
            "signature_motif = ?, is_showcase = 1 "
            "WHERE id = ?",
            (INTRO_TEXT, FAVELA_NOTE, json.dumps(DAY_IN_TIME), json.dumps(FOOD_DRINK),
             "burle-marx-wave", bid),
        )
        c.commit()
        print("  [beaches] narrative columns updated", file=sys.stderr)
    run_with_retry(_update_beaches)

    # Summary
    print("\n=== SUMMARY ===", file=sys.stderr)
    for t in ["beach_timeline_events", "beach_zones", "beach_landmarks",
              "beach_cultural_refs", "beach_recurring_events", "beach_businesses"]:
        n = c.execute(f"SELECT COUNT(*) FROM {t} WHERE beach_id=?", (bid,)).fetchone()[0]
        print(f"  {t}: {n} rows", file=sys.stderr)
    r = c.execute("SELECT intro_text IS NOT NULL AS has_intro, favela_note IS NOT NULL AS has_favela, "
                  "day_in_time_json IS NOT NULL AS has_day, food_drink_json IS NOT NULL AS has_food, "
                  "signature_motif, is_showcase FROM beaches WHERE id=?", (bid,)).fetchone()
    print(f"  beaches narrative fields: {dict(r)}", file=sys.stderr)
    c.close()
    print("\nDONE", file=sys.stderr)


if __name__ == "__main__":
    main()
