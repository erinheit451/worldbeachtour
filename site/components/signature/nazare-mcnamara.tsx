/**
 * Nazaré signature: The McNamara Era.
 *
 * How Nazaré went from a globally-unknown Portuguese fishing village to
 * the site of every modern big-wave world record — in the span of twelve
 * years. The story starts with a small-town bodyboarder's email, runs
 * through one November afternoon in 2011, and is still being written.
 */

import {
  WideSection,
  SectionHeader,
  Prose,
  Caption,
  type SectionImage,
} from "@/components/showcase/legendary-beach";

export default function NazareMcnamara({
  archivalImage,
}: {
  archivalImage?: SectionImage;
}) {
  return (
    <WideSection id="mcnamara">
      <SectionHeader
        eyebrow="· The McNamara Era"
        title="From an email to a world record"
        kicker="How a 2005 email from a local bodyboarder to a Hawaiian surfer turned Nazaré into the most-photographed stretch of ocean in the world."
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] items-start">
        {archivalImage && (
          <figure className="overflow-hidden rounded-xl bg-volcanic-100 lg:sticky lg:top-24">
            <img
              src={archivalImage.thumbnail || archivalImage.url}
              alt={archivalImage.title}
              className="w-full h-auto"
            />
            <figcaption className="p-3 bg-white border-t border-volcanic-100">
              <Caption>
                {archivalImage.title} · {archivalImage.license}
              </Caption>
            </figcaption>
          </figure>
        )}
        <Prose>
          <p>
            <strong>Dino Casimiro</strong> is a bodyboarder from Nazaré. Around 2005 he began
            sending emails to{" "}
            <strong>Garrett McNamara</strong> — a Hawaiian big-wave surfer known for rides at
            Jaws, Teahupoʻo, and Cortes Bank — with photographs of the waves at Praia do Norte.
            McNamara ignored the first several. In 2010 he finally responded. He flew to Nazaré
            to see for himself. What he found was a break that he later described as "the closest
            thing to a bigger Jaws I have ever seen." He began assembling a training operation:
            water safety, jet-ski drivers, a base at the Forte parking lot.
          </p>
          <p>
            On <strong>1 November 2011</strong>, during a large Atlantic winter swell, McNamara
            was towed by jet-ski into a wave at Praia do Norte. The photograph — McNamara on a
            small yellow board, a speck at the bottom of a vertical wall of water, the Forte de
            São Miguel lighthouse visible above the crest — became, within 48 hours, one of the
            most-shared single images in surfing history. The wave was later measured at{" "}
            <strong>23.77 meters (78 feet)</strong>. Guinness certified it as the largest wave
            ever surfed. The certification was still new enough that they hadn't figured out how
            to measure it consistently; they've gotten better since.
          </p>
          <p>
            What McNamara did with the fame was significant. He and his wife Nicole moved to
            Nazaré. He trained other surfers to ride it. He was frank with the Portuguese media
            about the risks and about the canyon's physics. <strong>The Câmara Municipal de
            Nazaré</strong> — the local town council — saw what was coming and began the
            conversation about the Forte de São Miguel becoming a municipal surf museum.
            McNamara's second ride in 2013, estimated visually at close to 100 feet, put the town
            on the cover of <em>Time</em>, <em>Newsweek</em>, and <em>Surfer</em>.
          </p>
          <p>
            The generation of surfers who followed is specific:
          </p>
          <ul>
            <li>
              <strong>Maya Gabeira</strong>, Brazilian, nearly killed at Nazaré in 2013 in a
              wipeout that broke her fibula and required CPR on the beach from fellow surfer
              Carlos Burle. She came back. Her 2020 wave was measured at 22.4 m — the largest
              wave ever ridden by a woman, certified by Guinness.
            </li>
            <li>
              <strong>Rodrigo Koxa</strong>, Brazilian, who broke McNamara's record in November
              2017 with a 24.38 m (80 ft) ride. Certified by Guinness in 2018.
            </li>
            <li>
              <strong>Sebastian Steudtner</strong>, German, who set the current world record in
              October 2020 at 26.21 m (86 ft). Post-ride photogrammetry at the University of
              Alcalá estimated the actual height at closer to 28.6 m — which, if accepted, would
              put the largest ride ever well into the 90-foot zone.
            </li>
            <li>
              <strong>Kai Lenny</strong>, Justine Dupont, Michelle des Bouillons, Pedro "Scooby"
              Vianna — the core Nazaré-resident group. Lenny is Hawaiian; Dupont is French; des
              Bouillons is Brazilian-German; Vianna is Brazilian. The Nazaré scene is the most
              international big-wave community in the sport's history, and it is functionally
              based out of a 15,000-person Portuguese fishing village.
            </li>
          </ul>
          <p>
            The <strong>HBO series <em>100 Foot Wave</em></strong> (2021, still in production as
            of 2026) has put this community in front of an audience that does not surf. The
            WSL's <strong>Nazaré Tow Challenge</strong> is held each winter during the prime
            swell window; the exact date is announced 72 hours out, based on forecast. The
            Forte's surf museum opened in 2017 and is now the village's second-most-visited
            attraction (behind the Sítio sanctuary).
          </p>
          <p>
            The story is also still open. <strong>The 100-foot wave — as a certified, measured,
            ridden ride — has not yet happened.</strong> McNamara has said publicly he believes
            it is possible at Nazaré within the decade. Steudtner's 2020 ride, if the University
            of Alcalá reanalysis is accepted, is already over 93 feet. The measurement standard
            matters: Guinness uses an official crest-to-trough method; photogrammetric analysis
            typically returns higher numbers. Either way, if it happens anywhere, it is going to
            happen here.
          </p>
        </Prose>
      </div>
    </WideSection>
  );
}
