export default function RedDivider({ className = '', variant = 'line' }) {
  if (variant === 'diamond') {
    return (
      <div
        className={'flex items-center justify-center gap-3 ' + className}
        aria-hidden="true"
      >
        <span className="h-px w-12 bg-neutral-700" />
        <span className="w-2 h-2 bg-yellow-500 rotate-45" />
        <span className="h-px w-12 bg-neutral-700" />
      </div>
    )
  }

  if (variant === 'thick') {
    return (
      <div
        className={'flex items-center justify-center gap-3 ' + className}
        aria-hidden="true"
      >
        <span className="h-px w-16 bg-neutral-700" />
        <span className="h-1 w-24 bg-yellow-500" />
        <span className="h-px w-16 bg-neutral-700" />
      </div>
    )
  }

  return (
    <hr
      className={
        'border-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent ' +
        className
      }
      aria-hidden="true"
    />
  )
}
