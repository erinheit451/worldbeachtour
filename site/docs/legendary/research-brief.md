# Tier 1 Research Brief — Schema & Agent Prompt

Every Tier 1 legendary beach page starts from a **research brief**. The brief is
structured JSON (or YAML) produced by a research subagent before any code is
written. The brief is the single point of human review: if the brief is thin,
the page will be thin. If the brief is good, the page mostly writes itself.

This document defines:

1. The brief schema (what the subagent must produce)
2. The subagent prompt (what to paste into `Agent(subagent_type: "general-purpose")`)
3. The review checklist (what to verify before proceeding to build)

---

## 1. Schema

```jsonc
{
  "slug": "malibu",
  "beach_name": "Surfrider Beach (Malibu)",
  "tier": 1,
  "one_line_spike": "The longboard point-break that invented modern surf culture.",

  "why_legendary": "One paragraph (~100 words) — what makes this beach globally recognized. Must cite the cross-border claim: a surfer in Japan, a traveler in Brazil, a landlocked teenager in Nebraska should all recognize the name.",

  "named_humans": [
    {
      "name": "Miki Dora",
      "role": "First-Point surfer, 1950s–60s",
      "dates": "1934–2002",
      "one_line": "Cat on a Hot Foamed Roof. The anti-establishment archetype who defined Malibu's outlaw cool."
    }
  ],

  "dated_incidents": [
    {
      "year": 1957,
      "event": "Kathy Kohner begins surfing First Point, inspires Gidget novel (father), launches global surf culture.",
      "significance": "high"
    }
  ],

  "place_names": [
    {
      "local_name": "First Point",
      "english_gloss": "The wave directly off the pier.",
      "note": "The longboard wave. Two- to four-foot shoulder-high walls that peel for 100+ yards."
    }
  ],

  "wave_or_physical": "What makes the geography physically distinct. Reef? Canyon? Point? Sand bar? Tide mechanics. Wind patterns. Swell windows.",

  "cultural_footprint": "What the beach put into world culture. Specific songs, films, books, contests, archetypes. Not vague 'inspired many artists' — named things.",

  "honest_reckoning": "What is uncomfortable about this beach. Environmental damage. Displaced indigenous peoples. Drownings. Localism. Over-tourism. Whatever the page cannot look away from.",

  "voice_register_candidates": [
    {
      "register": "WRY",
      "why": "Malibu's own self-image is ironic — beach where Hollywood pretends to be itself. WRY matches the cultural register the place performs."
    },
    {
      "register": "CLASSICAL",
      "why": "If we take the first-point longboard seriously as a formal tradition (Maori waka-ama treatment, etc.), CLASSICAL pulls it toward canon."
    }
  ],

  "proposed_spokes": [
    {
      "slug": "longboard-and-gidget",
      "type": "deep_dive",
      "one_line": "1957 to 1975 — the cultural explosion that turned a point break into a worldview."
    }
  ],

  "image_queries": [
    { "role": "hero", "query": "Surfrider Beach Malibu First Point aerial" },
    { "role": "section:longboard", "query": "Malibu longboard surfer 1960s" },
    { "role": "section:pier", "query": "Malibu Pier sunset" }
  ],

  "sources": [
    "https://en.wikipedia.org/wiki/Surfrider_Beach",
    "https://en.wikipedia.org/wiki/Miki_Dora",
    "https://surfrider.org/about/history"
  ]
}
```

### Required minimums

A brief is **not ready to build** unless it has:

- At least **5 named humans** with roles and dates
- At least **7 dated incidents** spanning 30+ years
- At least **3 place names** with local-language detail
- At least **10 image queries** split between hero and section roles
- At least **1 honest-reckoning** angle that is not a PR-friendly line
- At least **2 voice-register candidates** with rationales
- At least **3 proposed spokes** — author will pick 3–4

## 2. Subagent prompt

Paste this into an `Agent(subagent_type: "general-purpose")` call, substituting
`{{beach_name}}` and `{{slug}}`:

```
Research brief for a Tier 1 legendary beach page at worldbeachtour.com:
{{beach_name}} (slug: {{slug}}).

Produce a JSON document matching the schema in
site/docs/legendary/research-brief.md. Your brief is the single source
of truth the page will be written from — be specific, named, dated.
Never write "inspired many artists" where you could name three. Never
write "over the years" where you could write "1957".

Required minimums (see schema): 5+ named humans, 7+ dated incidents
across 30+ years, 3+ place names with local-language detail, 10+ image
queries, 1+ honest-reckoning angle that would make a Chamber of
Commerce uncomfortable, 2+ voice-register candidates with rationale.

Use Wikipedia as a starting point but do not stop there — newspaper
obituaries, surf-culture histories, oral histories are the sources
that produce specific sentences. If a claim cannot be sourced, omit
it rather than hedge it.

Voice registers available: SEVERE / REVERENT / WRY / ROMANTIC /
CLINICAL. Display pairings: CLASSICAL (serif) / AUSTERE (condensed
sans) / VERNACULAR (clean sans). Pick candidates that fit the place's
actual character, not the first one that comes to mind.

Return ONLY the JSON brief — no commentary, no preamble. I will review,
then build the page from the brief.
```

## 3. Review checklist

Before proceeding to build, the brief reviewer (Erin) confirms:

- [ ] Every named human has a date and a one-line role
- [ ] Every dated incident has a specific year, not "the 1960s"
- [ ] The spike statement is in one sentence and is not generic
- [ ] The honest-reckoning angle names a specific thing, not a vibe
- [ ] The voice register matches the beach's actual character
- [ ] The proposed spokes are *distinct* audiences/angles, not three
      retellings of the same story
- [ ] Image queries include at least one hero-candidate and at least
      one human-face candidate (pages without human faces feel dead)

If any checkbox fails, send the brief back to the subagent with the
specific gap flagged. Do not build a page from a thin brief.

## 4. Integration with image CLI

Once the brief is approved:

```bash
# For each image_query in the brief, search for candidates:
cd site && npx tsx scripts/images.ts search "Surfrider Beach Malibu First Point aerial"

# Pick the best candidate per role, build a manifest.json:
#   { "hero": { "filename": "hero.jpg", "source_url": "https://commons.wikimedia.org/wiki/File:..." }, ... }

# Download + auto-populate meta.json:
npx tsx scripts/images.ts fetch malibu manifests/malibu.json
```

## 5. Integration with spoke scaffold

For each approved spoke in the brief:

```bash
cd site && npx tsx scripts/new-spoke.ts malibu longboard-and-gidget \
  "Longboard & Gidget" \
  "1957 to 1975 — the cultural explosion that turned a point break into a worldview." \
  deep_dive
```

The scaffold creates the component stub, route, and composition.json
entry, and prints the exact lines to paste into the cluster's
`shared.tsx` for `*_SPOKES`, `ClusterRail`, and the `SpokeCrossNav` grid.
