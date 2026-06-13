import { useCallback, useEffect, useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, key: Date.now() })
  }, [])

  return { toast, showToast }
}

export default function Toast({ toast, onClose }) {
  if (!toast) return null

  const isError = toast.type === 'error'

  return (
    <div
      role="status"
      aria-live="polite"
      className={
        'fixed top-6 right-6 z-[200] max-w-sm flex items-start gap-3 p-4 pr-10 rounded-sm shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border-l-4 animate-[slideIn_0.25s_ease-out] ' +
        (isError
          ? 'bg-[#171717] border-red-600 text-white'
          : 'bg-[#171717] border-red-600 text-white')
      }
    >
      <span
        className={
          'flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-sm ' +
          (isError ? 'bg-red-950/60 text-red-400' : 'bg-red-600 text-white')
        }
      >
        {isError ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <div className="flex-1">
        <p className="text-[10px] tracking-[0.3em] uppercase text-red-600 font-bold mb-0.5">
          {isError ? 'Error' : 'Success'}
        </p>
        <p className="text-sm text-neutral-200 leading-relaxed">
          {toast.message}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="absolute top-2 right-2 inline-flex items-center justify-center w-6 h-6 rounded-sm text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
