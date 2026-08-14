function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function UploadProgress({
  current = 0,
  total = 0,
  status = 'uploading',
  failed = [],
  successCount,
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="mt-6 bg-[#0a0a0a] border border-neutral-800 rounded-sm p-5">
      {status === 'uploading' && (
        <>
          <div className="flex items-center justify-between mb-3 gap-4">
            <p className="text-sm font-bold text-white">
              Uploading {current} of {total}{' '}
              {total === 1 ? 'image' : 'images'}...
            </p>
            <span className="text-xs text-neutral-500 font-semibold tabular-nums">
              {pct}%
            </span>
          </div>
          <div
            className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      )}

      {status === 'done' && (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-green-500/20 text-green-400">
            <CheckIcon />
          </span>
          <p className="text-sm font-bold text-green-400">
            {typeof successCount === 'number'
              ? `${successCount} ${successCount === 1 ? 'image' : 'images'} uploaded successfully`
              : 'All uploaded successfully'}
          </p>
        </div>
      )}

      {status === 'error' && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-green-500/20 text-green-400">
              <CheckIcon />
            </span>
            <p className="text-sm font-bold text-white">
              {typeof successCount === 'number' ? successCount : 0} uploaded,{' '}
              <span className="text-red-400">{failed.length} failed</span>
            </p>
          </div>
          {failed.length > 0 && (
            <div className="bg-red-950/30 border border-red-900/50 rounded-sm p-3">
              <p className="text-[10px] tracking-[0.25em] uppercase text-red-400 font-bold mb-1.5">
                Failed to upload
              </p>
              <ul className="space-y-0.5">
                {failed.map((name, i) => (
                  <li
                    key={`${name}-${i}`}
                    className="text-xs text-red-300 break-all"
                  >
                    • {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
