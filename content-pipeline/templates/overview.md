# Overview Page Prompt Template

You are writing the overview page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 300-500 words introducing this beach. Cover:
- What makes this beach notable or unique
- Geographic context (where it is, what surrounds it)
- The type of experience someone should expect
- Which lenses (travel, surf, environment, family, photography, diving, history, sand) are most relevant and why

## Tone
Authoritative, engaging, informative. Not salesy or generic. Write like a knowledgeable local explaining their beach to a curious traveler.

## Format
Output as MDX. No frontmatter. No imports. Use plain markdown (headings, paragraphs, lists). You may use these components:
- `<MapEmbed lat={number} lng={number} name="string" />` — for map placement
- `<DataCard label="string" value="string" unit="string" />` — for key stats

Start directly with the content (no title — the page template adds it).
