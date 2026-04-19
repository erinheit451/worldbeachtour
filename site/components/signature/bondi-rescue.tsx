/**
 * Bondi signature: Bondi Rescue + the lifeguards.
 *
 * Bondi is the place where organized surf lifesaving was invented in 1907.
 * Today it has ~4,500 documented rescues a year — filmed, syndicated to
 * 100+ countries, and made the lifeguards into the most recognizable
 * municipal employees on Earth.
 */

import {
  WideSection,
  SectionHeader,
  Prose,
  Caption,
  type SectionImage,
} from "@/components/showcase/legendary-beach";

export default function BondiRescue({
  rescueImage,
  capImage,
}: {
  rescueImage?: SectionImage;
  capImage?: SectionImage;
}) {
  return (
    <WideSection id="rescue">
      <SectionHeader
        eyebrow="· The Lifeguards"
        title="Why the world knows this specific beach"
        kicker="Australia invented surf lifesaving at Bondi in 1907. A hundred years later, a documentary TV show turned the lifeguards into the most-recognized municipal employees on Earth."
      />
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
        <Prose>
          <p>
            On <strong>21 February 1907</strong>, the Bondi Surf Bathers' Life Saving Club was
            founded — the world's first organized surf-lifesaving club. The founding was a direct
            response to the 1903 repeal of New South Wales's law against daylight sea bathing;
            once swimming was legal, thousands of inexperienced bathers were drowning. The club
            invented the resuscitation drill, the shark-spotting patrol, and — crucially — the
            volunteer surf-rescue boat. The red-and-yellow-quartered cap they adopted became the
            Australian surf-lifesaving uniform. It still is.
          </p>
          <p>
            There are two separate services on the beach, and this is a real distinction that
            matters if you are here to be rescued. The{" "}
            <strong>Bondi Surf Bathers' Life Saving Club</strong> (the 1907 one) is a volunteer
            organization — they patrol the beach on weekends and holidays, wearing the
            red-and-yellow caps. The <strong>Waverley Council professional lifeguards</strong> are
            paid full-time municipal employees — they patrol every day, wear blue-and-yellow polo
            shirts, work from the towers on the sand, and are the ones filmed in Bondi Rescue.
            Both services work the same water; they're coordinated but organizationally distinct.
          </p>
          <p>
            The rescue statistics are genuinely extraordinary. The Waverley Council team performs
            on average <strong>4,500 rescues every year</strong> at Bondi alone — roughly{" "}
            <strong>twelve per day.</strong> Another 150,000 "preventative actions" annually —
            moving people out of rip currents, stopping children from running into big surf,
            redirecting drunk backpackers. The majority of rescues involve tourists; Sydney locals
            know the rips. The professional lifeguards also perform CPR, call the helicopter, and
            occasionally pull people out of the surf who didn't want to be pulled out.
          </p>
          {rescueImage && (
            <figure className="my-8 overflow-hidden rounded-xl bg-volcanic-100">
              <img
                src={rescueImage.thumbnail || rescueImage.url}
                alt={rescueImage.title}
                className="w-full h-auto"
              />
              <figcaption className="p-3 bg-white border-t border-volcanic-100">
                <Caption>
                  {rescueImage.title} · {rescueImage.license}
                </Caption>
              </figcaption>
            </figure>
          )}
          <p>
            <strong>Bondi Rescue</strong> — the documentary TV series — has run on Australia's
            Network Ten since February 2006. It is now in its eighteenth-plus season and syndicates
            to more than a hundred countries. The show follows the Waverley Council lifeguards in
            real time, documenting actual rescues. The lifeguards who've become household names —{" "}
            <strong>Hoppo</strong> (Bruce Hopkins, the captain), <strong>Deano</strong>,{" "}
            <strong>Whippet</strong>, <strong>Trent</strong>, <strong>Maxi</strong> — are the same
            people working the beach today. If you visit, one of the bronze-skinned people in
            blue-and-yellow in Tower 1 is from the show. They are not actors.
          </p>
          <p>
            The Bondi lifeguards also run the surf-life-saving school curriculum for Waverley
            primary schools — a generation of Bondi-raised children learn to read rip currents
            before they learn cursive. The <strong>"Nippers"</strong> program, for ages 5-13,
            trains future volunteer lifesavers on Sunday mornings. On any given Sunday from
            September to March, there are 500+ kids in red-and-yellow caps on the sand being
            coached.
          </p>
        </Prose>
        {capImage && (
          <figure className="overflow-hidden rounded-xl bg-volcanic-100 lg:sticky lg:top-24">
            <img
              src={capImage.thumbnail || capImage.url}
              alt={capImage.title}
              className="w-full h-auto"
            />
            <figcaption className="p-3 bg-white border-t border-volcanic-100">
              <div className="font-display text-lg text-volcanic-900">The Cap</div>
              <Caption>
                {capImage.title} · {capImage.license}
              </Caption>
            </figcaption>
          </figure>
        )}
      </div>
      <div className="mt-10 rounded-2xl bg-ocean-50 p-7">
        <p className="text-sm italic text-volcanic-600 leading-relaxed max-w-3xl">
          <strong>If you only read one safety line about Bondi:</strong> swim between the
          red-and-yellow flags. The flags are not a suggestion; they mark the only patrolled water
          on the beach. Most drownings on Australian beaches happen outside the flags. The
          lifeguards are waiting to help you, but they cannot be everywhere. The flags move up and
          down the beach as rip currents migrate during the day. Always re-check.
        </p>
      </div>
    </WideSection>
  );
}
