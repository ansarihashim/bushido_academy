import { Link } from 'react-router-dom'

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export default function NotFound() {
  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] min-h-[80vh] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(234,179,8,0.18), transparent 60%), #0a0a0a',
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #eab308 0 2px, transparent 2px 80px)',
        }}
      />

      <div className="text-center max-w-2xl">
        <p className="text-xs tracking-[0.3em] uppercase text-yellow-500 font-bold mb-4">
          Lost on the Path
        </p>
        <h1 className="text-[7rem] sm:text-[10rem] font-black tracking-tight text-white leading-none">
          4<span className="text-yellow-500">0</span>4
        </h1>
        <div className="flex items-center justify-center gap-3 my-6">
          <span className="h-px w-12 bg-neutral-700" />
          <span className="h-1 w-24 bg-yellow-500" />
          <span className="h-px w-12 bg-neutral-700" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-neutral-400 mb-10 max-w-md mx-auto leading-relaxed">
          The page you&rsquo;re looking for has wandered off the dojo mat.
          Return to the path of the warrior.
        </p>
        <Link
          to="/"
          className="group inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(234,179,8,0.6)]"
        >
          Go Home
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            <ArrowRightIcon />
          </span>
        </Link>
      </div>
    </div>
  )
}
