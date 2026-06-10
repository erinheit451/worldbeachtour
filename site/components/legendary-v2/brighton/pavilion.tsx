/**
 * Brighton → The Royal Pavilion (deep-dive spoke).
 */

import type { LegendaryPageBundle } from "../types";
import LegendaryShell from "../shell";
import Figure from "../primitives/figure";
import {
  BODY,
  BODY_SM,
  COOL,
  CREAM,
  EYEBROW,
  Fact,
  H3,
  PAPER,
  Section,
  SectionHeader,
  SpokeHero,
  SpokeProvenance,
  pickImage,
  renderInlineBold,
} from "../nazare/shared";
import {
  ClusterAside,
  ClusterLink,
  ClusterRail,
  SpokeCrossNav,
} from "./shared";

export default function BrightonPavilionPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const pavilion = pickImage(meta, "royal_pavilion");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="pavilion" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· The Royal Pavilion"
        title="A Mughal fantasy palace on the Sussex coast"
        kicker="A prince, an Indo-Islamic exterior, a chinoiserie interior, a kitchen the size of a parish church, and forty years of Regency theatre in a building that looks, at first glance, like it fell out of an 18th-century William Daniell etching of Lucknow."
        image={pavilion ?? meta.images.hero}
      />

      {/* --- How it got built --- */}
      <Section id="how-built" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· How It Got Built"
          title="Forty years, three architects, one dissolute prince"
          kicker="The Pavilion was not built as you see it. It was renovated into its current form across four decades — starting as a classical villa, acquiring a Chinese interior, then an Indian exterior, and finally becoming the Nash masterpiece you can visit today."
        />

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>Phase 1 · Henry Holland's villa (1787)</h3>
          <p className={BODY}>
            In 1787 the <strong>Prince of Wales</strong> — the future
            George IV, then 25, already deeply in debt and deeply in love
            with the actress Mrs Fitzherbert — commissioned{" "}
            <strong>Henry Holland</strong> to build a modest classical
            residence at Brighton. Holland (1745–1806) was a competent
            but not unusual Regency architect; the building he produced
            was symmetrical, bow-fronted, white stucco, Greek-ionic, and
            almost entirely unremarkable. A London merchant's
            seaside-villa. The Prince lived in this version for a
            decade without much commentary.
          </p>

          <h3 className={`${H3} mt-6`}>Phase 2 · The Chinese interior (1801–1804)</h3>
          <p className={BODY}>
            Around 1801 the Prince acquired a substantial collection of{" "}
            <strong>Chinese wallpaper</strong> — hand-painted silk,
            purchased through London dealers from the Canton trade. He
            had no particular place to put it. His response was to order
            the Brighton villa redecorated to accommodate it. Between
            1801 and 1804, the ground-floor interiors were reworked
            into a theatrical chinoiserie register — gilded dragons,
            bamboo-patterned plasterwork, red lacquer panelling, lotus
            chandeliers. The exterior was still Holland's white stucco
            classical villa at this point. The disjunction between a
            sober Greek-fronted English seaside house and a Chinese
            fantasy interior was the Pavilion's condition for fifteen
            years.
          </p>

          <h3 className={`${H3} mt-6`}>Phase 3 · Humphry Repton and the Indian proposal (1805–1808)</h3>
          <p className={BODY}>
            In 1805 the Prince commissioned the landscape designer{" "}
            <strong>Humphry Repton</strong> to propose a replacement
            exterior to match the Chinese interior. Repton's brief, in
            his famous <em>Red Book</em> of watercolor proposals, was to
            draw architecture inspired by the{" "}
            <strong>Mughal palaces of India</strong> — specifically the
            illustrations of William and Thomas Daniell's{" "}
            <em>Oriental Scenery</em>, published 1795–1808, which had
            become fashionable in London elite collections. Repton's
            scheme — onion domes, chhatris, minarets, Moorish arches —
            was approved by the Prince but not executed for nearly a
            decade; the Napoleonic Wars, the Prince's mounting debts,
            and the practical difficulties of constructing large domes
            on the existing Holland-villa structure intervened.
          </p>

          <h3 className={`${H3} mt-6`}>Phase 4 · John Nash's rebuild (1815–1822)</h3>
          <p className={BODY}>
            In 1815, with the Napoleonic Wars over and the Regent (as
            George now was, since 1811) restored to some political
            relevance, the Pavilion commission passed to{" "}
            <strong>John Nash</strong>. Nash (1752–1835) was the Regency
            era's most important architect — the master-planner of{" "}
            <strong>Regent Street</strong>, the designer of Regent's
            Park and the John Nash terraces around it, and the single
            most-influential figure in the look of Regency London. His
            Brighton Pavilion commission was to execute Repton's
            Indo-Islamic exterior but more ambitiously — larger domes,
            more elaborate minarets, a complete reworking of the
            building's silhouette.
          </p>
          <p className={BODY}>
            Nash's construction ran <strong>1815–1822</strong>. The
            structural engineering was substantially innovative: the
            main onion dome is a{" "}
            <strong>cast-iron internal frame</strong> covered with
            external plasterwork, a technique Nash was using in parallel
            at the Brighton's Chain Pier (also cast-iron, opened 1823,
            destroyed 1896). The minarets are similar: iron armatures,
            stone-and-plaster skins. The Pavilion's structure is, in
            this sense, a deeply Georgian-industrial building wearing an
            Indian-Mughal costume.
          </p>
        </div>
      </Section>

      {/* --- What to look at --- */}
      <Section id="interior" className={PAPER}>
        <SectionHeader
          eyebrow="· What to Look At"
          title="Five rooms and why each one matters"
          kicker="The Pavilion's interior is organised as theatrical progression — a visitor is meant to move through rooms that escalate in drama. The audio guide follows this route; so should you."
        />

        <div className="space-y-8 max-w-3xl">
          <RoomCard
            n="1"
            name="The Entrance Hall"
            body="A deliberately quiet beginning — pale-pink walls, classical mouldings, Chinese lantern detail only. Nash's design register was not to announce the building's chinoiserie at the door; the visitor is meant to turn a corner and be surprised."
          />
          <RoomCard
            n="2"
            name="The Long Gallery"
            body="The transition. Chinese wallpaper — original silk, restored — running the length of 50 meters of corridor, with gilded bamboo furniture and carved Chinese dragon figures. This is where the Pavilion shifts from English country house to something else."
          />
          <RoomCard
            n="3"
            name="The Banqueting Room"
            body="**The showpiece**. A 50-foot domed room with a one-ton cast-iron chandelier — a silver dragon holding a lotus chandelier — suspended from the ceiling on a single chain. Hand-painted Chinese trees climbing the walls, chinoiserie plasterwork, silver-gilt dining service. The table seats 40; George IV's dinners here routinely ran 30+ courses. The room is the most theatrical single interior in British royal architecture."
          />
          <RoomCard
            n="4"
            name="The Great Kitchen"
            body="Hidden behind the state rooms: a cast-iron-framed kitchen the size of a parish church, with four **cast-iron palm-tree columns** (designed by Marc Brunel) supporting the ceiling. Industrial-scale 19th-century food production for the banqueting. The kitchen is Nash's innovation — previously royal kitchens were service architecture, hidden; Nash made this one visible because the Prince liked showing his guests where the food came from."
          />
          <RoomCard
            n="5"
            name="The Music Room"
            body="The Pavilion's second showpiece — a domed red-and-gold room with hand-painted lotus ceiling, Chinese landscape wallpaper, a gilded bamboo organ case. George IV hired the Italian violinist Niccolò Paganini to play here in 1831; the room is acoustically peculiar and reportedly made Paganini's tone sound 'like water.'"
          />
        </div>
      </Section>

      {/* --- Post-royal history --- */}
      <Section id="post-royal" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· After the Royals"
          title="Queen Victoria's decision, the town's purchase, two World War hospitals"
          kicker="The Pavilion has been municipal property since 1850 — longer than it was royal property. The decisions made about it by the Brighton Town Commissioners and the modern Royal Pavilion & Museums Trust are the reason it still looks the way it does."
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            <strong>Queen Victoria</strong> visited the Pavilion only a
            handful of times and disliked it. It was too small for her
            growing family, insufficiently private, and — in her
            judgment — the wrong architectural register for the
            Victorian monarchy she was trying to establish. In{" "}
            <strong>1850</strong> she sold the building to the
            Brighton Town Commissioners for <strong>£50,000</strong>,
            stripping it of almost all its movable furniture, Chinese
            wallpaper, and silver-gilt collections (most of which went
            to Buckingham Palace and Windsor, where they remain).
            Victoria also had the building's domes flattened slightly
            and some of its more "excessive" chinoiserie painted over
            before the sale. The Pavilion you visit today has had
            roughly a century of restoration work to undo the
            Victorian-era depredations.
          </p>
          <p className={BODY}>
            In the First World War, the Pavilion was converted into a{" "}
            <strong>hospital for Indian Army soldiers</strong> wounded
            on the Western Front. Between December 1914 and January
            1916, roughly 2,300 Indian soldiers were treated there —
            the building's Indian architecture was explicitly cited by
            the War Office in the decision to use it, which is a
            characteristically Edwardian bit of logic (a British
            pastiche of Indian architecture, built by a king who'd
            never been to India, used to house Indian soldiers wounded
            fighting for the British Empire). Approximately{" "}
            <strong>53 soldiers died</strong> at the Pavilion hospital;
            a memorial <strong>Chattri</strong> — an Indian-style
            pavilion on the South Downs above Brighton — marks the
            cremation site of the Hindu and Sikh casualties.
          </p>
          <p className={BODY}>
            In World War II the building was briefly used as
            administrative offices for the Home Front effort. The
            post-war restoration program — formalised in 1982 under
            the current Royal Pavilion & Museums Trust management —
            has been reconstructing the George IV interiors room by
            room using the original Nash drawings, the original Chinese
            wallpaper samples (some held at the V&A, some at the
            Pavilion's own archive), and — in several cases — the
            actual Chinese wallpapers that Queen Victoria stripped in
            1850 and that the Royal Collection has since returned on
            long-term loan. The 2010s saw major restoration of the
            Great Kitchen and the Music Room specifically; both look
            substantially closer to their 1822 state now than they did
            in 1975.
          </p>
        </div>
      </Section>

      {/* --- Practical --- */}
      <Section id="practical" className={PAPER}>
        <SectionHeader
          eyebrow="· Practical"
          title="How to actually visit"
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start max-w-3xl">
          <div className="space-y-6">
            <ul className={`${BODY} list-disc pl-6 space-y-3`}>
              <li>
                <strong>Admission</strong>: £18 adult; £11 reduced;
                children under 5 free; Art Fund members free. Family
                tickets available.
              </li>
              <li>
                <strong>Opening hours</strong>: 9:30 a.m. to 5:30 p.m.
                summer; 10 a.m. to 5:15 p.m. winter. Closed 25–26
                December.
              </li>
              <li>
                <strong>Time budget</strong>: 90 minutes as an absolute
                minimum; 2–3 hours for a real visit. Groups with limited
                time frequently underestimate this.
              </li>
              <li>
                <strong>Audio guide</strong>: included in admission,
                genuinely worth using — the sequence of rooms was
                designed as theatrical progression and the audio guide
                keeps you on that path.
              </li>
              <li>
                <strong>Photography</strong>: permitted without flash in
                most rooms; restricted in a few.
              </li>
              <li>
                <strong>Best time to visit</strong>: first thing in the
                morning or last 90 minutes before closing. Midday tour
                buses crowd the Banqueting Room in peak summer.
              </li>
              <li>
                <strong>Café + tea in the garden</strong>: the Pavilion
                Gardens Café serves Regency-styled tea service £20–30
                per person; more reliable than the tour-bus cafés on the
                Steine.
              </li>
            </ul>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· Pavilion Facts</div>
            <dl className="space-y-5">
              <Fact label="Commissioned" value="1787 (first)" />
              <Fact label="Nash version" value="1815–1822" />
              <Fact label="Architect" value="John Nash" />
              <Fact label="Sold to Brighton" value="1850" />
              <Fact label="Indian military hospital" value="1914–1916" />
              <Fact label="Full restoration program" value="since 1982" />
              <Fact label="Admission" value="£18" />
              <Fact label="Annual visitors" value="~400,000" />
            </dl>
          </aside>
        </div>

        <ClusterAside>
          Main-page context — the two piers, the Regency seafront the
          Pavilion era built, and the town that grew up around it — is
          in <ClusterLink to="main" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="pavilion" />

      <SpokeProvenance
        bundle={bundle}
        note="Historical material follows Jessica Rutherford's Royal Pavilion: The Palace of George IV (Brighton Museums, 2nd ed.) and the Royal Pavilion & Museums Trust archive. Indian Military Hospital detail from the Imperial War Museum's 2014 centenary catalogue. Admission rates and opening hours as of 2026; verify at brightonmuseums.org.uk before travel."
      />
    </LegendaryShell>
  );
}

function RoomCard({
  n,
  name,
  body,
}: {
  n: string;
  name: string;
  body: string;
}) {
  return (
    <article className="border-l-2 border-[color:var(--beach-primary,#3A4E5C)] pl-6">
      <div className={`${EYEBROW} mb-2`}>{n}</div>
      <h3 className={`${H3} mb-2`}>{name}</h3>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}
