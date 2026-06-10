/**
 * Malibu → Humaliwo (honest-reckoning expansion spoke).
 *
 * SEVERE primary register with REVERENT undertones. The Chumash village
 * before "Malibu," CA-LAN-264 under the parking lot, the Rindge land
 * grant that erased it.
 *
 * Care: the Chumash are present-tense. Santa Ynez Band is federally
 * recognized. Wishtoyo Chumash Foundation exists and is where readers
 * should go to hear the story in Chumash voices. This page points.
 */

import type { LegendaryPageBundle } from "../types";
import LegendaryShell from "../shell";
import Figure from "../primitives/figure";
import {
  BODY,
  BODY_DARK,
  BODY_SM,
  COOL,
  CREAM,
  DARK,
  DISPLAY_FF,
  EYEBROW,
  H2_DARK,
  H3,
  H3_DARK,
  PAPER,
  Section,
  SectionHeader,
  SpokeHero,
  SpokeProvenance,
  pickImage,
} from "../nazare/shared";
import { ClusterAside, ClusterLink, ClusterRail, SpokeCrossNav } from "./shared";

export default function MalibuHumaliwoPage({ bundle }: { bundle: LegendaryPageBundle }) {
  const { composition, meta } = bundle;
  const hero = pickImage(meta, "coastline_aerial") ?? meta.images.hero;
  const tomol = pickImage(meta, "chumash_tomol");
  const lagoon = pickImage(meta, "lagoon");
  const adamson = pickImage(meta, "adamson_house");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="humaliwo" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Humaliwo"
        title="Before Malibu, a village named for the sound of the wave"
        kicker="The Chumash village at the mouth of Malibu Creek, continuously occupied for at least two thousand years. CA-LAN-264. The Rindge land grant that erased it. The name 'Malibu' is a Chumash word with its consonants filed down."
        image={hero}
      />

      {/* Opener */}
      <Section id="opener" className={PAPER}>
        <div className={`${EYEBROW} mb-4`}>· The parking lot</div>
        <p className={`${BODY} mb-6`}>
          The parking lot at First Point is asphalt over a village. You pay twelve to fifteen dollars at the kiosk, you pull into a stall, you wax your board on the trunk of your car, and you walk across the sand to surf the most filmed wave in the history of surfing. The asphalt you just parked on, and the sand you just walked across, sits on top of the unmarked location of a Chumash village that was occupied continuously for a period scholars estimate at a minimum of two thousand years, and quite possibly substantially longer.
        </p>
        <p className={`${BODY} mb-6`}>
          The village is called <strong>Humaliwo</strong>. The word is Ventureño Chumash. The Spanish heard it in the eighteenth century, wrote it into mission ledgers with a handful of different spellings, and eventually smoothed it into the word Americans now print on baseball caps and real estate listings: <em>Malibu</em>. Malibu is not a Spanish word. Malibu is not an English word. <strong>Malibu is a Chumash word with its consonants filed down.</strong>
        </p>
        <p className={`${BODY} mb-6`}>
          Every surfer who has ever ridden First Point since Bob Simmons, Joe Quigg, and Matt Kivlin began shaping boards for this specific wave in 1947 has done so on top of a name and a place they almost certainly were never taught. Bruce Brown filmed over it. Kathy Kohner sat on towels over it. Miki Dora dropped his trunks over it. The Surfrider Foundation was incorporated a mile from it. The wave that became a global shorthand for California sits at the foot of a village most of the people who love the wave have never heard named.
        </p>
        <p className={`${BODY} italic`}>
          This page is the attempt to hear it named.
        </p>
      </Section>

      {/* The Chumash */}
      <Section id="chumash" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Humaliwo and the Ventureño Chumash"
          title="Coastal people, island people, tomol people — present tense"
        />

        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              The <strong>Chumash</strong> are a coastal Southern California people. Their homelands stretch from roughly the Malibu coast north to the San Luis Obispo area and out across the Santa Barbara Channel to the northern Channel Islands — San Miguel, Santa Rosa, Santa Cruz, and Anacapa. Their territory is the full arc of a particular ecosystem: kelp forest, rocky point, estuary mouth, oak savanna, island chain. They have lived inside it for a long time. Archaeological work on the Channel Islands has returned dates on human occupation in the range of thirteen thousand years. On the mainland coast at Humaliwo, continuous occupation is documented in the two-thousand-year range and strongly suggested beyond it.
            </p>
            <p className={BODY}>
              The language family has historically been classified by linguists as <strong>Chumashan</strong>, often grouped with the broader Hokan proposal, though the Hokan classification remains contested. Within Chumashan, the language of the Malibu area at the time of Spanish contact was <strong>Ventureño</strong> — the southernmost of the recognized Chumash dialects, spoken through the Ventura and Malibu coastal zone and taken to the San Fernando and San Buenaventura missions when the people who spoke it were taken. Ventureño went silent as a community language in the twentieth century. <em>It is not silent now.</em> A revitalization effort led by Chumash descendants and supported by tribal organizations has brought Ventureño words and phrases back into ceremonial and educational use.
            </p>
            <p className={BODY}>
              Population estimates at the moment of Spanish contact in 1769 place the Chumash at roughly fifteen to twenty thousand people across their full territory. The mission period — San Buenaventura founded 1782, San Fernando Rey founded 1797 — pulled Chumash families onto mission grounds through a combination of persuasion, coercion, and the collapse of traditional subsistence as cattle and disease moved in. Smallpox, measles, and chronic disease reduced the population by more than eighty percent over the seventy years between 1769 and the secularization of the missions in the 1830s.
            </p>
            <p className={BODY}>
              The Chumash built the <strong>tomol</strong> — a sewn-plank canoe. Planks of redwood or pine, drilled and stitched with plant-fiber cordage, caulked with <em>yop</em> (a mixture of pine pitch and asphaltum from natural tar seeps), and sealed with whale fat. The tomol is the oldest plank-built watercraft documented in North America. It was the vehicle of a maritime economy that moved people, shell-bead currency, and fish across the Santa Barbara Channel for thousands of years. In 2001 a group of Chumash paddlers, working with the Channel Islands National Marine Sanctuary and the Chumash Maritime Association, completed a twenty-one-mile tomol crossing from the mainland to Santa Cruz Island. The crossing has been repeated. <em>It is not a reenactment. It is a living maritime tradition in active practice.</em>
            </p>
            <p className={BODY}>
              The contemporary Chumash exist as multiple organized groups. The <strong>Santa Ynez Band of Chumash Indians</strong> is the federally recognized tribe, headquartered on the Santa Ynez Reservation. Several other bands — including the Barbareño/Ventureño Band of Mission Indians, the Coastal Band of the Chumash Nation, and others — are not federally recognized and have pursued recognition and land-return efforts for decades. Chumash representatives attend ceremonies, oversee repatriation, consult on coastal development, speak at Malibu Creek. <strong>They are present tense.</strong>
            </p>
          </div>
          {tomol && (
            <Figure
              image={tomol}
              size="inline"
              caption="A Chumash tomol — sewn-plank canoe, the oldest plank-built watercraft documented in North America. Channel Islands National Marine Sanctuary."
            />
          )}
        </div>
      </Section>

      {/* The name */}
      <Section id="the-name" className={PAPER}>
        <SectionHeader
          eyebrow="· The name and what it means"
          title="Where the surf sounds loudly"
        />

        <p className={`${BODY} mb-6`}>
          The word <strong>Humaliwo</strong> appears in mission-era Spanish records with a handful of spellings: Humaliwo, Humaliwu, Umalibo, Maliwu. The spelling shifts because Spanish priests were transcribing a sound from a language they did not speak, and because Ventureño contains consonants and vowel qualities that Spanish orthography could not cleanly accommodate.
        </p>
        <p className={`${BODY} mb-6`}>
          The standard gloss among linguists and tribal sources is <strong>&ldquo;where the surf sounds loudly&rdquo;</strong> — or, more literally, something close to &ldquo;where the water sounds.&rdquo; The root is the Ventureño word for loud or resonant sound, applied to the roar of Pacific swell breaking against a rocky point at the mouth of a creek.
        </p>
        <p className={`${BODY} mb-6 italic`}>
          Sit with that for a second.
        </p>
        <p className={`${BODY} mb-6`}>
          The people who lived at the mouth of Malibu Creek named the place for the sound of the wave. They were not naming it for the wave&rsquo;s shape, or its length, or the way it peeled off the cobblestone toward the pier — those are surfer concerns. They were naming it for what you could hear from the village, inland, at night, when the swell was up: the low, continuous rumble of a south pulse detonating on the point.
        </p>
        <p className={`${BODY} mb-6`}>
          Two thousand years before Miki Dora came down from the bluff and slid across First Point on a balsa board, the Chumash at Humaliwo already knew what the wave sounded like, and had named the place for the sound.
        </p>
        <p className={`${BODY} mb-6`}>
          <em>The wave was never undiscovered. It had a name. The name was about the wave.</em>
        </p>
        <p className={BODY}>
          That name is still the name of the place. Every time a visitor says the word &ldquo;Malibu,&rdquo; they are saying a Chumash word with its edges worn down. The word survives inside the Spanish-mouthed shell of it. The shell has been worn for so long that most of the people speaking the word have no idea what is underneath.
        </p>
      </Section>

      {/* CA-LAN-264 — dark section */}
      <section className={DARK}>
        <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
          <div className={`${EYEBROW} mb-4`} style={{ color: "var(--beach-supporting, #C98B5F)" }}>
            · CA-LAN-264
          </div>
          <h2 className={H2_DARK} style={{ fontFamily: DISPLAY_FF }}>
            What is buried at First Point
          </h2>
          <p className="mt-5 text-lg italic font-serif max-w-2xl text-[#94A3B8]">
            Not metaphor. A continuously occupied coastal village and its dead, underneath parking asphalt and a state-park snack kiosk, within sight of the takeoff zone.
          </p>

          <div className="space-y-6 mt-12">
            <p className={BODY_DARK}>
              The archaeological designation is <strong className="text-white">CA-LAN-264</strong>. California, Los Angeles County, site number 264 in the state inventory. The site sits at the mouth of Malibu Creek, on the eastern edge of the Malibu Lagoon, directly adjacent to what is now the Lagoon Beach parking lot and the lower edge of the Adamson House property. It is listed on the National Register of Historic Places.
            </p>
            <p className={BODY_DARK}>
              The site has been excavated in pieces since the 1940s. The major professional investigation was conducted by UCLA-affiliated archaeologists in the 1960s and 1970s, with materials and records eventually deposited in the UCLA Fowler Museum and the California Archaeological Inventory. Further recovery work took place during the contentious 2012–2013 Malibu Lagoon Restoration Project, which required archaeological monitoring because the construction cut through portions of the site.
            </p>
            <p className={BODY_DARK}>
              What has come out of the ground at CA-LAN-264 includes <strong className="text-white">olivella shell beads</strong> in quantity; <strong className="text-white">abalone ornaments</strong>; stone tools including chert projectile points and mortars; asphaltum-sealed basketry fragments; tomol-associated tools and materials; fish, shellfish, and marine mammal bone indicating a marine-centered diet; and <strong className="text-white">human burials</strong>.
            </p>
            <p className={BODY_DARK}>
              The burials matter. <strong className="text-white">Humaliwo is in part a cemetery.</strong> The Chumash dead of Malibu are in the ground at the mouth of Malibu Creek, immediately beside where the cars park and the people lay out towels. Some of those remains were removed during twentieth-century excavation under standards of consent and custody that today would not be considered acceptable.
            </p>
            <p className={BODY_DARK}>
              The <strong className="text-white">Native American Graves Protection and Repatriation Act</strong> (NAGPRA), passed in 1990, established a federal framework requiring institutions to inventory Native American human remains and funerary objects and repatriate them to descendant tribes. NAGPRA did not reach backward in time to undo what had already been done. It did force an accounting. The process of repatriating Chumash ancestral remains from museum and university collections — including materials from CA-LAN-264 — has been ongoing for more than three decades and is not finished.
            </p>
            <p className={BODY_DARK}>
              Interpretive signage at Malibu Lagoon acknowledges the Chumash presence, but the signage is modest relative to the significance of the site. A visitor who is not looking for it will not find it. The state park system manages the land. Tribal consultation on what is posted, what is said, and what is permitted at the site is a negotiation that is still in progress.
            </p>
            <p className={`${BODY_DARK} italic pt-2`}>
              What is buried at First Point is not metaphor. It is a continuously occupied coastal village and its dead, underneath parking asphalt and a state-park snack kiosk, within sight of the takeoff zone.
            </p>
          </div>
        </div>
      </section>

      {/* The Rindge grant */}
      <Section id="rindge" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· The Rindge grant"
          title="Four layers of legal displacement stacked on top of Humaliwo"
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] items-start">
          {adamson && (
            <Figure
              image={adamson}
              size="inline"
              caption="Adamson House, 1929. Built for Rindge's daughter Rhoda on the bluff directly above First Point. The final structure of the Rindge family's Malibu coastline."
            />
          )}
          <div className="space-y-6">
            <p className={BODY}>
              In <strong>1892, Frederick Hastings Rindge bought the Malibu coast.</strong>
            </p>
            <p className={BODY}>
              Rindge was a Harvard-educated industrialist from Cambridge, Massachusetts, who had made money in Boston real estate and utilities and had come west with a fortune and a taste for solitude. He purchased <strong>Rancho Topanga Malibu Sequit</strong> — a thirteen-thousand-three-hundred-fifteen-acre Mexican land grant stretching along roughly twenty miles of coastline from the neighborhood of Las Flores Canyon in the south to the mouth of Arroyo Sequit in the north — for a price typically cited as three hundred thousand dollars.
            </p>
            <p className={BODY}>
              The grant had a chain of title. Mexico had issued it in 1804 to José Bartolomé Tapia. It passed through Tapia&rsquo;s family and was eventually sold, by way of a French-American intermediate owner named Matthew Keller, to Rindge. Each transaction was lawful under the property regime of the moment. <em>None of those regimes had asked the Chumash.</em>
            </p>
            <p className={BODY}>
              The Mexican land grant was itself a product of Spanish mission-era displacement: in the Spanish and then Mexican framework, Chumash land was <em>terra nullius</em> for the purposes of grant, because the Chumash were not recognized as legal landholders. The 1848 Treaty of Guadalupe Hidalgo transferred California to the United States and nominally committed the U.S. to honoring Mexican land grants. It did. The grants survived the transition, and with them the structural exclusion of the Chumash from title. By the time Rindge bought Malibu in 1892, <strong>four layers of legal displacement — Spanish mission, Mexican grant, Treaty of Guadalupe Hidalgo, American confirmation</strong> — had been stacked on top of Humaliwo.
            </p>
            <p className={BODY}>
              Rindge died in 1905. His wife, <strong>May Knight Rindge</strong>, inherited the property and spent the next three decades waging one of the longest and most aggressive private-land legal campaigns in California history. She armed guards. She blew up roads. She fought the Southern Pacific Railroad and then the State of California itself to prevent a public highway along her coast.
            </p>
            <p className={BODY}>
              May Rindge lost at the United States Supreme Court in 1923, which upheld California&rsquo;s right of eminent domain for what would become the Pacific Coast Highway. Construction of PCH through the Rindge ranch was completed through the late 1920s. Simultaneously, May, by then financially strained, began leasing beachfront parcels to Hollywood figures — the nucleus of what became the <strong>Malibu Colony</strong>, first leased in 1926. The Malibu Pier, originally built in 1905 as the Rindge family&rsquo;s private freight landing, opened to public fishing in 1926. The Adamson House, built for Rindge&rsquo;s daughter Rhoda and her husband Merritt Adamson, was completed in 1929 on the bluff directly above First Point.
            </p>
            <p className={BODY}>
              Every structure that anchors the modern Malibu scene — the Pier, the Colony, the Adamson House, PCH itself — dates to the moment the Rindge wall cracked. The Surfrider wave became reachable in the late 1920s because May Rindge ran out of appeals.
            </p>
            <p className={`${BODY} italic`}>
              Before that, it was private. Before private, it was Mexican grant. Before grant, it was Spanish mission. Before mission, it was Humaliwo.
            </p>
          </div>
        </div>
      </Section>

      {/* What to do with this */}
      <Section id="what-to-do" className={CREAM}>
        <SectionHeader
          eyebrow="· What to do with this"
          title="Loving the wave honestly requires knowing what is underneath it"
        />

        <p className={`${BODY} mb-6`}>
          The position of this page is straightforward: loving First Point honestly requires knowing what is underneath it. You can ride the wave and also know that you are riding above Humaliwo. The two facts are compatible. The two facts are not mutually exclusive. <strong>What is not compatible is loving the wave while pretending the parking lot is nothing but a parking lot.</strong>
        </p>
        <p className={`${BODY} mb-6`}>
          Practical actions for a visitor who takes this seriously:
        </p>
        <div className="space-y-5 mb-8">
          <div>
            <h3 className={H3} style={{ fontFamily: DISPLAY_FF }}>Read</h3>
            <p className={`${BODY} mt-2`}>
              Chester King&rsquo;s 1990 monograph <em>Evolution of Chumash Society</em> is the dense, technical baseline and is available in university libraries. For a more accessible entry, the <strong>Santa Ynez Band of Chumash Indians</strong> maintains a cultural department and website with educational materials written by Chumash people about Chumash history. The <strong>Wishtoyo Chumash Foundation</strong>, headquartered just up the coast at Nicholas Canyon, runs a cultural village (Wishtoyo&rsquo;s Chumash Village) with scheduled tours, ceremonies, and educational programming. That is the place to go to hear the story told by the people whose story it is.
            </p>
          </div>
          <div>
            <h3 className={H3} style={{ fontFamily: DISPLAY_FF }}>Show up honestly</h3>
            <p className={`${BODY} mt-2`}>
              Chumash ceremonies at Malibu Creek and the lagoon do occur. Some are private and closed. Some are public. If you attend a public one, attend as a guest — quiet, present, following the direction of the people conducting it. Do not photograph without asking. Do not narrate over it.
            </p>
          </div>
          <div>
            <h3 className={H3} style={{ fontFamily: DISPLAY_FF }}>Give money that matters</h3>
            <p className={`${BODY} mt-2`}>
              Wishtoyo Chumash Foundation accepts donations and takes volunteers. The Santa Ynez Chumash Environmental Office does applied work on habitat and cultural landscape protection. These are concrete, not symbolic.
            </p>
          </div>
          <div>
            <h3 className={H3} style={{ fontFamily: DISPLAY_FF }}>Say the word</h3>
            <p className={`${BODY} mt-2`}>
              Before you paddle out at First Point, learn how to say <strong>Humaliwo</strong>. Say it out loud once. Know that the place you are about to surf has been called that, by the people who heard the wave before anyone else, for two thousand years. Then ride the wave whose sound the Chumash named.
            </p>
          </div>
        </div>
        <p className={`${BODY} italic`}>
          None of this makes the parking lot disappear. None of it undoes the Rindge grant. None of it repatriates a single burial. It is the minimum version of a traveler showing up at a place and not pretending the place has no history. It is the starting line, not the finish.
        </p>

        {lagoon && (
          <div className="mt-12">
            <Figure
              image={lagoon}
              size="wide"
              caption="Malibu Lagoon. The hydrological heart of the break, the eastern edge of CA-LAN-264, and the place a Chumash ceremony at Malibu Creek would most likely be held."
            />
          </div>
        )}
      </Section>

      <SpokeCrossNav current="humaliwo" />
      <SpokeProvenance
        bundle={bundle}
        note="Key sources: Chester D. King, 'Evolution of Chumash Society' (Garland, 1990); California Archaeological Site Inventory record for CA-LAN-264 and UCLA Fowler Museum archival materials; 2012–2013 Malibu Lagoon Restoration Project archaeological monitoring reports; Santa Ynez Band of Chumash Indians official publications; Wishtoyo Chumash Foundation resources; California State Archives holdings on the Rancho Topanga Malibu Sequit grant and Rindge family litigation. This is a one-page summary written by a non-Chumash author. For the fuller history told by Chumash people directly, go to the Santa Ynez Band and to Wishtoyo — their account is the primary one. Corrections welcome, particularly on Ventureño etymology and contemporary tribal nomenclature."
      />
    </LegendaryShell>
  );
}
