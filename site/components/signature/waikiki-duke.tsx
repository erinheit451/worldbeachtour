/**
 * Waikīkī signature section: Duke Kahanamoku + the reintroduction of surfing.
 *
 * Why this is Waikīkī's first signature: every travel page calls Waikīkī "the
 * birthplace of modern surfing." Few say what that means specifically. Duke
 * Paoa Kahanamoku is the person; the beach boys of Waikīkī are the movement;
 * Freshwater Beach in Sydney and Southern California are the diffusion points.
 */

import {
  WideSection,
  SectionHeader,
  Prose,
  Caption,
  type SectionImage,
} from "@/components/showcase/legendary-beach";

export default function WaikikiDuke({
  statueImage,
  archivalImage,
}: {
  statueImage?: SectionImage;
  archivalImage?: SectionImage;
}) {
  return (
    <WideSection id="duke">
      <SectionHeader
        eyebrow="· Duke & the Beach Boys"
        title="Where modern surfing was reintroduced to the world"
        kicker="Duke Kahanamoku did not invent surfing — Hawaiians had been doing it for centuries. He is the reason everyone else came to know it."
      />
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
        <Prose>
          <p>
            <strong>Duke Paoa Kahanamoku</strong> was born in Honolulu on 24 August 1890, of Hawaiian ancestry
            through both parents. He grew up at Waikīkī — literally on this beach, swimming and paddling and
            riding the Queens break on koa-wood boards made by his uncles. In an era when the Hawaiian
            population was still recovering from 19th-century epidemics that had reduced it by more than 80%,
            the practice of <em>heʻe nalu</em> — surfing — had contracted to a handful of families still
            passing it down. Duke's family was one of them.
          </p>
          <p>
            In <strong>1912</strong>, he took a boat to Stockholm, won Olympic gold in the 100-meter freestyle,
            set a world record, and became — overnight — the first global Hawaiian celebrity. Over the next
            two decades he won more medals (1920, 1924), toured the mainland and Australia as a swimming
            exhibition star, and wherever he went, he brought a surfboard. On <strong>15 December 1914</strong>,
            at Freshwater Beach in Sydney, he gave the demonstration that is generally credited with introducing
            surfing to Australia. He did the same in Southern California. What had been a practice of a few
            Hawaiian families became — within twenty years of Duke's Olympic win — a global sport.
          </p>
          <p>
            Back at Waikīkī, Duke was never just a champion. He was one of the <strong>beach boys of Waikīkī</strong> —
            a loose collective of Hawaiian watermen (Hiram Anahu, Steamboat Mokuahi, Chick Daniels, Sam Kahanamoku,
            Rabbit Kekai, others) who worked the hotels as surf instructors, canoe captains, lifeguards, and
            entertainers. They played ukulele under the banyan at the Moana. They taught tourists how to stand
            up on a board. They were the original version of the tropical-beach-resort staff template that every
            island destination on Earth now copies, and they did it with complete Hawaiian cultural authority —
            because it was their beach.
          </p>
          {archivalImage && (
            <figure className="my-8 overflow-hidden rounded-xl bg-volcanic-100">
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
          <p>
            Duke died in 1968. A bronze statue was dedicated to him on Kalākaua Avenue in 2002, a nine-foot
            figure with arms outstretched in front of a longboard. It stands at the Kūhiō Beach end of the
            strip, directly across from the surf breaks he grew up on. <strong>Fresh flower leis appear on it
            every morning.</strong> Nobody who works at the hotels can tell you exactly who places them.
            Hawaiian cultural practitioners, the state parks department, and countless anonymous well-wishers
            simply ensure it never goes without.
          </p>
          <p>
            If you want to understand why Waikīkī is different from every other tourist beach — why a
            neighborhood of high-rise hotels still feels connected to something older than hotels — you can
            start with the leis on the Duke statue. Somebody keeps doing that, every day, because he is still
            theirs.
          </p>
        </Prose>
        {statueImage && (
          <figure className="overflow-hidden rounded-xl bg-volcanic-100 lg:sticky lg:top-24">
            <img
              src={statueImage.thumbnail || statueImage.url}
              alt={statueImage.title}
              className="w-full h-auto"
            />
            <figcaption className="p-3 bg-white border-t border-volcanic-100">
              <div className="font-display text-lg text-volcanic-900">The Duke</div>
              <Caption>
                {statueImage.title} · {statueImage.license}
              </Caption>
            </figcaption>
          </figure>
        )}
      </div>
    </WideSection>
  );
}
