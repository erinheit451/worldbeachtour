"""Rewrite the favela_note with substantive content about the Plano Inclinado,
the Mirante do Pavão-Pavãozinho, and the community's own cultural life.
Move UPP facts out of this section — they're covered in Safety now."""
import sqlite3, time

DB = "output/world_beaches.db"

NEW = """The favelas of Cantagalo and Pavão-Pavãozinho rise directly behind Copacabana and Ipanema. Their houses are visible from the sand whenever you look up. That geographic adjacency — luxury apartments facing the beach, favela stairs rising behind them — is not a problem to be elided from a travel guide. The inequality is the view.

There is also a specific way up. The **Plano Inclinado do Morro Cantagalo** — a free municipal inclined elevator, built alongside the Metro Rio expansion and opened in 2010 — runs from the General Osório metro station in Ipanema up into the favela. The ride is two minutes. At the top is the **Mirante do Pavão-Pavãozinho**, a public viewpoint that looks down on the entire Ipanema-Copacabana-Leme arc and across to Sugarloaf. Most tourists never make it here; the few who do generally say it's the best view in the South Zone, and it is.

The communities have their own long cultural lives. Cantagalo and Pavão-Pavãozinho are well-documented sites in the history of funk carioca — the genre that became Rio's most-exported sound of the 1990s and 2000s. They also have working samba schools, their own restaurants, and a tradition of community tour cooperatives that are meaningfully different from the 'favela safari' tours most residents have asked visitors to avoid. If you walk Copacabana and never look up at Cantagalo, you have seen half the beach."""

c = sqlite3.connect(DB, timeout=60.0)
c.execute("PRAGMA busy_timeout=60000")
for _ in range(60):
    try:
        c.execute("UPDATE beaches SET favela_note=? WHERE slug='copacabana-7'", (NEW,))
        c.commit()
        break
    except sqlite3.OperationalError as e:
        if 'locked' in str(e): time.sleep(2); continue
        raise
print("Favela note rewritten.")
