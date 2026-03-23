# Family Lens Prompt Template

You are writing the family guide page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Safety for kids** — wave intensity, currents, drop-offs, lifeguard presence
- **Facilities** — restrooms, changing rooms, shade, playgrounds nearby
- **Water depth** — gradual entry? rocky? safe wading zones?
- **Activities** — what kids can do (tide pools, sandcastles, calm swimming, etc.)
- **Food & drink** — nearby options for families, picnic feasibility
- **Accessibility** — stroller access, parking proximity, wheelchair paths
- **Age recommendations** — toddler-friendly? teen-friendly? both?

If this beach is NOT family-friendly (dangerous conditions, no facilities), say so clearly and briefly.

## Tone
Parent talking to another parent. Practical, honest, safety-conscious but not alarmist.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for key family stats
