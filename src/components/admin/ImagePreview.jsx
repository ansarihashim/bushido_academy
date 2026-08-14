import { useEffect, useMemo } from 'react'

function XIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function ImagePreview({
  file,
  onRemove,
  captionValue = '',
  onCaptionChange,
  showCaption = true,
  children,
}) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])

  // Revoke the object URL when the file changes or the component unmounts.
  useEffect(() => {
    if (!url) return undefined
    return () => URL.revokeObjectURL(url)
  }, [url])

  return (
    <div className="relative bg-[#0a0a0a] border border-neutral-800 rounded-sm overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-neutral-900">
        {url && (
          <img
            src={url}
            alt={file?.name || 'Selected image preview'}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove image from selection"
            className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-sm bg-black/70 hover:bg-yellow-500 text-white hover:text-black transition-colors"
          >
            <XIcon />
          </button>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        {showCaption && (
          <input
            type="text"
            value={captionValue}
            onChange={(e) => onCaptionChange?.(e.target.value)}
            placeholder="Caption (optional)"
            className="w-full bg-[#171717] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white text-sm px-3 py-2 rounded-sm placeholder:text-neutral-600 transition-colors"
          />
        )}
        {children}
        {file?.name && (
          <p className="text-[10px] text-neutral-500 truncate" title={file.name}>
            {file.name}
          </p>
        )}
      </div>
    </div>
  )
}
