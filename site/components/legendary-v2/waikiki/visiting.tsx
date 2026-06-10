/**
 * Waikīkī → Visiting Waikīkī (Travel spoke). Standalone page.
 *
 * For a reader who has decided to come to Oʻahu. The practical
 * trip-planning content the main page deliberately excluded.
 */

import type { LegendaryPageBundle } from "../types";
import LegendaryShell from "../shell";
import Figure from "../primitives/figure";
import {
  BODY,
  BODY_SM,
  COOL,
  CREAM,
  EYEBROW,
  H3,
  PAPER,
  Section,
  SectionHeader,
  SpokeHero,
  SpokeProvenance,
  pickImage,
  renderInlineBold,
} from "../nazare/shared";
import {
  ClusterAside,
  ClusterLink,
  ClusterRail,
  SpokeCrossNav,
} from "./shared";

export default function WaikikiVisitingPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "royal_hawaiian") ??
    pickImage(meta, "moana_hotel") ??
    meta.images.hero;

  const moana = pickImage(meta, "moana_hotel");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="visiting" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Visiting Waikīkī"
        title="How to actually be here"
        kicker="Four days in Oʻahu with Waikīkī as the base is the default most travellers will thank themselves for. The strip is engineered to accommodate you; the rest of the island is why you came."
        image={heroImage}
      />

      {/* --- Quick decisions --- */}
      <Section id="quick" className={PAPER} width="wide">
        <SectionHeader eyebrow="· Two-Minute Answers" title="When, where, how long" />
        <div className="grid gap-8 md:grid-cols-3">
          <article>
            <div className={`${EYEBROW} mb-2`}>When</div>
            <h3 className={`${H3} mb-3`}>
              April–May and September–October. Not the high season.
            </h3>
            <p className={BODY_SM}>
              Trade winds are steady from April through October; waves are
              small and swimmable at Waikīkī year-round. The peak visitor
              windows — Christmas–New Year, spring break, and the last two
              weeks of July — triple hotel rates without improving the
              weather. If you have flexibility, early May or late September
              gives the best ratio of price to conditions. Humpback whale
              season runs December through April, visible from shore off
              the Ko Olina side; big-wave North Shore season overlaps
              November through February.
            </p>
          </article>
          <article>
            <div className={`${EYEBROW} mb-2`}>Where</div>
            <h3 className={`${H3} mb-3`}>
              Stay in Waikīkī, rent a car for one or two of your days.
            </h3>
            <p className={BODY_SM}>
              Waikīkī is the right base. The whole island is within a
              90-minute drive. A rental car is useful for two or three of
               your days (North Shore circuit, windward-side beaches,
              circle-island drive) but not every day — Waikīkī itself
              walks, and the Bus 20 direct to Pearl Harbor and Bus 22 to
              Hanauma Bay cover the major non-car trips. Rent from
              Enterprise or Turo at the airport; return before the
              beachfront day you want to walk.
            </p>
          </article>
          <article>
            <div className={`${EYEBROW} mb-2`}>How long</div>
            <h3 className={`${H3} mb-3`}>
              Four nights if it's your only Hawaiian island. Seven if you
              add a neighbor island.
            </h3>
            <p className={BODY_SM}>
              Four nights in Waikīkī is the right floor for a Hawaiian
              first-timer — enough time for one surf lesson, one North
              Shore day, one sovereign-history day (ʻIolani Palace +
              Pearl Harbor or Bishop Museum), one beach day. Seven nights
              is the right length if you're island-hopping: four on
              Oʻahu, three on Kauaʻi, Maui, or the Big Island. A cruise
              port day is possible but rushed — the 6-hour window
              shouldn't include both Waikīkī and Pearl Harbor.
            </p>
          </article>
        </div>
      </Section>

      {/* --- Getting here --- */}
      <Section id="getting-here" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Getting Here"
          title="Honolulu International (HNL) to Waikīkī"
          kicker="Daniel K. Inouye International Airport is eight miles west of Waikīkī. Thirty minutes in typical traffic; an hour if the H-1 is backed up to Pearl City."
        />

        <div className="grid gap-8 md:grid-cols-2">
          <article>
            <h3 className={`${H3} mb-3`}>From HNL airport</h3>
            <p className={`${BODY_SM} mb-3`}>
              The airport taxi queue at the arrivals curb is organized and
              flat-rated ~$40 to Waikīkī. Uber and Lyft run $35–55 with
              surge pricing at peak arrivals. SpeediShuttle is cheaper
              ($18–25 per person) if your flight arrives at a reasonable
              hour; Hertz / Enterprise / Avis rentals are in the
              consolidated rental facility a tram ride from arrivals.
            </p>
            <p className={BODY_SM}>
              The Bus 20 route runs from HNL directly to Kalākaua Avenue
              in Waikīkī — 60–75 minutes, $3 per ride, exact change
              required. Feasible if you're travelling light; painful with
              three suitcases.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>On the ground in Waikīkī</h3>
            <p className={`${BODY_SM} mb-3`}>
              Kalākaua Avenue is the main beachfront strip; Kūhiō Avenue
              runs parallel one block inland and carries the Bus and
              most of the nightlife. The whole strip is 2 km end-to-end —
              walkable. The Hawaiʻi Biki bikeshare network has docks
              every few blocks; $4.50 for a 30-minute ride.
            </p>
            <p className={BODY_SM}>
              The Waikīkī Trolley (red, blue, green, pink lines)
              connects Waikīkī to Ala Moana Center, downtown Honolulu,
              and Diamond Head. $2–30 per day depending on line. Tourist
              infrastructure; avoid if you want to feel like a local.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>For a rental-car day</h3>
            <p className={`${BODY_SM} mb-3`}>
              Pick up the car at HNL on the morning you want to do North
              Shore or the circle-island drive. The H-1 West is the
              easy route to Pearl Harbor and Ko Olina; the H-2 North via
              H-1 gets you to the North Shore in under an hour. The
              Pali Highway (61) over the mountains takes you to the
              windward side (Kailua, Lanikai) in 25 minutes.
            </p>
            <p className={BODY_SM}>
              Parking at most Waikīkī hotels is $30–50 a night. If you
              need parking more than 2 days, consider booking an
              off-beach hotel with free parking and walking the 10–15
              minutes to the sand.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>Entry</h3>
            <p className={`${BODY_SM} mb-3`}>
              Hawaiʻi is a U.S. state. Domestic U.S. travellers have no
              border; foreign visitors use standard U.S. entry rules
              (ESTA for Visa Waiver Program countries, B-2 for others).
              No agricultural inspection on arrival; an outgoing
              inspection when leaving Hawaiʻi checks for fresh fruit
              and plants you cannot take back to the mainland.
            </p>
          </article>
        </div>

        {moana && (
          <Figure
            image={moana}
            size="wide"
            tier="B"
            caption="The Moana Hotel, opened 1901 — the first tourist hotel on Waikīkī. Still operating as the Moana Surfrider. Its courtyard banyan (planted 1904) has hosted the 'Hawaii Calls' radio broadcast since 1935."
            className="mt-12"
          />
        )}
      </Section>

      {/* --- Where to stay --- */}
      <Section id="stay" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Where to Stay"
          title="Thirty thousand rooms, three real decisions"
          kicker="Waikīkī has more hotel rooms than all of Maui. The decision that actually matters is which of the six beach zones you want to walk out to every morning."
        />

        <div className="grid gap-8 md:grid-cols-2">
          <StayBlock
            zone="Heritage luxury — the old buildings on the sand"
            character="The Royal Hawaiian (1927, pink stucco, Warren & Wetmore), the Moana Surfrider (1901, Beaux-Arts, banyan courtyard), the Halekulani (1917 cottages, later redeveloped; House Without a Key on the lanai). These three are on Waikīkī's sand directly, on historic sites, and carry most of the cultural weight that survives the strip's renovation cycles. $450–900 / night in season."
            names="Royal Hawaiian, Moana Surfrider, Halekulani"
          />
          <StayBlock
            zone="Modern luxury — newer builds, bigger amenities"
            character="The Ritz-Carlton Residences, the Kahala (technically a 10-minute drive east of Waikīkī — quieter, better beach, serious luxury), the Trump International Waikīkī. These are full-service modern hotels without the heritage dimension. $500–1,500 / night."
            names="Kahala Hotel & Resort, Ritz-Carlton Residences, Trump Waikīkī"
          />
          <StayBlock
            zone="Mid-tier — walkable strip hotels"
            character="The Sheraton Waikīkī, the Outrigger Reef, the Waikīkī Beach Marriott, the Hyatt Regency. Reliable mid-range hotels along Kalākaua. Rooms without ocean view are 30–40% cheaper and walk to the same beach in five minutes. $200–400 / night."
            names="Sheraton Waikīkī, Outrigger Reef, Hyatt Regency Waikīkī"
          />
          <StayBlock
            zone="Budget and locally-owned"
            character="The Hotel Renew, the Waikīkī Marina Resort, the Polynesian Hostel Beach Club, and the Airbnb inventory off Kūhiō Avenue. Locally-owned guesthouses exist but are shrinking; the short-term rental legal situation on Oʻahu tightened in 2022 and most unregulated Airbnbs are illegal. Verify your STR listing has a registration number. $80–200 / night."
            names="Polynesian Hostel Beach Club, Hotel Renew, vetted STRs"
          />
        </div>

        <div className="mt-16 border-l-2 border-[color:var(--beach-supporting,#1E5F74)] pl-6 max-w-3xl">
          <div className={`${EYEBROW} mb-3`}>· The resort fee problem</div>
          <p className={BODY_SM}>
            Almost every Waikīkī hotel charges a <strong>resort fee</strong> —
            usually $35–55 per night on top of the room rate — which bundles
            "amenities" (Wi-Fi, a beach-towel check-out, a pool) that used
            to be included. Compare total post-fee prices, not nightly
            rates. The Hawaiʻi Attorney General's office has been
            investigating resort-fee disclosure practices since 2020;
            hotels publish the fees clearly now, but you still have to do
            the math.
          </p>
        </div>
      </Section>

      {/* --- What to eat --- */}
      <Section id="eat" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· What to Eat"
          title="Poke, shave ice, plate lunch, and why grocery-store food is not an insult"
          kicker="Hawaiʻi's local food tradition is the legacy of plantation-era Hawaiian, Japanese, Chinese, Portuguese, Filipino, and Korean labor. The single best story in a Hawaiian meal is usually the immigration history on the plate."
        />

        <div className="grid gap-10 md:grid-cols-2">
          <EatCard
            name="Poke"
            range="$12–18 a bowl"
            body="Cubed raw fish — usually ʻahi (yellowfin tuna) or aku (skipjack) — seasoned with shoyu, sesame oil, limu (seaweed), Hawaiian salt, and inamona (roasted kukui nut). The word means 'to cut crosswise into pieces.' **Grocery-store poke in Waikīkī is genuinely excellent.** Foodland's deli counter at the Ala Moana store is the baseline; Ono Seafood (on Kapahulu) and Maguro Brothers are the named local favorites. Restaurants charge $25+ for the same thing."
          />
          <EatCard
            name="Shave Ice"
            range="$5–8"
            body="Not a snow cone. Finely shaved block ice layered with housemade syrups — lilikoʻi (passion fruit), lychee, guava, pineapple, li hing — usually over azuki beans or vanilla ice cream, topped with condensed milk. Waiola Shave Ice on Kapahulu is the local baseline. Matsumoto's on the North Shore is the Instagram destination; the ice is the same."
          />
          <EatCard
            name="Plate Lunch"
            range="$10–15"
            body="Two scoops rice, one scoop mac salad, one protein — kalua pork, teriyaki chicken, loco moco, chicken katsu, Korean kalbi. **Portions are enormous.** The dish tells the story of Hawaiian, Japanese, Chinese, Portuguese, Filipino, and Korean plantation labor in one cardboard box. Rainbow Drive-In on Kapahulu and Zippy's (20+ locations) are the canonical names. Don't order a small; it will still be too big."
          />
          <EatCard
            name="Mai Tai"
            range="$18 at heritage bars"
            body="Invented in Oakland in 1944 by Trader Vic Bergeron, but the Waikīkī interpretation (at the Royal Hawaiian since 1953) is its own canonical thing. Two rums, orange curaçao, orgeat, lime. The Royal Hawaiian's Mai Tai Bar is the most famous; Duke's Waikīkī (at the Outrigger Reef) and House Without a Key (at the Halekulani) are the alternatives. Ask for well-made; some strip bars use premix."
          />
        </div>

        <div className="mt-16 border-l-2 border-[color:var(--beach-supporting,#1E5F74)] pl-6 max-w-3xl">
          <div className={`${EYEBROW} mb-3`}>· Where the locals eat</div>
          <p className={BODY}>
            Kapahulu Avenue (10 minutes east of Kalākaua on foot) is where
            Honoluluans eat. Rainbow Drive-In for plate lunch, Leonard's
            Bakery for malasadas, Ono Seafood for poke, Waiola for shave
            ice, Side Street Inn for pupu-style izakaya. Doing one meal
            in Waikīkī and one on Kapahulu is the correct default.
          </p>
        </div>
      </Section>

      {/* --- Safety --- */}
      <Section id="safety" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· How to Not Die"
          title="Five risks that actually matter, and the one you can stop worrying about"
        />

        <div className="space-y-8 max-w-3xl">
          <Hazard
            label="1 · The sun"
            severity="serious"
            body="Hawaiʻi is 21° north latitude. The sun is **much stronger than anywhere on the U.S. mainland**. Visitors get second-degree burns in 40 minutes of midday exposure. Reef-safe mineral sunscreen (zinc or titanium dioxide) is required by Hawaiʻi state law as of 2021; most chemical sunscreens damage coral. A rash guard shirt is a better default than sunscreen on your torso."
          />
          <Hazard
            label="2 · Reef cuts"
            severity="serious"
            body="The reef offshore of Waikīkī is shallow in places. Stepping on coral cuts skin cleanly and the cuts get infected fast in warm salt water. Wear reef booties if you're not a confident swimmer. At Queen's Surf, Canoes, and other beginner surf breaks, surf-board fins also cut; falling flat is safer than falling feet-first."
          />
          <Hazard
            label="3 · Rip currents on the windward and North Shore beaches"
            severity="fatal"
            body="Waikīkī itself is gentle. **The windward-side beaches — Lanikai, Waimānalo, Kailua — and the North Shore between November and March have dangerous rips.** Swim between the flags, not outside them. If caught in a rip, swim parallel to shore, not against it. Lifeguard presence on unrelated Oʻahu beaches is inconsistent."
          />
          <Hazard
            label="4 · Trade winds and kona winds"
            severity="mild"
            body="Trade winds (NE, 15–25 knots most of the year) keep the temperature comfortable and the air dry. When the wind swings south (kona winds, usually October–March), the air gets muggy, pollution settles, and the surf gets messier. Kona-wind days are the days to go inland."
          />
          <Hazard
            label="5 · Hawaiian monk seals"
            severity="real"
            body="Monk seals (ʻilio-holo-i-ka-uaua, the 'dog that runs in rough water') occasionally haul out on Waikīkī beaches, typically at Sans Souci Beach at the eastern end. They are **federally protected endangered species**; approaching one is illegal (50 ft minimum) and can result in fines. NOAA Marine Sanctuary volunteers usually set up perimeter tape when a seal is hauled out. Stay outside the tape; photograph from distance."
          />
          <Hazard
            label="Not a serious risk — sharks"
            severity="real"
            body="Hawaiʻi averages ~7 non-fatal shark encounters per year across all islands; fatalities are rare. The actual risk to swimmers at Waikīkī is statistically negligible. Public Hawaiian culture takes sharks seriously in a different register — as spiritual presences (ʻaumākua) rather than hazards — and mainland visitors' shark anxiety often reads as culturally tone-deaf."
          />
        </div>
      </Section>

      {/* --- Itineraries --- */}
      <Section id="itineraries" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Itineraries"
          title="Four ways to use the time you have"
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <Itinerary
            days="Cruise port day (6 hours)"
            plan="Disembark at Honolulu Harbor, take a taxi or rideshare directly to Waikīkī (15 min). **Skip Pearl Harbor** — you don't have time to do it respectfully. Morning: beach and poke. Midday: walk Kalākaua to the Duke statue, the Royal Hawaiian (stop for a Mai Tai). Afternoon: the Honolulu Museum of Art or ʻIolani Palace if time permits. Back to the ship by 4 p.m."
          />
          <Itinerary
            days="Four nights (the default)"
            plan="Day 1: Arrive. Beach afternoon, dinner on Kapahulu. Day 2: Morning surf lesson at Canoes. Afternoon ʻIolani Palace tour. Dinner at House Without a Key. Day 3: Pearl Harbor early (first tickets 7 a.m.), then Bishop Museum. Day 4: Rental car day — circle-island drive via windward side, North Shore lunch in Haleʻiwa, Matsumoto's shave ice, back to Waikīkī via central Oʻahu. Dinner at Helena's Hawaiian Food or Alan Wong's."
          />
          <Itinerary
            days="Seven nights, Oʻahu only"
            plan="The 4-night template, plus: Day 5 Diamond Head hike at dawn, Queen's Beach afternoon, Kūhiō Hula Mound sunset. Day 6 East Oʻahu — Hanauma Bay snorkel (reservations required), Makapuʻu lookout, Lanikai Beach. Day 7 rest day — Waikīkī Aquarium (1904, the oldest in the U.S. outside New York), lounging, last mai tai."
          />
          <Itinerary
            days="Seven nights, island-hopping"
            plan="Four nights Oʻahu, three nights neighbor island. Kauaʻi for the Nā Pali coast, the Waimea Canyon, and Hanalei Bay — most dramatic. Maui for Haleakalā sunrise, the Hāna road, and Makena Beach. Big Island for Volcanoes National Park, the Kohala Coast, and the Mauna Kea summit (elevation permitting). Inter-island flights run Hawaiian Airlines and Southwest; ~$100–150 RT."
          />
        </div>

        <ClusterAside>
          If you're coming mainly for the surfing, the actual surf
          logistics — which break, which school, what to expect — are in{" "}
          <ClusterLink to="surf" />.
        </ClusterAside>
        <ClusterAside>
          If you want to understand what you're visiting — the overthrow,
          sovereignty today, Hawaiian language, and respectful
          engagement — that lives in <ClusterLink to="malama" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="visiting" />

      <SpokeProvenance
        bundle={bundle}
        note="Rates and logistics reflect April 2026. Hotel categories are named as reference points, not endorsements. Reef-safe sunscreen requirement follows Hawaiʻi Act 104 (2018, effective 2021). Resort fee disclosure requirements tightened following the 2022 Hawaiʻi Attorney General investigation. Hanauma Bay reservation and STR registration rules change frequently; verify at honolulu.gov before planning."
      />
    </LegendaryShell>
  );
}

