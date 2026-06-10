/**
 * Copacabana → Bossa Nova (deep-dive spoke).
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

export default function CopaBossaPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "music_jobim") ??
    pickImage(meta, "arpoador_sunset") ??
    meta.images.hero;
  const jobim = pickImage(meta, "music_jobim");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="bossa" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Bossa Nova"
        title="The musical movement the Copa-Ipanema neighborhood invented between 1958 and 1964"
        kicker="A specific genre of Brazilian popular music was assembled — in the kitchens, bars, and small-capacity clubs of a six-block radius around Ipanema and Copacabana — over a six-year window between 1958 and 1964. The Girl from Ipanema is now the second-most-recorded song in popular-music history. Most of the rest of bossa nova's story is less known and more interesting."
        image={heroImage}
      />

      {/* --- What it is --- */}
      <Section id="what" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· The Music"
          title="What bossa nova is, stylistically"
          kicker="Bossa nova is recognizable in seconds. Naming what makes it recognizable takes a little longer."
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            <strong>Bossa nova</strong> — Portuguese for "new trend"
            or "new feel" — is a genre of Brazilian popular music
            that emerged in Rio de Janeiro in the late 1950s,
            fusing:
          </p>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Samba's rhythmic base</strong> — the syncopated
              Brazilian dance rhythm with its 2/4 meter and
              off-beat emphasis — but played at a much softer
              dynamic range, with the rhythm largely carried on
              guitar rather than percussion.
            </li>
            <li>
              <strong>Jazz harmonic vocabulary</strong> — extended
              chords (ninths, eleventhsm thirteenths), substitutions,
              and modal harmonic movement, drawn from the
              American jazz records that Rio musicians had been
              studying since the 1940s.
            </li>
            <li>
              <strong>Soft, conversational vocal delivery</strong> — a
              near-whispered intimate singing style pioneered by
              João Gilberto. Most bossa nova vocals are one or two
              decibels above speaking volume; the music is{" "}
              <em>quiet</em>, deliberately and radically so.
            </li>
            <li>
              <strong>Portuguese-language lyrics</strong>, usually
              about love, saudade, the beach, the city, and the
              weather, in a literary register contemporary Brazilian
              literature was exploring in parallel.
            </li>
          </ul>
          <p className={BODY}>
            The distinctive{" "}
            <strong>violão gago</strong> ("stuttering guitar")
            right-hand rhythm pattern is bossa nova's single most
            recognizable signature. João Gilberto is universally
            credited with inventing or perfecting it; every bossa
            nova guitarist since has played in his shadow.
          </p>
        </div>
      </Section>

      {/* --- The canonical figures --- */}
      <Section id="figures" className={PAPER}>
        <SectionHeader
          eyebrow="· The Figures"
          title="Four people, one neighborhood, one six-year window"
        />

        <div className="space-y-10">
          <FigureCard
            name="Antônio Carlos Jobim (1927–1994)"
            role="Composer, pianist, arranger"
            body="The principal composer of bossa nova. Born in Rio, raised in Ipanema, lived most of his adult life in the Copa-Ipanema neighborhood. Composed **Desafinado**, **Chega de Saudade**, **Garota de Ipanema**, **Corcovado**, **Águas de Março**, and most of the standard bossa nova repertoire. Worked extensively with Vinícius de Moraes as lyricist and with João Gilberto as performer. His first recordings with Elis Regina and later solo work define the genre's harmonic language."
          />
          <FigureCard
            name="João Gilberto (1931–2019)"
            role="Singer, guitarist"
            body="The performing pioneer. Born in Juazeiro, Bahia; arrived in Rio in 1950. Invented — or at least perfected — the soft-voiced, syncopated-guitar bossa nova performance style. His 1958 album **Chega de Saudade** is conventionally the moment bossa nova became a named genre. Gilberto was famously difficult (recording sessions often lasted days for a single song), famously exacting, and famously brilliant; his recordings are the baseline reference for every subsequent bossa nova vocalist and guitarist."
          />
          <FigureCard
            name="Vinícius de Moraes (1913–1980)"
            role="Poet, diplomat, lyricist"
            body="Bossa nova's principal lyricist. A Rio-born poet and Brazilian diplomat (he served in embassies in Los Angeles, Paris, Montevideo, and Lisbon before being forced to resign in 1969 under the military dictatorship). Wrote the lyrics to **Garota de Ipanema**, **Insensatez**, **Eu sei que vou te amar**, and dozens more with Jobim. His literary background — Vinícius was a published poet before he was a lyricist — is what gives bossa nova its distinct literary register among popular-music traditions of the 1960s."
          />
          <FigureCard
            name="Astrud Gilberto (1940–2023)"
            role="Singer"
            body="The voice on the English-language portion of **The Girl from Ipanema** on the 1964 Getz/Gilberto album — a recording made almost by accident when her English was judged good enough to handle the translation and her voice matched the song. She was married to João Gilberto at the time. The recording made her a global figure overnight; her subsequent career through the 1960s and 70s established a distinct solo voice alongside the canonical bossa nova repertoire."
          />
        </div>

        {jobim && (
          <Figure
            image={jobim}
            size="wide"
            tier="B"
            caption="Antônio Carlos Jobim. The composer whose harmonic vocabulary defines bossa nova; the Rio-Ipanema resident whose relationship to this neighborhood shaped the music."
            className="mt-10"
          />
        )}
      </Section>

      {/* --- The venues --- */}
      <Section id="venues" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· The Venues"
          title="Six blocks, six clubs, five years"
          kicker="Bossa nova was not recorded into existence in a studio. It was rehearsed and assembled and performed in a very small number of specific Rio bars and clubs — most of them within walking distance of each other in Ipanema and Copacabana. Several still exist."
        />

        <div className="grid gap-8 md:grid-cols-2">
          <VenueCard
            name="Beco das Garrafas (Bottles' Alley)"
            location="Rua Duvivier, Copacabana"
            body="The single most important address in bossa nova history. A short alley off Rua Nossa Senhora de Copacabana lined with small clubs — **Little Club**, **Bottle's Bar**, **Ma Griffe**, **Bacará** — that between roughly 1958 and 1964 hosted Jobim, Gilberto, Sergio Mendes, Vinícius, Nara Leão, and effectively every bossa nova figure of consequence. **The clubs are gone; the alley is still there.** You can walk it."
          />
          <VenueCard
            name="Veloso (now Garota de Ipanema)"
            location="Rua Vinícius de Moraes 49, Ipanema"
            body="The bar where **Jobim and Vinícius wrote 'Garota de Ipanema'** in 1962, inspired by a teenage girl — **Heloísa Eneida Menezes Paes Pinto**, later Helô Pinheiro — walking past on her way to the beach. The bar still operates under the song's name; Heloísa eventually took ownership stakes in a restaurant chain using the brand. Tourist-heavy now, but the walls carry genuine music-history photographs."
          />
          <VenueCard
            name="Zum-Zum"
            location="Rua Visconde de Pirajá, Ipanema"
            body="Small intimate club where Nara Leão ran her famous Monday-night sessions in 1961–63. **The room where João Gilberto first played 'Desafinado' publicly** in 1958 is conventionally one of Zum-Zum's incarnations. Gone as a venue; the Ipanema address is commercial retail today."
          />
          <VenueCard
            name="Jobim's Ipanema apartment"
            location="Rua Barão da Torre, Ipanema"
            body="Where Jobim wrote extensively in the early 1960s. Not open to the public; the building is a private residential condominium. Noted here because an unusually large share of the bossa nova repertoire was composed in this specific apartment over roughly a 4-year window."
          />
          <VenueCard
            name="Copacabana Palace rooftop"
            location="Avenida Atlântica 1702"
            body="Hosted multiple formal bossa nova sessions in the early 1960s — Gilberto, Jobim, and Nara Leão performed at private hotel parties that were recorded informally and have since surfaced as bootlegs. The rooftop still hosts evening events; a modern visitor can drink at the Palace bar and stand on the same terrace where the recordings happened."
          />
          <VenueCard
            name="Canto do Rio (Modersohn-Becker Street)"
            location="Flamengo, 6 km north"
            body="The working session for Jobim's early recording career in 1959–60. Less beach-adjacent than the other venues but named because the 1958 **Chega de Saudade** João Gilberto album — typically cited as the first bossa nova record — was recorded here, not in Copa/Ipanema."
          />
        </div>
      </Section>

      {/* --- The canonical recordings --- */}
      <Section id="recordings" className={PAPER}>
        <SectionHeader
          eyebrow="· The Recordings"
          title="Five albums that are the genre"
        />

        <div className="space-y-8 max-w-3xl">
          <RecordCard
            year="1958"
            name="Chega de Saudade — João Gilberto"
            body="**The record where bossa nova becomes a genre.** Gilberto's first album; title track composed by Jobim. Produced by Aloysio de Oliveira for Odeon. The album length and production standards are modest by any subsequent measure; the musical break is complete. Every bossa nova singer since has measured themselves against this record."
          />
          <RecordCard
            year="1962"
            name="Jazz Samba — Stan Getz & Charlie Byrd"
            body="American jazz guitarist Charlie Byrd, having visited Rio, recruited tenor saxophonist **Stan Getz** to record an album of American jazz interpretations of Jobim compositions. Released in April 1962; instrumental. The single 'Desafinado' reached #15 on US Billboard. The album is **bossa nova's first American commercial success** and opened the market for the Getz/Gilberto collaboration that followed."
          />
          <RecordCard
            year="1964"
            name="Getz/Gilberto — Stan Getz & João Gilberto"
            body="**The global breakthrough.** Recorded March 1963 in New York; released March 1964. Stan Getz, João Gilberto, Jobim (piano), Astrud Gilberto (vocals on two English-language tracks). Side 1 Track 1 is **The Girl from Ipanema**. The album won the Grammy for Album of the Year and Best Jazz Album in 1965 — the first non-jazz-genre Album of the Year win in Grammy history. Sold over 2 million copies in its first year. Made bossa nova globally legible in a way no Portuguese-only recording had."
          />
          <RecordCard
            year="1967"
            name="Francis Albert Sinatra & Antônio Carlos Jobim"
            body="Jobim collaborated directly with Sinatra on a now-classic duets album recorded in January-February 1967. The tracks — Jobim compositions sung by Sinatra, Portuguese and English — completed bossa nova's absorption into the American Great American Songbook tradition. By 1967 bossa nova was no longer a strictly Brazilian genre; it was a global popular-music form."
          />
          <RecordCard
            year="1972"
            name="Elis & Tom — Elis Regina & Antônio Carlos Jobim"
            body="Twelve years after bossa nova's invention, Brazilian singer **Elis Regina** (1945–1982) recorded an album with Jobim that is widely considered **the best single Jobim performance record**. Recorded in 1974 in Los Angeles; released later that year. Elis's voice at its peak; Jobim's compositions in their mature arrangements. The canonical bossa nova Brazilian-market recording."
          />
        </div>
      </Section>

      {/* --- Why Copa --- */}
      <Section id="why-copa" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Why Here"
          title="What about this specific neighborhood made this specific music possible"
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            A genuine historical question: why did the bossa nova
            invention happen specifically in Copa-Ipanema between
            1958 and 1964, rather than elsewhere in Rio, elsewhere
            in Brazil, or elsewhere in the world? Several converging
            factors:
          </p>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Real-estate economics.</strong> The Ipanema /
              Copacabana neighborhoods were, in the late 1950s,
              solidly middle-class-to-wealthy but not yet the
              internationalized luxury districts they would become
              after the 1970 expansion. Apartment rents were
              affordable for working artists.
            </li>
            <li>
              <strong>Proximity to beaches + quiet indoor spaces.</strong>
              Bossa nova was written in apartments and performed in
              acoustically small clubs. A 6-block radius in
              Copa-Ipanema had both high-density apartment-building
              stock and a dense cluster of small-capacity bars.
            </li>
            <li>
              <strong>Cultural convergence.</strong> Post-war Rio was
              the convergence point of middle-class Brazilian
              literary culture (Vinícius de Moraes was a published
              poet and diplomat before he was a lyricist), American
              jazz imports (Rio's radio stations had been playing
              American jazz since the 1930s), and the existing
              Brazilian samba tradition (bossa nova's rhythmic
              basis).
            </li>
            <li>
              <strong>A specific social cluster.</strong> Jobim,
              Vinícius, Gilberto, Nara Leão, Carlos Lyra, Roberto
              Menescal, Baden Powell, and a dozen other bossa nova
              figures lived within walking distance of each other
              and saw each other daily. This is not incidental;
              musical genres generally emerge from dense social
              networks in small geographic radii. Bossa nova was
              not the beach's music; it was <em>the neighborhood's</em>{" "}
              music, and the neighborhood happened to sit on the
              beach.
            </li>
          </ul>
          <p className={BODY}>
            The post-1964 political context matters too. The
            military coup of 31 March 1964 — which would rule
            Brazil until 1985 — changed the cultural climate
            sharply. Several bossa nova figures went into exile
            (Vinícius resigned his diplomatic post in 1969 and
            subsequently wrote increasingly politically-charged
            work; Chico Buarque, who emerged from the post-bossa
            Brazilian popular-music generation, was exiled in
            Italy 1969–70). Bossa nova's <em>inventing era</em>
            — the six years of 1958–64 — is substantially
            contained within the pre-military-dictatorship
            Brazilian cultural moment. That the music sounds so
            apparently apolitical is a reading of the era's final
            days, not a statement about Brazilian politics before
            or after.
          </p>
        </div>
      </Section>

      {/* --- Where to hear it today --- */}
      <Section id="today" className={PAPER}>
        <SectionHeader
          eyebrow="· Where to Hear It Now"
          title="Four venues a visitor can actually use"
        />

        <div className="grid gap-8 md:grid-cols-2">
          <CurrentVenue
            name="Beco das Garrafas (the alley)"
            body="You can walk it. The clubs are gone; a memorial plaque was installed in 2008. Worth a ten-minute visit to stand in the alley; the walking tour **Roteiro da Bossa Nova** (available through Turismo Rio) starts here."
          />
          <CurrentVenue
            name="Garota de Ipanema (the bar)"
            body="The restored 1962 Veloso, now operating as the **Garota de Ipanema** at Rua Vinícius de Moraes 49. Tourist-heavy, prices inflated, but the walls carry photographs of the original bossa nova era. Worth lunch or a late-afternoon beer."
          />
          <CurrentVenue
            name="Vinícius Piano Bar"
            body="Above the Garota de Ipanema at the same address. Live bossa nova most nights from 9 p.m.; cover charge R$50–80 plus drinks. The performers range from locally-famous to unnamed-but-excellent. **The closest thing to a current-era bossa nova club at an original-era address.**"
          />
          <CurrentVenue
            name="Centro Cultural Nara Leão"
            body="A small museum and performance space in Leblon dedicated to the 'Muse of Bossa Nova.' Permanent exhibition of recordings, photographs, and Leão's personal effects. Free; check hours. The scholarly end of the bossa nova tourism inventory."
          />
        </div>

        <ClusterAside>
          Main-page context — the Calçadão, cultural ubiquity, the
          kiosks — is in <ClusterLink to="main" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="bossa" />

      <SpokeProvenance
        bundle={bundle}
        note="Historical material follows Ruy Castro's Chega de Saudade (Companhia das Letras, 1990) — the canonical bossa nova history — and Bryan McCann's Hello, Hello Brazil: Popular Music in the Making of Modern Brazil (Duke University Press, 2004). Recording-session detail from the Odeon / Verve session archives. Venue status current as of 2026; verify current operating hours before visiting the Garota de Ipanema and Vinícius Piano Bar."
      />
    </LegendaryShell>
  );
}

