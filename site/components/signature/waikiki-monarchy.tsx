/**
 * Waikīkī signature section: The monarchy, Pearl Harbor, and the layers
 * of 20th-century history that sit under the sand.
 *
 * Why this is Waikīkī's second signature: Waikīkī is two miles from ʻIolani
 * Palace, ten kilometers from Pearl Harbor, and eight kilometers from the
 * USS Arizona Memorial. The beach is inside a geography of 20th-century
 * American history and a 19th-century Hawaiian monarchy. Both are visible
 * from the sand if you know how to look.
 */

import {
  Section,
  SectionHeader,
  Prose,
  Caption,
  type SectionImage,
} from "@/components/showcase/legendary-beach";

export default function WaikikiMonarchy({
  liliuokalaniImage,
  palaceImage,
  pearlHarborImage,
}: {
  liliuokalaniImage?: SectionImage;
  palaceImage?: SectionImage;
  pearlHarborImage?: SectionImage;
}) {
  return (
    <Section id="monarchy" className="bg-volcanic-900 text-volcanic-50" dark>
      <SectionHeader
        eyebrow="· Monarchy & Memory"
        title="Waikīkī sits inside two histories"
        kicker="The 19th-century Hawaiian kingdom. The 20th-century American Pacific. Both are visible from the beach if you know where to look."
        dark
      />
      <Prose dark>
        <p>
          <strong>ʻIolani Palace</strong> is a ten-minute drive inland from Waikīkī. It is the only royal
          palace on U.S. soil. Built in 1882 by King <strong>Kalākaua</strong> — the monarch who dedicated
          Kapiʻolani Park at the eastern end of the beach to his queen — the palace had electric light before
          the White House did and telephones before the British royals. The throne room is preserved. So is
          the upstairs bedroom where, after the 1893 overthrow, Queen <strong>Liliʻuokalani</strong> was held
          under house arrest for eight months. She wrote a quilt during her confinement. It is on display.
        </p>
        <p>
          The overthrow itself was quick. On <strong>17 January 1893</strong>, a group of American and
          European businessmen — sugar planters, mostly, calling themselves the Committee of Safety — declared
          the monarchy deposed. U.S. Marines from the USS <em>Boston</em> had landed the day before, ostensibly
          to protect American lives. Liliʻuokalani, rather than order her soldiers to fight the U.S. military,
          yielded her authority to what she believed would be U.S. restoration. President Grover Cleveland
          called the overthrow an illegal act and tried to restore her. Congress overruled him. In 1898, at
          the close of the Spanish-American War, the U.S. annexed Hawaiʻi via joint resolution. The 21,269
          Native Hawaiian signatures on the <strong>Kuʻe Petitions</strong> — more than half the indigenous
          population at the time, protesting annexation — were filed away. They were recovered from the
          National Archives in 1997.
        </p>
        {liliuokalaniImage && (
          <figure className="my-8 overflow-hidden rounded-xl bg-volcanic-800 max-w-md">
            <img
              src={liliuokalaniImage.thumbnail || liliuokalaniImage.url}
              alt={liliuokalaniImage.title}
              className="w-full h-auto"
            />
            <figcaption className="p-3 bg-volcanic-950 border-t border-volcanic-700">
              <Caption>
                {liliuokalaniImage.title} · {liliuokalaniImage.license}
              </Caption>
            </figcaption>
          </figure>
        )}
        <p>
          On <strong>7 December 1941</strong> at 7:48 a.m., the first Japanese attack aircraft crossed Oʻahu
          heading for Pearl Harbor, eight miles west of Waikīkī. 2,403 American servicemembers and civilians
          died that morning. The USS <em>Arizona</em> still lies where it sank — oil seeps from its hull at
          the rate of about a quart a day, a visible reminder called the "black tears of the Arizona." The
          memorial above it opened in 1962. It is one of the most-visited sites in Hawaiʻi; a free ferry
          runs from the visitor center at the edge of the base.
        </p>
        <p>
          Waikīkī itself spent the war strung with barbed wire. Hotels were requisitioned for military
          rest-and-recreation leave. The Royal Hawaiian became a Navy submarine R&R center; the Moana housed
          officers. When the barbed wire came down in 1945 and the civilian tourists returned, they found a
          beach that had been, briefly, a forward operating base. Some of the bunkers are still visible at
          Fort DeRussy. The military presence has not ended; the Pacific Fleet still runs out of Pearl, and
          tens of thousands of service members take beach time at Waikīkī every year.
        </p>
        {pearlHarborImage && (
          <figure className="my-8 overflow-hidden rounded-xl bg-volcanic-800 max-w-2xl">
            <img
              src={pearlHarborImage.thumbnail || pearlHarborImage.url}
              alt={pearlHarborImage.title}
              className="w-full h-auto"
            />
            <figcaption className="p-3 bg-volcanic-950 border-t border-volcanic-700">
              <Caption>
                {pearlHarborImage.title} · {pearlHarborImage.license}
              </Caption>
            </figcaption>
          </figure>
        )}
        <p>
          <strong>Hawaiʻi became the 50th state in 1959.</strong> The statehood vote had only two options on
          the ballot — statehood or territorial status. Independence, the other legal post-colonial option
          under UN frameworks, was not offered. Native Hawaiian sovereignty activists continue to contest
          the legal basis of the transition to U.S. statehood. In 1993, on the centennial of the overthrow,
          Congress issued a formal apology — Public Law 103-150 — acknowledging that Native Hawaiians "never
          directly relinquished their claims to their inherent sovereignty as a people over their national
          lands."
        </p>
        <p>
          <strong>Waikīkī is a beach. It is also the shoreline of all of this.</strong> The surfers paddling
          out at Queens in the morning are passing the Royal Hawaiian, built on former Crown Lands. The
          tourists walking to ʻIolani Palace in the afternoon are walking from one history into another. The
          barefoot bar that is Duke's opens at 4 p.m. with a view of the Rainbow Tower, which stands on fill
          that buried the Kaliʻa fishponds where the royal family once harvested mullet. All of this is true
          at the same time. A page that tells you Waikīkī is just a nice beach is not a page telling you the
          truth.
        </p>
      </Prose>
    </Section>
  );
}
