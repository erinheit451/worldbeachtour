/**
 * NavagioFrame — the bespoke signature visual for navagio-1.
 *
 * Navagio's thesis is that the place *is* a single composition, shot from one
 * sanctioned cliff-edge angle. This diagram draws that frame and deconstructs
 * why it never changes: the limestone horseshoe, the wreck dead-centre, the
 * one camera position 200 m up, and the now-prohibited boat approach. It
 * deliberately renders an illustration, not a photo — because the cove is
 * closed and hard to photograph, which is the whole point.
 *
 * Hand-tuned SVG in the manner of nazare-v2's CanyonCrossSection.
 */

export default function NavagioFrame() {
  return (
    <figure className="my-4">
      <svg viewBox="0 0 800 520" className="w-full h-auto" role="img"
        aria-label="Annotated diagram of the canonical overhead photograph of Navagio cove">
        <defs>
          <linearGradient id="nv-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7fd4d0" />
            <stop offset="55%" stopColor="#2a8fb5" />
            <stop offset="100%" stopColor="#0c5a86" />
          </linearGradient>
          <linearGradient id="nv-cliff" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#efe9dd" />
            <stop offset="100%" stopColor="#c9bea6" />
          </linearGradient>
        </defs>

        {/* Open sea (deep) fills the frame */}
        <rect x="0" y="0" width="800" height="520" fill="url(#nv-water)" />

        {/* The limestone horseshoe — three cliff walls enclosing the cove */}
        <path
          d="M40,40 L760,40 L760,300 Q700,250 640,250 L600,250 Q560,150 470,140
             L330,140 Q240,150 200,250 L160,250 Q100,250 40,300 Z"
          fill="url(#nv-cliff)" stroke="#8a7a5c" strokeWidth="1.5" />
        {/* cliff hatching to read as height */}
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={i} x1={70 + i * 30} y1="44" x2={70 + i * 30} y2={i % 2 ? 120 : 95}
            stroke="#b3a585" strokeWidth="0.6" opacity="0.6" />
        ))}

        {/* White-pebble beach strip at the back of the cove */}
        <path d="M250,250 Q400,225 550,250 Q500,290 400,292 Q300,290 250,250 Z"
          fill="#f3efe6" stroke="#d8cdb4" strokeWidth="1" />

        {/* The wreck — MV Panagiotis, rust, dead centre, canted */}
        <g transform="translate(400,262) rotate(-18)">
          <rect x="-46" y="-9" width="92" height="20" rx="3" fill="#9c4a2a" stroke="#6f3115" strokeWidth="1.2" />
          <rect x="-46" y="-9" width="92" height="6" fill="#b5613c" />
          <rect x="6" y="-22" width="16" height="14" fill="#7f3a20" />
          <line x1="-46" y1="1" x2="46" y2="1" stroke="#5e2911" strokeWidth="0.8" />
        </g>

        {/* The one sanctioned camera position — north clifftop platform */}
        <g>
          <circle cx="120" cy="78" r="13" fill="#15110d" />
          <rect x="111" y="72" width="18" height="12" rx="2" fill="#15110d" />
          <circle cx="120" cy="78" r="4.5" fill="#fff" />
          {/* dashed sightline to the wreck */}
          <line x1="130" y1="86" x2="392" y2="256" stroke="#15110d" strokeWidth="1.4" strokeDasharray="5 5" />
          <text x="138" y="74" fontFamily="ui-monospace,monospace" fontSize="12" fill="#15110d">
            the only sanctioned angle
          </text>
          <text x="138" y="90" fontFamily="ui-monospace,monospace" fontSize="10" fill="#3f3a33">
            north platform · ~200 m up
          </text>
        </g>

        {/* The prohibited boat approach — greyed, struck through */}
        <g opacity="0.85">
          <line x1="400" y1="500" x2="400" y2="300" stroke="#64748b" strokeWidth="2" strokeDasharray="2 6" />
          <line x1="360" y1="430" x2="440" y2="470" stroke="#b91c1c" strokeWidth="2.5" />
          <text x="412" y="430" fontFamily="ui-monospace,monospace" fontSize="11" fill="#475569">
            boat landing &amp; swimming
          </text>
          <text x="412" y="446" fontFamily="ui-monospace,monospace" fontSize="11" fill="#b91c1c">
            prohibited, 2018 →
          </text>
        </g>

        {/* Vertical scale: cliff vs human-scale beach */}
        <g transform="translate(720,330)">
          <line x1="0" y1="0" x2="0" y2="150" stroke="#15110d" strokeWidth="1" />
          <line x1="-4" y1="0" x2="4" y2="0" stroke="#15110d" strokeWidth="1" />
          <line x1="-4" y1="150" x2="4" y2="150" stroke="#15110d" strokeWidth="1" />
          <text x="6" y="6" fontFamily="ui-monospace,monospace" fontSize="9" fill="#15110d">200 m</text>
          <text x="6" y="150" fontFamily="ui-monospace,monospace" fontSize="9" fill="#15110d">cliff</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-[13px] leading-[1.5] text-volcanic-500 italic">
        Why every photograph of Navagio is the same photograph: one cliff-edge
        platform, one frame, the wreck dead-centre — and, since 2018, no way down.
      </figcaption>
    </figure>
  );
}
