/**
 * Copacabana signature section: the Calçadão (Burle Marx wave pavement).
 * The Portuguese pavement motif, its Lisbon origin, the 1970 Burle Marx
 * redesign, and why it's the most-walked work of public art in the Americas.
 */

import {
  WideSection,
  SectionHeader,
  Prose,
  Caption,
  type SectionImage,
} from "@/components/showcase/legendary-beach";

export default function CopaCalcadao({ mosaicImage }: { mosaicImage: SectionImage }) {
  return (
    <WideSection id="calcadao">
      <SectionHeader
        eyebrow="· The Calçadão"
        title="The most-walked work of public art in the Americas"
        kicker="Everyone thinks Roberto Burle Marx invented the wave pattern. He didn't. He made it mean something."
      />
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
        <figure className="overflow-hidden rounded-xl bg-volcanic-100">
          <img
            src={mosaicImage.thumbnail || mosaicImage.url}
            alt={mosaicImage.title}
            className="w-full h-auto"
          />
          <figcaption className="p-3 bg-white border-t border-volcanic-100">
            <Caption>
              {mosaicImage.title} · {mosaicImage.license}
            </Caption>
          </figcaption>
        </figure>
        <Prose>
          <p>
            The pattern was first laid on Lisbon's <strong>Praça do Rossio in 1848</strong> by the
            Portuguese engineer Eusébio Pinheiro Furtado — a mosaic of black basalt and white
            limestone in undulating waves, a homage to the sea crossed by Portuguese sailors. The
            motif crossed the Atlantic with the men who knew how to lay it. Under Mayor Francisco
            Pereira Passos in the early 1900s, Rio imported <em>calceteiros</em> and stones for the
            Belle-Époque boulevards. What remained was set onto the newly inaugurated Avenida
            Atlântica, and has been there in some form <strong>since the 1930s</strong>.
          </p>
          <p>
            In 1970, Roberto Burle Marx — the Brazilian landscape architect whose gardens at
            Brasília and the Parque do Flamengo had already redefined public space in the country —{" "}
            <strong>redesigned</strong> the Copacabana promenade as part of the Aterro expansion. He
            extended the wave pattern four continuous kilometers along the new Avenida Atlântica,
            and he varied the rhythm so that no 10-meter stretch repeats exactly. The waves widen
            and narrow. The compositions shift between the three lanes of the walkway. It is a 4 km
            landscape drawing in black and white.
          </p>
          <p>
            What makes the Calçadão the great piece of public art in the Americas is not that it
            exists but that it is walked on by <strong>three hundred thousand people a day</strong>,
            unceremoniously, and still feels like a composition. You cross it to get to the sand.
            You run along it. Children draw on it with chalk. Joggers at dawn, dog-walkers at
            midnight. No security rope, no admission fee. The art works for everyone and belongs to
            everyone and requires only that you look down occasionally and notice.
          </p>
        </Prose>
      </div>
    </WideSection>
  );
}
