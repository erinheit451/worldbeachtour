/**
 * Nazaré signature: The Canyon.
 *
 * The reason Nazaré is Nazaré. A 230 km submarine canyon begins 500 m off
 * the beach and runs 5,000 m down to the abyssal plain. Winter Atlantic
 * swells split along the canyon edge, refract, and re-converge offshore
 * of Praia do Norte — arriving focused, amplified, and reshaped by the
 * sudden 95m-to-zero bathymetry at the coast.
 */

import {
  WideSection,
  SectionHeader,
  Prose,
} from "@/components/showcase/legendary-beach";

export default function NazareCanyon() {
  return (
    <WideSection id="canyon" className="bg-ocean-50/40">
      <SectionHeader
        eyebrow="· The Canyon"
        title="The physics of what shouldn't exist"
        kicker="A 230-km submarine trench begins 500 meters off this beach and runs 5 kilometers straight down. The Atlantic's biggest waves exist because of what happens when a swell meets it."
      />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start">
        <Prose>
          <p>
            The <strong>Nazaré Canyon</strong> — <em>Canhão da Nazaré</em> — is one of the largest
            submarine canyons in Europe. It begins approximately{" "}
            <strong>500 meters off the coast at Praia do Norte</strong>, cuts straight out to the
            west for 230 km, and plunges to a maximum depth of roughly{" "}
            <strong>5,000 m</strong> at its terminus on the Iberian Abyssal Plain. Its head — the
            canyon's shoreward end — is startlingly shallow and startlingly close. You can stand
            at the lighthouse at Forte de São Miguel, look down and slightly offshore, and be
            looking at the edge of a 5 km drop.
          </p>
          <p>
            This is not rare geology in a grand sense — submarine canyons exist off many
            coastlines. What is rare is the <strong>geometry of this specific canyon</strong>.
            Two features make it produce waves no other canyon does.
          </p>
          <p>
            <strong>First: swell refraction along the canyon axis.</strong> When a winter Atlantic
            swell arrives from the northwest, part of the wave front crosses the canyon's north
            rim and continues over the shallow shelf. The other part runs <em>down the canyon
            axis</em>, traveling through much deeper water. The two halves of the wave travel at
            different speeds (deep water = fast; shallow shelf = slow). By the time they
            re-converge near the shore, the shallower-traveling wave has been <strong>delayed
            just enough</strong> that the two wave fronts arrive at Praia do Norte{" "}
            <em>in phase</em>. The amplitudes add. What was a 4-meter open-ocean swell offshore
            becomes, functionally, an 8-meter wave at the break.
          </p>
          <p>
            <strong>Second: the bathymetric ramp at the canyon head.</strong> The canyon's
            shoreward end is abrupt — the seafloor rises from 95 meters to the beach within
            roughly 500 horizontal meters. Water arriving from the deep canyon has all the speed
            and all the mass of deep-ocean water, and when it hits the 95-to-zero ramp it has
            nowhere to go but up. The wave face rears; the crest folds over the trough;{" "}
            <strong>the wave breaks at a height the same swell would never reach on a normal
            continental-shelf coastline</strong>. Researchers at the University of Lisbon and the
            IPMA (Instituto Português do Mar e da Atmosfera) published the mechanism in a 2013
            paper that is still the definitive technical treatment.
          </p>
          <p>
            The result, every winter between October and February, is a break that nobody else on
            the planet has. The biggest days at Nazaré produce wave faces in the <strong>20–28
            meter range</strong>. The current certified world record — Sebastian Steudtner's 2020
            ride — was measured at 26.21 m. Post-ride photogrammetry by researchers at the
            University of Alcalá suggested the actual height was closer to <strong>28.6 m</strong>.
            Either number makes this the largest wave ever surfed under any recognized standard.
          </p>
          <p>
            The canyon is also why Nazaré was never a historical big-wave surf spot. The physics
            work <em>only</em> when a northwest Atlantic swell hits at a specific angle. That
            window is rare — maybe 15-20 days per year. Before satellite swell forecasting, a
            surfer would have had no way to know when to be here. The modern Nazaré era begins
            the same year that open-access Magic Seaweed and Surfline forecasting data became
            reliable for European Atlantic swells: <strong>2010</strong>.
          </p>
        </Prose>

        <aside className="rounded-2xl bg-white border border-volcanic-100 p-7 lg:sticky lg:top-24">
          <h3 className="font-display text-xl text-volcanic-900 mb-5">The numbers</h3>
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Canyon length
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">230 km</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Maximum depth
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">5,000 m</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Canyon head depth (at the beach)
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">95 m</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Distance from canyon head to shore
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">~500 m</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Current record wave (2020)
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">26.21 m</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Big-wave swell window
              </dt>
              <dd className="font-display text-xl text-volcanic-900 mt-1">Oct–Feb</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Peak-size days per year
              </dt>
              <dd className="font-display text-xl text-volcanic-900 mt-1">15–20</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs italic text-volcanic-500 leading-relaxed">
            Sources: IPMA (Instituto Português do Mar), University of Lisbon (Oliveira et al. 2013
            JGR:Oceans), WSL Big Wave Awards, Guinness World Records.
          </p>
        </aside>
      </div>
    </WideSection>
  );
}
