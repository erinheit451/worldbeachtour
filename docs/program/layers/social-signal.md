# Layer: Social signal
**Status:** scoped (full plan in [`../../future-scope-social-photo-mining.md`](../../future-scope-social-photo-mining.md))
**Scores:** Uniqueness M · Leverage M · Cost L(expensive) · Authority M · Revenue M

## What it is
Geotagged Instagram/TikTok post volume as popularity + seasonality curves; spike
detection = "going viral" early warning (content opportunity AND overtourism angle).
Plus a global beach webcam directory. Highest cost and ToS risk in the program —
deferred build, but one no-regret action now.

## What it yields (DB columns)
Post-density-per-month → crowd/popularity curves (independent of climate), trending
flag, aesthetic score (CLIP over CC images), webcam URLs. Store references only,
never rehost.

## Sources
Meta Content Library + TikTok Research API (free research tiers — SLOW approvals),
Reddit API (low-friction start), Flickr/Wikimedia CC for aesthetic scoring, YouTube.
See future-scope doc for the full matrix + ToS posture.

## Depends on
Nothing technical. Gated by API access approvals.

## Effort
High + ongoing. Batch pulls, cached, refreshed on cadence.

## No-regret action NOW
Apply for Meta Content Library + TikTok Research API access this week — approvals
take weeks and both are free. (Also logged in ROADMAP no-regret actions.)

## Open questions
- Geo-query strategy (precise lat/lon search mostly removed) — hashtag + caption NLP
  reverse-matched to DB names.
- Whether social signals feed the main ranking or stay a separate display layer.
