"""Update Copacabana recurring_events with 2026-verified dates + the Guinness
world-record Réveillon Dec 31 2025 fact. Rewrite the events as dated, current content."""
import sqlite3, time

DB = "output/world_beaches.db"
c = sqlite3.connect(DB, timeout=60.0)
c.execute("PRAGMA busy_timeout=60000")
bid = c.execute("SELECT id FROM beaches WHERE slug='copacabana-7'").fetchone()[0]

EVENTS = [
    ("Réveillon (New Year's Eve)",
     "Dec 31 → Jan 1 · Next: Dec 31 2026", 12,
     "Certified by Guinness on 30 December 2025 as the world's largest New Year's Eve celebration. The 2025→2026 edition drew 2.6 million to Copacabana alone and 5.1 million citywide. Nineteen fireworks barges, a 12-minute pyrotechnic show, 13 stages, 1,200 drones. The white-dress tradition is a Yemanjá offering from Candomblé, and the ritual predates the civic spectacle.",
     2600000),
    ("Iemanjá / Festa da Iemanjá",
     "Monday, 2 February 2026", 2,
     "On the feast day of Iemanjá, the Afro-Brazilian sea goddess, Candomblé and Umbanda practitioners gather at dusk to make offerings — flowers, perfume, combs, small boats — released into the waves. Rituals predate formal tourism and continue uninterrupted. Copacabana and Praia Vermelha are the two main Rio offering sites.",
     20000),
    ("Carnaval street blocos",
     "Feb 13–17 2026 (peak Sun 15 · Mon 16 · Tue 17 · Ash Wed 18)", 2,
     "Copacabana is not the main Carnaval venue — the Sambódromo handles the samba-school parades — but its streets host major blocos (roving street parties). The Copacabana Palace's Baile do Copa on Saturday night is the most exclusive ticket in Brazil. The city is effectively booked solid Feb 13–22 (Rio Open overlaps).",
     500000),
    ("Rio Open 2026",
     "Feb 16–22 2026 · Jockey Club Brasileiro (Leblon)", 2,
     "ATP 500 tennis tournament on clay, 12th edition. Not on Copa itself, but adjacent Leblon, and every hotel south of Arpoador sells out. If you want to see top-25 players on clay without flying to Europe, this is the week.",
     None),
    ("Maratona do Rio 2026",
     "Jun 4–7 2026 · Full marathon Sun Jun 7 along Copa/Flamengo", 6,
     "The full marathon course 'returns to its origins' for 2026 — running along Copacabana, Flamengo Park, and into downtown. A 42.2 km tour of Rio's South Zone shoreline. Half marathon, 10K, and 5K on earlier days. Coincides with the Corpus Christi holiday weekend.",
     None),
    ("Festival do Rio 2026",
     "Oct 1–11 2026 · 28th edition", 10,
     "Latin America's largest film festival. Screens in Copacabana, Ipanema, Barra, and downtown. RioMarket industry days run Oct 1–10. Most screenings are free or low-cost; tickets go on sale through the festival's official app two weeks before.",
     None),
    ("Parada do Orgulho LGBTI+ do Rio (Rio Pride)",
     "Sun Nov 22 2026 · Av. Atlântica, Copacabana", 11,
     "The 31st edition of Rio Pride. The parade proceeds along the entire 4 km of Avenida Atlântica, closing the beachfront lane to traffic for the afternoon. Typical crowds are in the hundreds of thousands.",
     300000),
]

for _ in range(60):
    try:
        c.execute("DELETE FROM beach_recurring_events WHERE beach_id=?", (bid,))
        for ev in EVENTS:
            c.execute(
                "INSERT INTO beach_recurring_events (beach_id, name, when_text, month, description, typical_attendance) VALUES (?,?,?,?,?,?)",
                (bid, *ev))
        c.commit()
        break
    except sqlite3.OperationalError as e:
        if 'locked' in str(e): time.sleep(2); continue
        raise

print(f"Events rewritten: {len(EVENTS)} rows")
for r in c.execute("SELECT name, when_text FROM beach_recurring_events WHERE beach_id=? ORDER BY id", (bid,)):
    print(f"  {r[0]}: {r[1]}")
c.close()
