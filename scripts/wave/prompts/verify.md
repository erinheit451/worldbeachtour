# Stage V — Verify a page against its fact sheet AND the live sources (sonnet)

The author had no web access and could only use `research/<slug>.json`. Your job is
therefore two audits, not a re-research:

**Audit 1 — sheet → page (no web):** does every claim on the page stay within what
its cited facts actually say? Overstatement is the #1 historical defect class
("helped make it known" → "made it famous"; "announced" → "built"; a 2024 record
described as all-time when 2026 exceeded it; a straight-line km presented as
road). Also arithmetic, unit flips (km↔mi), date/name consistency across surfaces,
held-vs-scheduled events, and brochure slop.

**Audit 2 — page → world (web, capped):** the bundle contains `quote_check.py`
results — every fact id listed OK there has ALREADY been mechanically confirmed
(its verbatim quote was found on its URL). Do NOT re-fetch OK rows; for them do
only Audit 1 (does the page stay within the quote?). Re-fetch ONLY: (a) rows
quote_check lists as NOT_FOUND / FETCH_FAIL that a load-bearing claim depends on,
(b) the spike's sources if any of them is non-OK, (c) businesses (confirm currently
operating). Otherwise the load-bearing set is:
spike_statement, subtitle, every key_fact, every timeline row, landmarks,
cultural_refs, businesses (confirm currently operating). Then run ≤3 searches for
recency (`<name> 2026`, local language) to catch anything stale. Budget: ≤12
WebFetch, ≤4 WebSearch. Fetch, don't search, when you have a URL.

## Read ONE file: the verify bundle (path given in your dispatch)
It contains every page file, the claims ledger, and the fact sheet. Do not read
anything else. Do Audit 1 entirely from it before touching the web.

## Cost discipline
Issue fetches in PARALLEL BATCHES of 4–6 per message (one turn), not one per
turn. Target: 1 Read + 2–3 fetch batches + 1 search batch + 1 Write ≈ 7 tool
turns. Fetch only the LOAD-BEARING rows: spike, subtitle, key_facts, timeline,
businesses, plus anything Audit 1 made you suspicious of.

## Output — write EXACTLY one file: `<verdicts_dir>/<slug>.verdict.json`
```
{
  "slug": "...", "verdict": "PASS|FAIL",
  "claims_checked": <int>, "fetches_used": <int>, "searches_used": <int>,
  "spike_verdict": "one sentence: does the evidence carry the spike as stated?",
  "blocking": [
    {"where": "surface(s), e.g. 'SPIKE; intro_text para 2; travel.mdx By air'",
     "claim": "the claim as written",
     "problem": "why it is wrong — quote the source",
     "evidence": "URL(s) + the verbatim line",
     "fix": "the exact replacement wording or 'delete'"}
  ],
  "advisory": [ same shape, for non-blocking issues ],
  "verified_ok": ["short list of the load-bearing claims that checked out, with fact ids"]
}
```
BLOCKING = a reader would be misled or a service-level error (wrong price, wrong
airport, wrong safety statement, fabricated or misattributed source, overstated
headline). Everything else is advisory. `verdict` is FAIL if blocking is
non-empty. Be specific enough that a repair agent with no web access can apply
`fix` verbatim. No edits to page files. No git.

Finish with a 4-line summary: verdict, blocking count, fetches/searches used,
the single worst finding.
