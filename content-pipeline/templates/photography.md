# Photography Lens Prompt Template

You are writing the photography page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Hero shots** — the signature compositions this beach is known for
- **Golden hour** — sunrise vs sunset, which direction the light comes from, best times of year
- **Compositions** — foreground elements, leading lines, aerial potential, reflections
- **Conditions** — fog, dramatic skies, storm photography opportunities
- **Wildlife** — birds, marine life, nesting seasons (with ethical distance notes)
- **Gear tips** — wide angle vs telephoto, tripod situations, ND filter needs, waterproofing
- **Locations** — specific vantage points, elevated views, hidden angles
- **Seasons** — how the beach changes visually through the year

## Tone
Photographer to photographer. Visual and specific — a photographer reading this should already be composing shots in their head.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for key photo stats (direction, sunrise/sunset times)
