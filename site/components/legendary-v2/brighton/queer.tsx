/**
 * Brighton → Queer Brighton (honest-reckoning-expansion spoke).
 *
 * Treated with care. The UK's queer-capital history is celebratory and
 * long — Brighton was a refuge more than it was a site of persecution —
 * and the spoke honours that without flattening the complications.
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

export default function BrightonQueerPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "pride_2022") ??
    pickImage(meta, "kemptown") ??
    meta.images.hero;
  const kemptown = pickImage(meta, "kemptown");
  const pride = pickImage(meta, "pride_2022");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="queer" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Queer Brighton"
        title="The UK's oldest, largest, longest-running queer capital"
        kicker="Kemptown — a mile east of the Palace Pier — has been the center of British gay life for eighty years. Brighton's Pride is the largest in the UK. The Duke's Mound naturist beach was the country's first, legalized in 1980. This is the spoke that reads the town through the identity that made it."
        image={heroImage}
      />

      {/* --- What Kemptown is --- */}
      <Section id="kemptown" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Kemptown"
          title="The neighborhood and how to read it"
          kicker="Kemptown is not a gay neighborhood the way Chelsea or the Castro are gay neighborhoods. It is a Regency-era district of central Brighton that became queer-dominant in the mid-20th century and stayed that way through the 1967 decriminalization and into the modern era. The architecture predates the gay culture by 130 years; the gay culture has shaped the architecture since."
        />

        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              The neighborhood runs roughly from <strong>Old Steine</strong>{" "}
              in the west (at the eastern edge of the Pavilion Gardens)
              to <strong>Black Rock</strong> in the east (where the
              Brighton Marina now is), and from the seafront north to
              <strong> Queen's Park</strong>. The architectural core is
              a series of <strong>Regency terraces</strong> built between
              approximately <strong>1820 and 1840</strong> — the same
              generation as the seafront's Kings Road squares — on
              steep hills rising from Marine Parade. Grand in intention,
              quickly compartmentalized into flats and bedsits as the
              Victorian middle-class moved on.
            </p>
            <p className={BODY}>
              By the <strong>1940s</strong> Kemptown's cheap rents and
              discrete street geography had made it a refuge for
              Brighton's gay community. The UK's criminalization of
              male homosexual acts, in force from 1885 until the partial
              decriminalization of <strong>1967</strong>, made visible
              gay life dangerous in most British towns. Brighton — with
              its Regency tradition of licentiousness, its theatrical
              and hospitality industries, and its post-war housing
              availability — was one of the few cities where an
              informal gay culture could sustain itself at scale. The
              first documented openly gay pub, <strong>The Chequers</strong>,
              opened in Kemptown in the 1940s. The Brighton police's
              de facto tolerance — they did not run the kind of raids
              that Soho and Manchester saw — made the town the UK's
              effective gay capital throughout the 1950s and 60s,
              before the formal decriminalization of 1967 changed the
              playing field for other cities.
            </p>

            {kemptown && (
              <Figure
                image={kemptown}
                size="wide"
                tier="B"
                caption="A Kemptown street scene. Regency terraces on steep hills, black iron lampposts, pre-war pub signage, rainbow flags. The architectural character is 180 years older than the neighborhood's queer identity; both are present-tense."
              />
            )}

            <p className={BODY}>
              The <strong>Revenge</strong> club opened in 1981; the{" "}
              <strong>Legends</strong> club on Marine Parade opened in
              the same period. Both were, by the 1990s, Saturday-night
              landmarks on the European gay circuit — London-Brighton
              clubbing weekends were a standard format of the UK gay
              scene. <strong>The Marlborough</strong> (on Princes
              Street), <strong>The Queen's Arms</strong> (on George
              Street), <strong>Charles Street Tap</strong> (on St
              James's Street) were and are the long-running pub scene.
              Some of these venues have closed and reopened with
              different names over the decades; most have held their
              identity.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· Kemptown Timeline</div>
            <dl className="space-y-5">
              <Fact label="Regency terrace period" value="1820–1840" />
              <Fact label="The Chequers opened" value="1940s" />
              <Fact label="UK partial decriminalization" value="1967" />
              <Fact label="Duke's Mound naturist beach" value="1980" />
              <Fact label="Revenge opened" value="1981" />
              <Fact label="First Brighton Pride" value="1992" />
              <Fact label="Pride attendance today" value="~400,000" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- Duke's Mound --- */}
      <Section id="dukes-mound" className={PAPER}>
        <SectionHeader
          eyebrow="· Duke's Mound"
          title="The UK's first legalized naturist beach, and why it mattered"
        />

        <div className="space-y-6">
          <p className={BODY}>
            A mile east of the Palace Pier, where the undercliff walk
            passes beneath Marine Parade, is a small stretch of
            pebble beach called <strong>Duke's Mound</strong>. In
            1980, after approximately four decades of informal use and
            periodic police tension, <strong>Brighton & Hove Council</strong>{" "}
            formally designated the stretch as the{" "}
            <strong>United Kingdom's first legally tolerated
            naturist beach</strong>. This was nominally a
            clothing-optional-for-everyone designation. In practice, it
            was — and is — understood as a gay men's beach.
          </p>
          <p className={BODY}>
            The significance of the 1980 designation for Brighton was
            twofold. The first-order effect was legal clarification:
            what had been a de facto usage requiring nightly police
            forbearance became, after 1980, an explicitly protected
            public space. The second-order effect was cultural —
            Brighton's Council had, in 1980, become the first UK local
            authority to formally legitimize a piece of outdoor gay
            male space. The precedent mattered. Several other UK
            councils followed, slowly, through the 1980s and 90s. A
            substantial piece of the UK's outdoor LGBTQ+ public-space
            inventory traces to the Brighton decision.
          </p>
          <p className={BODY}>
            Duke's Mound today is still in operation. It is less
            heavily used than it was in the 1980s — the broader
            liberalization of UK society has reduced the function it
            served as one of few outdoor gay spaces. But it is still
            there, still protected, still signposted. A visitor who
            wants to see it should walk east from the Palace Pier
            along the lower undercliff path; it is a ten-minute walk.
            The etiquette is the etiquette of any naturist beach:
            don't photograph people, don't stare, don't approach. The
            beach is a working piece of Brighton's gay infrastructure,
            not a tourist curiosity.
          </p>
        </div>
      </Section>

      {/* --- The AIDS era --- */}
      <Section id="aids" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· The 1980s and 90s"
          title="AIDS, Section 28, and what Brighton did"
          kicker="The two decades between the first UK AIDS diagnoses in 1982 and the repeal of Section 28 in 2003 were the hardest period in modern British LGBTQ+ history. Brighton was hit disproportionately hard. It also organized disproportionately fast."
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            The first British AIDS diagnosis was made in{" "}
            <strong>late 1981</strong>; by the mid-1980s the epidemic
            had reached the UK's gay community at catastrophic scale.
            Brighton's disproportionate share of the UK's gay
            population — by 1985 it had one of the highest per-capita
            HIV rates in Britain — meant the town also carried a
            disproportionate share of the deaths. The annual loss
            during the peak years (1989–1996) was devastating; the
            Brighton Cemetery at Bear Road holds a substantial section
            of that generation.
          </p>
          <p className={BODY}>
            The civic response was unusually fast for a British town.
            The <strong>Sussex AIDS Centre and Helpline</strong> was
            founded in 1985 — one of the UK's earliest — and remains
            in operation as part of what became the{" "}
            <strong>Terrence Higgins Trust</strong> national network.
            Brighton's <strong>Claude Nicol Centre</strong> (named for
            the Victorian-era Brighton physician who pioneered
            community-based public-health work) provided free and
            anonymous HIV testing when such a service was rare
            elsewhere. By the late 1980s the town had a network of
            hospice provision, legal advocacy, and housing support
            that was by British standards exceptional.
          </p>
          <p className={BODY}>
            <strong>Section 28</strong> — the Thatcher-era statute,
            active 1988–2003, that prohibited "promotion of
            homosexuality" by local authorities and in schools — was
            openly opposed by Brighton & Hove Council. The town's
            libraries continued to stock LGBTQ+ material; the
            Pavilion & Museums service ran LGBTQ+ history programming
            through the Section 28 period that would have generated
            prosecution-risk elsewhere. The town was not always ahead
            of national progress, but it was substantially ahead of
            its local-authority peers.
          </p>
          <p className={BODY}>
            The first <strong>Brighton Pride</strong> — in{" "}
            <strong>1992</strong>, organized under Section 28 — was
            in this context an act of some political courage. Its
            subsequent growth to the UK's largest Pride is, in one
            reading, the town's continuation of a commitment that
            predates both the decriminalization and the public-health
            emergency that shaped it.
          </p>
        </div>
      </Section>

      {/* --- Pride today --- */}
      <Section id="pride" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Pride"
          title="What the first weekend of August actually looks like"
          kicker="Brighton & Hove Pride draws roughly 400,000 people across the first weekend of August — the parade, the Preston Park festival, the weekend of club nights. It is the UK's largest Pride. It is also a specific and particular kind of event that benefits from being understood in advance."
        />

        {pride && (
          <Figure
            image={pride}
            size="wide"
            tier="B"
            caption="Brighton Pride 2022. The parade runs from Hove to Preston Park; the Preston Park Pride festival runs Saturday afternoon through Sunday evening. Attendance approaches half a million across the weekend."
            className="mb-10"
          />
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <PrideCard
            slot="The Parade · Saturday morning"
            body="The parade route runs from **Hove Lawns** through central Brighton to **Preston Park**, a mile inland. ~100,000 people along the route. Start time is around 11 a.m.; the front of the parade reaches Preston Park by 1 p.m. Best viewing: Old Steine Gardens (central, near the Pavilion) or anywhere along North Street. Arrive by 10 a.m. for a decent spot."
          />
          <PrideCard
            slot="Preston Park Festival · Saturday afternoon through evening"
            body="The ticketed main event (£35–75 depending on tier). Multiple stages, big-name acts headlining. Historically: **Kylie Minogue, Britney Spears, Christina Aguilera, Mariah Carey**. The festival runs until roughly 10 p.m.; tickets sell out weeks ahead. Not for everybody — it's a mega-event. Smaller ticketed events in Kemptown clubs follow the evening."
          />
          <PrideCard
            slot="Village Party · Saturday night"
            body="St James's Street in Kemptown is closed to traffic and becomes a street festival; £10–15 entry wristband. The clubs — Revenge, Legends, Charles Street — run at full volume. This is the Pride night most visitors come for; it is also the night Kemptown genuinely fills with people."
          />
          <PrideCard
            slot="Sunday · Recovery + tea dances"
            body="Preston Park is cleaner than you'd expect by Sunday morning. The tea dance at the Marlborough or at the Brighton Dome (schedule varies by year) is the Sunday afternoon tradition. Most out-of-town visitors leave Sunday evening; the town takes roughly 72 hours to return to normal."
          />
        </div>

        <div className="mt-12 border-l-2 border-[color:var(--beach-supporting,#8B5A3C)] pl-6 max-w-3xl">
          <div className={`${EYEBROW} mb-3`}>· If You're Attending</div>
          <p className={BODY}>
            <strong>Book accommodation 4–6 months ahead.</strong> Hotel
            rates triple over Pride weekend. Many Kemptown B&Bs and
            Lanes hotels are block-booked by Pride operators.{" "}
            <strong>Book parade/festival tickets early.</strong> Large
            sections of the Saturday Preston Park festival sell out by
            June; same-day tickets are rarely available.{" "}
            <strong>Pace yourself</strong> — Pride weekend is a
            three-day event and trying to do all of it on day one is
            the most common mistake. <strong>Respect the protest
            strand</strong>: Pride began as a protest, not a party, and
            the Saturday march still has a banner-bearing front section
            that is a protest parade. Don't cheer for corporate floats
            if you wouldn't cheer for corporate anything; applaud the
            community groups genuinely.
          </p>
        </div>
      </Section>

      {/* --- Who's there --- */}
      <Section id="who" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Who Lives Here"
          title="The community beyond the pubs and the parade"
          kicker="Brighton's queer capital status is not just a nightlife economy. It is a resident community, a demographic layer of the city, and a set of institutions."
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            Brighton has, by several measures,{" "}
            <strong>the highest per-capita LGBTQ+ population of any
            UK city</strong>. The 2021 UK census — the first to ask a
            sexual-orientation question — recorded roughly{" "}
            <strong>10.7% of Brighton & Hove residents</strong> as
            identifying as lesbian, gay, bisexual, or other
            non-heterosexual orientation. The comparable London
            figure was 4.3%; the UK average 3.2%. Brighton's trans
            population is also disproportionately concentrated; the
            city has one of the UK's few specialist adult gender
            identity clinics.
          </p>
          <p className={BODY}>
            This demographic concentration is not only Kemptown. Queer
            Brighton extends through{" "}
            <strong>Hanover</strong> (the inland neighborhood just
            north of Kemptown, traditionally younger and more
            alternative), through <strong>Hove</strong> (where many
            older LGBTQ+ residents live for the quieter setting), and
            through the central Lanes district (where much of the
            LGBTQ+ retail, bookshops, and non-pub social
            infrastructure is located). A visitor who only reads
            Kemptown is reading ten percent of queer Brighton.
          </p>
          <p className={BODY}>
            Institutions: <strong>Allsorts Youth Project</strong>
            (LGBTQ+ youth support, since 1999), <strong>LGBT Switchboard
            Brighton</strong> (helpline and support, since 1974 as
            Brighton Gay Switchboard), <strong>Lunch Positive</strong>{" "}
            (for people living with HIV, weekly community lunch since
            2009), the <strong>Marlborough Productions</strong>{" "}
            theatre company (trans- and queer-focused, residency at The
            Marlborough pub's theatre space), the <strong>Brighton
            Ourstory Project</strong> (community LGBTQ+ history
            archive, since 1989 — one of the UK's oldest community-led
            queer-history projects).
          </p>
          <p className={BODY}>
            What all of this means for a visitor: the Kemptown scene
            you encounter in July 2026 is the top layer of an
            eighty-year-old community with formal institutions,
            accumulated knowledge, and real continuity.{" "}
            <strong>Leave money in the community.</strong> Drink at
            owner-operated local pubs rather than chain venues,
            attend a Marlborough Productions show, buy a book at Queer
            Lit on Gardner Street, donate to Allsorts or Lunch
            Positive. The Brighton queer economy's sustainability is
            the mechanism that keeps it being Brighton.
          </p>
        </div>

        <ClusterAside>
          Main-page context — the Pavilion, the piers, the Regency
          town that shaped the neighborhood architecture — is in{" "}
          <ClusterLink to="main" />. Practical trip logistics are in{" "}
          <ClusterLink to="visiting" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="queer" />

      <SpokeProvenance
        bundle={bundle}
        note="Historical material follows the Brighton Ourstory Project's published community oral history (since 1989), the LGBT Switchboard Brighton fiftieth-anniversary retrospective (2024), and the Royal Pavilion & Museums Trust's LGBTQ+ history programme catalogues. Kemptown venue status current as of 2026; verify current opening for specific pubs before a visit, as the post-pandemic hospitality churn has affected several long-standing names. Pride logistics reflect the 2026 programme — verify event schedule at brighton-pride.org."
      />
    </LegendaryShell>
  );
}

function PrideCard({ slot, body }: { slot: string; body: string }) {
  return (
    <article className="rounded-sm border border-[#E7E2D4] bg-white p-6">
      <div className={`${EYEBROW} mb-3`}>{slot}</div>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}
