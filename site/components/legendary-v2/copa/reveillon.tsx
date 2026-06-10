/**
 * Copacabana → Réveillon (New Year's Eve spoke).
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

export default function CopaReveillonPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage = pickImage(meta, "nye") ?? meta.images.hero;
  const nye = pickImage(meta, "nye");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="reveillon" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Réveillon"
        title="The world's largest New Year's Eve"
        kicker="Three million people, 4 kilometers of sand, white clothes, fireworks on barges offshore, Candomblé offerings pushed into the surf at midnight, and a city that has organized its Réveillon for a century with genuine operational skill. If you are considering being here for 31 December, this page is the reason to and the how to."
        image={heroImage}
      />

      {/* --- What it is --- */}
      <Section id="what" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· The Event"
          title="Guinness-certified, 2025"
          kicker="Attendance at Copa's Réveillon has grown over the last century from tens of thousands in the mid-20th century to 3 million on recent peak years. In December 2025, Guinness World Records formally certified the celebration as the world's largest New Year's Eve event."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              The practice of gathering at the beach on 31 December
              goes back in Rio at least to the 1940s, when Carioca
              middle-class families would bring picnics to the sand
              and watch the midnight fireworks that some hotels ran
              off their rooftops. The scale began growing in the 1960s
              and 70s; by the 1980s the Prefeitura of Rio formalized
              the event by adding a municipal fireworks program on
              offshore barges, infrastructure for public toilets and
              water stations, and a beach-wide lighting plan that
              turned the event into a coordinated civic spectacle.
            </p>
            <p className={BODY}>
              Modern Réveillon attendance figures are tracked by the
              Prefeitura's tourism agency <strong>Riotur</strong>:{" "}
              <strong>2.5 million in 2015</strong>,{" "}
              <strong>3 million in 2024</strong>, similar in the 2025
              peak. The attendance spans the full Copa arc from Leme
              to the Forte plus substantial overflow along Ipanema
              and Leblon. <strong>Guinness World Records certified</strong>{" "}
              the 2025 event as the world's largest documented NYE
              celebration — ahead of Times Square, Sydney Harbor, and
              the London Embankment. The certification was the
              culmination of several years of Rio municipal lobbying
              and a painstaking attendance-methodology audit.
            </p>

            <h3 className={`${H3} mt-6`}>The fireworks</h3>
            <p className={BODY}>
              The Copa Réveillon fireworks are launched from{" "}
              <strong>11 barges</strong> anchored approximately 400
              meters offshore along the length of the beach. The
              show runs roughly <strong>12 minutes</strong> starting
              at midnight, with 24 tonnes of pyrotechnics discharged
              in a choreographed program. The municipal investment
              runs roughly <strong>R$15–20 million</strong> annually.
              Scale-wise, it is comparable to the Sydney Harbour NYE
              fireworks; the immersion of the audience — standing
              on the beach within 400 meters of the barges, the sky
              filling the whole field of vision — is distinct.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· Réveillon Numbers</div>
            <dl className="space-y-5">
              <Fact label="Peak attendance (2025)" value="3 million" />
              <Fact label="Guinness certification" value="Dec 2025" />
              <Fact label="Fireworks barges" value="11" />
              <Fact label="Pyrotechnics total" value="24 tonnes" />
              <Fact label="Show duration" value="~12 minutes" />
              <Fact label="Municipal budget" value="R$15–20M" />
              <Fact label="Beach-arc length" value="4 km" />
              <Fact label="Public toilets deployed" value="~600 portable" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- White and Yemanjá --- */}
      <Section id="yemanja" className={PAPER}>
        <SectionHeader
          eyebrow="· White Clothing and Yemanjá"
          title="The Candomblé tradition most visitors don't know they're participating in"
        />

        <div className="space-y-6">
          <p className={BODY}>
            If you look at any Copa Réveillon photograph, nearly
            everyone is dressed in <strong>white</strong>. This is
            not a tourist gimmick, a fashion choice, or a municipal
            dress code. It is a <strong>Candomblé tradition</strong>{" "}
            honoring <strong>Yemanjá</strong>, the Afro-Brazilian
            orixá of the sea. The practice enters mainstream Rio NYE
            through the Candomblé and Umbanda religious traditions,
            both of which have deep roots in Rio's Afro-Brazilian
            communities.
          </p>
          <p className={BODY}>
            The specific ritual observed most visibly on the sand:
            practitioners bring <strong>offerings</strong> — white
            flowers (typically roses or lilies), perfume, small
            mirrors, rice, and occasionally full candle-lit wooden
            boats (<em>barquinhos de Iemanjá</em>) with small
            offerings inside — and at midnight push them out into
            the Atlantic. The prayer: if the offering returns to
            shore, Yemanjá has refused it; if the offering goes out
            to sea, it has been accepted and the prayer is granted.
            The three waves one is supposed to jump in sequence at
            midnight, each wave a wish, come from the same tradition.
          </p>
          <p className={BODY}>
            The white clothing: white is Yemanjá's color. Wearing
            white on the beach at midnight is a visual invocation
            of her presence. Cariocas who are not themselves
            Candomblé practitioners still wear white on NYE because
            the tradition is fully absorbed into secular Rio
            practice. A visitor unfamiliar with Afro-Brazilian
            religion need not pretend to be a practitioner to
            participate respectfully; the baseline is simply to
            <strong> wear white</strong>, to not step on offerings
            being set out on the sand (they look like small flower
            arrangements and candles — don't kick them), and to
            understand that you are in the presence of a living
            religious tradition, not a municipal aesthetic choice.
          </p>

          {nye && (
            <Figure
              image={nye}
              size="wide"
              tier="B"
              caption="Réveillon at Copa — white clothing, barge fireworks, and (not visible in this frame) Yemanjá offerings being pushed out into the surf at midnight. The religious tradition is absorbed into the civic event; both layers are present."
              className="my-8"
            />
          )}
        </div>
      </Section>

      {/* --- How to actually be here --- */}
      <Section id="how-to" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· How to Actually Be Here"
          title="The practical guide to surviving and enjoying 3 million people on a beach"
          kicker="Réveillon is one of the best mass events anywhere. It requires preparation. Below is the guide Cariocas pass to their first-time Réveillon visitors."
        />

        <div className="space-y-8 max-w-3xl">
          <PracticalItem
            n="1"
            title="Book accommodation 4–6 months ahead"
            body="Hotel rates triple for the Réveillon week. Many Copa beachfront hotels require a minimum 4-night stay over 28 December–2 January. By November the inventory is 90%+ booked. **Book by August if possible.** If you miss that window, look to Ipanema or Botafogo where stock is more available and the walk to the event is still reasonable."
          />
          <PracticalItem
            n="2"
            title="Wear white"
            body="As above. Any white clothes work — T-shirt and shorts are fine; dress-up is optional. Some Cariocas wear **specific colors over the white** for specific wishes (yellow for wealth, green for health, pink for love); most wear white only."
          />
          <PracticalItem
            n="3"
            title="Arrive by 9 p.m., not 11:30"
            body="The beach's access streets close to vehicles at 6 p.m. The Metro runs until past midnight but gets overwhelming by 10:30 p.m. **Arrive early, stake out your sand.** Most Cariocas set up on the beach by 7–8 p.m. with drinks and food and stay through the fireworks."
          />
          <PracticalItem
            n="4"
            title="Don't drive"
            body="All major access streets close to private vehicles on 31 December afternoon. Uber works but surge prices are extreme. Metro or walking from Ipanema / Leblon / Botafogo is the standard. Don't plan a post-midnight taxi; it won't work."
          />
          <PracticalItem
            n="5"
            title="Hotel-rooftop alternatives"
            body="If 3 million people on the sand sounds like too much, most Copa hotel rooftops run **ticketed Réveillon parties** — the Copacabana Palace's rooftop dinner is the canonical one (R$4,000+ per person), Fairmont's and other hotels run R$800–2,000 parties. The view is identical to the beach's; the crowd density is 0.1% of it."
          />
          <PracticalItem
            n="6"
            title="Keep your valuables minimal"
            body="A 3-million-person crowd attracts pickpocketing. Leave passport, credit cards, and anything non-essential at the hotel. Bring a phone (keep in a front pocket or zipped bag), a cash amount you can afford to lose, and the clothes you are in. Don't wear expensive jewelry."
          />
          <PracticalItem
            n="7"
            title="Post-midnight: pace yourself"
            body="After the fireworks end (~12:12 a.m.), the beach doesn't clear — crowds stay through 2–3 a.m., many stay until sunrise. If you are planning to last until 3 a.m., don't drink heavily before midnight. If you are planning to sleep at 1 a.m., start moving toward your hotel at 12:20."
          />
          <PracticalItem
            n="8"
            title="Sunrise on New Year's Day is the best-kept secret"
            body="Most Réveillon visitors leave the beach by 3 a.m. The sand from 5 to 7 a.m. on 1 January is strangely quiet, littered with the debris of the night before, and catches the first sunrise of the year over the Atlantic. **If you can stay up or wake up early, this is the hour that rewards the trip.** The first sun of the new year rising over a beach still dressed in white wreckage is a particular kind of Rio image."
          />
        </div>

        <ClusterAside>
          If you're planning an actual non-Réveillon Rio trip that
          happens to be in December, the wider logistics — getting
          here, where to stay, what else to do — are in{" "}
          <ClusterLink to="visiting" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="reveillon" />

      <SpokeProvenance
        bundle={bundle}
        note="Attendance figures and municipal logistics from Riotur and Prefeitura do Rio de Janeiro public data. Guinness certification per the Guinness World Records database (December 2025). Candomblé / Yemanjá religious detail follows Reginaldo Prandi's Segredos Guardados (Companhia das Letras, 2005) and the Sala de São Paulo Afro-Brazilian music / culture archive. For current-year Réveillon schedule, verify with Riotur (visit.rio) before travel; specific logistics shift year-to-year."
      />
    </LegendaryShell>
  );
}

function PracticalItem({
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
