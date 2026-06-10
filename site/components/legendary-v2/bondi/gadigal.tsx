/**
 * Bondi → Gadigal Country (honest-reckoning expansion spoke).
 *
 * Treated with the same register as Waikīkī's Mālama Hawaiʻi spoke.
 * The Gadigal sovereignty question is unresolved; this spoke works
 * carefully without closure.
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

export default function BondiGadigalPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "emu_rock_engraving") ?? meta.images.hero;
  const engraving = pickImage(meta, "emu_rock_engraving");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="gadigal" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Gadigal Country"
        title="Unceded land. A failed referendum. A living practice."
        kicker="Bondi is on Gadigal country — unceded land of the Eora Nation, one of several hundred Aboriginal nations whose territories cover the Australian continent. What that means in 2026, specifically and materially, is the subject of this spoke."
        image={heroImage}
      />

      {/* --- Sixty-five thousand years --- */}
      <Section id="sixty-five" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· 65,000 Years"
          title="Who the Gadigal are and how long they've been here"
          kicker="The dates matter. Aboriginal and Torres Strait Islander peoples have continuously inhabited what is now Australia for at least 65,000 years — possibly considerably longer. The Gadigal clan of the Eora Nation has held the Sydney coastal strip for most of that time."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              The <strong>Eora Nation</strong> is a coastal grouping of
              related Aboriginal clans whose traditional territory
              covered the stretch of coast from Botany Bay north to
              Pittwater, extending inland to the ridges above the
              Parramatta and Lane Cove rivers. Within the Eora, the{" "}
              <strong>Gadigal</strong> clan held the specific coastal
              strip from what is now Port Jackson south to what is
              now Bondi and Tamarama.
            </p>
            <p className={BODY}>
              Archaeological evidence for Gadigal occupation of the
              Sydney coast extends to at least{" "}
              <strong>20,000 years</strong> with strong confidence; the
              rising seas of the post-glacial period (roughly 15,000
              to 6,000 years ago) flooded out older coastal sites,
              which makes earlier dating difficult. The continental
              dating of Aboriginal presence — from sites like{" "}
              <strong>Madjedbebe</strong> in the Northern Territory —
              has been firmly pushed to{" "}
              <strong>at least 65,000 years</strong> in the last two
              decades of research, with several lines of evidence
              suggesting possibly 80,000+. The Gadigal on this
              headland, specifically, have been here since the coast
              itself took its current shape.
            </p>

            <h3 className={`${H3} mt-6`}>The name "Bondi"</h3>
            <p className={BODY}>
              The word <strong>Bondi</strong> is an anglicization of
              an Eora word. The standard attested readings are{" "}
              <em>boondi</em> meaning either:
            </p>
            <ul className={`${BODY} list-disc pl-6 space-y-3`}>
              <li>
                <strong>"Water breaking over rocks"</strong> — the
                descriptive reading, referring to the surf on the
                headlands bracketing the beach.
              </li>
              <li>
                <strong>"A place where a flight of nullas took place"</strong>{" "}
                — nullas being Aboriginal throwing sticks used for
                hunting or in ceremonial contests. This reading
                attests to a specific use of the Bondi area by Eora
                people for ceremonial or competitive practice.
              </li>
            </ul>
            <p className={BODY}>
              Both readings are in 19th-century settler records; both
              are maintained in current oral tradition. The name, in
              other words, is Gadigal and always has been — the town,
              the postcard, and the TV show's brand are all working
              on a piece of Aboriginal language.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· Dating</div>
            <dl className="space-y-5">
              <Fact label="Aboriginal continental presence" value="≥65,000 yrs" />
              <Fact label="Sydney coastal presence" value="≥20,000 yrs" />
              <Fact label="Eora Nation clans" value="~3 dozen" />
              <Fact label="Bondi = Gadigal word" value="confirmed" />
              <Fact label="First Fleet arrived" value="Jan 1788" />
              <Fact label="Gadigal population pre-1788" value="~100" />
              <Fact label="Smallpox killed" value="~50%, 1789–90" />
              <Fact label="Living descendants today" value="continuous" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- The rock engravings --- */}
      <Section id="engravings" className={PAPER}>
        <SectionHeader
          eyebrow="· The Rock Engravings"
          title="What is on the North Bondi clifftop, and how to see it respectfully"
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            A short walk north from the Bondi Surf Bathers' Life
            Saving Club, along the clifftop path toward Ben Buckler
            rock, there is a flat sandstone platform on the
            clifftop. If you know what you're looking for, there are{" "}
            <strong>Aboriginal rock engravings</strong> carved into
            it — kangaroos, marine animals, what may be a whale, and
            several human figures. They are unmarked. There is no
            signposting. This is deliberate.
          </p>
          <p className={BODY}>
            The engravings are part of the{" "}
            <strong>Sydney-region rock-art tradition</strong> — a
            corpus of roughly 4,000 documented engraved sites in the
            greater Sydney area, most concentrated in Ku-ring-gai
            Chase National Park to the north but extending through
            the eastern suburbs and down the coast. The technique —
            pecked outline figures in flat sandstone — is
            characteristic of the region and distinct from the
            ochre-painted rock shelters of northern Australia. Most
            Sydney-region engravings are <strong>1,500 to 5,000 years
            old</strong>; they are not the continent's oldest but
            they are among the best-preserved.
          </p>

          {engraving && (
            <Figure
              image={engraving}
              size="wide"
              tier="B"
              caption="A rock engraving at North Bondi. The Sydney-region tradition uses pecked outline figures in flat sandstone — distinctive from the northern Australian ochre-painted shelters."
            />
          )}

          <h3 className={`${H3} mt-6`}>Why they're unmarked</h3>
          <p className={BODY}>
            Waverley Council, after community consultation with
            Aboriginal heritage officers and the Metropolitan Local
            Aboriginal Land Council, made an explicit decision to
            leave the Bondi engravings unsignposted. The reasoning:
            signposting attracts unintentional damage (visitors
            stepping on the engravings, touching them for tactile
            exploration, cleaning them with water that dissolves
            the engraved surface). The unsignposted protocol has
            worked reasonably well at keeping the engravings intact
            through high-traffic decades.
          </p>

          <h3 className={`${H3} mt-6`}>If you go looking</h3>
          <p className={BODY}>
            The etiquette is specific:
          </p>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Do not walk on the engravings themselves.</strong>{" "}
              Walking on the sandstone in shoes wears down the pecked
              grooves. Stand on the surrounding rock, look from the
              edges.
            </li>
            <li>
              <strong>Do not touch.</strong> Skin oils and moisture
              accelerate weathering. This is a universal
              Aboriginal-heritage-site rule.
            </li>
            <li>
              <strong>Do not clean or "enhance" them for a photo.</strong>{" "}
              Pouring water onto an engraving to make it more visible
              is one of the primary ways the surface is damaged.
              Photograph them as they are, with whatever lichen and
              weathering they currently carry.
            </li>
            <li>
              <strong>If you are not sure which rocks are engraved</strong>
              — and at Bondi it is not always obvious — walk on the
              path, not on the sandstone platforms.
            </li>
            <li>
              <strong>The Waverley Council Aboriginal Heritage Walk</strong>{" "}
              — an occasional guided walk run by the Council with
              Aboriginal cultural officers — is the right way to see
              the engravings with interpretation. Schedule at
              waverley.nsw.gov.au.
            </li>
          </ul>
        </div>
      </Section>

      {/* --- The Uluru arc --- */}
      <Section id="uluru" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· The Uluru Arc"
          title="What 1992 started, what 2017 codified, what 2023 rejected"
          kicker="The legal status of Aboriginal sovereignty in Australia has been contested since 1788. The Mabo decision of 1992 ended the legal fiction of terra nullius; the Uluru Statement of 2017 proposed three specific reforms; the 2023 referendum rejected the first of them. The story is ongoing."
        />

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>1992 — Mabo and native title</h3>
          <p className={BODY}>
            Until <strong>1992</strong>, Australian common law held to
            the doctrine of <strong><em>terra nullius</em></strong> —
            the legal fiction that Australia had been an "empty land"
            at British colonization and therefore open to assertion
            of Crown sovereignty without need for treaty or recognition
            of prior ownership. The doctrine was overturned on{" "}
            <strong>3 June 1992</strong> by the High Court of Australia
            in <strong><em>Mabo v Queensland (No 2)</em></strong>. The
            case, brought by Torres Strait Islander{" "}
            <strong>Eddie Koiki Mabo</strong>, concerned land on Mer
            (Murray Island). The court's ruling recognized a form of
            <strong> native title</strong> surviving Crown sovereignty
            where continuous traditional connection to specific land
            could be demonstrated. This was a foundational legal
            shift.
          </p>

          <h3 className={`${H3} mt-6`}>1997 — Bringing Them Home</h3>
          <p className={BODY}>
            The <strong>Bringing Them Home</strong> report of 1997
            documented the <strong>Stolen Generations</strong>: the
            Australian government's policy, from the 1910s to the
            1970s, of forcibly removing Aboriginal and Torres Strait
            Islander children from their families and placing them in
            institutions or with white foster families. The report's
            findings were incontrovertible in their scale; the
            apology from the Australian Parliament — formally
            delivered by Prime Minister Kevin Rudd on{" "}
            <strong>13 February 2008</strong> — came a decade later.
          </p>

          <h3 className={`${H3} mt-6`}>2017 — the Uluru Statement</h3>
          <p className={BODY}>
            In May 2017, after eighteen months of regional dialogues
            across the country, a First Nations Constitutional
            Convention at the base of Uluru produced the{" "}
            <strong>Uluru Statement from the Heart</strong> — a
            consensus document from Aboriginal and Torres Strait
            Islander delegates requesting three reforms:
          </p>
          <ol className={`${BODY} list-decimal pl-6 space-y-3`}>
            <li>
              A <strong>constitutionally-recognized Voice to
              Parliament</strong> — a First Nations advisory body
              formally entrenched in the Australian Constitution,
              with the role of providing input on legislation that
              affects Aboriginal and Torres Strait Islander peoples.
            </li>
            <li>
              A <strong>Makarrata Commission</strong> to supervise
              treaty-making processes between First Nations peoples
              and Australian governments.
            </li>
            <li>
              A <strong>truth-telling commission</strong> to formally
              document the history of colonization and its
              consequences.
            </li>
          </ol>
          <p className={BODY}>
            The Statement was the most widely-endorsed First Nations
            political document in Australian history.
          </p>

          <h3 className={`${H3} mt-6`}>2023 — the referendum</h3>
          <p className={BODY}>
            On <strong>14 October 2023</strong>, Australia held a
            national referendum on the first of the Uluru reforms — a
            constitutional amendment to recognize Aboriginal and
            Torres Strait Islander peoples and establish the Voice to
            Parliament as an advisory body. The referendum required
            both a national majority and a majority in a majority of
            states to pass. It <strong>failed, 60.1% against to 39.9%
            in favor nationally</strong>. Every Australian state voted
            against; only the Australian Capital Territory voted in
            favor.
          </p>
          <p className={BODY}>
            The result was the <strong>definitive national-political
            event of the early 2020s in Australia</strong>. The
            reasons for the defeat are contested — disinformation
            campaigns, voter confusion about the specific proposal,
            partisan Opposition strategy, and a long history of
            Australian referendum failure (only 8 of 45 national
            referendums have passed since Federation in 1901) have
            all been cited. The defeat has not closed the Uluru
            arc — truth-telling work continues at the state level,
            treaty processes are under way in Victoria and the ACT
            — but the national Voice proposal is, for now,
            historically contested rather than institutionally
            realized.
          </p>
          <p className={BODY}>
            Bondi — the electorate of Wentworth, which covers the
            beach — voted <strong>52% Yes, 48% No</strong>, above the
            state and national No majority but below the Sydney
            inner-urban Yes swing. It is worth holding both facts
            together: the Bondi community voted Yes on the balance,
            but the national result that controls the beach's legal
            status was No.
          </p>
        </div>
      </Section>

      {/* --- How to visit --- */}
      <Section id="how-to-visit" className={PAPER}>
        <SectionHeader
          eyebrow="· How to Visit"
          title="Nine specific things, not vibes"
          kicker="The general 'respect Country' advice is meaningless without specifics. The below is concrete."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Practice
            n="1"
            title="Say the Acknowledgement of Country at the start of any event you run here"
            body="The standard Australian form: 'I acknowledge the Gadigal people of the Eora Nation, the traditional custodians of the land on which we meet today, and pay my respects to elders past, present, and emerging.' Not a tourist performance — it is the professional Australian norm and it should be yours too."
          />
          <Practice
            n="2"
            title="Don't walk on the North Bondi rock engravings"
            body="Stay on the path. Walking on the engraved sandstone, even with rubber soles, accelerates weathering. If you don't know which rocks are engraved, walk only on the path."
          />
          <Practice
            n="3"
            title="Attend Yabun Festival on January 26 if you can"
            body="The largest ongoing public Aboriginal cultural event in Australia, held every 26 January at Victoria Park in central Sydney (6 km west of Bondi). Free. Music, dance, stalls, speeches. Attendance in the tens of thousands; a very different day out than Australia Day / Invasion Day protests on the same date."
          />
          <Practice
            n="4"
            title="Pay attention to the date 26 January itself"
            body="January 26 is Australia Day for many Australians and Invasion Day for First Nations peoples — the date of the 1788 First Fleet arrival. The date is contested. Most Aboriginal activists and many non-Aboriginal allies attend the protest march rather than celebrate. If you are visiting Bondi during this week, know what date you are in."
          />
          <Practice
            n="5"
            title="Buy from Aboriginal-owned businesses"
            body="The **Koori Indigenous Art Centre** and similar outlets across Sydney are places where money you spend on art, craft, or merchandise reaches Aboriginal artists and communities directly. The Indigenous Art Code (indigenousartcode.org) is the authentication framework."
          />
          <Practice
            n="6"
            title="Eat at Aboriginal-chef-led restaurants"
            body="Chef **Mark Olive** ('the Black Olive') and chef **Jack Drummond** among others have been leading a Sydney native-ingredient restaurant movement. The Australian Indigenous-chef-led fine dining scene is emerging and worth supporting."
          />
          <Practice
            n="7"
            title="Read First Nations authors on Sydney"
            body="Anita Heiss, Melissa Lucashenko, Alexis Wright, Tony Birch, and Ellen van Neerven are all First Nations Australian authors whose work includes Sydney and coastal NSW settings. The books are easier to read than the history textbooks and carry considerably more."
          />
          <Practice
            n="8"
            title="Support the Redfern Community Connection"
            body="Redfern, 6 km west of Bondi, has been Sydney's central Aboriginal community hub since the 1960s. The **Redfern Aboriginal Medical Service** (1971, the world's first Aboriginal Community Controlled Health Organization) is still operating. **Tribal Warrior** runs Sydney Harbour cultural cruises led by Aboriginal guides."
          />
          <Practice
            n="9"
            title="Don't assume the Voice question is settled"
            body="The 2023 referendum defeat does not mean the Uluru arc is finished. State-level treaty processes are active; truth-telling commissions are being established. The next Australian federal election will re-raise some of this conversation. As a visitor, you are not expected to have opinions on Australian constitutional politics — but you are expected to know that the conversation is current, not historical."
          />
        </div>

        <ClusterAside>
          Main-page context — the surf-lifesaving history, the Icebergs
          Club, what makes Bondi the beach the whole story fits on —
          is in <ClusterLink to="main" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="gadigal" />

      <SpokeProvenance
        bundle={bundle}
        note="Historical material follows AIATSIS (aiatsis.gov.au) and the Sydney Morning Herald's First Nations reporting. Rock-engraving detail from the Waverley Council Aboriginal Heritage records and the National Museum of Australia. Uluru Statement text from ulurustatement.org. 2023 referendum results via the Australian Electoral Commission. Population dating of Aboriginal continental presence is a moving figure as research advances; Madjedbebe dating (2017) is the current standard reference. Corrections welcome, particularly from Gadigal elders, on specific clan history and on the Bondi engraving tradition."
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
    <article className="border-l-2 border-[color:var(--beach-supporting,#0D3B5C)] pl-6">
      <div className={`${EYEBROW} mb-2`}>{n}</div>
      <h3 className={`${H3} mb-2`}>{title}</h3>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}
