# Layer: Distribution & products
**Status:** partial (799 URLs live; MCP/dataset/API/query engine = idea)
**Scores:** Uniqueness varies · Leverage H · Cost varies · Authority H · Revenue H

Not a data layer — the surfaces the DB projects onto. Data has zero authority value
unpublished; this is how it reaches people and machines. See DECISIONS: open-core
split + quality gates.

## The six surfaces

**1. Programmatic pages (Tier 3/4).** Templated field-guide + stub pages for all
~228K beaches, quality-gated (publish above completeness threshold, noindex thin).
Each carries structured attributes + JSON-LD = a citable answer. 799 → six figures.

**2. Query / intersection pages.** Computed-attribute intersections as landing pages
("west-facing sandy beaches near Lisbon, swimmable in October") — the only site that
can answer them. Real substance, not thin templating.

**3. Beach MCP server.** The beach tool AI assistants call — search, attributes,
comparisons, "best X near Y." First-mover: no beach MCP exists. Attribution baked in.

**4. Open dataset release.** Generous core slice (identity + location + country + a
few attributes) on Hugging Face / Kaggle / Zenodo with DOI + citation requirement.
Computed depth stays proprietary. Makes 228,612 THE cited number.

**5. API (paid, later).** Full-depth programmatic access, tiered. The monetization
valve — travel apps, weather apps, climate-risk, tourism boards.

**6. Embeds & reports.** Embeddable beach data cards; the annual State of the World's
Beaches report; ranking press releases. Each embed = a backlink/citation.

## Depends on
#1–2 need the compute layers to have something worth publishing. #3–4 are cheap and
time-sensitive (first-mover) — ship as soon as the DB has a defensible core.

## Effort
Templating + rollout tooling for #1; #3 ~a weekend; #4 ~days; #2 after compute lands.

## Open questions
- Completeness-threshold value + noindex policy (coordinate with Search Console).
- Exact open-core column boundary for #4.
- MCP tool surface design (search/filter/compare/nearby verbs).
