/**
 * Waikīkī signature section: Reading the Land.
 *
 * Every block in this neighborhood sits on top of a Hawaiian place. The
 * Royal Hawaiian Hotel stands on what was Helumoa, the royal coconut
 * grove. The Ala Wai Canal buried Apuakehau Stream and the wetlands
 * that fed it. Kalākaua Avenue is named for a king. Diamond Head is the
 * English name for Lēʻahi. Knowing these names is the difference between
 * visiting Waikīkī and being present at it.
 */

import {
  Section,
  SectionHeader,
  Prose,
} from "@/components/showcase/legendary-beach";

interface PlaceName {
  hawaiian: string;
  english?: string;
  meaning: string;
  nowAt: string;
  note: string;
}

const NAMES: PlaceName[] = [
  {
    hawaiian: "Waikīkī",
    meaning: "ʻSpouting fresh waterʼ — a reference to the springs and streams that once surfaced along this coast.",
    nowAt: "The neighborhood now called Waikīkī.",
    note:
      "Before the Ala Wai Canal in 1928, this entire district was wetland — taro fields, fishponds, and duck ponds fed by four streams running down from the Koʻolau mountains. The canal drained all of it. The name survived.",
  },
  {
    hawaiian: "Lēʻahi",
    english: "Diamond Head",
    meaning:
      "ʻBrow of the tunaʼ — the shape of the crater, seen from offshore, resembles the dorsal fin and brow of an ʻahi.",
    nowAt: "The 300,000-year-old tuff cone at the eastern end of the beach.",
    note:
      "The English name comes from 19th-century British sailors who mistook calcite crystals on the crater's slopes for diamonds. Locals almost always say Lēʻahi; even the summit trailhead signage uses both.",
  },
  {
    hawaiian: "Helumoa",
    meaning: "ʻScratching chickenʼ — from a Kamehameha-era myth about a rooster who scratched the earth here.",
    nowAt: "The land from roughly the Royal Hawaiian Hotel through the Royal Hawaiian Center.",
    note:
      "Helumoa was a royal coconut grove — 10,000 trees, planted for Chief Kākuhihewa, used by Hawaiian royalty for centuries. Kamehameha I camped here in 1795 after unifying Oʻahu. The last of the grove was cut down in the 1920s to build the Royal Hawaiian. A handful of replanted trees stand in front of the hotel; the shopping center behind takes its name from the grove.",
  },
  {
    hawaiian: "Apuakehau",
    meaning: "ʻThe basket of dewʼ — the name of a stream.",
    nowAt: "Buried under Beachwalk and Lewers Street, empties onto Gray's Beach.",
    note:
      "One of four streams that used to flow across Waikīkī from the Koʻolau range. Its mouth was a canoe landing and a place where chiefs bathed. You can still see where it exits — Gray's Beach is narrower than its neighbors because the stream's old mouth is now a storm drain, and sand does not accumulate there the way it does elsewhere.",
  },
  {
    hawaiian: "Kālia",
    meaning: "ʻThe waitingʼ — or possibly referring to a kind of small sacred shrine.",
    nowAt: "The area now occupied by Fort DeRussy and the Hilton Hawaiian Village.",
    note:
      "Kālia was a royal fishpond complex. The Hawaiian Kingdom's Commissioner of Crown Lands recorded it as one of Oʻahu's most productive mullet ponds. The U.S. Army filled the ponds in 1909 to build Fort DeRussy. Today the fort's chapel and the Hale Koa military resort sit on what was underwater in the Hawaiian period.",
  },
  {
    hawaiian: "Kūhiō",
    meaning:
      "Named for Prince Jonah Kūhiō Kalanianaʻole — Hawaiian royalty, U.S. Congressman, namesake of the Hawaiian Homes Commission Act of 1921.",
    nowAt: "Kūhiō Beach, Kūhiō Avenue, and the whole civic geography of Hawaiian home lands.",
    note:
      "Kūhiō was born at Waikīkī in 1871. After the 1893 overthrow, he served two years in prison for his role in an attempted royalist counter-coup. Decades later, as the Territory of Hawaiʻi's non-voting delegate to Congress, he passed the act that created the Department of Hawaiian Home Lands — homesteads set aside for Native Hawaiians. The beach where he played as a child is now called Kūhiō Beach. Kūhiō Day is a state holiday.",
  },
  {
    hawaiian: "Kalākaua",
    meaning: "ʻThe dayʼ — the name of King David Kalākaua, who reigned 1874 to 1891.",
    nowAt: "Kalākaua Avenue — the main beachfront boulevard.",
    note:
      "Kalākaua is known as the Merrie Monarch. He revived hula, which Christian missionaries had suppressed, and he dedicated Kapiʻolani Park at the eastern end of the beach to his queen. The annual Merrie Monarch Festival — the world's premier hula competition, held in Hilo on the Big Island every April — is named in his honor. His statue stands at the Waikīkī Gateway Park at the western edge of the district.",
  },
  {
    hawaiian: "Puʻuhonua",
    meaning: "ʻPlace of refugeʼ — a sanctuary where lawbreakers, defeated warriors, or noncombatants could not be pursued.",
    nowAt: "A marker at Kūhiō Beach, near the old canoe-landing area.",
    note:
      "A puʻuhonua existed at Waikīkī in pre-contact times. The best-preserved example in Hawaiʻi is Puʻuhonua o Hōnaunau on the Big Island, a National Historical Park. At Waikīkī the site is commemorated by a marker; the physical puʻuhonua was paved over generations ago. The principle is still in the Hawaiian constitution — sanctuary exists.",
  },
];

