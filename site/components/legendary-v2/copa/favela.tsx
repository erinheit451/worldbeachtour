/**
 * Copacabana → The Favela Above (honest-reckoning expansion spoke).
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

export default function CopaFavelaPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "context_mirante") ??
    pickImage(meta, "context_plano") ??
    meta.images.hero;
  const plano = pickImage(meta, "context_plano");
  const mirante = pickImage(meta, "context_mirante");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="favela" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· The Favela Above"
        title="Cantagalo, Pavão-Pavãozinho, and the inequality that is the view"
        kicker="Rio's two most famous beach neighborhoods — Copa and Ipanema — sit directly below three specific favelas on the granite hills behind. The luxury apartments face the beach. The favela stairs climb the hills behind the apartments. This is the literal visual geography of Rio. This spoke treats it specifically."
        image={heroImage}
      />

      {/* --- Three favelas, one hillside --- */}
      <Section id="three" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· The Three"
          title="Cantagalo, Pavão-Pavãozinho, Vietnã"
          kicker="Three adjacent favelas occupy the slopes between Copacabana and Ipanema, rising to approximately 200 meters above sea level. They are administratively distinct and each has a specific history; to a visitor looking up from the beach they form one continuous urban texture on the hills."
        />

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>Cantagalo</h3>
          <p className={BODY}>
            The largest of the three. Cantagalo occupies the slopes
            on the south side of the ridge — visible from Ipanema's
            Posto 9 and from the Copa Posto 6 end. Population roughly{" "}
            <strong>10,000</strong>. Established in the late 19th
            century when freed enslaved Brazilians and internal
            migrants settled on the then-unoccupied hills above the
            Zona Sul. Grew substantially through the 20th century.
            Formally incorporated into Rio municipal records in the
            1930s.
          </p>

          <h3 className={`${H3} mt-6`}>Pavão-Pavãozinho</h3>
          <p className={BODY}>
            On the north side of the ridge, visible from Copa's
            middle stretch. Population roughly <strong>7,000</strong>.
            Named for the peacock rock formation on the slopes. The
            neighborhood's modern form dates from post-WWII internal-
            migration waves that brought workers from the Brazilian
            northeast to Rio. Shares community infrastructure with
            Cantagalo; the two favelas are often treated as a single
            community in municipal programs.
          </p>

          <h3 className={`${H3} mt-6`}>Vietnã</h3>
          <p className={BODY}>
            The smallest and highest. Population roughly{" "}
            <strong>1,500</strong>. Sits at the apex of the ridge.
            Named during the 1960s after the then-current Vietnam War —
            a reference to the difficulty of municipal authority in
            reaching the summit. Genuinely remote from the beach
            economy; the walk down to Ipanema is steep.
          </p>
        </div>
      </Section>

      {/* --- The UPP arc --- */}
      <Section id="upp" className={PAPER}>
        <SectionHeader
          eyebrow="· The UPP"
          title="Pacification — December 2009 to the current collapse"
          kicker="The Pacifying Police Units (UPPs) were a Rio state-police program launched in 2008 — a deliberate attempt to reoccupy favelas that had been under the de facto administration of drug-trafficking organizations for two decades. Cantagalo-Pavão-Pavãozinho was the 11th UPP installation, on 23 December 2009. The program's arc over the subsequent 15 years is a real story."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <h3 className={H3}>2008–2012 · The installation</h3>
            <p className={BODY}>
              The <strong>Unidade de Polícia Pacificadora</strong>{" "}
              model was pioneered at Santa Marta favela in November
              2008. The model: Rio state-police BOPE (special
              operations) units would enter a favela, secure it from
              trafficking-organization control, and then install a
              permanent community-policing UPP with regular officers
              who lived and worked in the neighborhood. Cantagalo-
              Pavão-Pavãozinho-Vietnã was designated for UPP on{" "}
              <strong>23 December 2009</strong>.
            </p>
            <p className={BODY}>
              The <strong>early years were genuinely transformative</strong>.
              By mid-2012 Pavão-Pavãozinho's recorded unemployment
              had dropped to approximately 5% (from much higher
              baselines); residents reported freedom of movement
              they hadn't had in decades; municipal services
              (garbage collection, water, electricity) reached the
              upper reaches of the favela for the first time;
              community tourism initiatives launched. The federal
              government's 2011 Plano de Aceleração do Crescimento
              (Growth Acceleration Plan) directed substantial
              infrastructure investment into the pacified favelas,
              including the Plano Inclinado project.
            </p>

            <h3 className={`${H3} mt-6`}>2013–2016 · The high water</h3>
            <p className={BODY}>
              The <strong>Rio 2016 Olympics preparation</strong> drove
              a massive round of UPP expansion through 2013–2015;
              by the Games, 37 UPPs covered approximately 1.5
              million Rio residents. International coverage of the
              program was broadly positive through this period.
              Academic analysis was more mixed — scholars pointed
              to uneven enforcement, tensions with residents'
              customary autonomy, and specific incidents of police
              violence (notably the April 2014 killing of dancer
              Douglas Rafael da Silva Pereira in Pavão-Pavãozinho)
              that triggered community protests.
            </p>

            <h3 className={`${H3} mt-6`}>2017–present · Decline</h3>
            <p className={BODY}>
              Rio's <strong>fiscal crisis of 2016–2018</strong> — a
              state-level budget collapse driven by falling oil
              royalties, the 2016 impeachment of Dilma Rousseff, and
              the federal austerity that followed — led to severe
              cuts to the UPP program. Officers went unpaid for
              months at a time in 2017–2018; posts were reduced in
              staffing; some were abandoned entirely.
              Trafficking organizations returned to de facto
              administration of several favelas. As of 2026 the UPP
              in Cantagalo-Pavão-Pavãozinho-Vietnã is{" "}
              <strong>nominally operational but substantially
              degraded</strong>; the exact status fluctuates and
              residents report effective conditions that vary by
              street and by week. The community is safer than it
              was in 2008 but meaningfully less safe than it was in
              2012.
            </p>

            <p className={BODY}>
              The honest frame: the UPP program was an{" "}
              <strong>unfinished experiment</strong>. It produced
              real short-term gains in specific communities; it
              depended on funding and political will the Rio state
              could not sustain past its first decade; its
              long-term legacy is ambiguous. The community's own
              assessment varies sharply by age, by position, and by
              which week you ask.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· The UPP Record</div>
            <dl className="space-y-5">
              <Fact label="First UPP installed" value="Santa Marta, 2008" />
              <Fact label="Cantagalo UPP installed" value="23 Dec 2009" />
              <Fact label="Cantagalo population" value="~10,000" />
              <Fact label="Pavão-Pavãozinho pop." value="~7,000" />
              <Fact label="Vietnã pop." value="~1,500" />
              <Fact label="Total UPPs by 2016" value="37" />
              <Fact label="Residents covered" value="~1.5 million" />
              <Fact label="Rio state fiscal crisis" value="2016–2018" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- The Plano Inclinado --- */}
      <Section id="plano" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· The Plano Inclinado"
          title="A free two-minute ride into the hill most tourists never take"
          kicker="One specific piece of 2010-era municipal infrastructure lets a visitor see the favela geographically and non-exploitatively: a free inclined elevator that runs from the Ipanema metro station directly up into Cantagalo, reaching a public viewpoint at the top."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              The <strong>Plano Inclinado do Morro Cantagalo</strong>{" "}
              is a municipal inclined elevator built alongside the
              2010 Metro Rio expansion (Line 2 work that connected
              Ipanema to Barra). It runs from the{" "}
              <strong>General Osório metro station</strong> in
              Ipanema up the south face of the Cantagalo ridge to
              the favela residential neighborhood, a vertical rise
              of approximately <strong>75 meters</strong> in a
              ride of roughly <strong>two minutes</strong>.
            </p>
            <p className={BODY}>
              The Plano Inclinado is <strong>free</strong>. No
              ticket is required; you enter at the metro station or
              at the upper Cantagalo terminal. It operates 6 a.m.
              to 10 p.m. Monday through Saturday, shorter Sunday
              hours. The cars run every 4–5 minutes; the wait is
              rarely long.
            </p>

            {plano && (
              <Figure
                image={plano}
                size="wide"
                tier="B"
                caption="The Plano Inclinado at Cantagalo — free municipal inclined elevator connecting Ipanema's General Osório metro station to the favela's residential core. Two-minute ride; 75-meter vertical rise. Operational since 2010."
              />
            )}

            <h3 className={`${H3} mt-6`}>What's at the top</h3>
            <p className={BODY}>
              The upper terminus deposits you on a{" "}
              <strong>public plaza</strong> at the edge of
              Cantagalo's residential core. From the plaza, a short
              walk (50 meters, paved path) reaches the{" "}
              <strong>Mirante do Pavão-Pavãozinho</strong> — a
              public viewpoint installed by the Prefeitura in
              2013. The Mirante has a railing, a small
              interpretation panel, and an uninterrupted view of:
            </p>
            <ul className={`${BODY} list-disc pl-6 space-y-2`}>
              <li>The full arc of Ipanema (directly below)</li>
              <li>The full arc of Copacabana</li>
              <li>Leblon to the west</li>
              <li>Pão de Açúcar in the middle distance east</li>
              <li>
                The Atlantic horizon, the barges offshore, and —
                on clear days — the islands 10 km out
              </li>
            </ul>
            <p className={BODY}>
              Most tourists never make it here. The few who do
              generally rate it <strong>the best viewpoint in the
              Zona Sul</strong>, and they are probably right. The
              view is different from Sugarloaf or Cristo Redentor
              because you are <em>low enough</em> to see the beaches
              as beaches rather than as abstractions.
            </p>

            {mirante && (
              <Figure
                image={mirante}
                size="wide"
                tier="B"
                caption="The Mirante do Pavão-Pavãozinho — the public viewpoint at the top of the Plano Inclinado. The view covers Ipanema, Copacabana, Leblon, and on clear days the offshore islands."
              />
            )}
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· The Ride</div>
            <dl className="space-y-5">
              <Fact label="Cost" value="Free" />
              <Fact label="From" value="General Osório metro" />
              <Fact label="Ride duration" value="~2 minutes" />
              <Fact label="Vertical rise" value="~75 m" />
              <Fact label="Operating hours (M–Sa)" value="6 a.m.–10 p.m." />
              <Fact label="Hours (Sun)" value="Reduced" />
              <Fact label="Opened" value="2010" />
              <Fact label="Mirante at top" value="Free, public" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- How to visit --- */}
      <Section id="how-to-visit" className={PAPER}>
        <SectionHeader
          eyebrow="· How to Visit"
          title="Four practices, not vibes"
          kicker="The general 'respect the favela' advice is meaningless without specifics. Below is concrete."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Practice
            n="1"
            title="Take the Plano Inclinado as your default"
            body="The viewpoint at the top gives you the geography of the favela and the beach together, on Ipanema's ground, without any paid guide, without intruding on residents' daily lives beyond the brief shared-elevator ride. This is the respectful baseline Rio visitor-to-favela-visitor practice."
          />
          <Practice
            n="2"
            title="If you want a deeper visit, go via a community cooperative"
            body="**Favela Inc.**, **Favela Walking Tour**, and **Rocinha Original Tour** are community-led tour cooperatives operating in Rio. They are run by residents, revenue stays in the community, and the guiding is done by people who live there. Reserve ahead; respect guide instructions about photography and where to walk."
          />
          <Practice
            n="3"
            title="Don't book a 'favela safari' via a hotel concierge"
            body="Standard hotel tour packages to favelas — run by for-profit non-community operators, typically driving through in jeeps with foreign tourists — are widely rejected by community leaders as **'poverty tourism'**. They are also usually more expensive and less informative than community-led alternatives. Avoid."
          />
          <Practice
            n="4"
            title="Eat at the Mirante café, buy art from community studios"
            body="Small cafés, art studios, and community-run shops operate at the upper Plano Inclinado terminus and on the adjacent streets. Buying a coffee, a meal, or a handmade piece of art leaves money in the community in a direct, low-friction way. The Prefeitura keeps a rotating public-art program on the upper-favela streets that visiting artists contribute to; the walls are worth a photograph."
          />
        </div>

        <ClusterAside>
          The main page's honest-context treatment — the sightlines,
          the UPP baseline, the inequality-is-the-view frame — is
          summarized on <ClusterLink to="main" />. This spoke is the
          full detail that summary points at.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="favela" />

      <SpokeProvenance
        bundle={bundle}
        note="UPP program detail follows Instituto de Segurança Pública do Rio de Janeiro published statistics and Beatriz Jaguaribe's Rio de Janeiro: Urban Life through the Eyes of the City (2014). Community-tour cooperative directory via Favela Inc., Favela Walking Tour, and similar community organizations. Plano Inclinado operational details from MetrôRio. Population figures via IBGE 2022 census; favela populations are notoriously undercounted and these figures are conservative. For current UPP operational status — which varies month-to-month — consult Brazilian press and community-based observers rather than relying on pre-published data."
      />
    </LegendaryShell>
  );
}

function Practice({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <article className="border-l-2 border-[color:var(--beach-primary,#1A1A1A)] pl-6">
      <div className={`${EYEBROW} mb-2`}>{n}</div>
      <h3 className={`${H3} mb-2`}>{title}</h3>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}
