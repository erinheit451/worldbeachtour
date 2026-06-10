# Praia do Norte (Nazaré) — audit v2 (spoke model)

Date: 2026-04-19
Source page: `site/app/beaches/praia-do-norte-6/page.tsx` rendering
`components/showcase/legendary-beach.tsx` + 4 signature components.

Aligned with Erin on 2026-04-19:
- **Main page** = uniqueness + context + color. Why *this* beach is *this* beach.
- **Spokes** = standalone landing pages, one per user archetype that
  actually matters for this beach. Each spoke works cold (a reader who
  never opens main can still get what they came for).
- **Spoke set is chosen per beach.** Nazaré earns three:
  **Travel · Local · Surfing**. Other Tier-1 pages may need Scuba, Nightlife,
  Pilgrimage — whatever the beach itself demands.

## Current page = 21 slots, most don't belong here

Under the old model the main page was trying to be every audience's
landing page. That's why it has a lodging matrix, an ETIAS paragraph, a
wetsuit-weight forecast, *and* a 900-year pilgrimage history. Moving the
audience-specific material out is the single biggest cleanup.

## Main page — what it becomes

The main page is the canonical "here is Nazaré, and here is why Nazaré is
Nazaré." Ten sections, in order:

1. **Hero.** Lighthouse + wave composition, the 900-year-above-5-km-canyon
   tagline. Keep; it's the only place `text-9xl` lives.
2. **Story.** The 6-paragraph intro — three-centuries-in-one-kilometer,
   the physics overview, the village/surf/pilgrimage layering. Drop-cap,
   pull-quote. This is the spine. Keep as is; possibly tighten paragraph
   six.
3. **Canyon (signature).** High-level physics: 500 m offshore, 5,000 m
   down, swell splits and re-phases. **Explainer register** — enough
   that a smart non-surfer gets *why* the waves here are different. The
   *applied* forecasting version goes to the Surfing spoke.
4. **McNamara Era (signature).** 2005 Casimiro email → 2011 ride → 2013
   cover era → WSL era. The inflection-point story. Verify the
   `surfer_action` image is actually the 2011 ride, not stock.
5. **The Village (signature).** Fisherwomen, funicular, sanctuary —
   the counterweight to McNamara. Without it, the page tilts surf-doc.
6. **Zones / orientation.** Praia do Norte vs. Praia da Nazaré vs.
   Sítio — three different beach-experiences under one town name.
   Reader needs this map to hold everything else. **Rename the anchor
   from "postos"** (Copa's Brazilian lifeguard-station word; Nazaré has
   *bairros / miradouros*). **Fold the rip-current red callout in
   here**: "Praia do Norte is not swimmable, even in summer." That's
   the only safety warning that has to live on main.
7. **A day here.** Dawn / midday / golden / night prose. This is
   atmospheric color, not actionable timing — it earns its main-page
   spot. Add one dawn and one golden image; currently text-only.
8. **Timeline.** 1182 (Lenda) → 2023 (UNESCO submission). The 900-year
   spine. Keep all 15 events; review whether 2011 + 2013 McNamara rides
   collapse to one beat.
9. **Cultural footprint.** Rewrite the 15-card grid as 2–3 paragraphs
   of prose. The real shape is "before 2011, Nazaré was a fado
   sub-theme and a Bordalo Pinheiro ceramic; after 2011, it is
   Portugal's international tourism cover image." That narrative ≠ 15
   uniform cards.