export default function WaikikiPlacenames() {
  return (
    <Section id="placenames">
      <SectionHeader
        eyebrow="· Reading the Land"
        title="Every block sits on a Hawaiian place"
        kicker="The tourist grid was drawn on top of an older map. You can still walk the older one."
      />
      <Prose>
        <p>
          The Hawaiian word <em>wahi pana</em> means ʻstoried placeʼ. Every stretch of sand at
          Waikīkī, every ridge behind it, every stream buried under asphalt, has a name in Hawaiian
          — and the name carries a story. The modern streetscape — Kalākaua, Kūhiō, the big hotels
          — sits on top of this older geography. Most visitors never see it. It is not hidden; it
          is just in a different language and a different set of stories than the one the hotels
          tell. What follows is eight of the place-names you will walk past. You can go find each
          of them in an afternoon.
        </p>
      </Prose>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {NAMES.map((n) => (
          <article key={n.hawaiian} className="border-l-2 border-ocean-400 pl-6">
            <header className="mb-3">
              <h3 className="font-display text-2xl text-volcanic-900 leading-tight">
                {n.hawaiian}
                {n.english && (
                  <span className="block text-sm font-normal italic text-volcanic-500 mt-1">
                    English: {n.english}
                  </span>
                )}
              </h3>
              <p className="mt-2 text-sm italic text-ocean-700">{n.meaning}</p>
            </header>
            <dl className="space-y-3 text-[15px] text-volcanic-700">
              <div>
                <dt className="font-semibold uppercase tracking-widest text-[10px] text-volcanic-500">
                  Now at
                </dt>
                <dd className="mt-1 leading-relaxed">{n.nowAt}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-widest text-[10px] text-volcanic-500">
                  Note
                </dt>
                <dd className="mt-1 leading-relaxed">{n.note}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <Prose>
        <p className="mt-14 italic text-volcanic-600">
          There is also <em>kanawai kai</em> — the Hawaiian law of the sea, which holds that no
          beachfront property can privatize the shore. That principle predates the U.S. annexation
          and has outlasted it. Every inch of sand at Waikīkī, from Kaimana on the east to Ala Moana
          Bowls on the west, is public. The pink umbrellas belong to the Royal Hawaiian; the sand
          beneath them belongs to everyone.
        </p>
      </Prose>
    </Section>
  );
}
