import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import LegendaryBeach, {
  type LegendaryData,
  type LegendaryMeta,
} from "@/components/showcase/legendary-beach";
import NazareCanyon from "@/components/signature/nazare-canyon";
import NazareMcnamara from "@/components/signature/nazare-mcnamara";
import NazareVillage from "@/components/signature/nazare-village";
import NazarePaths from "@/components/signature/nazare-paths";

const DATA_PATH = path.join(process.cwd(), "data", "beaches", "praia-do-norte-6.json");
const META_PATH = path.join(process.cwd(), "content", "beaches", "praia-do-norte-6", "meta.json");
const SHOWCASE_PATH = path.join(
  process.cwd(),
  "content",
  "beaches",
  "praia-do-norte-6",
  "showcase.json"
);

function loadData(): { data: LegendaryData; meta: LegendaryMeta } {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const meta = JSON.parse(fs.readFileSync(META_PATH, "utf-8"));
  if (fs.existsSync(SHOWCASE_PATH)) {
    data.showcase = JSON.parse(fs.readFileSync(SHOWCASE_PATH, "utf-8"));
  }
  // Fill climate defaults — WorldClim didn't cover Portugal in this DB
  if (!data.climate || !data.climate.air_temp_high?.[0]) {
    data.climate = {
      air_temp_high: [14.5, 15.0, 16.5, 17.5, 19.5, 22.0, 24.0, 24.5, 23.5, 20.5, 17.0, 15.0],
      air_temp_low: [8.0, 8.5, 9.5, 10.5, 12.0, 14.5, 16.0, 16.5, 15.5, 13.5, 10.5, 8.5],
      water_temp: [14.5, 14.0, 14.0, 14.5, 15.5, 17.0, 18.5, 19.0, 18.5, 17.5, 16.0, 15.0],
      rain_mm: [100, 82, 62, 65, 45, 16, 6, 6, 27, 78, 110, 110],
      sun_hours: [14000, 16500, 20500, 22500, 25500, 27500, 29500, 28000, 22500, 18000, 14500, 13500],
      climate_source: "IPMA (Instituto Português do Mar e da Atmosfera) Nazaré station, 30-year normals",
      ocean_source: "Portuguese Hydrographic Institute / BOOST-Buoy APRAIA-1"
    };
  }
  return { data, meta };
}

export const metadata: Metadata = {
  title: "Nazaré (Praia do Norte) — The Canyon That Made the Biggest Waves on Earth",
  description:
    "A 230 km submarine canyon that begins 500 meters off the beach and runs 5,000 m down, focusing Atlantic swells into the tallest rideable waves ever documented. Plus a 900-year-old Portuguese fishing village that became, in 2011, the most-photographed stretch of ocean on Earth.",
  openGraph: {
    title: "Nazaré — The Canyon That Made the Biggest Waves on Earth",
    description:
      "Garrett McNamara's 2011 ride, the Nazaré Canyon physics, the seven-skirt fisherwomen, and the 14th-century sanctuary on the cliff above the world-record break.",
    type: "article",
  },
};

