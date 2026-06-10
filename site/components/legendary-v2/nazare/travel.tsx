/**
 * Nazaré → Visiting Nazaré (Travel spoke). Standalone page.
 *
 * This page is written for a reader who has decided to go and wants to
 * know the specifics. The main page deliberately scrubbed trip-planning
 * content; it all lands here.
 *
 * Register: practical, specific, no travel-blog throat-clearing.
 */

import type { LegendaryPageBundle } from "../types";
import LegendaryShell from "../shell";
import Figure from "../primitives/figure";
import {
  BODY,
  BODY_SM,
  ClusterAside,
  ClusterLink,
  ClusterRail,
  COOL,
  CREAM,
  EYEBROW,
  H3,
  PAPER,
  Section,
  SectionHeader,
  SpokeCrossNav,
  SpokeHero,
  SpokeProvenance,
  pickImage,
  renderInlineBold,
} from "./shared";

export default function NazareTravelPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;

  const heroImage =
    pickImage(meta, "grande_plage_aerial") ??
    pickImage(meta, "praia_do_norte") ??
    meta.images.hero;

  const funicular = pickImage(meta, "funicular");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="travel" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Visiting Nazaré"
        title="How to actually be here"
        kicker="Two nights in the lower village is the right default. Three if you're chasing a winter swell forecast. Less than one if you don't mind missing the atmosphere."
        image={heroImage}
      />

      {/* --- Quick answers --- */}
      <Section id="quick" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Two-Minute Answers"
          title="When, where, how long"
        />
        <div className="grid gap-8 md:grid-cols-3">
          <article>
            <div className={`${EYEBROW} mb-2`}>When</div>
            <h3 className={`${H3} mb-3`}>October–February for drama. April–September for weather.</h3>
            <p className={BODY_SM}>
              October through February is the big-wave window — daily forecasts
              decide whether any given afternoon is empty or packed to the cliff
              ramparts. Spring and early summer are the easiest weather on this
              coast; the village is half-empty and the sea is swimmable at
              Praia da Nazaré. September 8 is the pilgrimage — book months
              ahead if you want to be here for the Festas.
            </p>
          </article>
          <article>
            <div className={`${EYEBROW} mb-2`}>Where</div>
            <h3 className={`${H3} mb-3`}>Stay in Praia. Walk or funicular up to Sítio.</h3>
            <p className={BODY_SM}>
              Praia — the lower village — has the restaurants, the fishing
              port, and the walk to the village beach. Sítio — the upper town,
              120 m above — has the Santuário, the Forte de São Miguel
              (surf museum and the big-wave viewpoint), and a quieter
              overnight atmosphere. The 1889 funicular connects the two in
              two minutes for €2.20 round trip.
            </p>
          </article>
          <article>
            <div className={`${EYEBROW} mb-2`}>How long</div>
            <h3 className={`${H3} mb-3`}>Two nights. Three if winter swell is forecast.</h3>
            <p className={BODY_SM}>
              Two nights is the default — Day 1 lower village and estendal;
              Day 2 Sítio, Forte, surf museum, afternoon at the Praia do
              Norte viewpoint. Three nights in winter gives you forecast
              flexibility for a swell window. One day is a Lisbon day trip
              and feels rushed but does work.
            </p>
          </article>
        </div>
      </Section>

      {/* --- Getting here --- */}
      <Section id="getting-here" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Getting Here"
          title="92 km from Lisbon, nothing from anywhere else"
          kicker="Nazaré has no train station. Almost every visitor arrives either in a rental car off the A8 motorway or on the Rede Expressos bus from Sete Rios. Budget an hour and fifteen minutes from LIS."
        />

        <div className="grid gap-8 md:grid-cols-2">
          <article>
            <h3 className={`${H3} mb-3`}>From Lisbon (LIS)</h3>
            <p className={`${BODY_SM} mb-3`}>
              The practical base. 92 km north on the A8 motorway; 60–75
              minutes by car in normal traffic. Rede Expressos runs a direct
              bus from Lisbon Sete Rios to Nazaré — about 1h 50m, €12. No
              direct train. Uber does not operate between Lisbon and
              Nazaré.
            </p>
            <p className={BODY_SM}>
              Taxis from LIS will quote €120–150 one-way. Unless a car isn't
              an option, rent one.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>From Porto (OPO)</h3>
            <p className={`${BODY_SM} mb-3`}>
              200 km south. Most visitors fly Lisbon. Porto plus a rental
              car adds two hours to the drive but gives you the scenic
              Atlantic coast via Aveiro and Figueira da Foz, which is a
              reasonable use of a day if you're building a longer trip.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>By car — A8 exit Nazaré</h3>
            <p className={`${BODY_SM} mb-3`}>
              Exit the A8 at Nazaré; follow N242 into the lower town.
              Parking in the lower village is free on the street and in the
              large lot at the south end of Avenida Marginal. The
              clifftop parking at the Forte — for the Praia do Norte
              viewpoint — is tight on swell days. Arrive before 11 a.m.
              if you want a spot.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>Walking the village</h3>
            <p className={`${BODY_SM} mb-3`}>
              Lower Nazaré is end-to-end walkable in 15 minutes. Up to
              Sítio: the 1889 funicular (€2.20 round trip, runs every
              10 minutes from 7 a.m. to midnight), the 175-step{" "}
              <em>Capuchinhos</em> stair, or the winding road. The
              funicular is almost always the right answer unless you
              want the stair views on a clear morning.
            </p>
          </article>
        </div>

        {funicular && (
          <Figure
            image={funicular}
            size="wide"
            tier="B"
            caption="The Funicular da Nazaré — 318 meters of inclined rail, 120 meters of vertical rise in two minutes. Designed by Raoul Mesnier du Ponsard, opened 1889."
            className="mt-12"
          />
        )}
      </Section>

      {/* --- Where to stay --- */}
      <Section id="stay" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Where to Stay"
          title="Praia by default, Sítio if you want quiet, Pederneira if you want rural"
        />

        <div className="grid gap-8 md:grid-cols-3">
          <StayCard
            zone="Praia (lower village)"
            character="Where almost everyone stays. Walk to the fishing port, the Praia da Nazaré, the estendal, and most of the restaurants. Noise at 7 a.m. from fishing returns; quiet by 11 p.m."
            tiers={[
              ["Luxury (€200+)", "Hotel Praia, Hotel Mar Bravo"],
              ["Mid (€80–150)", "Hotel Maré, family-run pensões"],
              ["Budget (€40–80)", "Nazaré Hostel & Guest House, apartment rentals"],
            ]}
          />
          <StayCard
            zone="Sítio (upper town)"
            character="Quieter, older, closer to the Santuário and the Forte. Tree-lined squares. Ten-minute funicular down to the lower town for dinner. Excellent for pilgrimage or big-wave-morning stays."
            tiers={[
              ["Luxury (€180+)", "Miramar Hotel Sítio"],
              ["Mid (€70–130)", "Vila Sítio, small pousadas"],
              ["Budget (€40–70)", "Rooms above the cafés; weekly rentals"],
            ]}
          />
          <StayCard
            zone="Pederneira (inland, 5 km)"
            character="The original pre-maritime village on a small hilltop. Medieval fortress ruins. Rural, affordable, requires a car. Good for travellers who want Portuguese countryside over seafront."
            tiers={[
              ["Luxury (€150+)", "Quintas de turismo rural com piscina"],
              ["Mid (€60–100)", "Casa da Pederneira, holiday rentals"],
              ["Budget (€20–50)", "Camping Inatel Nazaré (year-round)"],
            ]}
          />
        </div>

        <p className={`${BODY_SM} mt-10 max-w-2xl italic text-volcanic-500`}>
          Hotel names are given as anchors, not endorsements. The village is
          small; walking between any two of them on the same tier-level
          takes minutes. The choice that matters is which of the three
          <em> zones</em> you base in, not which particular hotel.
        </p>
      </Section>

      {/* --- What to eat --- */}
      <Section id="eat" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· What to Eat"
          title="Salt cod, dried sardines, and the right etiquette at the estendal"
          kicker="Portugal has, by tradition, a different bacalhau recipe for every day of the year. Nazaré's version — drier, saltier, honest about its 500-year relationship with North Atlantic cod — is one of them. Order it."
        />

        <div className="grid gap-10 md:grid-cols-2">
          <EatCard
            name="Bacalhau à Nazaré"
            range="€12–18"
            body="Salt cod flaked with shredded potato, eggs, olives, and parsley. The Nazaré variant is drier and saltier than the Lisbon or Porto versions — the village processed salt cod from the Newfoundland fleets for five centuries and the recipe reflects the sourcing. Good at Taberna d'Adélia, Rosa dos Ventos, Casa Marques."
          />
          <EatCard
            name="Sardinha seca"
            range="€6–10 for three"
            body="The iconic Nazaré food. Sardines split along the belly (not gutted), dry-salted, and laid on the wooden racks — the estendal — on the village beach. Grilled whole over charcoal, eaten with broa (corn bread) and fingers. The practice is a 2023 UNESCO Intangible Heritage candidate. Buy from the women working the estendal directly; most traditional restaurants also serve."
          />
          <EatCard
            name="Caldeirada de peixe"
            range="€15–25"
            body="Portuguese fish stew. Four to five species per pot: scorpion fish, hake, monkfish, squid, sometimes conger eel. Tomato, onion, white wine, potato, saffron. Best at family restaurants where the same pot has been running 40 years. A Casa Velha and Tasca do Celso (in Praia) are the names worth trying."
          />
          <EatCard
            name="Vinho Verde & Ginjinha"
            range="€3–5 glass"
            body="Vinho Verde is the young, slightly-fizzy white wine of northern Portugal — the right lunchtime accompaniment to grilled fish on the beach. Ginjinha (ginja) is the afternoon drink: sour cherry liqueur, often served in a small chocolate cup you eat after. Ginjinha Sem Rival is the local brand."
          />
        </div>

        <div className="mt-16 border-l-2 border-[color:var(--beach-primary,#2B3E50)] pl-6 max-w-3xl">
          <div className={`${EYEBROW} mb-3`}>· Estendal Etiquette</div>
          <p className={BODY}>
            The women working the sardine-drying racks on the Praia da
            Nazaré are working, not performing. Most are over 60; most are
            in the traditional seven-skirt dress. The practice is in a
            UNESCO Intangible Heritage file. <strong>If you stop to watch:</strong>{" "}
            buy sardines if you eat fish, ask before taking photographs,
            and do not photograph the women's faces without eye contact.
            This is someone's afternoon, not a museum diorama.
          </p>
        </div>
      </Section>

      {/* --- Visitor safety --- */}
      <Section id="safety" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· How to Not Die"
          title="Five things that have killed visitors here"
          kicker="Nazaré is a very safe small Portuguese town by normal measures. Violent crime is rare; the risks are specific and mostly marine. Read this section."
        />

        <div className="space-y-8 max-w-3xl">
          <Hazard
            label="1 · Praia do Norte currents"
            severity="fatal"
            body="**Do not swim at Praia do Norte, even in summer.** The rip currents and the canyon-driven nearshore bathymetry produce rapid underwater current changes that are dangerous even to strong swimmers. The beach is not lifeguarded; warning signs are explicit. People die at this beach every few years, and they are almost always non-surfers. Swim at **Praia da Nazaré** (the village beach, south of the headland) — lifeguarded in summer, gentle slope, small shore break, safe for families."
          />
          <Hazard
            label="2 · The cliff edge at the Forte on big-wave days"
            severity="fatal"
            body="The ramparts at the Forte de São Miguel — the fortress / lighthouse / surf museum at the tip of Sítio — have no continuous railing on the ocean side. On big-wave days the viewpoint fills with hundreds of spectators. Wind gusts are strong. **At least one fatal fall has occurred in the last decade.** Stay well back from the edge; do not climb onto the low stone walls. The view is as good from two meters inside the line."
          />
          <Hazard
            label="3 · Traffic in Praia on big-wave days"
            severity="serious"
            body="The village's streets were laid out for fishing carts. On peak swell days with a WSL event or viral-level conditions, several thousand cars try to fit through Avenida Marginal and up to the Forte. Locals avoid driving on these days and walk or use the funicular. If you arrive in the lower town by car and see crowds, park where you are and walk."
          />
          <Hazard
            label="4 · The jet-ski tow operations"
            severity="serious"
            body="During big-wave sessions, you will see jet-skis visible offshore at Praia do Norte — sometimes two hundred meters out, sometimes closer. **Do not attempt to paddle out** or swim toward them for a closer look. A driver focused on a surfer at speed cannot see a civilian swimmer in time to avoid collision, and the impact zone moves unpredictably."
          />
          <Hazard
            label="5 · Cold-water exposure at all seasons"
            severity="real"
            body="Atlantic water at Nazaré runs **14 °C in February, 19 °C in August**. Even in peak summer a swim is refreshing, not soothing. Visitors from warmer coasts regularly get into trouble with hypothermia on overcast days in May or October. If you're swimming at Praia da Nazaré outside July–August, expect to be cold faster than you expect to be cold."
          />
        </div>

        <ClusterAside>
          The reason Praia do Norte and Praia da Nazaré are functionally
          different oceans — the 95-meter canyon ramp, the focused
          swell, the nearshore bathymetry — is explained on{" "}
          <ClusterLink to="main" />.
        </ClusterAside>
      </Section>

      {/* --- Itineraries --- */}
      <Section id="itineraries" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Itineraries"
          title="Four ways to use two days"
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <Itinerary
            days="Day trip from Lisbon"
            hours="6–8 hours"
            plan="Drive up via A8, arrive by 10 a.m. Morning in Sítio — the Santuário and the Forte / surf museum. Lunch in Praia. Afternoon at the Praia da Nazaré to see the estendal. Leave by 4 p.m. Misses the 4-p.m.-golden-hour at the Praia do Norte viewpoint — which is the thing you came for in winter — so only do this in summer."
          />
          <Itinerary
            days="Two nights (the default)"
            hours="Arrive day 1 afternoon, leave day 3 morning"
            plan="Day 1: lower village, Praia da Nazaré, dinner at Taberna d'Adélia. Day 2: morning funicular to Sítio, Santuário, Forte / surf museum, lunch in Sítio. Afternoon at the Praia do Norte viewpoint. Dinner back in Praia. Day 3: estendal breakfast, walk the coastal path north before leaving."
          />
          <Itinerary
            days="Three nights (winter, swell-forecast)"
            hours="Arrive day 1 with a 72-hour swell window visible"
            plan="Same two days, plus a buffer day for the swell to actually arrive. Watch the forecast from magicseaweed.com / surfline.com. The WSL Tow Challenge is called 72 hours ahead of a swell; if the call happens while you're here, you have the best cliff seat in Europe. Keep day 3 flexible until the morning of."
          />
          <Itinerary
            days="Three nights (non-surf, Silver Coast)"
            hours="Arrive day 1, leave day 4"
            plan="The two-night Nazaré itinerary plus a day exploring the Silver Coast. Alcobaça (12th-century monastery, 15 km inland) in the morning; Óbidos (walled medieval town, 25 km south) in the afternoon; dinner back in Nazaré. Or substitute São Martinho do Porto (shell-shaped bay, 10 km north) for a swim-friendly morning."
          />
        </div>
      </Section>

      <SpokeCrossNav current="travel" />

      <SpokeProvenance
        bundle={bundle}
        note="Logistics and rates current as of April 2026. Restaurant and hotel names are anchors for navigation, not paid placements. Ferry / bus schedules should be re-checked before arrival; Rede Expressos publishes at rede-expressos.pt."
      />
    </LegendaryShell>
  );
}

