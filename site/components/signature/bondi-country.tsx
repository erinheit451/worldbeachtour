/**
 * Bondi signature: Country Before Colony.
 *
 * Parallel to Waikīkī's "Reading the Land." The Aboriginal presence at
 * this one kilometer of coast predates the 1788 British arrival by
 * tens of thousands of years. Specific sites at Bondi — the North
 * Bondi rock engravings, the Ben Buckler ceremonial area, the Tama
 * Rama middens — are still on the ground and walkable.
 */

import {
  Section,
  SectionHeader,
  Prose,
  Caption,
  type SectionImage,
} from "@/components/showcase/legendary-beach";

interface Site {
  name: string;
  meaning?: string;
  what: string;
  where: string;
  note: string;
}

const SITES: Site[] = [
  {
    name: "Boondi (Bondi)",
    meaning: "Eora word, probably 'water breaking over rocks' or 'a place where a flight of nullas took place' — both meanings are attested.",
    what: "The name of the beach itself, anglicized by British colonists in the 1830s.",
    where: "The entire bay.",
    note:
      "'Bondi' in English writing appears consistently from about 1830. The pronunciation has never softened — it is still 'BON-dye,' not 'BON-dee' — an accidental preservation of the Eora original.",
  },
  {
    name: "Ben Buckler rock engravings",
    what: "Sandstone engravings: a whale about 3 meters long, three kangaroos, a male human figure, marine shapes. Pre-contact.",
    where: "The sandstone cliff top at the northern headland, near the Bondi Golf Course's 5th hole.",
    note:
      "Unmarked. Partially visible on flat rock platforms above the waterline. Most visible in early morning or late afternoon when shadow angles pick out the grooves. Please do not walk directly on them; the sandstone is soft and erodes quickly under foot traffic. Similar engravings exist at more than 800 sites across the Sydney region — Sydney has the densest concentration of pre-contact Aboriginal rock art in Australia.",
  },
  {
    name: "Tamarama midden",
    what: "Shell midden — a refuse deposit showing thousands of years of oyster and shellfish gathering. Some deposits 3-4 meters deep.",
    where: "Tamarama, 10 minutes south along the coastal walk from Bondi.",
    note:
      "Middens are living-culture evidence — they show what people ate, when they gathered, how the climate shifted over millennia. The Tama Rama midden has been partly damaged by 20th-century beach construction; what remains is protected under the NSW National Parks and Wildlife Act.",
  },
  {
    name: "Grotto Point engravings",
    what: "A major rock-engraving site with fish, kangaroos, and human figures, in situ on sandstone.",
    where: "Manly/Dobroyd Head, across the harbour — 45 min ferry + bus from Bondi.",
    note:
      "Not at Bondi itself, but the most accessible intact Aboriginal rock-art site near Sydney, worth a visit from Bondi visitors interested in the broader context. The Aboriginal Heritage Office offers guided walks.",
  },
  {
    name: "Ngurra",
    meaning: "Aboriginal word (multiple language groups) for 'home' — a specific place that holds story, responsibility, and identity.",
    what: "A concept, not a site. The idea that a specific patch of country holds ancestral responsibility — that you cannot be 'from here' without having care-of-country obligations.",
    where: "Everywhere. A way of seeing the land.",
    note:
      "Understanding Bondi as ngurra — the ancestral ngurra of the Gadigal — is the conceptual frame that makes sense of why the rock engravings are still here, unfenced, unmarked, and why Aboriginal Sydneysiders still visit them. They are not historical artifacts. They are someone's family's art.",
  },
];

