# Surf Lens Prompt Template

You are writing the surf conditions page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **The break** — type (beach break, reef break, point break), direction, bottom type
- **Conditions** — best swell direction, ideal wind, wave size range, consistency
- **Seasons** — when it works best, flat spells, peak season
- **Skill level** — who this wave is for, hazards for beginners, challenges for advanced
- **Crowd factor** — how crowded, localism, etiquette notes
- **Nearby breaks** — other surf spots within short distance
- **Gear** — wetsuit thickness by season, board recommendations

If this beach is not a notable surf spot, say so honestly and briefly (200-300 words). Don't fabricate surf conditions.

## Tone
Written by a surfer for surfers. Technical where it matters, practical throughout.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for conditions summary
- `<TideChart />` — placeholder for live tide data
- `<WeatherWidget />` — placeholder for live wind/weather
