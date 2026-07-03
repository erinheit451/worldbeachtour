# Layer: Surf
**Status:** idea
**Scores:** Uniqueness H · Leverage M · Cost M · Authority M · Revenue M

## What it is
A Surfline-style profile for thousands of unrated breaks, generated from physics —
break type, consistency, best season, tide dependence.

## What it yields (DB columns)
Break type, consistency score, best-season window, tide dependence, swell-window
direction. A whole vertical audience (surfers) and query surface ("consistent
beginner breaks in Portugal in September").

## Sources
NOAA WaveWatch III hindcast (shared with [marine-climate](marine-climate.md)) +
bathymetry (in DB) + orientation (post-keystone). Ground-truth against known rated
breaks for calibration.

## Depends on
[marine-climate](marine-climate.md) wave data + [geometry-keystone](geometry-keystone.md)
orientation. Largely a derivation on top of layer 2.

## Effort
Medium — mostly modeling on already-computed inputs once layer 2 lands.

## Open questions
- Calibration set of known breaks to validate the generated profiles.
- Where surf suitability stops and safety disclaimer starts.
