# Future Scope: Social Photo / UGC Mining

**Status:** Out-of-scope for the 2026-04-18 enrichment plan. Parked here for a dedicated future spec.

## Why this is a gap

Current enrichment plan covers Wikimedia Commons + Flickr CC. That captures encyclopedic and hobbyist photography but misses the largest volume of beach imagery in the world: social platforms. Social photos are the primary signal for several things no other source provides well:

- **Seasonal/temporal coverage** — posts are dated, geotagged, and reflect actual visitor conditions month-to-month
- **Crowd patterns** — post density over time approximates actual foot traffic better than static popularity proxies
- **Trending / emerging beaches** — small beaches going viral on TikTok/IG before appearing anywhere else
- **UGC credibility on the site** — "as seen on Instagram" carousels convert better than Wikimedia galleries
- **Quality signal** — beaches with high-aesthetic-score photos rank higher for the "photogenic" search axis
- **Real-time sensing** — storm damage, algae blooms, oil spills surface on social before official feeds

## Candidate sources

| Source | Access | Notes |
|---|---|---|
| Instagram | Graph API (business/creator), Meta Content Library (research tier), third-party scrapers | Geotag support partially removed 2019, but location-tagged posts still queryable. Meta Content Library is free for research with approval. |
| TikTok | Research API (academic only currently) + TikTok Commercial Content API | Geo-filtered video search. API access gated. |
| X / Twitter | v2 API (paid tiers), Academic track discontinued | $100/mo basic tier limited; enterprise expensive |
| Reddit | Official API (free tier, rate-limited) | r/travel, r/backpacking, r/earthporn, beach-specific subs. Low-friction starting point. |
| Pinterest | Official API with approval | High aesthetic signal, good for inspo/styling content |
| YouTube | Data API (free tier, quota-limited) | Beach walk videos, drone footage, seasonal content |
| Google Maps photos | Places API (paid per request) | High volume, user-submitted, already geo-tied |
| Tripadvisor | No official API; scraping ToS-restricted | Reviews + photos tied to specific places |

## Technical angles to investigate

1. **Geo-query strategies.** Most platforms no longer support precise lat/lon search. Workarounds: hashtag mining (#navagio, #tarkwabeach), place-tag scraping, caption NLP for location names, then reverse-match to DB by name + fuzzy country.
2. **Legal / ToS posture.** Meta/TikTok scraping is a minefield. Research tiers (Meta Content Library, TikTok Research API, Crowdtangle successor) may be free-for-research. Worth applying early even if not using immediately.
3. **Storage model.** Don't store copyrighted photos — store *references* (URL, platform, post_id, posted_at, caption excerpt, engagement metrics). Fetch + render client-side via platform embed codes. Reduces legal surface + storage cost.
4. **Aesthetic scoring.** Once image URLs are indexed, run CLIP / aesthetic-predictor models locally to rank photos per beach. "Top 10 most-beautiful beaches in Croatia" becomes a generated leaderboard.
5. **Crowd-time-series.** Aggregate posts_per_month per beach → crowding curve. Feeds the `best_months` computation independently of climate.
6. **Language / script handling.** Hashtags and captions are multilingual. Pipeline needs transliteration + multi-language name matching (already partially solved by Wikidata labels).
7. **Dedup across platforms.** Same event often posted to IG + TikTok + X. Perceptual hashing to dedupe.

## Value to the moat

- **Closes the seasonal-photo gap** identified in the 2026-04-18 scope review
- **Unlocks crowd patterns** — the only structured source for "is this beach busy in July?"
- **Enables trending detection** — early signal on beaches worth enriching deeply
- **Adds a social proof layer** to the site (UGC carousels) without writing content
- **Differentiation vs TripAdvisor/Google:** cross-platform + longitudinal + structured, not just photo stream

## Explicitly NOT in this scope

- Any photo *hosting* — references only
- Any un-licensed republishing — embed or link, never rehost
- Real-time scraping infra — batch pulls, cached, refreshed on cadence
- User-account-based collection — only public/API-surfaced content

## Suggested next step when picked up

One brainstorming session focused only on this. Likely outputs:
- Pick 2–3 platforms to start (probably Reddit + Meta Content Library + Google Places)
- Apply to research tiers immediately (approval takes weeks)
- Design `social_posts` table + aesthetic-score pipeline
- Decide whether crowd/aesthetic signals feed the main ranking score or stay separate
- Legal/ToS review before any scraping-adjacent work

## Related scope notes

- `docs/enrichment-plan.md` — current enrichment plan (Wikimedia + Flickr already scoped there)
- `docs/superpowers/specs/2026-04-18-*.md` — current enrichment spec (when written) — this doc is its deferred sibling
