import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import LegendaryBeach, {
  type LegendaryData,
  type LegendaryMeta,
} from "@/components/showcase/legendary-beach";
import WaikikiDuke from "@/components/signature/waikiki-duke";
import WaikikiMonarchy from "@/components/signature/waikiki-monarchy";
import WaikikiBreaks from "@/components/signature/waikiki-breaks";
import WaikikiPlacenames from "@/components/signature/waikiki-placenames";

const DATA_PATH = path.join(process.cwd(), "data", "beaches", "waikiki-beach-1.json");
const META_PATH = path.join(
  process.cwd(),
  "content",
  "beaches",
  "waikiki-beach-1",
  "meta.json"
);

function loadData(): { data: LegendaryData; meta: LegendaryMeta } {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const meta = JSON.parse(fs.readFileSync(META_PATH, "utf-8"));
  return { data, meta };
}

export const metadata: Metadata = {
  title: "Waikīkī — The Beach That Taught the World How to Beach",
  description:
    "Seven named surf breaks. A deposed queen two miles inland. Duke Kahanamoku's ninety-year-old leis. The Helumoa coconut grove under the Royal Hawaiian. The Natatorium ruin at the eastern edge. The definitive page on Hawaiʻi's most famous beach — written so a local nods.",
  openGraph: {
    title: "Waikīkī — The Beach That Taught the World How to Beach",
    description:
      "Queens, Canoes, Publics, Threes — the seven named breaks. Duke Kahanamoku's statue with fresh leis every morning. The 1893 overthrow. The Kingdom beneath the tourist strip.",
    type: "article",
  },
};

