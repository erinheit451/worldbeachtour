import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import LegendaryBeach, {
  type LegendaryData,
  type LegendaryMeta,
} from "@/components/showcase/legendary-beach";
import TeahupooBathymetry from "@/components/signature/teahupoo-bathymetry";
import TeahupooTowerFight from "@/components/signature/teahupoo-tower-fight";

const DATA_PATH = path.join(process.cwd(), "data", "beaches", "teahupoo.json");
const META_PATH = path.join(process.cwd(), "content", "beaches", "teahupoo", "meta.json");
const SHOWCASE_PATH = path.join(
  process.cwd(),
  "content",
  "beaches",
  "teahupoo",
  "showcase.json"
);

function loadData(): { data: LegendaryData; meta: LegendaryMeta } {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const meta = JSON.parse(fs.readFileSync(META_PATH, "utf-8"));
  if (fs.existsSync(SHOWCASE_PATH)) {
    data.showcase = JSON.parse(fs.readFileSync(SHOWCASE_PATH, "utf-8"));
  }
  // Climate fallback — French Polynesia 30-year normals (Météo-France Tahiti station)
  if (!data.climate || !data.climate.air_temp_high?.[0]) {
    data.climate = {
      air_temp_high: [30.5, 30.6, 30.4, 30.0, 29.0, 28.0, 27.5, 27.6, 28.1, 28.8, 29.5, 30.1],
      air_temp_low: [23.5, 23.7, 23.5, 23.0, 22.0, 21.0, 20.3, 20.3, 20.7, 21.5, 22.4, 23.1],
      water_temp: [29.0, 29.2, 29.0, 28.5, 27.7, 27.0, 26.4, 26.2, 26.4, 27.0, 27.8, 28.5],
      rain_mm: [325, 245, 195, 140, 105, 80, 55, 50, 60, 90, 165, 280],
      sun_hours: [21000, 21000, 22500, 22000, 22500, 22000, 22500, 23500, 24500, 25000, 23000, 21500],
      climate_source: "Météo-France Tahiti / Faaʻa station, 30-year normals",
      ocean_source: "Service Hydrographique et Océanographique de la Marine (SHOM); NOAA Pacific Reanalysis"
    };
  }
  return { data, meta };
}

export const metadata: Metadata = {
  title: "Teahupoʻo — The Wall of Skulls, the Olympic Wave, the Village at the End of the Road",
  description:
    "Teahupoʻo is a fishing village of 1,455 people on the Taiarapu peninsula of Tahiti and the most concentrated wave anyone has ridden. The seafloor goes from a thousand feet of open Pacific to coral 51 cm under the lip impact zone. Plus the 2024 Olympics, the judges' tower fight, and the Polynesian context surf media usually skips.",
  openGraph: {
    title: "Teahupoʻo — The Wall of Skulls",
    description:
      "Wave physics, the Tahitian context, the 2024 Olympics judges' tower fight, and the village that has been negotiating with the world's surf media since 1985.",
    type: "article",
  },
};