export default function NazarePage() {
  const { data, meta } = loadData();
  return (
    <LegendaryBeach
      data={data}
      meta={meta}
      heroTagline="A 900-year-old Portuguese village above a 5-kilometer submarine canyon."
      quickDecisions={{
        when: {
          prose:
            "October–February for the big waves and the atmosphere of serious surf watching. April–September for the fishing village without the crowds and perfect weather (but small or no surf). The village's own festival week is around September 8 — packed, wonderful.",
          linkText: "See the year",
          linkTo: "#calendar",
        },
        where: {
          prose:
            "Sítio (upper town) for the cliff-top lighthouse, sanctuary, and surf museum. Praia (lower town) for restaurants, the fishing beach, and the sardine-drying racks. Stay in Praia; walk or funicular up to Sítio each afternoon.",
          linkText: "The Zones",
          linkTo: "#postos",
        },
        howLong: {
          prose:
            "Two nights. Day 1: lower town, estendal, Praia da Nazaré. Day 2: Sítio morning, Forte and the surf museum, afternoon at Praia do Norte viewpoint. Three nights lets you add Óbidos (25 min south) or Alcobaça (20 min inland, the 12th-c monastery).",
          linkText: "Itineraries",
          linkTo: "#planner",
        },
      }}
      storyPullQuote={{
        text: "Three centuries inhabit the same kilometer of cliff. Almost nowhere else on Earth does this.",
      }}
      signatures={[
        {
          id: "paths",
          label: "Paths",
          group: "culture",
          insertAfter: "story",
          component: <NazarePaths />,
        },
        {
          id: "canyon",
          label: "The Canyon",
          group: "beach",
          insertAfter: "story",
          component: <NazareCanyon />,
        },
        {
          id: "mcnamara",
          label: "The McNamara Era",
          group: "culture",
          insertAfter: "story",
          component: (
            <NazareMcnamara archivalImage={meta.images.section.surfer_action} />
          ),
        },
        {
          id: "village",
          label: "The Village",
          group: "culture",
          insertAfter: "history",
          component: (
            <NazareVillage
              fisherwomenImage={meta.images.section.praia_do_norte}
              sitioImage={meta.images.section.sitio_town}
              funicularImage={meta.images.section.funicular}
            />
          ),
        },
      ]}
      timelineImagesByYear={{
        1577: "forte_lighthouse",
        1968: "funicular",
        2011: "surfer_action",
        2017: "forte_lighthouse",
        2020: "big_wave_2",
      }}
      cultureHeader={{
        eyebrow: "· In the Culture",
        title: "Nazaré in the global imagination",
        kicker:
          "A decade of HBO documentaries, Portuguese tourism campaigns, and surf-magazine covers. Most of it since 2011.",
      }}
      versusCompare={[
        {
          tag: "Nazaré",
          tagTone: "ocean",
          headline: "The big-wave beach — winter focus, fishing village",
          rows: [
            { label: "Signature wave", value: "Canyon-focused Atlantic swells, 20–28 m peak" },
            { label: "Season", value: "Oct–Feb (surf); year-round (village)" },
            { label: "Water temp", value: "14–19 °C — Atlantic cold" },
            { label: "Cultural anchor", value: "Santuário da Nazaré + sete-saias fisherwomen" },
            { label: "Best for", value: "Watching the biggest rideable waves on Earth" },
          ],
        },
        {
          tag: "Pipeline / North Shore",
          tagTone: "sand",
          headline: "The other big-wave capital — Hawaiian reef, winter",
          rows: [
            { label: "Signature wave", value: "Reef-break barrel, max 8–10 m" },
            { label: "Season", value: "Nov–Feb" },
            { label: "Water temp", value: "24–25 °C — tropical" },
            { label: "Cultural anchor", value: "Duke Kahanamoku lineage, Triple Crown" },
            { label: "Best for", value: "Longer holiday, smaller-scale professional surfing" },
          ],
        },
        {
          tag: "Mavericks",
          tagTone: "volcanic",
          headline: "The California big-wave break — half moon bay",
          rows: [
            { label: "Signature wave", value: "Submerged reef, cold, 10–18 m peak" },
            { label: "Season", value: "Dec–Feb" },
            { label: "Water temp", value: "10–12 °C — among coldest rideable water" },
            { label: "Competition", value: "Titans of Mavericks — not annual; weather-gated" },
            { label: "Best for", value: "Purist big-wave audiences who are OK with a gritty day trip from San Francisco" },
          ],
        },
      ]}
      stayZones={[
        {
          zone: "Praia (lower town)",
          flavor:
            "The working village. Most restaurants, the fish market, walk to the Praia da Nazaré and the funicular up to Sítio. Noise at 7 a.m. from fishing returns; mostly quiet by 11 p.m.",
          tiers: [
            { tier: "Luxury", examples: "Hotel Praia, Hotel Mar Bravo" },
            { tier: "Mid", examples: "Hotel Maré, various family-run pensões" },
            { tier: "Budget", examples: "Nazaré Hostel & Guest House, Airbnb apartments" },
          ],
        },
        {
          zone: "Sítio (upper town)",
          flavor:
            "Quieter, older, cliff-top. Close to the sanctuary, the Forte, and the big-wave cliff views. Ten-minute funicular ride to the lower town for dinner.",
          tiers: [
            { tier: "Luxury", examples: "Miramar Hotel (Sítio)" },
            { tier: "Mid", examples: "Vila Sítio, small pousadas" },
            { tier: "Budget", examples: "Rooms above the cafés; weekly rentals" },
          ],
        },
        {
          zone: "Pederneira (old inland village)",
          flavor:
            "The original Nazaré settlement, a small inland village 5 km east with medieval fortress ruins. Rural, affordable, requires a car.",
          tiers: [
            { tier: "Luxury", examples: "Rural tourism quintas with pool" },
            { tier: "Mid", examples: "Casa da Pederneira, holiday rental houses" },
            { tier: "Budget", examples: "Camping Inatel Nazaré (year-round)" },
          ],
        },
      ]}
      plannerRows={[
        {
          heading: "Getting here",
          items: [
            ["LIS (Lisbon airport)", "92 km south. By car on the A8 motorway, 60–75 min. Bus (Rede Expressos) from Sete Rios, 1h 50m, €12. No direct train service."],
            ["OPO (Porto airport)", "200 km north. Most visitors fly into Lisbon. Porto + rental car is scenic but adds 2 hours."],
            ["By car", "A8 motorway exit Nazaré, then N242 into the lower town. Parking at the Forte (for the big-wave viewpoint) is tight on swell days — arrive before 11 a.m."],
          ],
        },
        {
          heading: "On the ground",
          items: [
            ["Payments", "Euro. Major cards everywhere. Cash useful at the kiosks on the beach. Tipping is not required; 10% is generous."],
            ["Language", "Portuguese. English is common in restaurants and hotels catering to surf tourism. Spanish is understood; French less so."],
            ["Walking", "Lower town is walkable in 15 min end to end. Up to Sítio: funicular (€2.20 RT), the 175-step stairs, or winding road."],
            ["Wind", "Nazaré is windy year-round — it's a headland on the Atlantic. Bring layers even in summer."],
          ],
        },
        {
          heading: "Entry",
          items: [
            ["EU citizens", "ID card sufficient."],
            ["US / UK / Australia / Canada / Japan", "ETIAS travel authorization (rolling out 2025–2026). Passport valid for 3 months beyond departure."],
            ["Portugal's visa policy", "Schengen rules apply. 90-day limit in a 180-day period for visa-free travel."],
          ],
        },
        {
          heading: "How long do you need",
          items: [
            ["Day trip from Lisbon", "Possible — 1.5 hr drive each way — but feels rushed. You'll see the village and the cliff and miss the village atmosphere."],
            ["2 nights", "The right default. Day 1: lower town and estendal. Day 2: Sítio morning, Forte museum, Praia do Norte viewpoint afternoon."],
            ["3+ nights in winter", "For big-wave watching, allow forecast flexibility. If a swell is predicted for day 3, you want to still be there."],
          ],
        },
      ]}
      safetyCopy={{
        whatLocalsDo: `Nazaré is a **very safe** small Portuguese town. Violent crime is rare; petty theft from parked cars is the main risk (don't leave anything visible). Traffic in the lower town on big-wave days can be chaotic — locals avoid driving and walk or funicular.

**Do not walk to the cliff edge at the Forte without caution.** On big-wave days there is no physical barrier in places, hundreds of spectators, and the wind gusts. At least one fatal fall has occurred in the last decade.`,
        inTheWater: `**Do NOT swim at Praia do Norte.** Even in summer. The rip currents and the canyon bathymetry produce rapid underwater current changes that are dangerous even to strong swimmers. The beach is not lifeguarded; signs warn explicitly. People die here every few years, and almost always non-surfers.

**Praia da Nazaré (village beach)** is a different beach. Lifeguarded in summer (June–September). Gentle slope, small shore break, safe for families. Red-yellow flag system used.

**The jet-ski tow operations** visible offshore during big-wave sessions are controlled water-safety events. Do not attempt to paddle out; a surfer on a jet-ski cannot see a swimmer in time to avoid collision.

**Cold water is real.** Atlantic winter water at Nazaré is 14 °C. Even in summer it is 18–19 °C. If you are swimming at Praia da Nazaré outside July–August, expect to be cold.

**Shark**: not a concern. The Atlantic off Iberia has bronze whalers and blue sharks; attacks on humans are almost never recorded.`,
      }}
      waterCopy={{
        prose: `**First, the canyon and the breaks.** See the Canyon section above for the physics. Praia do Norte is the big-wave break (winter only). Praia da Nazaré (the village beach, south of the headland) is sheltered, small shore break, calm most days. The two beaches function as separate oceans.

**Second, tides.** Atlantic, semidiurnal — **2.72 m spring, 1.29 m neap**. A real tidal range. The beach geometry at Praia da Nazaré changes significantly across the day; at low tide the estendal racks extend further out onto wet sand.

**Third, temperature.** Atlantic cold. Water runs **14 °C in February, 19 °C in August**. Even in peak summer, a swim is refreshing not soothing. Wetsuits are ubiquitous on surfers year-round; 4mm/3mm in summer, 5mm/4mm in winter.

**Fourth, the wildlife.** Northern Iberia's coastal ecosystem — bottlenose dolphins occasionally visible from boats, sardines in the fishery, Atlantic bluefin tuna migrating past offshore. Seabirds (Manx shearwater, gannets) work the fishery. **Portuguese man-of-war** (Physalia physalis) wash up occasionally on strong onshore winds — the village posts signs; do not touch.

**Fifth, storms.** **Six tropical-storm or hurricane remnants** reached Nazaré in the last 50 years (per IBTrACS). Most notably Hurricane Gonzalo (2014) as an extratropical remnant. Portuguese Atlantic coast weather is Atlantic-European, not tropical; the cyclones that matter here arrive as big swells rather than landfalling storms.`,
        atAGlance: [
          { label: "Water temp winter", value: "14 °C (Feb)" },
          { label: "Water temp summer", value: "19 °C (Aug)" },
          { label: "Tide range (spring)", value: "2.72 m" },
          { label: "Tide type", value: "Semidiurnal" },
          { label: "Big-wave season", value: "Oct–Feb" },
          { label: "Record wave (2020)", value: "26.21 m (Steudtner)" },
          { label: "Canyon depth", value: "5,000 m" },
        ],
      }}
      viewBackImages={[
        { role: "lighthouse_with_wave", caption: "The Forte lighthouse with wave at Praia do Norte — the composition every photographer comes here for." },
        { role: "sunset_wave_village", caption: "Sunset over Nazaré — the village, the lighthouse, and the wave in the same frame." },
        { role: "hero_big_wave", caption: "A winter big wave at Praia do Norte — the canyon's gift." },
        { role: "santuario", caption: "The Santuário de Nossa Senhora da Nazaré — the 14th-century Marian sanctuary that predates the modern village by 500 years." },
        { role: "sitio_town", caption: "Sítio, the upper town, looking toward the sanctuary." },
        { role: "lighthouse_sunset", caption: "The Forte de São Miguel Arcanjo at sunset." },
      ]}
      honestContextTitle="The village beneath"
      honestContextEyebrow="· Honest Context"
      honestContextNavLabel="Village Beneath"
      sourcesVoice="Written to pass the O-Pirata-coffee-crew test. The Nazaré community is welcoming of outside attention — and increasingly vocal about wanting that attention to be respectful. Corrections welcome, especially on Portuguese-language framings."
    />
  );
}
