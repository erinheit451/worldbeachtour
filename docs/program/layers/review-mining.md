# Layer: Review mining
**Status:** idea
**Scores:** Uniqueness H · Leverage M · Cost M · Authority H · Revenue M

## What it is
The genuinely model-shaped job: NLP over millions of Google/TripAdvisor reviews to
extract structured attributes per beach, with seasonality. Reviews are unstructured
everywhere; structured at 228K scale, only here.

## What it yields (DB columns)
Per-beach structured signals: crowd complaints, seaweed/sargassum mentions, vendor
hassle, water-entry difficulty, parking pain, cleanliness sentiment — each with a
seasonality curve and a volume/confidence measure. Feeds swim/comfort scoring and
honest page copy.

## Sources
Google Places reviews, TripAdvisor (ToS-restricted — check access path), any
licensable review corpus. Extraction via LLM classification over review text.

## Depends on
Nothing hard; more valuable once pages exist to surface it on.

## Effort
Medium-high: acquisition path is the hard part (ToS/scraping vs licensed API);
the extraction itself is a batch classification pipeline.

## Open questions
- Legal acquisition path for review text at volume — this gates the whole layer.
- Store extracted attributes + provenance, never raw copyrighted review text.
- Cost of LLM classification at millions-of-reviews scale (sample first, prove signal).
