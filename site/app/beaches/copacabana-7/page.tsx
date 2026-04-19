import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import LegendaryBeach, {
  type LegendaryData,
  type LegendaryMeta,
} from "@/components/showcase/legendary-beach";
import BurleMarxDivider from "@/components/showcase/burle-marx-divider";
import CopaCalcadao from "@/components/signature/copa-calcadao";
import CopaAterro from "@/components/signature/copa-aterro";
import CopaMusic from "@/components/signature/copa-music";

const DATA_PATH = path.join(process.cwd(), "data", "beaches", "copacabana-7.json");
const META_PATH = path.join(
  process.cwd(),
  "content",
  "beaches",
  "copacabana-7",
  "meta.json"
);

function loadData(): { data: LegendaryData; meta: LegendaryMeta } {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const meta = JSON.parse(fs.readFileSync(META_PATH, "utf-8"));
  return { data, meta };
}

export const metadata: Metadata = {
  title: "Copacabana — The Beach the World Imagines",
  description:
    "The internet's best page on Copacabana Beach. Four kilometers of arc, the Burle Marx wave, six postos, two million people in white on New Year's Eve, and the history that made it Rio's beach.",
  openGraph: {
    title: "Copacabana — The Beach the World Imagines",
    description: "Four kilometers of arc, six postos, and a century of Brazilian glamour.",
    type: "article",
  },
};