export default function TeahupooPage() {
  const { data, meta } = loadData();
  return (
    <LegendaryBeach
      data={data}
      meta={meta}
      heroTagline="A Tahitian fishing village at the end of a one-lane road, and the most concentrated wave anyone has ridden."
      quickDecisions={{
        when: {
          prose:
            "May–September for the Southern Hemisphere swell window — the Tahiti Pro is in May, the Olympics ran late July to early August. April and October are shoulder months with smaller, more variable swells. November–April is the wet season; the wave runs but is far less consistent. If you come for the wave, plan for May or August.",
          linkText: "See the year",
          linkTo: "#calendar",
        },
        where: {
          prose:
            "Stay in Teahupoʻo village or in nearby Vairao (the commune seat, 12 km away — more services). The wave breaks ~800 m offshore at Passe Havae; you cannot see it from shore without binoculars. You go to it by boat. Most pensions are on the lagoon side of the road; book a taxi-boat captain for channel access.",
          linkText: "The Zones",
          linkTo: "#zones",
        },
        howLong: {
          prose:
            "Three nights minimum if you've come for the wave — the Tahitian swell pattern requires forecast flexibility, and a single morning of channel viewing is what most visitors get. Five nights gives you margin for one big swell day plus village/Fenua ʻAihere exploration. A day trip from Papeete is technically possible (90-minute drive each way) but doesn't make sense for the wave.",
          linkText: "Itineraries",
          linkTo: "#planner",
        },
      }}
      storyPullQuote={{
        text: "The wave is the show. The village is the home. The two have been negotiating, in public, since 1985.",
      }}
      signatures={[
        {
          id: "bathymetry",
          label: "The Bathymetry",
          group: "beach",
          insertAfter: "story",
          component: <TeahupooBathymetry />,
        },
        {
          id: "tower-fight",
          label: "The Tower Fight",
          group: "culture",
          insertAfter: "history",
          component: <TeahupooTowerFight />,
        },
      ]}
      timelineImagesByYear={{
        1769: "tahitian_canoes_martin",
        1985: "tahiti_iti_coast",
        2000: "hero_laird",
        2024: "vahine_fierro",
      }}
      cultureHeader={{
        eyebrow: "· In the Culture",
        title: "Teahupoʻo in the global imagination",
        kicker:
          "Decades of magazine covers, a Hollywood film cycle, a 200,000-signature petition, and an Olympic Games. The wave's cultural footprint is now larger than the village's population by four orders of magnitude.",
      }}
      versusCompare={[
        {
          tag: "Teahupoʻo",
          tagTone: "ocean",
          headline: "The most concentrated wave — reef pass, Tahiti, Polynesian village",
          rows: [
            { label: "Signature wave", value: "Below-sea-level cylinder over 51 cm of coral" },
            { label: "Season", value: "Apr–Oct (Southern Hemisphere swell)" },
            { label: "Water temp", value: "26–29 °C — tropical year-round" },
            { label: "Cultural anchor", value: "Tahitian heʻe nalu lineage + 2024 Olympics" },
            { label: "Best for", value: "Watching the heaviest sub-25-foot wave on Earth from a taxi-boat" },
          ],
        },
        {
          tag: "Pipeline / North Shore",
          tagTone: "sand",
          headline: "Hawaii's reef-break canon — barrels, Triple Crown, longer history",
          rows: [
            { label: "Signature wave", value: "Reef-break barrel, max 8–10 m" },
            { label: "Season", value: "Nov–Feb (Northern Hemisphere)" },
            { label: "Water temp", value: "24–25 °C — tropical" },
            { label: "Cultural anchor", value: "Duke Kahanamoku lineage, Triple Crown" },
            { label: "Best for", value: "Longer holiday, smaller-scale professional surfing" },
          ],
        },
        {
          tag: "Nazaré",
          tagTone: "volcanic",
          headline: "The biggest waves on earth — Portugal, canyon physics, cold water",
          rows: [
            { label: "Signature wave", value: "Canyon-focused Atlantic swell, 20–28 m peak" },
            { label: "Season", value: "Oct–Feb (Northern winter)" },
            { label: "Water temp", value: "14–19 °C — Atlantic cold" },
            { label: "Cultural anchor", value: "Portuguese fishing village + sete-saias women" },
            { label: "Best for", value: "Watching the tallest rideable waves; village charm" },
          ],
        },
      ]}
      stayZones={[
        {
          zone: "Teahupoʻo village",
          flavor:
            "On the road right at PK 0. Half a dozen family-run pensions, walking distance to the marina and Snack Mahanai. Quietest accommodations in the area; closest to the channel taxi-boats. Limited English in some pensions — French gets you through.",
          tiers: [
            { tier: "Mid", examples: "Pension Bonjouir (lagoon side, 12 rooms, breakfast incl.)" },
            { tier: "Mid", examples: "Vanira Lodge (boutique, garden setting)" },
            { tier: "Budget", examples: "Various small family pensions; Airbnb on the road" },
          ],
        },
        {
          zone: "Vairao (commune seat)",
          flavor:
            "Twelve kilometers up the road, inland from the village. Larger Tahitian town with the post office, pharmacy, supermarket, and the small Tahiti Iti airport. More accommodation options. 15-minute drive to Teahupoʻo's marina.",
          tiers: [
            { tier: "Mid", examples: "Vahaiarii guesthouse, family pensions on the lagoon" },
            { tier: "Budget", examples: "Local pensions and short-term rentals" },
          ],
        },
        {
          zone: "Papeete + day-trip",
          flavor:
            "If you want hotel infrastructure, restaurant variety, or a base for exploring multiple parts of Tahiti, Papeete is 90 min away on the north coast of Tahiti Nui. Day-trip works for casual channel viewing; doesn't work if you're tracking a swell forecast.",
          tiers: [
            { tier: "Luxury", examples: "InterContinental Tahiti Resort, Hilton Tahiti, Le Tahiti by Pearl Resorts" },
            { tier: "Mid", examples: "Tahiti Pearl Beach Resort, Manava Suite Resort" },
            { tier: "Budget", examples: "Mahana Lodge Hostel, various central guesthouses" },
          ],
        },
      ]}
      plannerRows={[
        {
          heading: "Getting here",
          items: [
            ["PPT (Faaʻa Intl Airport, Papeete)", "70 km from Teahupoʻo. Direct flights from LAX, SFO, AKL, NRT, CDG (via French Bee). The only international entry point for Tahiti."],
            ["By car", "Rental car at PPT, then ~90 min drive south on the south-coast road through Taravao to Teahupoʻo. The road is paved, single-lane each way for most of the route, and ends at the PK 0 sign in the village."],
            ["No public transit", "Le Truck buses serve Papeete and a few suburbs but do not run reliably to Tahiti Iti. Taxi from Papeete to Teahupoʻo runs ~12,000 XPF (~$110 USD) one-way."],
          ],
        },
        {
          heading: "On the ground",
          items: [
            ["Payments", "CFP franc (XPF). Major cards work in Papeete and at larger pensions; cash strongly preferred for taxi-boats, the snack, and family-run accommodations. ATM in Vairao; nearest in Papeete otherwise."],
            ["Language", "French is the dominant language; Tahitian (Reo Mā'ohi) is co-official and widely spoken in the village. English is common in surf-tourism contexts but not assumed elsewhere. Basic French goes a long way."],
            ["Channel boats", "Booking a taxi-boat for channel viewing should be done a day or two ahead during contest windows; otherwise same-day at the marina is fine. Rates ~5,000–10,000 XPF (~$45–90 USD) for a 2-4 hour trip."],
            ["Mobile signal", "Vini coverage in the village; weak past PK 0 into the Fenua ʻAihere. International roaming works on most carriers but is expensive."],
          ],
        },
        {
          heading: "Entry",
          items: [
            ["French citizens", "ID card; no visa."],
            ["EU citizens", "Schengen / EU passport rules apply; 90-day visa-free."],
            ["US / UK / Australia / Canada / Japan", "ETIAS / visa-free for tourism up to 90 days. Passport valid 6 months beyond departure."],
            ["French Polynesia specifics", "French Polynesia is a French overseas collectivity; Schengen rules apply but the territory issues its own customs forms. Quarantine on agricultural products is strict."],
          ],
        },
        {
          heading: "How long do you need",
          items: [
            ["Day trip from Papeete", "Possible but pointless for the wave — by the time you arrive the morning swell window has passed."],
            ["3 nights", "Minimum if the wave is the goal. Budget two of the three days for swell flexibility."],
            ["5 nights", "Comfortable. Two big-wave-window days, one Fenua ʻAihere day, two village/recovery days."],
            ["Tahiti Pro week (May)", "Book months ahead. Pensions sell out a year in advance for the contest window."],
          ],
        },
      ]}
      safetyCopy={{
        whatLocalsDo: `Teahupoʻo is a **safe rural village**. Violent crime is essentially absent; petty theft from rental cars left unattended at the marina happens occasionally — don't leave anything visible. The road from Papeete is in good condition but is single-lane and winds; drive defensively, especially at night.

**Tropical disease risk is low** but not zero. Dengue and chikungunya occur intermittently in French Polynesia; standard mosquito precautions (DEET-based repellent in the evening, long sleeves at dusk). No malaria. **Reef cuts get infected fast** in tropical water — antibiotics in your travel kit are a reasonable precaution if you plan to be in the water.

**The Olympic tower** is the most-photographed civic landmark in the village now, but it is not a tourist attraction. It sits on the reef alongside the wave's takeoff zone and is restricted-access during contest periods.`,
        inTheWater: `**Do NOT swim or snorkel near Passe Havae**, even on a flat day. The reef shelf is shallow, the coral edges are sharp, and the rip currents on the inside reef are extreme. Reef cuts here are deep and the nearest serious medical care is in Vairao (15 min) or Papeete (90 min). The wave is a watch-from-a-boat wave for everyone except expert big-wave surfers.

**The lagoon inside the reef** is calm, warm, and snorkelable in places — most pensions can direct you to the safe sections. Visibility is excellent; coral and reef-fish populations are healthy. This is the swimmer's option here.

**Sharks**: blacktip and whitetip reef sharks are present in the lagoon and channel; both are non-aggressive and routinely encountered without incident. Tiger sharks are present in the deeper water beyond the reef but are not a threat to channel observers or lagoon swimmers. **No confirmed shark attacks in the modern Teahupoʻo record.**

**The single confirmed surfing fatality** at the wave is Brice Taerea (27 April 2000) — duck-dove a 12-ft set, broken cervical vertebrae from impact with the reef. Twenty-five years; one death. The wave is dangerous in the way only an elite few will ever experience.

**Boat safety**: taxi-boat operators are licensed and the channel itself is calm. Wear the life vest if offered; it is not optional during contest-window restrictions.`,
      }}
      waterCopy={{
        prose: `**First, the wave.** See the Bathymetry section above for the physics. Teahupoʻo breaks at Passe Havae, ~800 m offshore from the village, over a near-vertical reef shelf with a 51 cm-deep lip impact zone on the inside. It is the most concentrated rideable wave on Earth.

**Second, the lagoon.** Inside the barrier reef, the Teahupoʻo lagoon is calm, shallow, warm, and rich. Coral is healthy in most sections (the construction-period damage is at Passe Havae specifically, not throughout the lagoon). Reef-fish populations are intact. Most pensions can direct visitors to safe snorkeling spots within the lagoon.

**Third, temperature.** Year-round tropical. Water runs **26 °C in August (the coolest month) to 29 °C in February-March**. Even in the depth of the Southern winter, the water is warmer than most California summers. Board shorts and rash guards are the year-round standard; wetsuits are unusual.

**Fourth, tides.** Diurnal range under a meter. Tahiti's tides are minor by global standards; the wave is not strongly tide-dependent.

**Fifth, the wildlife.** South Pacific coral-triangle ecosystem — roughly 200 reef-fish species in the Teahupoʻo lagoon alone. Humpback whales pass offshore from August to October on their southward migration; humpback-watching boat trips are available from Vairao and Papeete. Bottlenose and spinner dolphins are routinely sighted. Sea turtles (green, hawksbill) are present in the lagoon. **Coral colonies in the construction footprint** at Passe Havae: 1,003 catalogued by the MEGA Lab in 2024.

**Sixth, storms.** French Polynesia is south of the main South Pacific cyclone track but does occasionally get hit. Cyclone Oli (February 2010) caused significant infrastructure damage on Tahiti Iti. Cyclone Veena (1983) and Cyclone Pat (2010) are also in living memory. Cyclone risk is highest November-April.`,
        atAGlance: [
          { label: "Water temp coolest", value: "26 °C (Aug)" },
          { label: "Water temp warmest", value: "29 °C (Feb)" },
          { label: "Tide range", value: "<1 m diurnal" },
          { label: "Big-wave season", value: "Apr–Oct" },
          { label: "Reef depth at lip impact", value: "51 cm" },
          { label: "Coral species in tower footprint", value: "20" },
          { label: "Confirmed surf fatalities", value: "1 (Taerea, 2000)" },
        ],
      }}
      viewBackImages={[
        { role: "wave_aerial_2", caption: "The Teahupoʻo wave from above — the swell rears as it hits the reef shelf. Olivier Dugornay / Ifremer." },
        { role: "wave_aerial_3", caption: "Looking down the line at the heaviest wave in surfing." },
        { role: "wave_channel", caption: "The break, viewed from the channel — the canonical Teahupoʻo angle." },
        { role: "pk_marker", caption: "PK 0 — literally where the road ends on Tahiti Iti." },
        { role: "lagoon_mountains", caption: "The lagoon and the Tahiti Iti ridge above the village." },
        { role: "tahiti_from_orbit", caption: "Tahiti from orbit — Tahiti Nui (round) and Tahiti Iti (the smaller southeast lobe), captured days before the 2024 Olympics. Copernicus Sentinel." },
        { role: "vahine_fierro", caption: "Vahine Fierro at Teahupoʻo, January 2024 — months before her Tahiti Pro win." },
        { role: "surf_riding_1858", caption: "\"Surf-riding\" — the earliest published illustration of Native Hawaiian heʻe nalu, 1858. Tahiti is the elder cousin of this tradition." },
        { role: "tahitian_canoes_martin", caption: "Tahitian sailing canoes, painted by British naval officer Henry Byam Martin in the 1840s — Polynesian seamanship contemporaneous with the wave-riding tradition Cook's crew first witnessed." },
      ]}
      honestContextTitle="The village beneath the brand"
      honestContextEyebrow="· Honest Context"
      honestContextNavLabel="Village Beneath"
      sourcesVoice="Written to pass the village test — the people who actually live here at the end of the road. The Teahupoʻo community has been increasingly vocal about wanting outside attention to be respectful, accurate, and accountable. Corrections welcome, especially on Tahitian-language framings, the post-Games reef-damage assessment as it appears, and the local voices we have flagged as still missing from the record."
    />
  );
}