10. **The Village Beneath.** Renamed from "Honest Context" / "favela-note"
    framing. Numbers (600K → 2M visitors, 400 → 80 fishing vessels,
    short-term-let displacement, UNESCO candidacy, "stay overnight,
    tip generously"). This section is the strongest piece of writing on
    the page after the Story. Keep; rename.

**Footer: small-type page provenance** (what was "Sources" as a full
section). Demote entirely — no `text-3xl` heading, no grid of nine
cards. One paragraph, bottom of page.

**Also at the bottom: three spoke links.** Plain and direct:
"Visiting Nazaré →" / "Events & local rhythm →" / "Surfing Nazaré →".
This replaces the Paths widget.

## Travel spoke ("Visiting Nazaré")

Standalone page for a person who has decided to go. They may or may
not have read main.

- **Quick decisions** (when / where / how long — the three-answer widget,
  this is where it belongs).
- **Getting there.** LIS 92 km, A8 motorway, OPO option, bus from Sete
  Rios. Parking at the Forte (tight on swell days — arrive before 11 a.m.).
- **On the ground.** Payments, language, walking, wind, the funicular
  (€2.20 RT, the 175-step Capuchinhos alternative).
- **Entry.** EU, ETIAS, Schengen 90/180 — the generic travel block. Fine
  here; wrong on main.
- **Stay.** Praia / Sítio / Pederneira × three tiers. Currently a lodging
  matrix; keep as-is, it's genuinely useful at this register.
- **Eat.** Bacalhau, sardinha seca, caldeirada, vinho verde. Named
  restaurants (Taberna d'Adélia, Rosa dos Ventos, O Pirata). **One
  paragraph of estendal etiquette** — it's a working practice, ask
  before photographing, buy fish if you eat fish.
- **Visitor safety.** Rip currents at Praia do Norte (don't swim), the
  Forte cliff edge (no railing, fatalities have occurred), traffic in the
  lower town on big-wave days, the jet-ski tow operations (don't paddle
  out to them).
- **Itineraries.** Day trip from Lisbon (rushed, possible). Two nights
  (default). Three nights (forecast-flexible for winter swell window).
  What Óbidos/Alcobaça add as side trips.

## Local spoke ("Nazaré — events & local rhythm")

Standalone page for what is happening in Nazaré and when.

- **Seasonal rhythm.** October–February is surf spectator season. Spring
  and early summer are empty-village season. July–August is domestic
  Portuguese tourism. September 8 is the pilgrimage. That shape is the
  page's scaffold.
- **Festas da Senhora da Nazaré (September 8).** The 100K-attendee
  Marian pilgrimage — processions from the Ermida da Memória to the
  Santuário, folkloric performances, fireworks. Oldest continuously-
  celebrated Marian pilgrimage in Iberia. Deserves its own deep section;
  currently it's one recurring-events card.
- **Big Wave Season (Oct–Feb).** Not a scheduled event but a window.
  Daily forecasts at magicseaweed / surfline. How to know when a swell is
  coming (72-hour WSL call window).
- **WSL Nazaré Tow Challenge.** One-day event during the swell window;
  broadcast live; ~20K attendees.
- **Carnaval da Nazaré.** Shrove Tuesday + weekend. Atlantic-coast
  carnival, local *ranchos*, minimal foreign tourism.
- **Feira do Livro.** Summer book fair on Avenida Marginal — Portuguese-
  language, local authors.
- **Living practices.** Fisherwomen on the estendal (daily, weather-
  permitting). Sanctuary daily masses. The funicular's hours.
- **Museu do Surf de Nazaré.** Exhibits, opening hours, the €2
  admission, free guided tours at 11 a.m. and 3 p.m. in summer.

## Surfing spoke ("Surfing Nazaré")

Standalone page for surfers and surf-educated spectators.

- **How the canyon actually works.** The *applied* version of the Canyon
  signature — canyon-edge refraction math, swell-split mechanics, the
  95 m → 0 m bathymetry. Sebastian Steudtner's University of Alcalá
  measurement re-analysis (actual height ≈ 28.6 m, not 26.21 m). This
  is the surfer-grade explainer; main page gets the conceptual version.
- **Reading the forecast.** The swell window that matters: deep-Atlantic
  low pressure, W/NW groundswell, long-period (16s+). The local
  forecasters and the 72-hour call.
- **Water temperature by month → wetsuit guide.** 14 °C Feb, 19 °C Aug;
  4/3 in summer, 5/4 in winter with booties. This *is* the monthly
  chart, but reframed from "climate" (irrelevant for Nazaré on main) to
  "wetsuit decisions" (actionable here).
- **Tow operations.** How jet-ski entry works at Nazaré, who the core
  water-safety teams are, etiquette if you show up with a board.
- **Record rides anthology.** McNamara 2011 (23.77 m), McNamara 2013
  (disputed ~100 ft), Koxa 2017 (24.38 m), Steudtner 2020 (26.21 m /
  28.6 m), Gabeira 2018/2020 women's records (20.7 m → 22.4 m).
- **Nazaré vs. Jaws (Pe'ahi).** The only comparison that belongs — both
  canyon-assisted, both tow-dominant. Pipeline and Mavericks are
  different categories; mentioning them flatters neither.
- **Surfer safety.** Cold water, current patterns, the 2013
  Gabeira wipeout and what changed in water-safety after it, the
  realistic skill floor.

## What gets cut entirely

- **Paths signature.** An in-page audience-router — redundant once
  spokes exist. Cut.
- **Versus (Pipeline / Mavericks).** Wrong comparison; the right one
  (Jaws) lives on the Surfing spoke. Cut from main.
- **View-back gallery.** Six captioned images at the end. Fold any
  image that pulls weight into the section it illustrates; cut the rest.
  A Tier-1 page does not need a greatest-hits slideshow.
- **Climate bar chart.** Nazaré's "season" isn't a temperature graph.
  Chart shape migrates to the Surfing spoke as a wetsuit-by-month table.
  Cut from main.
- **Water section (as a standalone section on main).** Split: canyon
  physics → Canyon signature. Wetsuit/tide detail → Surfing spoke.
  Wildlife → Local spoke. Storms → cut entirely (it was Copa template
  residue).
- **Planner / Stay / Eat sections on main.** All move to Travel spoke.
- **Calendar / recurring events on main.** All move to Local spoke.
- **"Sources" as a dedicated section.** Demote to footer, smaller type.
- **`postos` anchor/nav label.** Rename to `bairros` or `zones`;
  Portuguese headland town doesn't use Brazilian lifeguard vocabulary.
- **The "sharks are not a concern" sentence in Safety.** Template
  residue — don't raise a threat just to dismiss it.

## Typography — three rules to set (unchanged from v1)

The drift isn't in `SectionHeader`; that primitive is already
consistent. The drift is inside sections — h3 ranges
`text-lg → text-3xl` with no scale, body text ranges `text-[15px]` to
`text-[17px]` to Tailwind `prose-lg`, eyebrows re-invented ad-hoc.

1. **Headings — four sizes only.** Hero h1 (`text-9xl`), section h2
   (`text-5xl`, from `SectionHeader`), sub-heading h3 (`text-xl`),
   tertiary h4 (`text-base`). No ad-hoc `text-2xl`/`text-3xl` in section
   bodies.
2. **Body — two sizes only.** Long-form `text-[17px] leading-[1.75]`
   (Story, Village Beneath). Short-form `text-sm leading-relaxed`
   (cards, captions, utility panels). Nothing else.
3. **Eyebrow — one treatment.** `text-xs font-mono uppercase
   tracking-[0.3em] text-ocean-700`. Used once per section, in the
   header. The `text-[10px]` / `text-[11px]` variants inside sections
   all collapse to this.

These rules are mostly *forbidding invention*, not adding new
primitives. `SectionHeader`, `Prose`, `PullQuote`, `Caption` already
exist and are close to correct.

## Order of operations (before any coding)

1. **Erin aligns on this audit** — or redirects the keep/cut/move
   calls.
2. **Short style-guide doc** — Erin's typography rules (the three above,
   or a variant), color tokens, approved component vocabulary,
   section-rhythm rules. Constraint list, not a spec.
3. **Build Nazaré main** at `/beaches-v2/praia-do-norte-6` against the
   rules. 10 sections, no CMS-template wrapper.
4. **Build the three Nazaré spokes** as standalone routes. Each one
   must read cold.
5. **Extract the shared design language** from what actually got
   built — don't pre-extract.
6. **Align the other five legendary pages** against the reference. For
   each, decide their own spoke set (Brighton probably Travel + Victorian-
   heritage, not Surfing; Glass Beach probably Travel only; Waikīkī
   likely Travel + Surfing + Hawaiian-history; Bondi likely Travel +
   Surfing + Lifesaving-heritage; Copacabana likely Travel + Samba/
   nightlife + Carnaval).

Steps 3–4 are where most of the work lives. Step 5 is the payoff.

## Open question before step 3

The cultural footprint on main — I propose **2–3 paragraphs of prose**
replacing the 15-card grid, centered on "pre-2011 footnote → post-2011
global brand." Confirm that framing is right, or redirect. That's the
only piece where I'm still guessing about tone.
