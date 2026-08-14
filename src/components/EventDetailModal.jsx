import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const MODAL_STYLES = `
  @keyframes eventModalIn {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: none; }
  }
`

function formatModalDate(date) {
  const d =
    date instanceof Date
      ? date
      : date && typeof date.toDate === 'function'
        ? date.toDate()
        : date
          ? new Date(date)
          : null
  if (!d || Number.isNaN(d.getTime())) return ''
  return d
    .toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase()
}

export default function EventDetailModal({ event, onClose }) {
  const [currentImg, setCurrentImg] = useState(0)

  // Cover image first, then any additional images; drop empties/dupes.
  const allImages = [event?.imageUrl, ...(event?.images || [])].filter(Boolean)
  const total = allImages.length
  const many = total > 1

  // Lock background scroll + ESC to close while open.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') setCurrentImg((i) => (i - 1 + total) % total)
      else if (e.key === 'ArrowRight') setCurrentImg((i) => (i + 1) % total)
    }
    document.addEventListener('keydown', onKey)
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = original
    }
  }, [onClose, total])

  // Auto-advance the carousel every 4s when there's more than one image.
  useEffect(() => {
    if (total < 2) return
    const id = setInterval(() => setCurrentImg((i) => (i + 1) % total), 4000)
    return () => clearInterval(id)
  }, [total])

  if (!event) return null

  const go = (d) => setCurrentImg((i) => (i + d + total) % total)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={event.title || 'Event details'}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'overlayFadeIn 250ms ease forwards',
      }}
    >
      <style>{MODAL_STYLES}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#111111',
          border: '1px solid #eab308',
          borderRadius: '8px',
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8)',
          animation: 'eventModalIn 300ms cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 5,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid #404040',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* ---------- Image area ---------- */}
        {total === 0 ? (
          <div className="aspect-video w-full flex items-center justify-center bg-neutral-900 rounded-t-lg">
            <span className="text-neutral-600 text-xs tracking-[0.25em] uppercase font-bold">
              No Image
            </span>
          </div>
        ) : (
          <div className="relative bg-black">
            <div className="relative w-full flex items-center justify-center">
              <img
                src={allImages[currentImg]}
                alt={event.title || 'Event image'}
                style={{
                  width: '100%',
                  maxHeight: '55vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />

              {many && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/60 border border-neutral-700 hover:bg-yellow-500 hover:text-black text-white transition-colors"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/60 border border-neutral-700 hover:bg-yellow-500 hover:text-black text-white transition-colors"
                  >
                    <ChevronRight size={22} />
                  </button>
                  {/* Counter */}
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-sm bg-black/70 text-white text-xs font-heading font-bold tracking-[0.15em] tabular-nums">
                    {currentImg + 1} / {total}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {many && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  padding: '8px 12px',
                }}
              >
                {allImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    onClick={() => setCurrentImg(i)}
                    style={{
                      width: '70px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border:
                        i === currentImg
                          ? '2px solid #eab308'
                          : '2px solid transparent',
                      opacity: i === currentImg ? 1 : 0.6,
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------- Text content ---------- */}
        <div className="p-6 sm:p-8">
          {formatModalDate(event.date) && (
            <p className="font-heading text-xs sm:text-sm tracking-[0.25em] uppercase text-yellow-500 font-bold mb-3">
              {formatModalDate(event.date)}
            </p>
          )}
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.03em] text-white leading-none">
            {event.title || 'Untitled Event'}
          </h2>
          <span className="block mt-5 h-1 w-20 bg-yellow-500" />

          {event.description && (
            <p className="mt-6 text-neutral-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
