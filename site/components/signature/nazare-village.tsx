/**
 * Nazaré signature: The Village.
 *
 * Nazaré is a 900-year-old fishing village that, in the last 15 years,
 * became a global surf destination. The village has not disappeared —
 * it is still here, actively functioning, visibly rearranged. Sítio,
 * Praia, the estendal sardine-drying racks, the seven-skirt widows, the
 * Marian pilgrimage. The layers coexist.
 */

import {
  Section,
  SectionHeader,
  Prose,
  Caption,
  type SectionImage,
} from "@/components/showcase/legendary-beach";

export default function NazareVillage({
  fisherwomenImage,
  sitioImage,
  funicularImage,
}: {
  fisherwomenImage?: SectionImage;
  sitioImage?: SectionImage;
  funicularImage?: SectionImage;
}) {
  return (
    <Section id="village" className="bg-sand-50">
      <SectionHeader
        eyebrow="· The Village Beneath the Big Wave"
        title="Nine hundred years before the world record"
        kicker="Nazaré was a working Atlantic fishing village for nearly a millennium before the first surfer arrived. Almost every layer of that history is still visible."
      />

      <Prose>
        <p>
          The settlement at Nazaré has three parts, and understanding the difference is how you
          understand the town.
        </p>
        <p>
          <strong>Sítio</strong> — the upper town on the cliff, 120 m above the ocean — is the
          <em> oldest</em> Nazaré. It was founded around the 1182 Marian chapel (see the Lenda da
          Nazaré) and grew through the 14th century around the Santuário de Nossa Senhora da
          Nazaré. For most of its history, Sítio was the inhabited Nazaré. The clifftop was
          defensible (corsair raids from the Mediterranean reached the Portuguese Atlantic
          through the 18th century), close to arable land, and directly above the Forte de São
          Miguel Arcanjo, the 1577 fortress that protected the anchorage below.
        </p>
        <p>
          <strong>Praia</strong> — the lower town at the base of the cliff, the fishing village
          proper — is the <em>newer</em> Nazaré. It grew in the 18th and 19th centuries as the
          fishing economy expanded and as the corsair risk receded. Fishermen wanted to live near
          their boats; their families followed. By 1900, Praia was the larger of the two
          settlements. The two towns were connected by the <strong>175-step Capuchinhos
          stairway</strong> until 1889, when the <strong>Funicular da Nazaré</strong> opened —
          one of three inclined funiculars built in Portugal by engineer Raoul Mesnier du Ponsard,
          the engineer responsible for Lisbon's iconic Elevador de Santa Justa.
        </p>
      </Prose>

      {funicularImage && (
        <figure className="my-10 max-w-3xl mx-auto overflow-hidden rounded-xl bg-white border border-volcanic-100">
          <img
            src={funicularImage.thumbnail || funicularImage.url}
            alt={funicularImage.title}
            className="w-full h-auto"
          />
          <figcaption className="p-3 border-t border-volcanic-100">
            <Caption>
              {funicularImage.title} · {funicularImage.license}
            </Caption>
          </figcaption>
        </figure>
      )}

      <Prose>
        <p>
          <strong>Praia do Norte</strong> — the north beach, beneath the opposite face of the
          Sítio headland, separated from the village by the promontory — is the <em>youngest</em>
          Nazaré. For most of the town's history it was a working stretch for heavy fishing
          operations (shore-based sardine seining, the type the seven-skirt widows represent) and
          was considered too rough for recreation. Until 2010 it had no global reputation at all.
          Today it is the reason most people outside Portugal have heard of the town.
        </p>
      </Prose>

      <h3 className="font-display text-2xl text-volcanic-900 mt-16 mb-8 text-center">
        The visible layers — what you will actually see
      </h3>

      <div className="grid gap-8 lg:grid-cols-2">
        <article className="rounded-xl bg-white p-7 border border-volcanic-100">
          <h4 className="font-display text-xl text-volcanic-900 mb-3">The estendal</h4>
          <p className="text-[15px] text-volcanic-700 leading-relaxed">
            Along Praia da Nazaré — the village beach on the south side of the headland — small
            wooden racks hold sardines split, salted, and drying in the Atlantic sun. This is the
            traditional <em>estendal</em>, a sardine-preservation technique in continuous
            practice here since at least the 16th century. The women who work it, many of them in
            their 70s and 80s, are among the last active practitioners. The practice is currently
            under consideration for UNESCO Intangible Cultural Heritage protection.
          </p>
          {fisherwomenImage && (
            <figure className="mt-5 overflow-hidden rounded-lg">
              <img
                src={fisherwomenImage.thumbnail || fisherwomenImage.url}
                alt={fisherwomenImage.title}
                className="w-full h-auto"
              />
              <Caption>
                {fisherwomenImage.title} · {fisherwomenImage.license}
              </Caption>
            </figure>
          )}
        </article>

        <article className="rounded-xl bg-white p-7 border border-volcanic-100">
          <h4 className="font-display text-xl text-volcanic-900 mb-3">The seven skirts (sete saias)</h4>
          <p className="text-[15px] text-volcanic-700 leading-relaxed">
            Traditional Nazarené women's dress: seven layered skirts in bright colors over a
            simple bodice, with a black shawl. The practical explanation — seven layers for seven
            days of the week; women wore all of them at the beach waiting for their husbands'
            boats to return, using individual skirts as cushions, windbreaks, and impromptu
            blankets — is the standard local story. You will see the dress on older women during
            major festivals (Festas da Senhora da Nazaré, Carnaval) and daily on a handful of
            women at the estendal.
          </p>
          <p className="text-[15px] text-volcanic-700 leading-relaxed mt-3">
            The dress is also the model for the Rafael Bordalo Pinheiro ceramic figurines that
            you see in every Portuguese souvenir shop — those come from here.
          </p>
        </article>

        <article className="rounded-xl bg-white p-7 border border-volcanic-100">
          <h4 className="font-display text-xl text-volcanic-900 mb-3">The Santuário and the pilgrimage</h4>
          <p className="text-[15px] text-volcanic-700 leading-relaxed">
            The Santuário de Nossa Senhora da Nazaré — the 14th-century sanctuary in Sítio —
            houses a Marian statue traditionally identified as a 4th-century Byzantine carving,
            said to have been carried from the Holy Land during the 8th-century Islamic expansion
            and hidden at Nazaré until Dom Fuas Roupinho rediscovered it in 1182. The annual
            pilgrimage around September 8 draws roughly 100,000 people to the clifftop. It is the
            largest single-week event in the town's calendar — larger than any surf event.
          </p>
        </article>

        <article className="rounded-xl bg-white p-7 border border-volcanic-100">
          <h4 className="font-display text-xl text-volcanic-900 mb-3">Sítio's 4 p.m. ritual</h4>
          <p className="text-[15px] text-volcanic-700 leading-relaxed">
            Late-afternoon, regardless of season, Sítio's main square fills with Nazarenés
            drinking coffee, walking the cliff promenade, and doing the Atlantic-sunset watching
            that is a specifically Portuguese practice. Not a surf ritual. Not a tourist ritual.
            The village's daily end-of-day check-in. If you are visiting and you want to
            understand why the locals stay, come up here at 4 p.m. on a Tuesday in November.
          </p>
        </article>
      </div>

      {sitioImage && (
        <figure className="mt-16 max-w-4xl mx-auto overflow-hidden rounded-xl">
          <img
            src={sitioImage.thumbnail || sitioImage.url}
            alt={sitioImage.title}
            className="w-full h-auto"
          />
          <Caption>
            {sitioImage.title} · {sitioImage.license}
          </Caption>
        </figure>
      )}
    </Section>
  );
}
