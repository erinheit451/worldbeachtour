# The Atlas Program — how this documentation system works

World Beach Tour's goal is **data authority**: when a person, journalist, researcher,
or AI assistant asks anything structured about any beach on Earth, the answer traces
back to us. The program is too large to hold in one head or one chat session — so the
repo holds it. This directory is the single source of truth for what we're building,
in what order, and why.

## The three documents that matter

| File | What it holds | Update cadence |
|---|---|---|
| `ONTOLOGY.md` | **The canonical data spec** — 14 classes, 102 attributes across 14 domains, 17 relationships, provenance model, ethics, query engines. What every layer builds toward. (Source: `beach_ontology.xlsx`, kept alongside.) | Reconcile both when the model changes |
| `ROADMAP.md` | The spine: thesis, scoring rubric, the current stack rank, operating cadence | Re-ranked when a layer ships or a new layer scores high |
| `DECISIONS.md` | Every settled decision, dated, with the why | Append-only; never re-litigate an entry without a new dated entry superseding it |
| `layers/*.md` | One scope file per data layer or product — the full possibility space | Stub created within 10 minutes of any new idea |

## The spine model

**The database is the spine. Everything else is a projection of it.**

```
sources (satellite, OSM, physics, APIs, community)
        │  ingest + enrich pipelines (src/ingest, src/enrich)
        ▼
world_beaches.db  ← every layer lands here as columns + provenance + confidence
        │
        ├─→ site pages (Tier 1–4)          ├─→ open dataset releases (DOI)
        ├─→ query/intersection pages       ├─→ API (paid, later)
        ├─→ Beach MCP server               └─→ rankings, reports, embeds
```

A layer is not "done" when a script runs — it's done when its columns are populated
at scale **with a source tag and a confidence level**, because every downstream
surface (pages, MCP, dataset, API) reads straight from the DB. This contract is what
lets spin-offs plug in without redesign: any new layer that lands as columns
automatically flows to every surface.

## The spin-off protocol (how new ideas are captured, not lost)

Ideas will keep arriving faster than they can be built. The protocol:

1. **Stub it** — create `layers/<name>.md` from the template below, status `idea`.
   Ten minutes, max. Capture sources, the insight, and open questions while fresh.
2. **Score it** — rate the five axes (see `ROADMAP.md` rubric) in the stub.
3. **Rank it** — it gets a row in the ROADMAP registry at the next re-rank.
   Until then it is parked, deliberately, and no session should work on it.
4. **Never re-litigate ad hoc** — if a session wants to change the order, it writes
   a dated entry in `DECISIONS.md` saying what changed and why.

## Layer file template

```markdown
# Layer: <name>
**Status:** idea | scoped | building | partial | live
**Scores:** Uniqueness ? · Leverage ? · Cost ? · Authority ? · Revenue ?  (H/M/L)

## What it is
## What it yields (DB columns / products)
## Sources
## Depends on
## Effort
## Open questions
```

## Rules for Claude sessions working in this repo

- Read `ROADMAP.md` + `DECISIONS.md` before starting program work. The rank there
  is the rank; the decisions there are settled.
- Work in an isolated worktree; the gold-page editorial loop runs concurrently in
  its own worktree and must not be disturbed.
- New idea from Erin or from analysis → stub first (protocol above), build later.
- When a layer's status changes, update its file AND the ROADMAP registry row in
  the same commit.
