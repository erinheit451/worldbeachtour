# Travel Lens Prompt Template

You are writing the travel guide page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Getting there** — nearest airports, driving routes, public transit, boat access
- **Best time to visit** — seasons, weather patterns, crowd levels by month
- **Where to stay** — neighborhoods/areas near the beach, accommodation types (don't name specific hotels)
- **Costs** — general cost level for the area, free vs paid beach access
- **Safety** — swimming conditions, crime, health considerations
- **Local tips** — things only a frequent visitor would know

Research the actual geography and travel logistics. Be specific — name real airports, real highways, real transit lines.

## Tone
Practical and specific. A traveler should be able to plan a trip from this page alone.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##) to structure sections. You may use:
- `<DataCard label="string" value="string" unit="string" />` — for key stats
- `<WeatherWidget />` — placeholder for live weather
- `<MapEmbed lat={number} lng={number} name="string" />` — for map
