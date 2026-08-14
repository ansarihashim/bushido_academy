import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { db } from '../firebase/config'
import useScrollReveal from '../hooks/useScrollReveal'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { useContent } from '../context/ContentContext'

const SKELETON_HEIGHTS = [220, 300, 180, 260, 320, 200, 280, 240, 210, 290, 190, 250]

/* Floating yellow particles — positions fixed once at module load (matches About) */
const PARTICLES = Array.from({ length: 20 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 3 + Math.random() * 5,
  delay: Math.random() * 6,
  duration: 6 + Math.random() * 8,
}))

const STYLES = `
  @keyframes floatDot {
    0%   { transform: translateY(0) scale(1); opacity: 0.15; }
    50%  { transform: translateY(-32px) scale(1.4); opacity: 0.85; }
    100% { transform: translateY(0) scale(1); opacity: 0.15; }
  }
  .float-dot { animation-name: floatDot; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }

  /* Hero entrance — staggered fade-in + slide-up on page load */
  @keyframes heroFadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes heroLineGrow { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
  .hero-anim { animation: heroFadeUp 800ms ease-out both; }
  .hero-line { animation: heroLineGrow 800ms ease-out both; transform-origin: center; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  @media (prefers-reduced-motion: reduce) {
    .float-dot, .hero-anim, .hero-line {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`

/* -------------------------------------------------------------------------- */
/*  Scroll-revealed masonry image                                             */
/* -------------------------------------------------------------------------- */