export default function WaikikiPage() {
  const { data, meta } = loadData();
  return (
    <LegendaryBeach
      data={data}
      meta={meta}
      heroTagline="The beach that taught the world how to go to the beach."
      quickDecisions={{
        when: {
          prose:
            "April–May and September–October: warm water, fewer visitors, mildest rain. Peak season is December–February (mainland winter escape); shoulders are the pro move.",
          linkText: "See the year",
          linkTo: "#calendar",
        },
        where: {
          prose:
            "Kūhiō Beach for swimming families, Duke Kahanamoku Beach (the Hilton end) for calmest water and Friday fireworks, Queen's Surf for the quieter east end and gay-friendly stretch.",
          linkText: "The Zones",
          linkTo: "#postos",
        },
        howLong: {
          prose:
            "Two days for Waikīkī itself. Four days to do Oʻahu right — add North Shore, Hanauma Bay, and ʻIolani Palace. A week lets you neighbor-island.",
          linkText: "Itineraries",
          linkTo: "#planner",
        },
      }}
      storyPullQuote={{
        text: "Waikīkī is not a resort — it is a royal beach that survived becoming one.",
      }}
      signatures={[
        {
          id: "duke",
          label: "Duke & Beach Boys",
          group: "culture",
          insertAfter: "story",
          component: (
            <WaikikiDuke
              statueImage={meta.images.section.duke_statue}
              archivalImage={meta.images.section.duke_1920s}
            />
          ),
        },
        {
          id: "breaks",
          label: "Named Breaks",
          group: "beach",
          insertAfter: "postos",
          component: <WaikikiBreaks />,
        },
        {
          id: "placenames",
          label: "Reading the Land",
          group: "culture",
          insertAfter: "day",
          component: <WaikikiPlacenames />,
        },
        {
          id: "monarchy",
          label: "Monarchy & Memory",
          group: "culture",
          insertAfter: "history",
          component: (
            <WaikikiMonarchy
              liliuokalaniImage={meta.images.section.liliuokalani}
              palaceImage={meta.images.section.iolani_palace}
              pearlHarborImage={meta.images.section.pearl_harbor_1941}
            />
          ),
        },
      ]}
      timelineImagesByYear={{
        1893: "liliuokalani",
        1901: "moana_hotel",
        1912: "duke_1920s",
        1927: "royal_hawaiian",
        1941: "pearl_harbor_1941",
        2002: "duke_statue",
      }}
      cultureHeader={{
        eyebrow: "· In the Culture",
        title: "Waikīkī in the American imagination",
        kicker:
          "A century of films, songs, novels, and TV shows about this two-mile strip. A few of them are what the mainland thinks Hawaiʻi is.",
      }}
      versusCompare={[
        {
          tag: "Waikīkī",
          tagTone: "ocean",
          headline: "The built beach — urban, layered, central",
          rows: [
            { label: "Anthem", value: "Somewhere Over the Rainbow (IZ, 1993); Tiny Bubbles (Don Ho, 1966)" },
            { label: "Defining image", value: "Duke Kahanamoku statue + Diamond Head silhouette" },
            { label: "Surf", value: "Queens, Canoes, Publics — longboard-friendly, crowded, classic" },
            { label: "Hotels on sand", value: "30,000+ rooms in a 2 km strip" },
            { label: "Best for", value: "First-time Hawaiʻi, urban amenities, shopping + beach" },
          ],
        },
        {
          tag: "North Shore",
          tagTone: "sand",
          headline: "The wild coast — 40 min drive north",
          rows: [
            { label: "Defining image", value: "Pipeline breaking in December" },
            { label: "Surf", value: "Pipeline, Sunset, Waimea — world-class, winter only, not for most swimmers" },
            { label: "Summer", value: "Calm beaches — Waimea Bay swimming, Shark's Cove snorkeling" },
            { label: "Food", value: "Matsumoto's shave ice, shrimp trucks (Giovanni's, Romy's)" },
            { label: "Best for", value: "Surf-watching Dec–Feb, day trip any time of year" },
          ],
        },
        {
          tag: "Lanikai / Kailua",
          tagTone: "volcanic",
          headline: "The suburban-gem beach — windward side",
          rows: [
            { label: "Defining image", value: "Two small islets (the Mokes) off a turquoise bay" },
            { label: "Access", value: "Residential parking — short walks through neighborhoods" },
            { label: "Water", value: "Calmest swimming on Oʻahu; kayak to the Mokes" },
            { label: "Character", value: "No hotels, no vendors, just sand and water" },
            { label: "Best for", value: "Half-day escape from Waikīkī, snorkeling, kayaking" },
          ],
        },
      ]}
      stayZones={[
        {
          zone: "Kāhala / eastern",
          flavor:
            "Residential Oʻahu east of Diamond Head. The Kāhala Resort is the one hotel — quieter, dolphin lagoon, 15-min drive to Waikīkī. Favored by returning visitors who want proximity without the strip.",
          tiers: [
            { tier: "Luxury", examples: "The Kahala Hotel & Resort" },
            { tier: "Mid", examples: "Airbnb and condos in Kāhala" },
            { tier: "Budget", examples: "Not well-served; stay on the strip instead" },
          ],
        },
        {
          zone: "Central Waikīkī (Royal / Sheraton area)",
          flavor:
            "The heart of the strip. Most restaurants, most shopping, most crowds. Every hotel here is within a 5-minute walk of the sand. If you want Waikīkī's full experience, stay here.",
          tiers: [
            { tier: "Luxury", examples: "The Royal Hawaiian (Marriott Luxury Collection), Moana Surfrider (Marriott), Halekulani" },
            { tier: "Mid", examples: "Sheraton Waikīkī, Outrigger Waikīkī Beach Resort, Hyatt Centric" },
            { tier: "Budget", examples: "Waikiki Beachside Hostel, OHANA Waikiki East by Outrigger" },
          ],
        },
        {
          zone: "Western (Hilton Village / Ala Wai)",
          flavor:
            "The ʻEwa end of the strip. Hilton Hawaiian Village is a self-contained resort with five restaurants, its own beach, and the Friday fireworks. Quieter than central. Short walk to Ala Moana shopping.",
          tiers: [
            { tier: "Luxury", examples: "Hilton Hawaiian Village, Prince Waikiki" },
            { tier: "Mid", examples: "Ala Moana Hotel by Mantra, Modern Honolulu" },
            { tier: "Budget", examples: "Ilima Hotel, Kaʻimana Beach Hotel (eastern alternative)" },
          ],
        },
      ]}
      plannerRows={[
        {
          heading: "Getting here",
          items: [
            [
              "HNL (Honolulu International)",
              "11 km west of Waikīkī. Daniel K. Inouye International. The hub for all Hawaiian-island flying. Taxi/Uber $30–45 to Waikīkī, 25–40 min with traffic. SpeediShuttle and Roberts shared-ride $15/person.",
            ],
            [
              "TheBus",
              "Oʻahu's excellent public bus system. Routes 19, 20, and 42 run from HNL to Waikīkī for $3. Not fast with luggage; fine without. HOLO card contactless.",
            ],
            [
              "Skyline (metro rail)",
              "Oʻahu's first metro line opened June 2023. Phase 1 runs from East Kapolei to Aloha Stadium. Does not yet serve Waikīkī; the extension to Ala Moana is projected for 2031.",
            ],
          ],
        },
        {
          heading: "On the ground",
          items: [
            [
              "Payments",
              "U.S. dollar. All major cards everywhere. Cash rarely needed. Tipping expected at U.S. levels (15–20% on restaurants, $1–2 per drink at bars, $2–5/day for housekeeping).",
            ],
            [
              "Language",
              "English throughout. Japanese widely spoken in retail and hospitality. Hawaiian is Hawaiʻi's other official language; signage is bilingual on state property. Learning aloha (hello/love), mahalo (thanks), ʻae (yes) goes a long way.",
            ],
            [
              "Driving",
              "You don't need a car to stay in Waikīkī. Rent one if you want to see Oʻahu (North Shore, Kailua, Hanauma Bay). Parking in Waikīkī is $30–50/day at hotels; budget accordingly.",
            ],
            [
              "Reef-safe sunscreen",
              "Required by Hawaiʻi state law (SB 2571, 2018) — oxybenzone and octinoxate are banned in sunscreen. Mineral sunscreens (zinc oxide, titanium dioxide) are legal and widely sold.",
            ],
          ],
        },
        {
          heading: "Entry",
          items: [
            [
              "U.S. citizens",
              "State ID sufficient (Hawaiʻi is a U.S. state). REAL ID required for domestic flights after May 7, 2025.",
            ],
            [
              "International",
              "Visa or ESTA required as for any U.S. entry. No additional Hawaiʻi-specific requirements since COVID-era rules ended in March 2022.",
            ],
            [
              "Agricultural inspection",
              "All outbound flights screen luggage for banned plant material. Don't try to take a pineapple home unless you bought it commercially packaged.",
            ],
          ],
        },
        {
          heading: "How long do you need",
          items: [
            [
              "2 days",
              "Day 1: Waikīkī itself — swim, Kūhiō Beach, ʻIolani Palace, sunset at Hula Mound. Day 2: Diamond Head hike at dawn, Pearl Harbor midday, Kapiʻolani Park and Waikīkī Aquarium in the afternoon.",
            ],
            [
              "4 days",
              "Add: North Shore day (Waimea Bay, Haleʻiwa, Matsumoto's), Hanauma Bay or Lanikai day, a Hawaiian cultural day at the Bishop Museum.",
            ],
            [
              "A week",
              "Add a neighbor-island hop — Maui for Haleakalā and Kā'anapali, Kauaʻi for Nā Pali Coast, or Hawaiʻi (Big Island) for Volcanoes National Park.",
            ],
          ],
        },
      ]}
      safetyCopy={{
        whatLocalsDo: `Waikīkī is **among the safer urban beaches in the world by absolute measures**. Violent crime is rare. The petty crime that exists is concentrated: cars parked on Kalākaua are targets for smash-and-grab (don't leave anything visible), and ATM-skimming rings appear periodically. Most of Waikīkī is patrolled and well-lit 24 hours.

The less-visible risk is **houselessness-related interaction**. Native Hawaiian homelessness is the highest per-capita in the U.S., and state parks (including beach parks) are where some unsheltered people spend the day. The vast majority are not a threat. Locals are courteous and give space; visitors sometimes misread the scene. Kapiʻolani Park after midnight has the most concentration; downtown Chinatown has more than Waikīkī itself.`,
        inTheWater: `The **Hawaiʻi Beach and Ocean Safety website** (oceansafety.hawaii.gov) publishes daily beach conditions. Waikīkī's swimming zones (Kūhiō, Duke Kahanamoku Beach) are lifeguarded 9 a.m. to 5:30 p.m. year-round. The reef is close to shore — snorkeling here is better than expected, but the water clarity depends on whether the trades have been running.

**Box jellyfish swarms** arrive on Oʻahu's south shore 8–10 days after each full moon, typically present in the water 10–14 days. Signs go up at Waikīkī when they're present. Vinegar (the locally-stocked treatment) is at every lifeguard stand.

**Rip currents** exist but are moderate compared to North Shore. The bigger risk for visitors is **overconfidence** — the water looks calm, and it mostly is, but the reef shelf creates unexpected drop-offs. Shuffle your feet entering the water; step on a dozing **honu** (green sea turtle, federally protected) and you're both having a bad day.

**Hawaiian monk seals** (endangered, ~1,400 remaining worldwide) haul out on Waikīkī beaches occasionally — most often at Kaimana Beach (east end). If you see one, stay **50 feet back**; state-federal protocol is enforced. NOAA Marine Mammal Response volunteers rope off the area.`,
      }}
      waterCopy={{
        prose: `**First, the reef.** Waikīkī sits inside a fringing reef that extends 100–400 m offshore. The reef is what makes the swimming calm, the surf longboard-friendly rather than barreling, and the coral ecosystem — while stressed by sunscreen, sediment, and warming — genuinely visible at snorkeling depth a short swim from the sand. **Hawaiʻi's 2018 ban on oxybenzone-containing sunscreen** (the first in the world) was passed specifically to protect this reef system.

**Second, the surf — seven named breaks.** See the Named Breaks section above. Summer (south swells, June–September) brings the cleanest conditions. The beach boys still run canoe-surfing rides at Canoes break from Royal Hawaiian Beach — the same service, roughly the same price, since the 1920s.

**Third, temperature and tides.** Water runs 24°C in January, 27°C in August. The tidal range is tiny — 0.48 m spring, 0.21 m neap, mixed semidiurnal — so the beach geometry barely changes across a day. What does change is the sand: **Waikīkī erodes at about 0.5 ft per year on average**, and the state has been nourishing the beach with barged-in or dredged sand since the 1920s. The beach you are standing on is a maintained object.

**Fourth, the marine life.** Green sea turtles (honu) are common and federally protected — give them space. Hawaiian monk seals occasionally haul out on the eastern beaches; volunteers rope them off. Humpback whales migrate past Oʻahu November through May; clearest from offshore charters. **Seven tropical cyclones in the past 50 years** (per IBTrACS), four of them Category 4 — Hawaiian islands are not immune to Central Pacific hurricanes. Hurricane ʻIniki (1992) spared Oʻahu but hit Kauaʻi hard enough to remind the state that the Central Pacific is not a benign basin.`,
        atAGlance: [
          { label: "Water temp", value: "24–27°C" },
          { label: "Tide range (spring)", value: "0.48 m" },
          { label: "Tide type", value: "Mixed semidiurnal" },
          { label: "Surf season", value: "Summer (south swells)" },
          { label: "Named breaks", value: "7 (Pops to Kaisers)" },
          { label: "Cyclones 50 yr", value: "7 (incl. 4× Cat 4)" },
          { label: "Beach retreat rate", value: "~0.5 ft/yr" },
          { label: "Jellyfish", value: "8–10 days after full moon" },
        ],
      }}
      viewBackImages={[
        {
          role: "panorama_arc",
          caption: "Waikīkī at night — ten-second exposure from the Royal Hawaiian lawn.",
        },
        {
          role: "aerial_iss_hawaii",
          caption:
            "Honolulu from 400 km up — photographed by astronaut Scott Kelly aboard the ISS.",
        },
        {
          role: "helumoa_historic_painting",
          caption:
            "Charles Furneaux's 19th-century painting of Diamond Head and the Helumoa coconut grove — where the Royal Hawaiian Hotel now stands.",
        },
        {
          role: "natatorium",
          caption:
            "The Waikīkī War Memorial Natatorium at sunrise — built 1927, closed 1979, still standing derelict at the eastern edge of the beach. Duke Kahanamoku set swimming records here.",
        },
        {
          role: "canoe_surfing_painting",
          caption:
            "D. Howard Hitchcock's painting of canoe surfing at Waikīkī. The beach boys were doing this before tourists knew the word 'surf.'",
        },
      ]}
      honestContextTitle="The kingdom beneath"
      honestContextEyebrow="· Honest Context"
      honestContextNavLabel="Kingdom Beneath"
      sourcesVoice="Written to pass the kumu hula test. Hawaiian-language diacritics and cultural framings may be refined with input from Hawaiian readers — corrections welcome."
    />
  );
}
