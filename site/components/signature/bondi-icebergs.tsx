/**
 * Bondi signature: Icebergs + the Australian ocean pool tradition.
 *
 * The Icebergs Club at the southern headland is the photographed image of
 * Bondi. Behind it is the Australian ocean-pool tradition — ~100 pools on
 * the New South Wales coast, the largest collection of ocean pools on
 * Earth. Waves break over them at high tide; the swimmer keeps swimming.
 */

import {
  WideSection,
  SectionHeader,
  Prose,
  Caption,
  type SectionImage,
} from "@/components/showcase/legendary-beach";

export default function BondiIcebergs({ poolImage }: { poolImage?: SectionImage }) {
  return (
    <WideSection id="icebergs" className="bg-ocean-50/40">
      <SectionHeader
        eyebrow="· Icebergs & the Ocean Pools"
        title="Australia invented a different kind of swimming"
        kicker="~100 ocean pools on the New South Wales coast — the largest collection on Earth. Bondi Icebergs is the one that ended up on your Instagram feed."
      />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] items-start">
        {poolImage && (
          <figure className="overflow-hidden rounded-2xl bg-volcanic-100 lg:sticky lg:top-24">
            <img
              src={poolImage.thumbnail || poolImage.url}
              alt={poolImage.title}
              className="w-full h-auto"
            />
            <figcaption className="p-3 bg-white border-t border-volcanic-100">
              <Caption>
                {poolImage.title} · {poolImage.license}
              </Caption>
            </figcaption>
          </figure>
        )}
        <Prose>
          <p>
            The <strong>Bondi Icebergs Club</strong> was founded on{" "}
            <strong>5 February 1929</strong> by a group of local lifesavers who wanted to swim
            year-round in the Pacific. The ocean at Sydney's latitude drops to 17°C in July — cold
            enough that the founding members, to prove their commitment, dropped actual blocks of
            ice into the pool during the inaugural season. The name stuck.
          </p>
          <p>
            The Icebergs pool itself — a 50-meter swimming pool set directly into the rock at
            Bondi's southern headland, with waves breaking over the ocean side at high tide — is
            the single most-photographed image in Australian beach culture. It predates the
            current club building by several decades. The pool was originally cut into the
            sandstone in the late 1880s. The clubhouse — the striking modernist building that
            looms behind the pool — was rebuilt in 2002 by Sydney architects Lahznimmo. It houses
            the club, a bistro, and the Icebergs Dining Room upstairs.
          </p>
          <p>
            The pool is <strong>open to the public year-round</strong> for A$9.50 per session. The
            club itself — the actual Icebergs membership, which requires swimming every Sunday of
            the winter — is invite-only and has about 300 current members. In summer the
            non-members' pool can get crowded; in winter you can often have it to yourself.
            Getting in at 6 a.m. in July when the water is 17°C and the mist rises off the surface
            and the sky behind Mackenzie's Point is turning pink — this is the experience that
            Icebergs is about. It is less a swimming facility than an Australian discipline.
          </p>
          <p>
            Icebergs is also the point of pilgrimage for the <strong>ocean-pool tradition
            broadly.</strong> The New South Wales coast has roughly one hundred ocean pools —
            concrete or sandstone swimming enclosures built into rock platforms, filled by the
            tide, free or nearly so to enter. This is the largest collection of ocean pools on
            Earth. They exist because Sydney, from the 1880s onward, kept building swimming
            infrastructure for people who were scared of the sharks (see next section) and
            unwilling to swim at crowded sandy beaches. The pools were — and are — a civic
            compromise: the water of the ocean, without the open water.
          </p>
          <p>
            Notable examples within a half-hour drive of Bondi: <strong>North Bondi Rock Pool</strong>{" "}
            (the smaller, free, 24-hour pool at the other end of the beach);{" "}
            <strong>Bronte Pool</strong> (20 minutes south on the coastal walk);{" "}
            <strong>McIver's Baths</strong> at Coogee (women-only since 1876 — one of the last
            legally-protected women-only public pools in the world); <strong>Mahon Pool</strong>{" "}
            at Maroubra; and — further afield — <strong>Bogey Hole</strong> at Newcastle,
            hand-carved by convicts in 1820, the oldest ocean pool in Australia. If the named-breaks
            section is the surfer's map of Bondi, the ocean pools are the non-surfer's.
          </p>
          <p className="text-sm italic text-volcanic-500">
            The <strong>Bondi to Coogee Coastal Walk</strong> passes four ocean pools in 6
            kilometers. It is, in effect, a self-guided tour of the tradition.
          </p>
        </Prose>
      </div>
    </WideSection>
  );
}
