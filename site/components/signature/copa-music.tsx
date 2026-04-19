/**
 * Copacabana signature section: Music — Beco das Garrafas + funk carioca.
 * Rio's two most important 20th-century music genres both live on Copacabana's topography.
 */

import { Section, SectionHeader, Prose } from "@/components/showcase/legendary-beach";

export default function CopaMusic() {
  return (
    <Section id="music" className="bg-volcanic-900 text-volcanic-50" dark>
      <SectionHeader
        eyebrow="· Music"
        title="Three blocks inland, a cradle"
        kicker="Rio's two most important 20th-century music genres both live on Copacabana's topography."
        dark
      />
      <Prose dark>
        <p>
          Walk three blocks inland from Posto 2, onto Rua Duvivier, and find a dead-end alley named{" "}
          <strong>Beco das Garrafas</strong>. In the late 1950s, three small clubs — Little Club,
          Bottles Bar, and Ma Griffe — operated here nightly. Sylvia Telles sang. Roberto Menescal
          played guitar. Carlos Lyra, Luiz Eça, and a very young Nara Leão developed a sound quieter
          than samba, more bent, more urban, more American in its harmonic language. Wikipedia
          calls the alley <em>a historical cradle of bossa nova</em>. It is Copacabana's — not
          Ipanema's — though the movement's anthem would be written a few blocks further south four
          years later at a bar called Veloso, now renamed <em>Garota de Ipanema</em>.
        </p>
        <p>
          Bossa nova left Brazil in 1962 when Jobim played Carnegie Hall, and returned as something
          adopted into the world's DNA — the film <em>Breathless</em>, Stan Getz's saxophone, the
          Pixies' "Here Comes Your Man." Copa's stake in the sound is its birthplace and its first
          venues. Ipanema's stake is its fame.
        </p>
        <p>
          A generation later, a different Rio music rose from the same geography.{" "}
          <strong>Funk carioca</strong> — baile funk — emerged in the 1980s in Rio's favelas,
          fusing Miami bass, samba, and candomblé rhythms. The <em>Cantagalo</em> and{" "}
          <em>Pavão-Pavãozinho</em> favelas, which sit directly above Copacabana and Ipanema, became
          documented scene sites. The genre's topography literally overlooks both beaches. A
          Copacabana page that treats bossa nova as cultured and baile funk as something elsewhere
          misunderstands the hill behind it.
        </p>
      </Prose>
    </Section>
  );
}
