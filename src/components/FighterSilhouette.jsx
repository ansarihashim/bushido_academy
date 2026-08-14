export default function FighterSilhouette({ className = '' }) {
  return (
    <svg
      viewBox="0 0 260 480"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <g fill="#eab308">
        {/* Head */}
        <circle cx="70" cy="58" r="24" />

        {/* Neck */}
        <rect x="62" y="80" width="16" height="14" />

        {/* Torso — leaning slightly into the kick */}
        <path d="M 38 94 L 102 94 L 112 232 L 30 232 Z" />

        {/* Kicking leg — extended out to the right */}
        <path d="M 100 208 L 235 158 L 244 184 L 110 238 Z" />

        {/* Front foot */}
        <ellipse cx="244" cy="172" rx="18" ry="11" />

        {/* Standing leg — vertical with slight knee bend */}
        <path d="M 38 230 L 82 230 L 80 332 L 92 418 L 50 422 L 46 332 Z" />

        {/* Standing foot */}
        <ellipse cx="72" cy="430" rx="24" ry="9" />

        {/* Front arm — extended forward in guard */}
        <path d="M 95 112 L 178 144 L 184 168 L 90 138 Z" />

        {/* Front fist */}
        <circle cx="190" cy="160" r="15" />

        {/* Rear arm — chambered back */}
        <path d="M 50 110 L 8 92 L 0 116 L 42 132 Z" />

        {/* Rear fist */}
        <circle cx="12" cy="104" r="12" />
      </g>
    </svg>
  )
}
