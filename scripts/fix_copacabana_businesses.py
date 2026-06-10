"""Correct the restaurant metadata on Copacabana:
- Pergula and Cipriani: null out year_established (1923 is the Palace's year, not the restaurant's).
- Cervantes: null out external_url (was pointing to Wikipedia, misleadingly labeled 'Website').
"""
import sqlite3, time, sys

DB = "output/world_beaches.db"
c = sqlite3.connect(DB, timeout=60.0)
c.execute("PRAGMA busy_timeout=60000")
bid = c.execute("SELECT id FROM beaches WHERE slug='copacabana-7'").fetchone()[0]

def retry(fn):
    for _ in range(60):
        try: return fn()
        except sqlite3.OperationalError as e:
            if 'locked' in str(e): time.sleep(2); continue
            raise

def _fix():
    c.execute("UPDATE beach_businesses SET year_established=NULL WHERE beach_id=? AND name IN ('Pergula — Copacabana Palace','Cipriani')", (bid,))
    c.execute("UPDATE beach_businesses SET external_url=NULL WHERE beach_id=? AND name='Cervantes'", (bid,))
    c.commit()

retry(_fix)
for r in c.execute("SELECT name, year_established, external_url FROM beach_businesses WHERE beach_id=? ORDER BY name", (bid,)):
    print(r)
c.close()