// ============================================================================
// Local sub-components
// ============================================================================

function StayCard({
  zone,
  character,
  tiers,
}: {
  zone: string;
  character: string;
  tiers: [string, string][];
}) {
  return (
    <article className="rounded-sm border border-[#E7E2D4] bg-white p-6">
      <h3 className={`${H3} mb-3`}>{zone}</h3>
      <p className={`${BODY_SM} mb-5`}>{character}</p>
      <dl className="space-y-3">
        {tiers.map(([tier, examples]) => (
          <div key={tier}>
            <dt className={`${EYEBROW} mb-1`}>{tier}</dt>
            <dd className="text-[13px] text-volcanic-700 leading-relaxed">
              {examples}
            </dd>
          </div>
        ))}
      </dl>
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
      <div className="flex items-baseline gap-3 mb-3">
        <h3 className={H3}>{name}</h3>
        <span className={`${EYEBROW}`}>{range}</span>
      </div>
      <p className={BODY_SM}>{body}</p>
    </article>
  );
}

function Hazard({
  label,
  severity,
  body,
}: {
  label: string;
  severity: "fatal" | "serious" | "real";
  body: string;
}) {
  const tone =
    severity === "fatal"
      ? "border-[#B91C1C] text-[#B91C1C]"
      : severity === "serious"
      ? "border-[#C2410C] text-[#C2410C]"
      : "border-[#475569] text-[#475569]";
  return (
    <article className={`border-l-4 pl-6 ${tone.split(" ")[0]}`}>
      <div className={`text-[11px] font-mono uppercase tracking-[0.3em] mb-2 ${tone.split(" ")[1]}`}>
        {label} · {severity}
      </div>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}

function Itinerary({
  days,
  hours,
  plan,
}: {
  days: string;
  hours: string;
  plan: string;
}) {
  return (
    <article className="rounded-sm border border-[#E2E8F0] bg-white p-7">
      <div className={`${EYEBROW} mb-2`}>{hours}</div>
      <h3 className={`${H3} mb-4`}>{days}</h3>
      <p className={BODY_SM}>{plan}</p>
    </article>
  );
}
