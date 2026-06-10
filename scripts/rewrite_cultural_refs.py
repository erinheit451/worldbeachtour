"""Rewrite Copa's cultural_refs with the new taxonomy the CultureSection expects:
film / tv / music / literature / historic / brand / other.

The key addition: the Manhattan Copacabana Nightclub (1940–), which is
the cultural cross-connection Erin asked about — Frank Sinatra / Bobby Darin /
Goodfellas / Manilow's song was named after *the club*, not the beach.
"""
import sqlite3, time, sys

DB = "output/world_beaches.db"
c = sqlite3.connect(DB, timeout=60.0)
c.execute("PRAGMA busy_timeout=60000")
bid = c.execute("SELECT id FROM beaches WHERE slug='copacabana-7'").fetchone()[0]

REFS = [
    # -------------------- FILM --------------------
    ("film", "Flying Down to Rio", "RKO Pictures", 1933,
     "Fred Astaire and Ginger Rogers's first film together; the Copacabana Palace is a setting. Widely credited with launching Copa's image as the glamour capital of the Americas and seeding the beach's English-language name recognition.",
     "https://en.wikipedia.org/wiki/Flying_Down_to_Rio", None),
    ("film", "Orfeu Negro (Black Orpheus)", "Marcel Camus", 1959,
     "Palme d'Or at Cannes, Academy Award for Best Foreign Language Film. Retells the Orpheus myth during Rio Carnaval in the favelas above Copa and Ipanema. Its bossa nova soundtrack (Jobim + Bonfá) was most of the Western world's first exposure to the sound.",
     "https://en.wikipedia.org/wiki/Black_Orpheus", None),
    ("film", "Copacabana (Manilow film)", "Waris Hussein (dir.)", 1985,
     "CBS TV film starring Barry Manilow, dramatizing the story his 1978 song implied. Named for the Manhattan nightclub, not the beach — but proof of how far the word had traveled by the 1980s.",
     "https://en.wikipedia.org/wiki/Copacabana_(1985_film)", None),
    ("film", "Fast Five", "Justin Lin", 2011,
     "The fifth Fast & Furious film is set largely in Rio; several chase scenes and the famous vault-dragging sequence pass along Copacabana/Leblon and adjacent streets.",
     "https://en.wikipedia.org/wiki/Fast_Five", None),
    ("film", "Rio", "Carlos Saldanha", 2011,
     "Blue Sky animation set in Rio, with Carnaval + favela sequences. Directed by a Rio-born Brazilian; one of the very few major animated films anchored on a specific real city's cultural geography.",
     "https://en.wikipedia.org/wiki/Rio_(2011_film)", None),

    # -------------------- TV --------------------
    ("tv", "The Simpsons — 'Blame It on Lisa'", "Fox", 2002,
     "Homer Simpson gets kidnapped in Rio. Riotur (the Rio tourism board) filed a complaint; the mayor threatened to sue. Then American bookings to Copa visibly spiked. Fourteenth episode of Season 13.",
     "https://en.wikipedia.org/wiki/Blame_It_on_Lisa", None),

    # -------------------- MUSIC --------------------
    ("music", "Copacabana (At the Copa)", "Barry Manilow", 1978,
     "Manilow's disco-storytelling hit ('Her name was Lola, she was a showgirl...') is named for the Manhattan nightclub, itself named for the beach. The song won the 1979 Grammy for Best Pop Vocal and permanently wired 'Copacabana' into Western pop memory.",
     "https://en.wikipedia.org/wiki/Copacabana_(song)", None),
    ("music", "Copacabana (original)", "João de Barro & Alberto Ribeiro", 1946,
     "The original Copacabana anthem — 'Copacabana, princesinha do mar…' Popularized by Dick Farney, sung by generations of Brazilians. The song that made the beach's name synonymous with Rio itself for Portuguese-speakers.",
     "https://en.wikipedia.org/wiki/Copacabana_(song)", None),
    ("music", "Getz/Gilberto", "Stan Getz & João Gilberto", 1964,
     "The bossa nova album that took the Copa-Ipanema sound global. 'The Girl from Ipanema,' sung by Astrud Gilberto on this record, became the second-most-recorded pop song in history. Four Grammys, including Album of the Year.",
     "https://en.wikipedia.org/wiki/Getz/Gilberto", None),
    ("music", "The Girl from Ipanema", "Jobim / Vinícius de Moraes", 1962,
     "Written at the Veloso bar (now Garota de Ipanema), a few blocks south of Copa. The anthem for the whole Copa-Ipanema creative scene, though Ipanema gets the name credit. Recorded in 373 known versions.",
     "https://en.wikipedia.org/wiki/The_Girl_from_Ipanema", None),

    # -------------------- LITERATURE --------------------
    ("literature", "Brazil: A Land of the Future", "Stefan Zweig", 1941,
     "Austrian-Jewish writer Zweig, in exile from the Nazis, drafted parts of this book from his Copa hotel window. Published November 1941 in Portuguese; he died by suicide in Petrópolis four months later. The book remains the most-read outsider account of Brazil ever written.",
     "https://en.wikipedia.org/wiki/Brazil:_Land_of_the_Future", None),

    # -------------------- HISTORIC --------------------
    ("historic", "Carmen Miranda", "Carmen Miranda", 1909,
     "Raised a block from Copacabana, Miranda became the highest-paid woman in Hollywood in the 1940s. Her parents' home on Rua do Riachuelo is marked. The Carmen Miranda Museum sits in Flamengo Park nearby.",
     "https://en.wikipedia.org/wiki/Carmen_Miranda", None),
    ("historic", "Pope Francis — World Youth Day", "Holy See", 2013,
     "Closing Mass on Copacabana drew an estimated 3.7 million — one of the largest single gatherings the beach has ever held. Pope John Paul II had drawn ~1M in 1994.",
     "https://en.wikipedia.org/wiki/World_Youth_Day_2013", None),
    ("historic", "Rio 2016 Olympic beach volleyball", "IOC", 2016,
     "A 12,000-seat temporary stadium was built directly on the sand for the Olympic beach volleyball tournament. Widely called the most scenic venue in Olympic history; removed after the Games.",
     "https://en.wikipedia.org/wiki/Volleyball_at_the_2016_Summer_Olympics", None),
    ("historic", "Madonna — Celebration Tour finale", "Live Nation", 2024,
     "Madonna closed her world tour with a free Copacabana concert on 4 May 2024; ~1.6 million attendees across the arc.",
     "https://en.wikipedia.org/wiki/The_Celebration_Tour", None),
    ("historic", "Lady Gaga — Copacabana free concert", None, 2025,
     "Gaga's free concert on 3 May 2025 drew an estimated 2.1 million — Copacabana's current record for a single musical act.",
     None, None),
    ("historic", "Réveillon Guinness certification", "Guinness World Records", 2025,
     "On 30 December 2025, Guinness certified Copacabana's Réveillon — ~5.1 million citywide, 2.6 million on the arc itself — as the world's largest New Year's Eve celebration. 19 fireworks barges, 1,200 drones, 13 stages.",
     None, "https://en.prefeitura.rio/cidade/reveillon-rio-2025-mais-de-cinco-milhoes-de-pessoas-celebram-a-chegada-do-ano-novo-na-maior-virada-do-mundo/"),

    # -------------------- BRAND (the cross-connection) --------------------
    ("brand", "Copacabana Nightclub (Manhattan)", "Monte Proser, Jack Entratter, et al.", 1940,
     "Opened 10 November 1940 at 10 East 60th Street in Manhattan. Named after the beach. For five decades it was THE American nightclub — Frank Sinatra, Dean Martin, Dinah Shore, Sammy Davis Jr., Nat King Cole, Tony Bennett, Bobby Darin, and (briefly, in 1964) a very young Barry Manilow as a pit pianist. The long tracking shot through the Copa's kitchen in Goodfellas (1990) is one of the most famous shots in cinema. Manilow's 1978 song is named for this club, not the beach — the transitive chain is: beach → club → song → film (1985) → the name's global embedding.",
     "https://en.wikipedia.org/wiki/Copacabana_(nightclub)", None),
    ("brand", "Copacabana Palace hotel as a cultural brand", "Belmond", 1923,
     "The hotel's name, Art Deco facade, and 1923 opening — originally commissioned to host European royalty — became shorthand for Rio glamour. Every Hollywood visitor from Orson Welles to Madonna has stayed here; it is a cultural landmark in its own right, separate from the beach.",
     "https://en.wikipedia.org/wiki/Copacabana_Palace", None),
]

for _ in range(60):
    try:
        c.execute("DELETE FROM beach_cultural_refs WHERE beach_id=?", (bid,))
        for r in REFS:
            c.execute(
                "INSERT INTO beach_cultural_refs (beach_id, ref_type, title, creator, year, description, wikipedia_url, external_url) VALUES (?,?,?,?,?,?,?,?)",
                (bid, *r))
        c.commit()
        break
    except sqlite3.OperationalError as e:
        if 'locked' in str(e): time.sleep(2); continue
        raise

print(f"Cultural refs rewritten: {len(REFS)} rows")
for r in c.execute("SELECT ref_type, title FROM beach_cultural_refs WHERE beach_id=? ORDER BY ref_type, id", (bid,)):
    try:
        sys.stdout.buffer.write(f"  [{r[0]}] {r[1]}\n".encode('utf-8'))
    except Exception:
        print(f"  [{r[0]}] (non-ASCII title)")
c.close()
