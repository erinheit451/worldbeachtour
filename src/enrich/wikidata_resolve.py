"""
Resolve Wikidata IDs to English Wikipedia URLs via SPARQL.
Then fetch page views for newly-discovered URLs.
"""

import socket
import sqlite3
import time
import requests
import urllib3.util.connection as _urllib3_conn
from tqdm import tqdm

# The local IPv6 route to Wikimedia flaps (WinError 10051 for minutes at a
# time) while IPv4 stays up. Python tries IPv6 first by default; pin to IPv4.
_urllib3_conn.allowed_gai_family = lambda: socket.AF_INET

SPARQL_URL = "https://query.wikidata.org/sparql"
USER_AGENT = "WorldBeachTour/1.0 (beach-enrichment)"
BATCH_SIZE = 50


def _sparql_batch(qids):
    """Query Wikidata SPARQL for English Wikipedia URLs for a batch of Q-IDs."""
    values = " ".join(f"wd:{qid}" for qid in qids)
    query = f"""
    SELECT ?item ?article WHERE {{
      VALUES ?item {{ {values} }}
      ?article schema:about ?item ;
               schema:isPartOf <https://en.wikipedia.org/> .
    }}
    """
    headers = {"User-Agent": USER_AGENT, "Accept": "application/json"}
    for attempt, backoff in enumerate((10, 30, 0)):
        try:
            resp = requests.get(SPARQL_URL, params={"query": query}, headers=headers, timeout=60)
            if resp.status_code == 429:
                print("  Rate limited — waiting 60s")
                time.sleep(60)
                resp = requests.get(SPARQL_URL, params={"query": query}, headers=headers, timeout=60)
            resp.raise_for_status()
            results = resp.json()["results"]["bindings"]
            mapping = {}
            for r in results:
                qid = r["item"]["value"].split("/")[-1]
                url = r["article"]["value"]
                mapping[qid] = url
            return mapping
        except Exception as e:
            print(f"  SPARQL error (attempt {attempt + 1}/3): {e}")
            if backoff:
                time.sleep(backoff)
    return None  # all attempts failed — distinct from a legitimate empty result


def resolve_wikidata_urls(conn) -> int:
    """Resolve Wikidata IDs to Wikipedia URLs. Returns count updated."""
    rows = conn.execute(
        "SELECT id, wikidata_id FROM beaches WHERE wikidata_id IS NOT NULL AND wikipedia_url IS NULL"
    ).fetchall()

    if not rows:
        print("No beaches need URL resolution")
        return 0

    print(f"Resolving {len(rows)} Wikidata IDs to Wikipedia URLs...")

    count = 0
    consecutive_failures = 0
    for i in tqdm(range(0, len(rows), BATCH_SIZE), desc="SPARQL batches"):
        batch = rows[i:i + BATCH_SIZE]
        qids = [r[1] for r in batch if r[1]]  # r[1] = wikidata_id
        id_map = {r[1]: r[0] for r in batch if r[1]}  # qid -> beach_id

        results = _sparql_batch(qids)

        # None = all retry attempts threw (endpoint/network down). An empty
        # dict is a legitimate answer — most OSM-imported beach Q-IDs have
        # no English Wikipedia article. Only true failures count toward the
        # abort, so a dead connection fails loudly instead of exiting 0.
        if results is None:
            consecutive_failures += 1
            if consecutive_failures >= 5:
                conn.commit()
                raise RuntimeError(
                    f"5 consecutive failed SPARQL batches (last at offset {i}) — "
                    f"endpoint unreachable. {count} resolved before abort; rerun to resume."
                )
            continue
        consecutive_failures = 0

        for qid, url in results.items():
            beach_id = id_map.get(qid)
            if beach_id:
                conn.execute(
                    "UPDATE beaches SET wikipedia_url = ?, updated_at = datetime('now') WHERE id = ?",
                    (url, beach_id),
                )
                count += 1

        if count % 500 == 0 and count > 0:
            conn.commit()

        time.sleep(1)  # Respectful rate limiting

    conn.commit()
    print(f"Resolved {count} Wikipedia URLs from Wikidata")
    return count


if __name__ == "__main__":
    import sys
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    resolve_wikidata_urls(conn)
    conn.close()
