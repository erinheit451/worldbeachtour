# Sand & Geology Lens Prompt Template

You are writing the sand & geology page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Composition** — what the sand is made of (quartz, feldspar, shell, coral, volcanic, etc.)
- **Color & texture** — what it looks like, grain size, feel underfoot
- **Geological origin** — where the sediment comes from, how it got here
- **Formation** — how this beach was created (river deposition, longshore drift, volcanic, reef erosion)
- **Coastal geomorphology** — dunes, berms, cusps, bars, spits, tombolos
- **Geological context** — the larger geological story (tectonic setting, rock formations, glacial history)
- **Change over time** — erosion/accretion trends, human intervention (seawalls, nourishment)
- **Microscope view** — what you'd see if you looked at a grain under magnification

This is the nerd page. Go deep on the science.

## Tone
Accessible but scientifically rigorous. A geologist should nod along; a curious tourist should understand.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for geological stats
