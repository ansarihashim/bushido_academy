import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { X } from 'lucide-react'
import { db } from '../firebase/config'

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="relative w-16 h-16">
        <span className="absolute inset-0 rounded-full border-4 border-neutral-800" />
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 animate-spin" />
      </div>
      <p className="mt-6 text-xs tracking-[0.3em] uppercase text-neutral-500 font-bold">
        Loading Gallery
      </p>
    </div>
  )
}

function Lightbox({ item, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = original
    }
  }, [onClose])

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 inline-flex items-center justify-center w-12 h-12 rounded-sm bg-neutral-900/80 border border-neutral-700 hover:bg-red-600 hover:border-red-600 text-white transition-colors"
      >
        <X size={22} />
      </button>

      <div
        className="relative max-w-6xl w-full max-h-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full flex items-center justify-center">
          <img
            src={item.imageUrl}
            alt={item.caption || 'Gallery image'}
            className="max-w-full max-h-[80vh] object-contain rounded-sm border-2 border-red-600 shadow-[0_30px_80px_-20px_rgba(220,38,38,0.4)]"
          />
        </div>
        {item.caption && (
          <div className="mt-5 max-w-3xl text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-2">
              Caption
            </p>
            <p className="text-white text-lg leading-relaxed">{item.caption}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function GalleryItem({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group block w-full mb-4 break-inside-avoid text-left bg-[#171717] border border-neutral-800 hover:border-red-600 rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(220,38,38,0.4)] cursor-zoom-in"
    >
      <div className="relative overflow-hidden bg-neutral-900">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.caption || 'Gallery image'}
            loading="lazy"
            className="block w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="aspect-square flex items-center justify-center bg-neutral-800">
            <span className="text-neutral-500 text-xs tracking-[0.25em] uppercase font-semibold">
              No Image
            </span>
          </div>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          View
        </span>
      </div>
      {item.caption && (
        <p className="px-4 py-3 text-sm text-neutral-300 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.caption}
        </p>
      )}
    </button>
  )
}

export default function Gallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchGallery() {
      try {
        const q = query(
          collection(db, 'gallery'),
          orderBy('uploadedAt', 'desc')
        )
        const snapshot = await getDocs(q)
        if (cancelled) return
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setItems(data)
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'Failed to load gallery')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchGallery()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* HERO BANNER */}
      <section className="relative py-24 sm:py-28 border-b border-neutral-900 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.18), transparent 60%), #0a0a0a',
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #dc2626 0 2px, transparent 2px 80px)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-4">
            Captured Moments
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-wide text-white">
            Gallery
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-neutral-700" />
            <span className="h-1 w-24 bg-red-600" />
            <span className="h-px w-12 bg-neutral-700" />
          </div>
          <p className="mt-8 text-lg text-neutral-400 max-w-2xl mx-auto">
            Moments from training sessions, tournaments, and academy life.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <LoadingSpinner />}

          {!loading && error && (
            <div className="max-w-2xl mx-auto bg-[#171717] border-l-4 border-red-600 p-6 rounded-sm">
              <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-2">
                Error
              </p>
              <p className="text-neutral-300">{error}</p>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-sm bg-red-950/40 border border-red-900/50 text-red-600 mb-6">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-9 h-9"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-white tracking-wide mb-3">
                Gallery coming soon!
              </h3>
              <p className="text-neutral-400">
                Photos from the academy will appear here.
              </p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {items.map((item) => (
                <GalleryItem
                  key={item.id}
                  item={item}
                  onOpen={setActive}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox item={active} onClose={() => setActive(null)} />
    </div>
  )
}
