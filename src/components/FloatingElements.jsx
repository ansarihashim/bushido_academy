/* -------------------------------------------------------------------------- */
/*  SVG primitives                                                            */
/* -------------------------------------------------------------------------- */

function GloveSvg() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <g fill="#eab308">
        {/* glove body */}
        <ellipse cx="46" cy="55" rx="38" ry="32" />
        {/* thumb bump on right (facing right) */}
        <ellipse cx="78" cy="48" rx="14" ry="20" />
        {/* wrist cuff */}
        <rect x="8" y="78" width="62" height="14" rx="4" />
        {/* cuff stripe */}
        <rect x="8" y="86" width="62" height="2" fill="#0a0a0a" opacity="0.6" />
      </g>
    </svg>
  )
}

function NunchakuSvg() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <g fill="#eab308">
        {/* top stick */}
        <rect x="15" y="8" width="14" height="42" rx="3" />
        {/* bottom stick */}
        <rect x="71" y="50" width="14" height="42" rx="3" />
        {/* chain dots */}
        <circle cx="34" cy="48" r="2.2" />
        <circle cx="42" cy="52" r="2.2" />
        <circle cx="50" cy="56" r="2.2" />
        <circle cx="58" cy="60" r="2.2" />
        <circle cx="66" cy="64" r="2.2" />
      </g>
    </svg>
  )
}

function ShurikenSvg() {
  // 8-pointed star: 16 points alternating outer (r=45) / inner (r=18) around (50,50)
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <g fill="#eab308">
        <path
          d="M 50 5
             L 56.89 33.37
             L 81.82 18.18
             L 66.63 43.11
             L 95 50
             L 66.63 56.89
             L 81.82 81.82
             L 56.89 66.63
             L 50 95
             L 43.11 66.63
             L 18.18 81.82
             L 33.37 56.89
             L 5 50
             L 33.37 43.11
             L 18.18 18.18
             L 43.11 33.37
             Z"
        />
        {/* central hole */}
        <circle cx="50" cy="50" r="6" fill="#0a0a0a" />
      </g>
    </svg>
  )
}

function FistSvg() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <g fill="#eab308">
        {/* knuckles row */}
        <rect x="20" y="28" width="58" height="34" rx="8" />
        {/* thumb */}
        <ellipse cx="80" cy="46" rx="10" ry="15" />
        {/* arm/wrist */}
        <rect x="28" y="58" width="46" height="36" rx="6" />
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*  Composed component — absolutely positioned floaters                       */
/* -------------------------------------------------------------------------- */

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      {/* GLOVE — left, mid */}
      <div
        className="absolute opacity-[0.08] animate-swing-glove"
        style={{ left: '5%', top: '40%', width: '120px', height: '120px' }}
      >
        <GloveSvg />
      </div>

      {/* NUNCHAKU — top right */}
      <div
        className="absolute opacity-[0.06] animate-sway-nun"
        style={{ right: '8%', top: '20%', width: '110px', height: '110px' }}
      >
        <NunchakuSvg />
      </div>

      {/* SHURIKEN — bottom left */}
      <div
        className="absolute opacity-[0.07] animate-spin-shuriken"
        style={{ left: '10%', bottom: '20%', width: '100px', height: '100px' }}
      >
        <ShurikenSvg />
      </div>

      {/* FIST — right side, lower */}
      <div
        className="absolute opacity-[0.08] animate-jab"
        style={{ right: '15%', bottom: '35%', width: '110px', height: '110px' }}
      >
        <FistSvg />
      </div>
    </div>
  )
}