export default function CopacabanaPage() {
  const { data, meta } = loadData();
  return (
    <>
      <LegendaryBeach
        data={data}
        meta={meta}
        heroTagline="The beach the world imagines when it imagines a beach."
        quickDecisions={{
          when: {
            prose:
              "April–May for the warm water with few tourists. Avoid January–February unless you want the full Carnaval crowd and the heat.",
            linkText: "See the year",
            linkTo: "#calendar",
          },
          where: {
            prose:
              "Posto 2 if you want the default tourist beach day. Fort end (Posto 5–6) for quieter sand and walking access to Ipanema.",
            linkText: "The Postos",
            linkTo: "#postos",
          },
          howLong: {
            prose:
              "One day sees it. Three days does it right. A week lets you step beyond to Prainha, Niterói, and Santa Teresa.",
            linkText: "Itineraries",
            linkTo: "#planner",
          },
        }}
        storyPullQuote={{ text: "The Portuguese wave is a Copacabana wave now." }}
        signatures={[
          {
            id: "calcadao",
            label: "Calçadão",
            group: "culture",
            insertAfter: "story",
            component: <CopaCalcadao mosaicImage={meta.images.section.mosaic} />,
          },
          {
            id: "aterro",
            label: "1970 Aterro",
            group: "culture",
            insertAfter: "story",
            component: <CopaAterro preImage={meta.images.section.pre_expansion} />,
          },
          {
            id: "music",
            label: "Music",
            group: "culture",
            insertAfter: "eat",
            component: <CopaMusic />,
          },
        ]}
        timelineImagesByYear={{
          1906: "pre_expansion",
          1914: "forte_1930",
          1923: "palace",
          1933: "flying_down_poster",
          1942: "zweig_portrait",
          1970: "mosaic",
          1992: "nye",
          2016: "olympic_2016",
        }}
        versusCompare={[
          {
            tag: "Copacabana",
            tagTone: "ocean",
            headline: "Old fame, mixed ages, mass occasions",
            rows: [
              { label: "Anthem", value: '"Copacabana" (João de Barro / Alberto Ribeiro, 1946)' },
              { label: "Demographic", value: "Older (27.5% over 60), mixed class, heavy tourist" },
              { label: "Bossa nova role", value: "Beco das Garrafas — the cradle" },
              { label: "Postos", value: "1 (Leme) through 6 (Fort)" },
              { label: "Best for", value: "The event, the crowd, the mass moment" },
            ],
          },
          {
            tag: "Ipanema",
            tagTone: "sand",
            headline: "The intellectual beach, now",
            rows: [
              { label: "Anthem", value: '"Garota de Ipanema" (Jobim / Vinícius, 1962)' },
              { label: "Demographic", value: "Middle-upper, younger, artistic heritage" },
              { label: "Bossa nova role", value: 'The lyrics, the fame — "Garota" was written at Veloso bar' },
              { label: "Postos", value: "7 through 9. Posto 9 is the intellectual/hippie posto" },
              { label: "LGBTQ+ stretch", value: "Farme de Amoedo — the documented hub" },
            ],
          },
          {
            tag: "Leblon",
            tagTone: "volcanic",
            headline: "The wealthy corner",
            rows: [
              { label: "Character", value: "Rio's most expensive square meter" },
              { label: "Demographic", value: "Wealthy families, dog-walkers, restaurants" },
              { label: "Postos", value: "10 through 12" },
              { label: "Separator", value: "Jardim de Alah canal" },
              { label: "Best for", value: "Eating well, walking with kids, avoiding chaos" },
            ],
          },
        ]}
        stayZones={[
          {
            zone: "Leme",
            flavor:
              "Quieter. Closer to the Leme headland and the Morro do Leme forest reserve. Fewer tourists, slightly cheaper.",
            tiers: [
              { tier: "Luxury", examples: "Windsor Atlantica, Miramar Hotel" },
              { tier: "Mid", examples: "Astoria Palace, Arena Leme" },
              { tier: "Budget", examples: "Royalty Copacabana, various pousadas" },
            ],
          },
          {
            zone: "Central (Posto 2–4)",
            flavor: "Heart of everything. Noisy, busy, central. Most of the beach's energy is here.",
            tiers: [
              { tier: "Luxury", examples: "Copacabana Palace (Belmond), Fairmont Rio" },
              { tier: "Mid", examples: "Rio Othon Palace, Atlantis Copacabana" },
              { tier: "Budget", examples: "Atlantis Copacabana Hostel, Books Hostel Copa" },
            ],
          },
          {
            zone: "Fort end (Posto 5–6)",
            flavor: "Slightly calmer than central, with surfer and fisherman culture. Quick walk to Ipanema.",
            tiers: [
              { tier: "Luxury", examples: "Sofitel Rio de Janeiro Ipanema, Arena Copacabana" },
              { tier: "Mid", examples: "Savoy Othon, Copacabana Mar" },
              { tier: "Budget", examples: "Che Lagarto Copa, Rio Hostel" },
            ],
          },
        ]}
        plannerRows={[
          {
            heading: "Getting here",
            items: [
              ["GIG (Galeão)", "23 km north, the international gateway. Uber R$80–120, 40–70 min with traffic. Some airline shuttles direct to Copa hotels."],
              ["SDU (Santos Dumont)", "6 km, regional + some international. Uber R$30–50, 15–25 min. The closest airport to the beach by a factor of four."],
              ["Metrô Line 1", "Runs directly under Copacabana. Stations: Cardeal Arcoverde (Leme end), Siqueira Campos (central), Cantagalo (Posto 5–6 end). Clean, safe, R$7.50 per ride. Best way in from downtown."],
            ],
          },
          {
            heading: "On the ground",
            items: [
              ["Payments", "Pix + contactless card are universal. Kiosks, taxis, vendors — all accept one or both. Cash is increasingly rare; you can do a full trip without it."],
              ["Language", "More English spoken on Copa than anywhere else in Rio, but still sparse. A Duolingo Portuguese week goes a long way. Carioca Portuguese has an audible chchch on 'S' that's a tell-tale."],
              ["Tipping", "10% service is typically added to restaurant bills. You don't tip on top. Taxis round up. Kiosks and beach vendors don't expect tips."],
              ["Power", "Brazilian Type N plugs (unique two-round-pin standard). Most US and EU plugs don't fit. Bring a universal adapter."],
              ["Tap water", "Not drinkable. Bottled or filtered. Hotels provide filtered water in-room; most restaurants serve filtered."],
            ],
          },
          {
            heading: "Visa (current as of April 2026)",
            items: [
              ["US / Australia / Canada / Japan", "E-visa required (reinstated April 2025 after multiple deferrals). Apply online at vfsglobal-brazil-evisa.com. Processing typically 5–10 business days."],
              ["EU / UK", "No visa for stays under 90 days."],
              ["Check your passport", "Brazil requires 6+ months validity beyond your arrival date."],
            ],
          },
          {
            heading: "How long do you need",
            items: [
              ["1 day", "Posto 2 morning → Calçadão walk to Ipanema (45 min) → Arpoador rock at sunset. You will have seen it, and you will want to come back."],
              ["3 days", "Add the Forte de Copacabana café, Pão de Açúcar cable car at sunset, Cristo Redentor at opening time (8 a.m. to beat the crowds)."],
              ["A week", "Add a community-led favela tour, MAC Niterói across the bay, Prainha and Grumari on the western wilder beaches, Santa Teresa for art-deco bohemia."],
            ],
          },
        ]}
        safetyCopy={{
          whatLocalsDo: `Beachfront **Avenida Atlântica** — well-lit, patrolled, crowded — is safe into the night. The inland streets (Avenida Nossa Senhora de Copacabana, the Barata Ribeiro blocks, the Bairro Peixoto interior) are substantially different after 10 p.m. Most arrastões (flash-robbery events on the sand) recorded over the past decade have been daytime on the beach itself.\n\nThe practical version of "don't flash valuables": no phone out while walking in the sand, no jewelry on the beach, no watch that announces itself. Locals use beach bags with a dirty t-shirt on top. Cars parked on Av. Atlântica are routinely broken into. If you want to walk Copa to Ipanema through Arpoador at night, go with company and stay on the beachfront side.`,
          inTheWater: `Red flags on the sand mean don't swim here today. Yellow means caution. Green means go. INEA's water-quality sampling can close the beach after heavy rain.\n\nRip currents are the real Atlantic risk — stronger near Posto 6 where the sandbar structure is sharpest. If you're caught, don't fight it: swim parallel to the shore until you're out of the channel, then back in at an angle. Lifeguards at each posto are experienced and bilingual basics.`,
        }}
        waterCopy={{
          prose: `**First, upwelling.** When the northeasterly wind pushes warm surface water offshore, cold nutrient-rich water from the continental shelf rises to take its place — sometimes dropping the surface temperature five or six degrees in a single day. Most common in late summer. When it hits, the Magnificent Frigatebirds that ride the thermals overhead (76 documented observations on this beach alone) are joined by more seabirds working the cold-water fish. In austral winter — July through October — humpback whales migrate past offshore; the clearest view is from the Forte. Olive ridley and green sea turtles are documented in Guanabara Bay and occasionally appear on Copa. Common Marmosets come down from the Morro do Leme forest reserve at the edges of the beach.\n\n**Second, surf.** Austral winter — June through August — brings cold-front swell from the Southern Ocean that lights up the Posto 6 break. Summer is usually flat. The water is shore-break-steep, with offshore sandbars forming rip channels that deserve respect: the red flags on the sand mean don't swim here today, and the lifeguards enforce them. Water temperature runs around 22°C in July, 26°C in February, occasionally 18°C when the upwelling hits. The tides are microtidal — spring 0.94m, neap 0.25m — so the beach geometry barely changes from one day to the next.\n\n**Third, water quality.** INEA, Rio de Janeiro state's environmental agency, samples beach water weekly and publishes bacterial counts at inea.rj.gov.br. A flag goes up when counts breach safe-swim thresholds — almost always after heavy rain, when Rio's combined sewer system discharges into storm drains that empty on the beach. Most days the water is safer than a Carioca will swear it is. After a big afternoon thunderstorm, wait 24 to 48 hours.\n\nIf you only come in summer, you will never see the ocean Copa is actually capable of.`,
          atAGlance: [
            { label: "Water temp", value: "22–26°C" },
            { label: "Upwelling cold drops to", value: "18°C" },
            { label: "Surf season", value: "Jun–Aug" },
            { label: "Tide range", value: "0.25 – 0.94 m" },
            { label: "Whale migration", value: "Jul–Oct" },
            { label: "Water quality", value: "inea.rj.gov.br" },
          ],
        }}
        viewBackImages={[
          { role: "panorama", caption: "Panorama from Morro do Leme looking south down the entire arc." },
          { role: "pre_expansion", caption: "The beach as it was, c.1916–1926 — a narrower Copacabana pressed up against a two-lane Av. Atlântica. Jorge Kfuri / Instituto Moreira Salles." },
          { role: "sugarloaf_night", caption: "From Sugarloaf Mountain at night. Copacabana on the left, Cristo Redentor on the right ridge." },
        ]}
        honestContextTitle="The favela above"
        honestContextEyebrow="· Honest Context"
        honestContextNavLabel="Favela Above"
        sourcesVoice="Written to pass the Carioca nod test. Corrections welcome."
      />
      <BurleMarxDivider />
    </>
  );
}
