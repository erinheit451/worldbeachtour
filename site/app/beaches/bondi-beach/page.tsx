import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import LegendaryBeach, {
  type LegendaryData,
  type LegendaryMeta,
} from "@/components/showcase/legendary-beach";
import BondiRescue from "@/components/signature/bondi-rescue";
import BondiSharks from "@/components/signature/bondi-sharks";
import BondiIcebergs from "@/components/signature/bondi-icebergs";
import BondiCountry from "@/components/signature/bondi-country";
import BondiPaths from "@/components/signature/bondi-paths";
import BondiBlackSunday from "@/components/signature/bondi-black-sunday";

const DATA_PATH = path.join(process.cwd(), "data", "beaches", "bondi-beach.json");
const META_PATH = path.join(process.cwd(), "content", "beaches", "bondi-beach", "meta.json");
// Showcase content lives outside the pipeline-managed data/ JSON so the
// regeneration pipeline cannot overwrite it. See docs/legendary-beach-playbook.md.
const SHOWCASE_PATH = path.join(
  process.cwd(),
  "content",
  "beaches",
  "bondi-beach",
  "showcase.json"
);

function loadData(): { data: LegendaryData; meta: LegendaryMeta } {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const meta = JSON.parse(fs.readFileSync(META_PATH, "utf-8"));
  if (fs.existsSync(SHOWCASE_PATH)) {
    data.showcase = JSON.parse(fs.readFileSync(SHOWCASE_PATH, "utf-8"));
  }
  return { data, meta };
}

export const metadata: Metadata = {
  title: "Bondi Beach — Where Australia Invented Surf Culture",
  description:
    "The one-kilometer crescent at Sydney's eastern edge. Bondi Rescue's 4,500-a-year rescues, the 1937 shark nets, the Icebergs ocean pool, the Aboriginal rock engravings on the cliff top above the beach — and the Gadigal country under all of it.",
  openGraph: {
    title: "Bondi — Where Australia Invented Surf Culture",
    description:
      "The lifeguards, the shark nets, the Icebergs pool, and the Gadigal country under it all.",
    type: "article",
  },
};

