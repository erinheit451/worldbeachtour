/**
 * Teahupoʻo signature: The Bathymetry — why this wave breaks like nothing else.
 *
 * Open ocean → 1000 ft within ⅓ mile → ~10 m at takeoff → <2 m at the lip.
 * The wave doesn't shoal; it folds. The crest stays above sea level while
 * the trough scoops out below it, producing the famous below-sea-level
 * square-lip cylinder over a coral floor 51 cm under the lip impact zone.
 */

import {
  WideSection,
  SectionHeader,
  Prose,
} from "@/components/showcase/legendary-beach";

export default function TeahupooBathymetry() {
  return (
    <WideSection id="bathymetry" className="bg-ocean-50/40">
      <SectionHeader
        eyebrow="· The Bathymetry"
        title="The wave that folds instead of shoaling"
        kicker="Open Pacific drops to a thousand feet within a third of a mile of shore. The reef shelf rises 150 ft to 30 ft on roughly a 1:1 vertical-to-horizontal slope. By the time the wave breaks, water depth at the lip impact zone is 51 cm. There is no continental shelf to absorb the swell first. The wave doesn't shoal — it folds."
      />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start">
        <Prose>
          <p>
            Teahupoʻo is not the largest wave anyone surfs. <strong>Nazaré</strong> is taller;
            <strong> Cortes Bank</strong> moves more water in the abstract; <strong>Mavericks</strong>
            sits over a deeper bottom and is more forgiving when things go wrong. What Teahupoʻo
            is, instead, is the most <em>concentrated</em> wave on earth — the most physically
            wrong-looking thing anyone has ridden — and it owes that to a single piece of
            geometry.
          </p>
          <p>
            The wave breaks at <strong>Passe Havae</strong>, a freshwater-cut channel through the
            barrier reef approximately 800 m offshore from the village. The pass was carved over
            millennia by streams draining the ~4,000-ft volcanic ridge of Tahiti Iti. The pass
            itself is calm — that is the channel, where photographer boats sit. The wave breaks
            on the south wall of the pass, on the inside reef, which is what the swell encounters
            after running unobstructed across nearly the entire Pacific.
          </p>
          <p>
            <strong>The first thing that's strange is the open-ocean approach.</strong> The
            seafloor drops to more than 1,000 ft within a third of a mile of shore and to more
            than a mile deep within three miles offshore. There is no continental shelf to slow a
            swell down. The wave arrives at the reef with all of its open-ocean speed and energy
            intact; nothing has had a chance to shoal it gradually.
          </p>
          <p>
            <strong>The second thing is the reef-shelf gradient.</strong> When the swell finally
            does feel bottom — about half a mile from shore — the rise is steep: from roughly
            150 ft of depth to about 30 ft, on close to a 1:1 vertical-to-horizontal slope. At
            the takeoff zone, water is in the 10 m range over a flatter "stand-up" shelf. The
            wave then breaks over a final reef rise where the trough can be{" "}
            <strong>less than 2 m of water under a 15 m face</strong>. Reef depth at the lip
            impact zone on the inside reef has been measured at as little as{" "}
            <strong>51 cm — twenty inches</strong>.
          </p>
          <p>
            <strong>The third thing — the one you can see — is what those numbers do to the
            wave's shape.</strong> A normal wave shoals: as it feels bottom, the trough slows
            faster than the crest, the crest steepens, and the wave eventually pitches into a
            triangular peak before breaking. Teahupoʻo doesn't have time. The depth changes
            faster than the wave can shoal. So the wave stays linear: too much water remains in
            the crest, the trough scoops out below sea level, and the wave produces the famous{" "}
            <strong>below-sea-level square-lip cylinder</strong> rather than a triangular peak.
            Riding it is — literally — riding a wall of water that is partly underneath where
            the ocean's surface used to be.
          </p>
          <p>
            <strong>The swell that lights it up</strong> comes from the southern hemisphere — the
            Roaring Forties storm tracks south of New Zealand and across the Southern Ocean.
            Long-period groundswells fan north into French Polynesia and arrive at Passe Havae
            from the south-southwest. The optimal local wind is a light easterly trade — cross-
            offshore on the wave's left, holding the lip up and clean. The big-wave window runs{" "}
            <strong>April through October</strong>, with the heaviest swells typically in May,
            August, and September. The Tahiti Pro is held in May; the 2024 Olympics ran the last
            week of July through the first week of August, near the historical peak.
          </p>
          <p>
            <strong>What is not strange about Teahupoʻo</strong> is the channel, which is deep
            and predictable and which is why the wave has stayed photographable. Surfers paddle
            out down the channel; safety jet skis stage in the channel; spectator taxi-boats sit
            in the channel watching the lefthander peel toward shore. The channel is what makes
            the wave a sport rather than just a hazard. The wave is the show; the channel is the
            theater.
          </p>
        </Prose>

        <aside className="rounded-2xl bg-white border border-volcanic-100 p-7 lg:sticky lg:top-24">
          <h3 className="font-display text-xl text-volcanic-900 mb-5">The numbers</h3>
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Open-ocean depth at ⅓ mile out
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">&gt;1,000 ft</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Reef-shelf gradient
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">~1:1 vert:horiz</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Depth at takeoff
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">~10 m</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Depth at lip impact (inside reef)
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">51 cm</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Trough below sea level on a 15 m face
              </dt>
              <dd className="font-display text-3xl text-volcanic-900 mt-1">~5 m</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Big-wave swell window
              </dt>
              <dd className="font-display text-xl text-volcanic-900 mt-1">Apr–Oct</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Distance from village to break
              </dt>
              <dd className="font-display text-xl text-volcanic-900 mt-1">~800 m</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-ocean-700">
                Confirmed surfing fatalities
              </dt>
              <dd className="font-display text-xl text-volcanic-900 mt-1">1 (Brice Taerea, 2000)</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs italic text-volcanic-500 leading-relaxed">
            Sources: Surfline (Mechanics of Teahupoo); Wikipedia: Teahupoʻo; The Conversation
            (Anatomy of a wave, 2024); SchoonerMan, Havae Pass.
          </p>
        </aside>
      </div>
    </WideSection>
  );
}
