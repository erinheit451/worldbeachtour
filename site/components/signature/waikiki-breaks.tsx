/**
 * Waikīkī signature section: The Named Breaks.
 *
 * Seven surf breaks sit along the two-mile reef in front of Waikīkī. Each
 * has a name that locals use as a coordinate — "I'll see you at Canoes,"
 * "it's firing at Populars today." A Waikīkī page that describes the water
 * as a single thing misses the whole point: the reef is a topography of
 * named places, and the names are old.
 */

import {
  WideSection,
  SectionHeader,
  Prose,
} from "@/components/showcase/legendary-beach";

interface Break {
  name: string;
  meaning?: string;
  character: string;
  who: string;
  position: string;
}

const BREAKS: Break[] = [
  {
    name: "Populars (Pops)",
    character:
      "Long right-hander along the outer reef. Fast, clean, rarely crowded past dawn. A 400-meter paddle. Head-high on a south swell is a good day.",
    who: "Experienced longboarders, stand-up paddlers. Not beginner water.",
    position: "Outer reef, fronting the Elks Club — eastern end of Waikīkī's reef.",
  },
  {
    name: "Public's",
    character:
      "Peaky, short-faced wave. Closer to shore than Pops, more crowded, less forgiving.",
    who: "Intermediate surfers who know the boil where the reef comes up.",
    position: "Inside of Pops, directly off Kapiʻolani Park.",
  },
  {
    name: "Queens",
    meaning: "Named for Queen Liliʻuokalani, who watched surfing here from the beach.",
    character:
      "Waikīkī's signature break. Soft-shouldered left, easy to take off on, long ride. The longboarder's dream. When people talk about 'Waikīkī surfing' they usually mean Queens.",
    who: "Everyone — from the beach-boy's first lesson to Duke Kahanamoku's grandson.",
    position: "Directly in front of the Waikīkī Wall at Kūhiō Beach. Launch from the sand.",
  },
  {
    name: "Canoes",
    character:
      "The tourist break. Gentle, slow-building rollers. The beach boys take paying customers out on six-person outriggers and catch one wave every ten minutes, cheered by everyone on the sand. It has been exactly this since the 1920s.",
    who: "First-timers, canoe surfers, tandem surfers, anyone on rental gear.",
    position: "Directly in front of the Royal Hawaiian. The wave breaks toward the Moana.",
  },
  {
    name: "Threes (No. 3)",
    character:
      "A right-breaking wave off the reef marker that reads '3.' Smaller and more technical than Queens — the wave throws, doesn't roll. Local-dominated; respect the pecking order.",
    who: "Oʻahu locals, intermediate-to-advanced shortboarders.",
    position: "Outside of Canoes, further offshore.",
  },
  {
    name: "Paradise",
    character:
      "A rare performance break at Waikīkī — punchy right, short wall, workable for shortboard turns. Only works on a southwest swell. Locals show up fast when it is on.",
    who: "Shortboarders looking for something other than a longboard cruise.",
    position: "West of Threes, behind the Halekulani.",
  },
  {
    name: "Kaiser Bowls",
    character:
      "Off Duke Kahanamoku Beach at the Hilton Hawaiian Village end. A bowly left at the edge of the Ala Wai channel. Fast, hollow, closes out quickly.",
    who: "Shortboarders, bodyboarders, the local kids who grew up on it.",
    position: "Far western end of Waikīkī's reef, off the Rainbow Tower.",
  },
];

export default function WaikikiBreaks() {
  return (
    <WideSection id="breaks" className="bg-ocean-50/30">
      <SectionHeader
        eyebrow="· The Named Breaks"
        title="Seven waves, one reef, old names"
        kicker="The reef in front of Waikīkī is not one break — it is seven, each with a name that locals use as a coordinate. This is the map."
      />
      <div className="grid gap-6 lg:grid-cols-2 mb-10">
        {BREAKS.map((b, i) => (
          <article
            key={b.name}
            className="rounded-xl bg-white border border-volcanic-100 p-6 shadow-sm"
          >
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-mono text-xs text-ocean-600 uppercase tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-2xl text-volcanic-900">{b.name}</h3>
            </div>
            {b.meaning && (
              <p className="text-sm italic text-ocean-700 mb-3">{b.meaning}</p>
            )}
            <p className="text-[15px] text-volcanic-700 leading-relaxed mb-4">
              {b.character}
            </p>
            <dl className="space-y-1 text-xs text-volcanic-600">
              <div>
                <dt className="inline font-semibold uppercase tracking-wider text-volcanic-500 mr-2">
                  Who:
                </dt>
                <dd className="inline">{b.who}</dd>
              </div>
              <div>
                <dt className="inline font-semibold uppercase tracking-wider text-volcanic-500 mr-2">
                  Where:
                </dt>
                <dd className="inline">{b.position}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <Prose>
        <p className="italic text-volcanic-600">
          If you paddle out at Queens on a south swell and wait your turn, somebody will eventually
          call you into a wave. If you paddle out at Threes on the same day and don't know the
          local hierarchy, you will get drops ignored. The reef sorts by knowledge; it always has.
          This is not hostility — it is how a shared resource maintains itself across generations.
        </p>
      </Prose>
    </WideSection>
  );
}
