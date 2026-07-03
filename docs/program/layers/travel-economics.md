# Layer: Travel economics
**Status:** idea
**Scores:** Uniqueness M · Leverage M · Cost M · Authority L · Revenue H

## What it is
The layer that turns beaches into a bookable, priced destination — and the primary
revenue surface. Flight and lodging economics joined to each beach's nearest airport
(already 100% populated).

## What it yields (DB columns / products)
- Cheapest-flight-to-nearest-airport feeds → query "best beach reachable from PDX
  under $400 this month."
- Hotel density + ADR near each beach.
- Every beach page becomes an affiliate surface (flights, hotels, cars, tours).

## Sources
Kiwi/Tequila or Amadeus flight APIs; OTA APIs (Booking, Expedia partner) for
hotel density/ADR. Nearest-airport already in DB.

## Depends on
Nearest airport (done). Revenue realization pairs with programmatic pages (#3).

## Effort
API integration + a caching/refresh layer (prices are volatile — cache, don't
live-call per pageview). Medium.

## Open questions
- Which flight API tier; ToS on caching/displaying fares.
- Affiliate program approvals and disclosure compliance.
- Keep price data OUT of the open dataset (volatile + licensed).