function FigureCard({
  name,
  role,
  body,
}: {
  name: string;
  role: string;
  body: string;
}) {
  return (
    <article className="border-l-2 border-[color:var(--beach-primary,#1A1A1A)] pl-6">
      <h3 className={`${H3} mb-1`}>{name}</h3>
      <div className={`${EYEBROW} mb-3`}>{role}</div>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}

function VenueCard({
  name,
  location,
  body,
}: {
  name: string;
  location: string;
  body: string;
}) {
  return (
    <article className="rounded-sm border border-[#E7E2D4] bg-white p-6">
      <h3 className={`${H3} mb-2`}>{name}</h3>
      <div className={`${EYEBROW} mb-3`}>{location}</div>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}

function RecordCard({
  year,
  name,
  body,
}: {
  year: string;
  name: string;
  body: string;
}) {
  return (
    <article className="border-l-2 border-[#CBD5E1] pl-6">
      <div className={`${EYEBROW} mb-2`}>{year}</div>
      <h3 className={`${H3} mb-2`}>{name}</h3>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}

function CurrentVenue({ name, body }: { name: string; body: string }) {
  return (
    <article className="rounded-sm border border-[#CBD5E1] bg-white p-7">
      <h3 className={`${H3} mb-3`}>{name}</h3>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}
