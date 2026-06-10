"""Editorial pass: trim redundancies in intro_text, expand favela_note with UPP,
cut the two weakest timeline entries (Manilow + funk-carioca-rises), shorten 2009 UPP.
"""
import sqlite3, time

DB = "output/world_beaches.db"
c = sqlite3.connect(DB, timeout=60.0)
c.execute("PRAGMA busy_timeout=60000")
bid = c.execute("SELECT id FROM beaches WHERE slug='copacabana-7'").fetchone()[0]

# --- New intro: Aterro paragraph collapsed to 3 sentences that point to the dedicated section ---
NEW_INTRO = """Copacabana is the beach the rest of the world imagines when it imagines a beach, and it deserves that reputation and also undermines it in ways only Cariocas fully understand.

It is four kilometers of sand arcing between two headlands — Leme at the north, the Fort at the south — with a wall of white buildings behind, and behind them, the granite peaks that make Rio one of the only cities on Earth where mountain and ocean meet mid-neighborhood. Cristo Redentor is visible from the sand if you know where to look. At midday in February the sand reaches 60°C and children run on it and adults don't.

The beach was not always this wide — a 1970 land reclamation doubled it. And the Portuguese-pavement wave you walk on has been here, in some form, since the 1930s, redesigned by Roberto Burle Marx in 1970 into four continuous kilometers where no stretch repeats exactly. The Portuguese wave is a Copacabana wave now.

The beach is a layered place. The Copacabana Palace, opened in 1923 to lure European royalty, still sits at the center of the arc and still sets the social tone. The Fort at the south, armed in 1914 with Krupp guns that now point at nothing, has become a military museum and — more improbably — a branch of the 1894 Confeitaria Colombo, where you can sit at a marble table in the old ramparts and drink café com leite while looking down the entire 4 km. Between the Fort and the Palace: six numbered lifeguard stations — the postos — that Cariocas use as coordinates. "Meet me at Posto 2" means something specific. So does Posto 6, where the fishing boats still beach at dawn, a hundred meters from luxury condominium lobbies.

Copa does mass occasions better than any beach on Earth. Two to three million people gather here every New Year's Eve dressed in white — a Yemanjá tradition borrowed from Candomblé. Pope Francis drew 3.7 million at World Youth Day in 2013. Madonna drew 1.6 million in 2024. Lady Gaga drew 2.1 million in 2025. On 30 December 2025, Guinness certified Copacabana's Réveillon as the world's largest New Year's Eve celebration.

And the beach also does ordinary mornings. An old man with a metal detector works the tide line at 5 a.m. The colônia de pescadores at Posto 6 pulls nets in. Runners, swimmers, surfers. A beach this famous does not need to do anything to be itself. It is already happening."""

# --- New favela note: adds the UPP paragraph moved from Safety section ---
NEW_FAVELA = """The favelas of Cantagalo and Pavão-Pavãozinho rise directly behind Copacabana and Ipanema. Their houses are visible from the sand whenever you look up. That geographic adjacency — luxury apartments facing the beach, favela stairs rising behind them — is not a problem to be elided from a travel guide. The inequality is the view.

On 23 December 2009, Rio installed a **Unidade de Polícia Pacificadora** (UPP) covering Pavão-Pavãozinho, Cantagalo, and Vietnã. For several years the program was credited with real economic gains in the community — Pavão-Pavãozinho's unemployment reportedly dropped to 5% by mid-2012. Its decline after 2016, under Rio's fiscal crisis, is documented in Brazilian press. The operational state of the favelas fluctuates; the view from the beach does not.

There is also a specific way up. The **Plano Inclinado do Morro Cantagalo** — a free municipal inclined elevator, built alongside the Metro Rio expansion and opened in 2010 — runs from the General Osório metro station in Ipanema up into the favela. The ride is two minutes. At the top is the **Mirante do Pavão-Pavãozinho**, a public viewpoint that looks down on the entire Ipanema-Copacabana-Leme arc and across to Sugarloaf. Most tourists never make it here; the few who do generally say it's the best view in the South Zone, and it is.

The communities have their own long cultural lives — funk carioca's origin sites, working samba schools, restaurants, and a tradition of community tour cooperatives meaningfully different from the 'favela safari' tours residents have asked visitors to avoid. If you walk Copacabana and never look up at Cantagalo, you have seen half the beach."""

# --- Timeline edits: remove Manilow + funk-carioca-rises; shorten 2009 UPP ---
def retry(fn):
    for _ in range(60):
        try: return fn()
        except sqlite3.OperationalError as e:
            if 'locked' in str(e): time.sleep(2); continue
            raise

def _updates():
    # Delete the two weakest entries
    c.execute(
        "DELETE FROM beach_timeline_events WHERE beach_id=? AND year IN (1978, 1980)",
        (bid,),
    )
    # Shorten 2009 UPP to a one-line callout
    c.execute(
        "UPDATE beach_timeline_events SET description=? WHERE beach_id=? AND year=2009",
        ("The Unidade de Polícia Pacificadora (UPP) is installed covering the favelas directly above Copa. See the Favela Above section for the contested history since.",
         bid),
    )
    # Apply narrative updates
    c.execute(
        "UPDATE beaches SET intro_text=?, favela_note=? WHERE id=?",
        (NEW_INTRO, NEW_FAVELA, bid),
    )
    c.commit()

retry(_updates)

# Verify
count = c.execute("SELECT COUNT(*) FROM beach_timeline_events WHERE beach_id=?", (bid,)).fetchone()[0]
print(f"Timeline now has {count} events (was 19, removed 2 = 17)")

import sys
for y in [1978, 1980, 2009]:
    r = c.execute("SELECT year, title, description FROM beach_timeline_events WHERE beach_id=? AND year=?", (bid, y)).fetchone()
    if r:
        sys.stdout.buffer.write(f"  {r[0]}: {r[1]} - {r[2][:100]}\n".encode('utf-8', errors='replace'))
    else:
        print(f"  {y}: CUT")
c.close()
