/**
 * Brighton signature section: The Piers — Palace Pier (working) + West Pier (ruin).
 * Brighton's defining visual: two Victorian piers, one alive and one a skeleton in the sea.
 */

import {
  WideSection,
  SectionHeader,
  Prose,
  type SectionImage,
} from "@/components/showcase/legendary-beach";

export default function BrightonPiers({
  palaceImage,
  ruinImage,
  fireImage,
}: {
  palaceImage?: SectionImage;
  ruinImage?: SectionImage;
  fireImage?: SectionImage;
}) {
  return (
    <WideSection id="piers">
      <SectionHeader
        eyebrow="· The Piers"
        title="Two Victorian piers. One alive, one a skeleton."
        kicker="Brighton's defining visual is not the beach. It is what stands in the sea in front of the beach."
      />

      {/* The paired image block */}
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {palaceImage && (
          <figure className="overflow-hidden rounded-xl bg-volcanic-100">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={palaceImage.url}
                alt={palaceImage.title}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="px-4 py-3 bg-white border-t border-volcanic-100">
              <div className="font-display text-lg text-volcanic-900">The Palace Pier (1899)</div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-volcanic-500 mt-1">
                Working · Fairground · 525 metres of iron · Free to walk on
              </div>
            </figcaption>
          </figure>
        )}
        {ruinImage && (
          <figure className="overflow-hidden rounded-xl bg-volcanic-100">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={ruinImage.url}
                alt={ruinImage.title}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="px-4 py-3 bg-white border-t border-volcanic-100">
              <div className="font-display text-lg text-volcanic-900">The West Pier (1866–)</div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-volcanic-500 mt-1">
                Ruin · Burned 2003–04 · Iron skeleton · Protected wildlife roost
              </div>
            </figcaption>
          </figure>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] items-start">
        <Prose>
          <p>
            The <strong>Palace Pier</strong> — officially the Brighton Marine Palace and Pier, opened 1899 — is the working one. Five hundred and twenty-five metres of iron extending into the Channel. Fairground rides at the far end; slot machines and a small theatre halfway; doughnuts, candyfloss, and Brighton Rock sold along the promenade deck. The Great Storm of October 1987 took its original concert hall into the sea. The pier is still free to walk on; you only pay if you ride.
          </p>
          <p>
            The <strong>West Pier</strong>, designed by Eugenius Birch and opened 1866, was the more elegant of the two — a 340-metre promenade pier with a pavilion and concert hall where Yehudi Menuhin performed as a child. It closed to visitors in 1975 after decades of decline. Two fires in 2003 (28 March and 11 May) and a third in December 2004 destroyed most of the superstructure. The cause was never formally established. The iron skeleton that remains is now a protected structure and a roost for starlings; their murmurations over the ruin on winter evenings are one of the south coast's reliable spectacles.
          </p>
          <p>
            Brighton has chosen, deliberately, not to remove what is left of the West Pier. The i360 observation tower, opened 2016, rises 162 metres beside it — intentionally paired. The West Pier Trust runs a small exhibition in the i360's base. The piers, together, are the city's argument about what to do with a lost thing: keep the bones, build something new alongside, and stop pretending the ruin is not also the art.
          </p>
        </Prose>

        {fireImage && (
          <figure className="overflow-hidden rounded-xl bg-volcanic-100 border border-volcanic-200">
            <img
              src={fireImage.url}
              alt={fireImage.title}
              className="w-full h-auto"
            />
            <figcaption className="px-4 py-3 bg-white border-t border-volcanic-100">
              <div className="font-display text-base text-volcanic-900">28 March 2003</div>
              <div className="text-xs text-volcanic-600 mt-1 leading-relaxed">
                The first of three fires. Cause unsolved. Photo: Mark Harris · Public domain.
              </div>
            </figcaption>
          </figure>
        )}
      </div>
    </WideSection>
  );
}