function StayBlock({
  zone,
  character,
  names,
}: {
  zone: string;
  character: string;
  names: string;
}) {
  return (
    <article className="rounded-sm border border-[#E7E2D4] bg-white p-7">
      <h3 className={`${H3} mb-3`}>{zone}</h3>
      <p className={`${BODY_SM} mb-4`}>{character}</p>
      <div className={`${EYEBROW} mb-1`}>Anchor names</div>
      <p className="text-[13px] text-volcanic-700 leading-relaxed">{names}</p>
    </article>
  );
}

function EatCard({
  name,
  range,
  body,
}: {
  name: string;
  range: string;
  body: string;
}) {
  return (
    <article>
      <div className="flex items-baseline gap-3 mb-3 flex-wrap">
        <h3 className={H3}>{name}</h3>
        <span className={EYEBROW}>{range}</span>
      </div>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}

function Hazard({
  label,
  severity,
  body,
}: {
  label: string;
  severity: "fatal" | "serious" | "mild" | "real";
  body: string;
}) {
  const tone =
    severity === "fatal"
      ? ["border-[#B91C1C]", "text-[#B91C1C]"]
      : severity === "serious"
      ? ["border-[#C2410C]", "text-[#C2410C]"]
      : severity === "mild"
      ? ["border-[#475569]", "text-[#475569]"]
      : ["border-[#475569]", "text-[#475569]"];
  return (
    <article className={`border-l-4 pl-6 ${tone[0]}`}>
      <div className={`text-[11px] font-mono uppercase tracking-[0.3em] mb-2 ${tone[1]}`}>
        {label} · {severity}
      </div>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}

function Itinerary({ days, plan }: { days: string; plan: string }) {
  return (
    <article className="rounded-sm border border-[#E2E8F0] bg-white p-7">
      <h3 className={`${H3} mb-4`}>{days}</h3>
      <p className={BODY_SM}>{renderInlineBold(plan)}</p>
    </article>
  );
}
