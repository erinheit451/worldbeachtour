# Legendary spoke brief — Coney Island Beach sub-page (NO web)

You write ONE sub-page of the Tier-1 Coney Island Beach page. Working dir:
`C:\Users\erinr\wt\worldbeachtour\main`. NO web access. Every number, date, name, price, rule and
quotation must come from the fact sheet; `dead_ends` are things you must not supply from memory.

## Read (each once)
1. This brief, then `research/legendary/coney-island-beach-1/AUTHOR-BRIEF.md` — ALL its copy rules,
   tense rules (today is 2026-10-13, the 2026 season is over), victim-naming rule, conflict and
   weak-source rules apply to you too.
2. The main page as written: `site/content/beaches/coney-island-beach-1/composition.json` and
   `showcase.json`. **Do not repeat it.** You may point back to it in one short sentence; you may
   not re-tell its stories. Where the main page gives a number, use the same number.
3. The fact sheet parts `research/legendary/coney-island-beach-1/sheet.partNofM.json` (all).

## Your page (slug, title idea and scope are in your dispatch)
Write `research/legendary/coney-island-beach-1/spoke.<slug>.json`, ONE Write, shaped:
```
{"title": "...", "kicker": "one plain sentence: what this page gives the reader",
 "meta_title": "≤65 chars", "meta_description": "140–160 chars, plain, answer first",
 "intro": "2–3 short paragraphs, BLUF",
 "sections": [{"heading": "plain heading that says what the section answers", "body": "paragraphs separated by blank lines"}],
 "sources": [{"label": "Publisher — page title (year)", "url": "..."}],
 "fact_ids": ["V001", "..."]}
```
- 1,300–1,900 words of prose across intro + sections; 5–8 sections.
- Headings are plain questions or statements a reader would scan for ("Where can you swim?").
- `sources`: every distinct URL behind the facts you used, deduped, best first.
- `fact_ids`: every fact id you relied on. Any date-span arithmetic ("N years later") needs a
  derivation appended to `research/legendary/coney-island-beach-1/derivations.json`
  (array of `{"id":"Dnn","fact":"…","from":[ids]}`; read it first if it exists, keep existing rows,
  use the next free id).
- Prose only inside `body` strings (no Markdown headings, lists as plain sentences; a short list is
  fine as separate one-line paragraphs).

## Check yourself
Run `python -c "import json;json.load(open(r'research/legendary/coney-island-beach-1/spoke.<slug>.json',encoding='utf-8'))"`.
Then reread your page once against the sheet for any number not in a fact. Fix with Edit.
No git. No other files. Finish with: word count, sections list, facts used count, anything left out
for lack of a source.
