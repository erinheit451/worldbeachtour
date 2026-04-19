/**
 * Waikīkī signature section: Mālama — Stewardship & Reciprocity.
 *
 * "Mālama ʻāina" means to care for the land. "Mālama kai" is to care for
 * the sea. This is not ornamental language — it is the legal, cultural, and
 * ecological framework Hawaiʻi operates under. The 2018 reef-safe sunscreen
 * law, the monk seal 50-foot rule, the Honolulu Marathon's Japanese half,
 * the Royal Hawaiian Band, the Hōkūleʻa voyaging canoe — all of it is
 * Waikīkī functioning as a Hawaiian place in the present tense.
 *
 * This section is both a public service (how to visit respectfully) and
 * a counterweight to the "Monarchy & Memory" signature — the present-tense
 * answer to the historical wound.
 */

import {
  Section,
  SectionHeader,
  Prose,
} from "@/components/showcase/legendary-beach";

export default function WaikikiMalama() {
  return (
    <Section id="malama">
      <SectionHeader
        eyebrow="· Mālama"
        title="Respect, reciprocity, real stewardship"
        kicker="The present-tense answer to the history. How Waikīkī is being cared for, right now, and how visitors can join that work."
      />
      <Prose>
        <p>
          <em>Mālama ʻāina</em> — care for the land. <em>Mālama kai</em> — care for the sea. In
          Hawaiian the word <strong>mālama</strong> means to care for, protect, honor, take
          responsibility for. It is not decorative. It is the legal, cultural, and ecological
          framework every Hawaiian policy conversation returns to, and Waikīkī has been shaped by it
          in specific, visible ways over the last generation.
        </p>
      </Prose>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <article className="rounded-xl bg-sand-50 p-7 border border-sand-100">
          <h3 className="font-display text-xl text-volcanic-900 mb-3">The 2018 sunscreen law</h3>
          <p className="text-[15px] text-volcanic-700 leading-relaxed">
            In 2018 Hawaiʻi became the <strong>first jurisdiction on Earth</strong> to ban sunscreen
            containing oxybenzone and octinoxate — the two UV-blocking chemicals most implicated in
            coral bleaching. The law took effect January 1, 2021. Waikīkī's reef is the specific
            reason the bill passed. You will see mineral sunscreen (zinc oxide, titanium dioxide)
            in every ABC Store now. Bring those, or buy them here. Reef-safe is not a marketing
            claim in Hawaiʻi — it is a statute.
          </p>
        </article>

        <article className="rounded-xl bg-ocean-50 p-7 border border-ocean-100">
          <h3 className="font-display text-xl text-volcanic-900 mb-3">The honu and the monk seal</h3>
          <p className="text-[15px] text-volcanic-700 leading-relaxed">
            <strong>Honu</strong> (green sea turtles) are federally protected under the Endangered
            Species Act. Approach within 10 feet is a violation. They will surface in Waikīkī's
            shallows. Stay back; they do not need help.
          </p>
          <p className="mt-3 text-[15px] text-volcanic-700 leading-relaxed">
            <strong>Hawaiian monk seals</strong> (ʻīlio holo i ka uaua — "the dog that runs on the
            rough water") are among the rarest marine mammals on Earth — roughly 1,400 left.
            They haul out to rest on Oʻahu beaches, most often at Kaimana Beach at Waikīkī's eastern
            end. The protocol is <strong>50 feet back</strong>. NOAA Marine Mammal Response
            volunteers rope off a sleeping seal within minutes. The seal is there to recover
            oxygen debt from diving. Bothering it is a federal offense.
          </p>
        </article>

        <article className="rounded-xl bg-white p-7 border border-volcanic-100">
          <h3 className="font-display text-xl text-volcanic-900 mb-3">Hōkūleʻa — the star of gladness</h3>
          <p className="text-[15px] text-volcanic-700 leading-relaxed">
            In <strong>1975</strong>, the Polynesian Voyaging Society launched{" "}
            <em>Hōkūleʻa</em> — a replica of an ancient double-hulled voyaging canoe — from
            Hawaiian waters. Its purpose was to prove that the Polynesian settlement of the Pacific
            was deliberate navigation, not drift, and to revive the traditional wayfinding
            knowledge that had nearly been lost. Master navigator <strong>Mau Piailug</strong>,
            from Satawal in Micronesia, taught the first crew to sail by stars, swells, and
            seabirds alone — no instruments. From 2014 to 2017 Hōkūleʻa completed a{" "}
            <strong>three-year, 40,000-nautical-mile voyage around the world</strong>.
          </p>
          <p className="mt-3 text-[15px] text-volcanic-700 leading-relaxed">
            When she is at home, she sails from the Sand Island harbor, ten kilometers west of
            Waikīkī. The voyage is the most visible artifact of the 1970s Hawaiian cultural
            renaissance that also revived the Hawaiian language, the hula, and the legal conversation
            about sovereignty. Hōkūleʻa is why Hawaiian cultural confidence is ascendant rather than
            retreating. She is why the Duke statue gets flowers every morning without anyone being
            paid to put them there.
          </p>
        </article>

        <article className="rounded-xl bg-white p-7 border border-volcanic-100">
          <h3 className="font-display text-xl text-volcanic-900 mb-3">The Royal Hawaiian Band</h3>
          <p className="text-[15px] text-volcanic-700 leading-relaxed">
            Founded <strong>1836</strong> by King Kamehameha III. The oldest continuously-operating
            municipal band in the United States. Uniformed, Hawaiian-led, plays free concerts at
            ʻIolani Palace every Friday at noon and frequently at Kapiʻolani Park. The repertoire
            is a mix of traditional Hawaiian anthems (<em>Hawaiʻi Ponoʻī</em>, the royal-era
            national anthem still used as state anthem; <em>Aloha ʻOe</em>, composed by
            Liliʻuokalani) and brass-band standards.
          </p>
          <p className="mt-3 text-[15px] text-volcanic-700 leading-relaxed">
            Seeing the Royal Hawaiian Band in uniform, playing the anthem of a deposed kingdom in
            front of the palace of its deposed queen, in 2026, is as close as a visitor can get to
            understanding why Hawaiian culture is not historical.
          </p>
        </article>
      </div>

      <div className="mt-12 rounded-2xl bg-volcanic-900 text-volcanic-50 p-8 sm:p-12">
        <h3 className="font-display text-2xl sm:text-3xl mb-6 text-white">What "aloha" actually means</h3>
        <Prose dark>
          <p>
            Aloha is not "hello." Aloha is a concept — a philosophy, arguably a spiritual practice
            — that happens to be used as a greeting because greetings are how cultures concentrate
            their values into a one-word handshake. The <strong>1986 Aloha Spirit Law</strong>{" "}
            (Hawaiʻi Revised Statutes §5-7.5) is a real statute that instructs Hawaiʻi's officials
            to consider the aloha spirit in decision-making. It decomposes the word into five
            qualities:
          </p>
          <ul className="grid gap-2 sm:grid-cols-5 mt-6 mb-8 text-sm">
            {[
              ["A", "Akahai", "kindness, tenderness"],
              ["L", "Lokahi", "unity, harmony"],
              ["O", "ʻOluʻolu", "agreeableness, patience"],
              ["H", "Haʻahaʻa", "humility, modesty"],
              ["A", "Ahonui", "perseverance, patience"],
            ].map(([letter, word, gloss]) => (
              <li key={letter} className="bg-volcanic-800/60 rounded-lg p-4 list-none">
                <div className="font-display text-3xl text-ocean-300">{letter}</div>
                <div className="font-display text-lg mt-1 text-white">{word}</div>
                <div className="text-xs italic text-volcanic-300 mt-1">{gloss}</div>
              </li>
            ))}
          </ul>
          <p>
            To greet someone with aloha is to commit to those qualities in the encounter. Locals
            who use the word sincerely will be embarrassed by the touristic use of it as
            pseudo-"hello-goodbye-mahalo." The right version is quieter and more specific: you
            thank the person at the kiosk who made your caipiroska; you take the time to learn
            <em> mahalo</em> properly; you step back fifty feet when you see a monk seal. That is
            the aloha the statute is talking about.
          </p>
        </Prose>
      </div>

      <Prose>
        <p className="mt-10 italic text-volcanic-600">
          If you leave Waikīkī knowing the word mahalo, how to pronounce ʻokina (the glottal stop),
          why Lēʻahi is the real name of Diamond Head, and why you should never touch a honu —
          you will have been a better guest than 95% of the two million visitors this beach sees
          each year. None of this is hard. The island thanks you in specific ways for it.
        </p>
      </Prose>
    </Section>
  );
}
