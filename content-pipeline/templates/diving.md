# Diving Lens Prompt Template

You are writing the diving & snorkeling page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Dive sites** — what's accessible from this beach (shore entry, boat needed?)
- **Marine life** — what you'll see, seasonal highlights, rare encounters
- **Visibility** — typical conditions, best and worst seasons
- **Water temperature** — by season, wetsuit recommendations
- **Depth** — typical range, max depth, profiles
- **Skill level** — beginner snorkeling? advanced drift dive? both?
- **Currents & hazards** — rip currents, surge, boat traffic, jellyfish seasons
- **Operators** — whether local dive shops exist (don't name specific ones)

If this beach has no notable diving/snorkeling, say so briefly and suggest nearby alternatives if known.

## Tone
Diver to diver. Safety-aware but enthusiastic.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for dive stats