function GalleryImage({ item, index, onOpen }) {
  const [ref, visible] = useScrollReveal()
  // Varied stagger (derived from index) so images don't pop in together.
  const delay = (index % 6) * 90

  return (
    <div
      ref={ref}
      className="mb-3 break-inside-avoid"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(40px)',
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="group relative block w-full overflow-hidden cursor-zoom-in"
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.caption || 'Gallery image'}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="block w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="aspect-square flex items-center justify-center bg-neutral-800">
            <span className="text-neutral-500 text-xs tracking-[0.25em] uppercase font-semibold">
              No Image
            </span>
          </div>
        )}
        {/* Hover overlay + caption */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/60 transition-all duration-300">
          {item.caption && (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center text-sm sm:text-base font-medium leading-relaxed px-5">
              {item.caption}
            </span>
          )}
        </div>
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Uniform grid layout                                                       */
/* -------------------------------------------------------------------------- */

function GridLayout({ items, onOpen }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '12px',
      }}
    >
      {items.map((item, i) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onOpen(i)}
          className="group relative block w-full overflow-hidden rounded-sm cursor-zoom-in bg-neutral-900"
        >
          <img
            src={item.imageUrl}
            alt={item.caption || 'Gallery image'}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            style={{
              width: '100%',
              height: '250px',
              objectFit: 'cover',
              display: 'block',
            }}
            className="transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {item.caption && (
              <span className="p-4 text-white text-sm font-medium leading-snug text-left">
                {item.caption}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Slideshow layout — one image, auto-advance, prev/next, counter            */
/* -------------------------------------------------------------------------- */

function SlideshowLayout({ items, onOpen }) {
  const [idx, setIdx] = useState(0)
  const total = items.length

  useEffect(() => {
    if (total < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 3000)
    return () => clearInterval(t)
  }, [total])

  const item = items[idx]
  const go = (d) => setIdx((i) => (i + d + total) % total)

  return (
    <div className="relative max-w-4xl mx-auto">
      <button
        type="button"
        onClick={() => onOpen(idx)}
        className="block w-full overflow-hidden rounded-sm cursor-zoom-in bg-neutral-900 border border-neutral-800"
      >
        <img
          src={item.imageUrl}
          alt={item.caption || 'Gallery image'}
          className="w-full max-h-[70vh] object-contain mx-auto block"
        />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-12 h-12 rounded-sm bg-neutral-900/80 border border-neutral-700 hover:bg-yellow-500 hover:border-yellow-500 text-white hover:text-black transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-12 h-12 rounded-sm bg-neutral-900/80 border border-neutral-700 hover:bg-yellow-500 hover:border-yellow-500 text-white hover:text-black transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div className="mt-5 flex items-center justify-center gap-4">
        <span className="font-heading text-sm tracking-[0.25em] text-yellow-500 font-bold tabular-nums">
          {idx + 1} / {total}
        </span>
      </div>
      {item.caption && (
        <p className="mt-2 text-center text-neutral-400">{item.caption}</p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Lightbox with prev/next + keyboard nav                                    */
/* -------------------------------------------------------------------------- */

function Lightbox({ items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    // Only lock page scroll / bind keys while the lightbox is actually open.
    // (This component stays mounted with index == null, so without this guard
    // it would lock body scroll on mount and the page could never scroll.)
    if (index == null) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = original
    }
  }, [index, onClose, onPrev, onNext])

  if (index == null) return null
  const item = items[index]
  if (!item) return null
  const many = items.length > 1

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 inline-flex items-center justify-center w-12 h-12 rounded-sm bg-neutral-900/80 border border-neutral-700 hover:bg-yellow-500 hover:border-yellow-500 text-white hover:text-black transition-colors"
      >
        <X size={22} />
      </button>

      {many && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-12 h-12 rounded-sm bg-neutral-900/80 border border-neutral-700 hover:bg-yellow-500 hover:border-yellow-500 text-white hover:text-black transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-12 h-12 rounded-sm bg-neutral-900/80 border border-neutral-700 hover:bg-yellow-500 hover:border-yellow-500 text-white hover:text-black transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div
        className="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.imageUrl}
          alt={item.caption || 'Gallery image'}
          className="max-w-[90vw] max-h-[80vh] object-contain rounded-sm border-2 border-yellow-500 shadow-[0_30px_80px_-20px_rgba(234,179,8,0.4)]"
        />
        {item.caption && (
          <p className="mt-5 max-w-3xl text-center text-yellow-500 text-base sm:text-lg leading-relaxed">
            {item.caption}
          </p>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Loading skeleton (masonry)                                                */
/* -------------------------------------------------------------------------- */

function SkeletonGrid() {
  return (
    <div
      className="columns-2 md:columns-3 lg:columns-4"
      style={{ columnGap: '12px' }}
      aria-hidden="true"
    >
      {SKELETON_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="mb-3 break-inside-avoid rounded-sm bg-neutral-800 animate-pulse"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Empty state                                                               */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-sm bg-yellow-950/40 border border-yellow-900/50 text-yellow-500 mb-6">
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
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      </div>
      <h3 className="text-3xl font-black text-white tracking-wide mb-3">
        Gallery is being built.
      </h3>
      <p className="text-neutral-400">Check back soon.</p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Gallery() {
  const { settings } = useSiteSettings()
  const { t } = useContent()
  const layout = settings.galleryLayout || 'masonry'
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchGallery() {
      try {
        const q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'))
        const snapshot = await getDocs(q)
        if (cancelled) return
        const images = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setItems(images)
      } catch (err) {
        if (cancelled) return
        setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchGallery()
    return () => {
      cancelled = true
    }
  }, [])

  // Only render documents that actually have an image URL.
  const validImages = items.filter((img) => img.imageUrl)
  const total = validImages.length
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () =>
    setLightboxIndex((i) => (i == null ? i : (i - 1 + total) % total))
  const nextImage = () =>
    setLightboxIndex((i) => (i == null ? i : (i + 1) % total))

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] overflow-hidden">
      <style>{STYLES}</style>

      {/* ===================== HERO (matches About) ===================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden px-4">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="float-dot absolute rounded-full bg-yellow-500"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl">
          <p
            className="hero-anim font-heading text-xs sm:text-sm tracking-[0.35em] uppercase text-yellow-500 font-bold mb-5"
            style={{ animationDelay: '0ms' }}
          >
            {t('gallery_label', 'Captured Moments')}
          </p>
          <h1
            className="hero-anim font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.04em] text-white leading-none"
            style={{ animationDelay: '200ms' }}
          >
            {t('gallery_heading', 'GALLERY')}
          </h1>
          <span
            className="hero-line block mx-auto mt-8 h-1 w-24 bg-yellow-500"
            style={{ animationDelay: '400ms' }}
          />
          <p
            className="hero-anim mt-8 text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed"
            style={{ animationDelay: '600ms' }}
          >
            {t('gallery_subtext', 'Every photograph is a moment of dedication, sweat, and triumph.')}
          </p>
        </div>
      </section>

      {/* ===================== GALLERY ===================== */}
      <section className="py-24 sm:py-32 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <SkeletonGrid />}

          {!loading && error && (
            <div
              role="alert"
              className="max-w-2xl mx-auto bg-red-950/40 border-2 border-red-600 p-6 rounded-sm"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-red-400 font-bold mb-2">
                Failed to load gallery
              </p>
              <pre className="text-sm text-red-200 whitespace-pre-wrap break-all font-mono">
                {error}
              </pre>
            </div>
          )}

          {!loading && !error && validImages.length === 0 && <EmptyState />}

          {!loading && !error && validImages.length > 0 && layout === 'grid' && (
            <GridLayout items={validImages} onOpen={setLightboxIndex} />
          )}

          {!loading &&
            !error &&
            validImages.length > 0 &&
            layout === 'slideshow' && (
              <SlideshowLayout items={validImages} onOpen={setLightboxIndex} />
            )}

          {!loading &&
            !error &&
            validImages.length > 0 &&
            layout !== 'grid' &&
            layout !== 'slideshow' && (
              <div
                className="columns-2 md:columns-3 lg:columns-4"
                style={{ columnGap: '12px' }}
              >
                {validImages.map((item, i) => (
                  <GalleryImage
                    key={item.id}
                    item={item}
                    index={i}
                    onOpen={setLightboxIndex}
                  />
                ))}
              </div>
            )}
        </div>
      </section>

      <Lightbox
        items={validImages}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </div>
  )
}
