/**
 * Bondi signature: Shark Country.
 *
 * The 1929 shark panic, the 1937 shark nets, and the contemporary debate
 * about what Australian beach safety should look like. A true layered
 * Bondi story that connects to the Australian coastal imagination more
 * generally.
 */

import { Section, SectionHeader, Prose } from "@/components/showcase/legendary-beach";

export default function BondiSharks() {
  return (
    <Section id="sharks" className="bg-volcanic-900 text-volcanic-50" dark>
      <SectionHeader
        eyebrow="· Shark Country"
        title="The 1929 panic, the 1937 nets, the 2026 debate"
        kicker="Why there is a mesh net off this beach, what it catches, and why Australia has been arguing about it for 90 years."
        dark
      />
      <Prose dark>
        <p>
          Bondi is <strong>shark water</strong>, in a literal ecological sense. The NSW east coast
          is the meeting zone of the cool Southern Ocean current and the warm East Australian
          Current. Bronze whalers, grey nurse sharks, the occasional white shark, and — in summer —
          migrating tiger sharks all pass through the kilometer of ocean in front of Bondi's sand
          every year. This is not rare; it is the ocean doing ocean things.
        </p>
        <p>
          What the sharks mostly do not do is attack humans. The last <strong>fatal shark
          attack at Bondi itself</strong> was in 1929. There have been a handful of non-fatal
          encounters since. Across all Sydney beaches, you are vastly more likely to drown in a
          rip current than to be bitten by a shark. The lifeguards are watching for the rips.
        </p>
        <p>
          And yet: from late <strong>1928 through early 1929</strong>, a cluster of shark attacks
          along the Sydney eastern beaches — including two fatal attacks in Sydney Harbour — caused
          a genuine public panic. Newspapers ran photographs of sharks hoisted on gaffs. Swimming
          numbers collapsed; shopkeepers on Campbell Parade complained of lost business. The NSW
          government convened a commission. The commission recommended, in 1935, that the
          government install <strong>meshing nets</strong> along the Sydney coast.
        </p>
        <p>
          The nets went in on 1 October 1937. They cover Bondi and 50 other New South Wales
          beaches today. They are <strong>not a physical barrier</strong> — they are 150-meter
          stretches of mesh set parallel to shore, in about 10 meters of water, intended to reduce
          the local shark population. Sharks swim over them, under them, and around them. The
          nets cull, rather than exclude.
        </p>
      </Prose>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-volcanic-800/60 p-6">
          <h3 className="font-display text-xl text-white mb-3">The net numbers</h3>
          <Prose dark>
            <p>
              A typical year of NSW shark nets catches about <strong>375 animals</strong>. Of
              those, roughly 35% are the target species (white, tiger, and bull sharks). The rest
              — about 65% — is what the industry calls <em>bycatch</em>: non-target sharks, rays,
              turtles, dolphins, and the occasional small whale. The NSW Department of Primary
              Industries publishes annual entanglement reports.
            </p>
          </Prose>
        </div>
        <div className="rounded-xl bg-volcanic-800/60 p-6">
          <h3 className="font-display text-xl text-white mb-3">What else is there</h3>
          <Prose dark>
            <p>
              Since the 2010s, NSW has added <strong>SMART drumlines</strong> (baited hooks that
              trigger an alert when a shark is caught — the shark is then tagged and released
              offshore) and <strong>listening stations</strong> that detect tagged sharks in real
              time and send alerts to lifeguard apps. Many researchers believe this modern
              combination is more effective and less destructive than the mesh nets. The
              government has not removed the nets.
            </p>
          </Prose>
        </div>
      </div>

      <Prose dark>
        <p className="mt-10">
          The political debate has been active for twenty years. Marine biologists, the{" "}
          <strong>Sea Shepherd</strong> foundation, and sections of the Surfrider Foundation have
          pushed for net removal. Fisher and surf-lifesaving groups have defended them. Local
          councils are split. Waverley Council (which governs Bondi) has formally expressed
          openness to replacement. The state government controls the final decision.
        </p>
        <p>
          What a visitor should take away is specific: <strong>you are extraordinarily safe
          swimming at Bondi.</strong> The lifeguards have drones that scan the water every
          half-hour. Shark-detecting buoys notify rescue services. The nets — for all their
          problems — have reduced fatal attacks at Sydney beaches to near-zero for nine decades.
          The ocean is still an ocean. The Australians have simply built the world's most
          elaborate surveillance state around it, and argued about it publicly for ninety years.
        </p>
      </Prose>
    </Section>
  );
}
