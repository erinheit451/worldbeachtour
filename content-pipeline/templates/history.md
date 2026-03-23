# History Lens Prompt Template

You are writing the history page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Indigenous history** — original inhabitants, cultural significance, traditional names
- **Colonial/exploration history** — European contact, naming, early settlements
- **Modern history** — development, tourism evolution, significant events
- **Military history** — if applicable (D-Day beaches, Pacific theater, etc.)
- **Cultural significance** — literature, film, music, mythology
- **Preservation** — how the beach has changed over centuries, what's been preserved

Research actual history. Don't fabricate events or dates. If historical records are sparse, say so.

## Tone
Narrative and engaging. A history buff should learn something they didn't know.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for key dates/facts
