/**
 * Copacabana signature section: the 1970 Aterro.
 * The land-reclamation project that doubled the beach's width.
 */

import {
  WideSection,
  SectionHeader,
  Prose,
  Caption,
  type SectionImage,
} from "@/components/showcase/legendary-beach";

export default function CopaAterro({ preImage }: { preImage?: SectionImage }) {
  return (
    <WideSection id="aterro" className="bg-sand-50">
      <SectionHeader
        eyebrow="· The 1970 Aterro"
        title="The year Copacabana was enlarged"
        kicker="Before 1970, the beach was narrower. The Aterro de Copacabana doubled it."
      />
      <div className="grid gap-10 md:grid-cols-2 items-start">
        <Prose>
          <p>
            The Copacabana of 1969 and the Copacabana of 1971 are not the same beach. Between them,
            an offshore dredging project called the <strong>Aterro de Copacabana</strong> pulled
            sand from the continental shelf and deposited it along the coastline. According to
            Brazilian urbanism sources, this roughly <strong>doubled the beach's width</strong>.
            Simultaneously, the two-lane Avenida Atlântica was widened into six lanes, a second
            service road was added, and Burle Marx laid the new Portuguese-pavement promenade on
            top.
          </p>
          <p>
            The project's full engineering record lives mostly in Portuguese-language archives —
            English Wikipedia mentions only that the promenade was "rebuilt in 1970." We flag this
            section accordingly. What's unambiguous: the beach you visit today is a 1970 artifact.
            The Copacabana of Orson Welles's visits and Stefan Zweig's final months was a narrower
            strip. The broad, football-capable, Olympic-stadium-bearing sand is the version Rio
            built in the twentieth century's last great piece of civic construction.
          </p>
          <p className="text-sm text-volcanic-500 italic">
            Per Brazilian urbanism sources. English-language Wikipedia entries for Copacabana
            reference the 1970 promenade rebuild but not the beach-widening in detail.
          </p>
        </Prose>
        {preImage && (
          <figure className="overflow-hidden rounded-xl bg-black">
            <img
              src={preImage.thumbnail || preImage.url}
              alt={preImage.title}
              className="w-full h-auto"
            />
            <figcaption className="p-3 bg-white border-t border-volcanic-100">
              <div className="font-display text-lg text-volcanic-900">Before the expansion</div>
              <Caption>
                {preImage.title} · {preImage.author} · {preImage.license}
              </Caption>
            </figcaption>
          </figure>
        )}
      </div>
    </WideSection>
  );
}