export default function BondiCountry({
  engravingImage,
  benBucklerImage,
}: {
  engravingImage?: SectionImage;
  benBucklerImage?: SectionImage;
}) {
  return (
    <Section id="country">
      <SectionHeader
        eyebrow="· Country Before Colony"
        title="The Gadigal map beneath the tourist map"
        kicker="Twenty thousand years of presence in one square kilometer. Some of the evidence is still on the rocks, unfenced, and walkable this afternoon."
      />
      <Prose>
        <p>
          <strong>Aboriginal and Torres Strait Islander peoples have lived in what is now
          Australia for at least 65,000 years.</strong> The <strong>Gadigal</strong> (also spelled
          Cadigal) people — one of several clans of the <strong>Eora Nation</strong> — held the
          coastal strip from what is now Sydney Harbour south to Botany Bay, including all of
          Bondi. They were coastal people: fishers, oyster gatherers, canoe-builders. They
          managed fire, quarried stone from specific outcrops, and maintained ceremonial sites in
          the rocks.
        </p>
        <p>
          When the First Fleet arrived in 1788, Sydney was not wilderness — it was a landscape of
          sites, stories, and specific ancestral responsibilities. <strong>Smallpox, introduced
          within two years of contact, killed roughly half of the Eora population.</strong>{" "}
          Within five years, the Gadigal had been largely displaced from the harbour lands. Despite
          this, Gadigal presence at Bondi did not disappear; it was reduced, forced inland, and
          systematically under-recorded. Every piece of rock art that survives is both evidence and
          resistance.
        </p>
      </Prose>

      {engravingImage && (
        <figure className="my-12 max-w-4xl mx-auto overflow-hidden rounded-xl bg-volcanic-50">
          <img
            src={engravingImage.thumbnail || engravingImage.url}
            alt={engravingImage.title}
            className="w-full h-auto"
          />
          <figcaption className="p-4 bg-white border-t border-volcanic-100 text-center">
            <div className="font-display text-lg text-volcanic-900">
              An Aboriginal rock engraving (detail — not at Bondi)
            </div>
            <Caption>
              {engravingImage.title} · {engravingImage.license}. The Ben Buckler engravings at
              Bondi remain unmarked and unphotographed on the open web out of respect for site
              protection.
            </Caption>
          </figcaption>
        </figure>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {SITES.map((s) => (
          <article key={s.name} className="border-l-2 border-amber-600 pl-6">
            <header className="mb-3">
              <h3 className="font-display text-2xl text-volcanic-900 leading-tight">
                {s.name}
              </h3>
              {s.meaning && <p className="mt-1 text-sm italic text-amber-700">{s.meaning}</p>}
            </header>
            <dl className="space-y-3 text-[15px] text-volcanic-700">
              <div>
                <dt className="font-semibold uppercase tracking-widest text-[10px] text-volcanic-500">
                  What
                </dt>
                <dd className="mt-1 leading-relaxed">{s.what}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-widest text-[10px] text-volcanic-500">
                  Where
                </dt>
                <dd className="mt-1 leading-relaxed">{s.where}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-widest text-[10px] text-volcanic-500">
                  Note
                </dt>
                <dd className="mt-1 leading-relaxed">{s.note}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      {benBucklerImage && (
        <figure className="mt-14 overflow-hidden rounded-xl bg-volcanic-50 max-w-4xl mx-auto">
          <img
            src={benBucklerImage.thumbnail || benBucklerImage.url}
            alt={benBucklerImage.title}
            className="w-full h-auto"
          />
          <figcaption className="p-3 bg-white border-t border-volcanic-100">
            <Caption>
              {benBucklerImage.title} — the northern headland of Bondi, near where the
              engravings sit. · {benBucklerImage.license}
            </Caption>
          </figcaption>
        </figure>
      )}

      <Prose>
        <p className="mt-12 italic text-volcanic-600">
          The conscious choice of this site is: we name the engravings, we tell you roughly where
          they are, and we do not provide a map or high-resolution photograph of the specific
          figures. That is the Aboriginal Heritage Office's framework — accessibility without
          advertisement — and it lets the sites remain visitable by people who know where to
          look, without turning them into Instagram destinations for people who do not. If you
          want to see them, a Waverley Council ranger or the{" "}
          <a
            href="https://www.aboriginalheritage.org/"
            target="_blank"
            rel="noopener"
            className="text-ocean-700 underline"
          >
            Aboriginal Heritage Office
          </a>{" "}
          offers guided walks on request.
        </p>
      </Prose>
    </Section>
  );
}
