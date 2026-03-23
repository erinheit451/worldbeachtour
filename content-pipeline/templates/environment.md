# Environment Lens Prompt Template

You are writing the environment page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Water quality** — testing results, pollution sources, swimming advisories
- **Ecosystem** — marine and coastal habitat, notable species, biodiversity
- **Conservation status** — protected area designation, conservation programs
- **Erosion & climate** — shoreline change trends, climate impacts, sea level concerns
- **Pollution** — plastic/litter, runoff, industrial threats
- **Stewardship** — cleanup programs, volunteer opportunities, what visitors can do

Use real data where available. If data is sparse, note what's unknown and why that matters.

## Tone
Scientifically grounded, accessible. An environmentalist or concerned traveler should find this valuable.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for environmental metrics
- `<WaterQualityWidget />` — placeholder for live water quality
