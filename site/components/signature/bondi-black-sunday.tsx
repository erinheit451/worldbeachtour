/**
 * Bondi signature: Black Sunday, 6 February 1938.
 *
 * The single day that is the founding trauma of Australian surf lifesaving,
 * still referenced in every lifeguard's training. 250+ people pulled from
 * the water; 5 drowned. The rescue is still the largest single surf-rescue
 * operation in recorded history.
 */

import {
  WideSection,
  SectionHeader,
  Prose,
  Caption,
  type SectionImage,
} from "@/components/showcase/legendary-beach";

export default function BondiBlackSunday({
  slsImage,
}: {
  slsImage?: SectionImage;
}) {
  return (
    <WideSection id="black-sunday" className="bg-volcanic-50">
      <SectionHeader
        eyebrow="· 6 February 1938"
        title="Black Sunday — and why Australia still trains for it"
        kicker="The afternoon Bondi's sandbar failed, 250 people went into the water, and five did not come out. Eighty-eight years later, every Bondi lifeguard knows the story."
      />
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
        <Prose>
          <p>
            Sunday, <strong>6 February 1938</strong>, was a normal hot Sydney summer afternoon.
            The temperature was in the low 30s. Bondi was full — perhaps 35,000 people on the
            sand. At approximately 3 p.m., three waves larger than anything the surf had produced
            that day hit the beach in quick succession. The sandbar the bathers were standing on
            was swept from under their feet. Later analysis suggested the waves were the result
            of a distant storm plus the configuration of the offshore reef that afternoon. At
            least <strong>200 people were pulled into the rip channel</strong> and carried out
            into deep water.
          </p>
          <p>
            The lifesavers at Bondi that day — volunteers, wearing the red-and-yellow caps —
            responded immediately. So did the lifesavers from North Bondi Surf Club next door,
            and from the Bondi Surf Bathers' Life Saving Club. Within minutes, every rescue reel
            on the beach was deployed. Surfboards, ropes, and bystanders in swimsuits were
            pulled into the rescue. At one point there were more than <strong>70 lifesavers in
            the water simultaneously</strong>. The belt-and-reel (a rescue rope attached to a
            swimmer by a leather belt) was used for nearly three hours straight.
          </p>
          <p>
            When the rescue ended, <strong>5 people had drowned</strong>. Another 250 had been
            pulled out and resuscitated on the sand. The rescue is still — as of 2026 — the{" "}
            <strong>largest single surf-rescue operation in recorded history</strong>.
          </p>
          {slsImage && (
            <figure className="my-8 overflow-hidden rounded-xl bg-white border border-volcanic-100">
              <img
                src={slsImage.thumbnail || slsImage.url}
                alt={slsImage.title}
                className="w-full h-auto"
              />
              <figcaption className="p-3 border-t border-volcanic-100">
                <Caption>
                  Surf Life Saving Boats, NSW. {slsImage.title} · {slsImage.license}
                </Caption>
              </figcaption>
            </figure>
          )}
          <p>
            Black Sunday became the founding reference in Australian surf-lifesaving training. It
            taught three specific lessons that are still in the curriculum today. <strong>First:
            set-waves can arrive in clusters.</strong> Lifeguards now watch the horizon in
            16-wave cycles, not single ones. <strong>Second: sandbars can fail.</strong> Flag
            positions are re-evaluated hourly; the patrol captain re-reads the rip structure
            before every shift. <strong>Third: mass rescues require improvisation.</strong>{" "}
            Modern surf-lifesaving doctrine explicitly teaches that in a Black-Sunday-scale
            event, bystanders are resources — the patrol captain will recruit swimmers from the
            sand and put them on rescue boards immediately.
          </p>
          <p>
            The day also cemented the surf club as an Australian civic institution. By the end of
            1938, membership in surf-lifesaving clubs nationwide had doubled. The Commonwealth
            formally recognized Surf Life Saving Australia as a protected volunteer service. The
            red-and-yellow cap — a specific piece of cultural costume that now signals trusted
            authority anywhere it is seen — owes its emotional weight to this one afternoon.
          </p>
          <p>
            A small plaque at the northern end of the Bondi promenade commemorates the five
            people who drowned. No large monument was ever built. The people who know about
            Black Sunday know. Everyone else walks past.
          </p>
        </Prose>
        <aside className="rounded-xl bg-white border border-volcanic-100 p-7 lg:sticky lg:top-24">
          <h3 className="font-display text-xl text-volcanic-900 mb-5">The numbers</h3>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-volcanic-500">
                People pulled from the water
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">~250</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-volcanic-500">
                Drowned
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">5</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-volcanic-500">
                Lifesavers in the water
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">70+</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-volcanic-500">
                Rescue operation duration
              </dt>
              <dd className="font-display text-2xl text-volcanic-900 mt-1">~3 hours</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-volcanic-500">
                Bondi lifesaving membership one year later
              </dt>
              <dd className="font-display text-2xl text-volcanic-900 mt-1">Doubled</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs italic text-volcanic-500">
            Sources: NSW State Library, Surf Life Saving Australia archives, the 1938 Sydney
            Morning Herald and Daily Telegraph coverage.
          </p>
        </aside>
      </div>
    </WideSection>
  );
}