export default function BondiPage() {
  const { data, meta } = loadData();
  return (
    <LegendaryBeach
      data={data}
      meta={meta}
      heroTagline="Australia's identity-image beach — and everything packed into one kilometer of sand."
      quickDecisions={{
        when: {
          prose:
            "December–February for peak Australian summer (and the full crowd). May–September for quiet, whales migrating past offshore, and the Icebergs pool in its element. March–April are the best compromise.",
          linkText: "See the year",
          linkTo: "#calendar",
        },
        where: {
          prose:
            "North Bondi for families and the rock pool. South end (Icebergs + surf) for serious swimmers and the coastal-walk start. Central for the lifeguard flags and the TV-show experience.",
          linkText: "The Zones",
          linkTo: "#postos",
        },
        howLong: {
          prose:
            "A full day at Bondi, plus the 6 km coastal walk to Coogee. Two days lets you add Manly (the ferry, Sydney's other beach) and one neighborhood inland (Surry Hills or Paddington).",
          linkText: "Itineraries",
          linkTo: "#planner",
        },
      }}
      storyPullQuote={{
        text: "One kilometer of sand, 240 years of British history, 20,000+ years of Gadigal country.",
      }}
      signatures={[
        {
          id: "paths",
          label: "Paths",
          group: "culture",
          insertAfter: "story",
          component: <BondiPaths />,
        },
        {
          id: "rescue",
          label: "Bondi Rescue",
          group: "culture",
          insertAfter: "story",
          component: (
            <BondiRescue
              rescueImage={meta.images.section.surf_life_saving_club}
              capImage={meta.images.section.historic_1937}
            />
          ),
        },
        {
          id: "black-sunday",
          label: "Black Sunday 1938",
          group: "culture",
          insertAfter: "history",
          component: (
            <BondiBlackSunday slsImage={meta.images.section.sls_boats_racing} />
          ),
        },
        {
          id: "country",
          label: "Country Before Colony",
          group: "culture",
          insertAfter: "history",
          component: (
            <BondiCountry
              engravingImage={meta.images.section.rock_engraving_example}
              benBucklerImage={meta.images.section.ben_buckler}
            />
          ),
        },
        {
          id: "sharks",
          label: "Shark Country",
          group: "beach",
          insertAfter: "water",
          component: <BondiSharks />,
        },
        {
          id: "icebergs",
          label: "Icebergs & Pools",
          group: "beach",
          insertAfter: "water",
          component: <BondiIcebergs poolImage={meta.images.section.icebergs_pool} />,
        },
      ]}
      timelineImagesByYear={{
        1928: "pavilion",
        1929: "icebergs_pool",
        2003: "sculpture_by_sea",
      }}
      cultureHeader={{
        eyebrow: "· In the Culture",
        title: "Bondi in the Australian imagination",
        kicker:
          "A century of Australian beach culture concentrated at a specific one-kilometer arc. Most of the country's beach mythology was tested here first.",
      }}
      versusCompare={[
        {
          tag: "Bondi",
          tagTone: "ocean",
          headline: "The famous one — urban, crowded, legible globally",
          rows: [
            { label: "Reach", value: "25 min from CBD by bus (Routes 333, 380)" },
            { label: "Surf", value: "Longboard to intermediate shortboard; south end break is best" },
            { label: "Pool", value: "Icebergs (50m, premium) + North Bondi Rock Pool (25m, free)" },
            { label: "Best for", value: "The TV-show experience, coastal walk, Sculpture by the Sea" },
          ],
        },
        {
          tag: "Manly",
          tagTone: "sand",
          headline: "The ferry beach — Sydney's other side of the harbour",
          rows: [
            { label: "Reach", value: "30 min ferry from Circular Quay — one of the great urban ferry rides" },
            { label: "Surf", value: "More consistent waves than Bondi; advanced surfers prefer it" },
            { label: "Character", value: "Village high street (The Corso), quieter, less tourist" },
            { label: "Best for", value: "The ferry itself, pedestrianized main street, Shelly Beach snorkeling" },
          ],
        },
        {
          tag: "Coogee",
          tagTone: "volcanic",
          headline: "The locals' beach — at the south end of the coastal walk",
          rows: [
            { label: "Reach", value: "Walk the Bondi-to-Coogee coastal path (6 km, 1.5–2 hours)" },
            { label: "Surf", value: "Rarely breaks — calm swimming most days" },
            { label: "Pool", value: "McIver's Baths (women-only, 1876) + Giles Baths" },
            { label: "Best for", value: "Ending the coastal walk with a beer at Coogee Pavilion" },
          ],
        },
      ]}
      stayZones={[
        {
          zone: "Beachfront (Campbell Parade)",
          flavor:
            "Directly on the beach. Most expensive. Views, noise, and walk-to-sand convenience.",
          tiers: [
            { tier: "Luxury", examples: "Bondi Icebergs apartments (rare rentals), QT Bondi" },
            { tier: "Mid", examples: "Adina Apartment Hotel Bondi, Swiss-Belhotel Royal Hotel Randwick (10 min)" },
            { tier: "Budget", examples: "Wake Up! Bondi Beach hostel" },
          ],
        },
        {
          zone: "Inland Bondi",
          flavor:
            "A block or two inland on Hall Street or Glenayr Avenue. Cheaper, quieter, short walk to sand.",
          tiers: [
            { tier: "Luxury", examples: "Short-term Airbnb apartments" },
            { tier: "Mid", examples: "Bondi Beach House B&B, Rooftop Travellers Lodge" },
            { tier: "Budget", examples: "Noah's Bondi Beach hostel" },
          ],
        },
        {
          zone: "Bondi Junction (5 min east)",
          flavor:
            "The commercial heart with Westfield mall and the train station. Better hotels, worse vibes, short bus to the sand.",
          tiers: [
            { tier: "Luxury", examples: "Hotel Bondi (heritage)" },
            { tier: "Mid", examples: "Holiday Inn Potts Point, Meriton Suites Bondi Junction" },
            { tier: "Budget", examples: "Various Airbnb apartments" },
          ],
        },
      ]}
      plannerRows={[
        {
          heading: "Getting here",
          items: [
            ["SYD (Sydney Airport)", "11 km south. Taxi A$45–60 direct, 25–45 min with traffic. Train from airport to Bondi Junction then bus is A$18 + A$4, 45–60 min."],
            ["Bus 333", "Direct from Circular Quay (downtown ferry terminal) to Bondi Beach. 25 min. Uses the Opal contactless card. A$5.47 peak."],
            ["Train + bus", "Trains don't run to Bondi itself. Go to Bondi Junction station, then take the 333 or 380 bus five minutes to the beach."],
          ],
        },
        {
          heading: "On the ground",
          items: [
            ["Payments", "Australian dollar. Contactless card everywhere. Tipping is not expected (round up is generous). Cash rarely needed."],
            ["Language", "English. Australian English has its idioms — 'arvo' (afternoon), 'servo' (service station), 'Maccas' (McDonald's)."],
            ["Driving", "Don't. Parking at Bondi is scarce, expensive (A$8/hour), and enforced. Use the bus or walk from Bondi Junction."],
            ["Safety", "Generally very safe. Campbell Parade on Saturday night is loud but not dangerous. Don't leave valuables in rental cars."],
          ],
        },
        {
          heading: "Entry",
          items: [
            ["ETA / eVisa", "Most Western visitors (US, UK, EU, Japan) need an ETA or eVisitor visa — A$20 online, 10-minute application."],
            ["Passport validity", "Australia requires at least 6 months validity beyond planned departure."],
            ["Biosecurity", "Arrival biosecurity is strict — declare all food, seeds, soil, timber. Penalties up to A$6,260 for non-declaration."],
          ],
        },
        {
          heading: "How long do you need",
          items: [
            ["1 day", "Sand time in the morning. Bondi-to-Coogee coastal walk after lunch (6 km). Return by bus. Dinner at North Bondi RSL or Speedos."],
            ["2 days", "Add: Manly ferry day (Circular Quay ferry + The Corso + Shelly Beach snorkel + beer at Manly Wharf Hotel)."],
            ["3–4 days", "Add: Paddington/Surry Hills (Sydney's food neighborhoods) + a Blue Mountains day trip (train to Katoomba)."],
          ],
        },
      ]}
      safetyCopy={{
        whatLocalsDo: `Bondi is **very safe by global urban-beach standards**. Sydney is a safe city; Bondi is a safe suburb within it. Violent crime against tourists is rare. The risks are ordinary: don't leave valuables in parked cars, don't wander drunk down empty streets at 3 a.m., and know that Campbell Parade on Saturday night is loud rather than dangerous.

**Box jellyfish and Irukandji are not a Sydney concern** — they live further north, in tropical Queensland. Sydney has blue-bottles (Pacific Man O' War) in summer; stings hurt for 30 minutes and are almost never dangerous. Lifeguards carry vinegar.`,
        inTheWater: `**The rip currents at Bondi are the actual risk.** Three persistent rips run between the northern and southern flags most days — "Backpackers' Express" at the northern end (self-explanatory), a middle rip, and the southern rip near the Icebergs headland. The rips are what pull 4,500 people a year out of their depth. **Always swim between the red-and-yellow flags.** The lifeguards place them where there is no active rip.

**If caught in a rip**: don't fight it. Swim parallel to shore (not against the current) until you're out of the channel — usually 20-50 meters sideways. Then back to the beach at an angle. Float if you're tired; a rip will deposit you in deeper calm water, not drag you to Tasmania.

**Sharks**: the nets and drumlines keep the fatal-attack probability very low. Drones patrol every 30 minutes. The swim-between-the-flags rule covers shark avoidance too — lifeguards close water on any confirmed sighting.

**Cold-water swimmers**: in winter, the water drops to 17°C. Hypothermia is real. If you're doing the Icebergs pool or open-water swim in July, wear a 3 mm wetsuit and don't swim alone.`,
      }}
      waterCopy={{
        prose: `**First, the waves.** Bondi sits on an exposed ocean-facing bay; the reef structure is flat sandstone, which produces clean but unremarkable waves. The **southern corner** (near Icebergs) is where the best break happens — a peaky right-hander that gets shoulder-high to overhead on a south swell. North Bondi has gentler, beginner-friendly waves when it's small.

**Second, temperature and tides.** Water runs **22°C in January, 17°C in July**. That is the widest seasonal swing of any Tier 1 beach on this site — a 5°C drop is real. Tides are **1.2 m spring, 0.74 m neap, mixed semidiurnal** — enough range to matter for rock pools and reef access. Low tide exposes the rock shelf at Ben Buckler with sea-glass and tidal-pool life.

**Third, migrations.** **Humpback whales** pass Bondi offshore from May to November on their 10,000 km round-trip from Antarctic feeding grounds to Queensland breeding grounds. Peak sightings from Ben Buckler in July and October. Whale-watching boats leave from Circular Quay; you can often see them from the Bondi-to-Bronte coastal walk without a boat. **Little penguins** — the world's smallest — are occasionally spotted offshore, though their main Sydney colony is at Manly.

**Fourth, the reef and the water quality.** Bondi's water is monitored weekly by NSW Beachwatch; results are published at **beachwatch.nsw.gov.au**. The beach gets a "good" rating most weeks. After heavy rain, stormwater brings runoff; Beachwatch posts swim advisories. Check the app before a morning swim after a Sydney downpour.

**Cyclones** do not reach Sydney. Bondi is far enough south that no tropical cyclone has made landfall this far in recorded history; the 8 historical cyclones in our database are all extratropical remnants that passed without direct impact. The ocean here is consistently **southern**, not tropical.`,
        atAGlance: [
          { label: "Water temp summer", value: "22°C (Jan)" },
          { label: "Water temp winter", value: "17°C (Jul)" },
          { label: "Tide range spring", value: "1.23 m" },
          { label: "Tide type", value: "Mixed semidiurnal" },
          { label: "Surf season", value: "Autumn / winter S swells" },
          { label: "Whales offshore", value: "May–Nov" },
          { label: "Water quality", value: "beachwatch.nsw.gov.au" },
        ],
      }}
      viewBackImages={[
        { role: "historic_1937", caption: "Bondi Beach in 1937 — the same arc, 90 years earlier. Royal Australian Historical Society." },
        { role: "icebergs_view", caption: "Icebergs from the Bondi-to-Bronte walk." },
        { role: "sculpture_by_sea", caption: "Sculpture by the Sea installed along the coastal path each October." },
        { role: "coastal_walk", caption: "The Bondi-to-Bronte clifftop walk, looking south toward Tamarama." },
      ]}
      honestContextTitle="Gadigal country"
      honestContextEyebrow="· Honest Context"
      honestContextNavLabel="Gadigal Country"
      sourcesVoice="Written to pass the Saturday-morning Speedos test. Aboriginal history in particular is areas where additional Indigenous-authored input and corrections are welcomed."
    />
  );
}
