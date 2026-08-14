import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { db } from '../firebase/config'
import { useContent } from '../context/ContentContext'
import useScrollReveal from '../hooks/useScrollReveal'

/* -------------------------------------------------------------------------- */
/*  Shared animation styles (mirrors About.jsx)                               */
/* -------------------------------------------------------------------------- */

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

  @keyframes caretBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  .type-caret { animation: caretBlink 1s step-end infinite; }
  .type-caret.is-done { animation: caretBlink 1s step-end infinite; }

  @keyframes legacyFadeIn { from { opacity: 0; } to { opacity: 1; } }

  @media (prefers-reduced-motion: reduce) {
    .float-dot, .type-caret, .scroll-arrow { animation: none !important; }
  }
`

/* -------------------------------------------------------------------------- */
/*  Reveal helper — directional scroll-in (matches About.jsx exactly)         */
/* -------------------------------------------------------------------------- */

function Reveal({
  children,
  from = 'up',
  delay = 0,
  as: Tag = 'div',
  className = '',
  ...rest
}) {
  const [ref, visible] = useScrollReveal()
  const hidden = {
    up: 'translateY(40px)',
    left: 'translateX(-60px)',
    right: 'translateX(60px)',
    none: 'none',
  }[from]

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : hidden,
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/*  Typewriter (matches About.jsx)                                            */
/* -------------------------------------------------------------------------- */

function Typewriter({ text, speed = 95 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count >= text.length) return
    const id = setTimeout(() => setCount((c) => c + 1), speed)
    return () => clearTimeout(id)
  }, [count, text, speed])

  const done = count >= text.length
  return (
    <>
      {text.slice(0, count)}
      <span
        className={'type-caret text-yellow-500' + (done ? ' is-done' : '')}
        aria-hidden="true"
      >
        _
      </span>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Credential — dash slides in first, then the text (matches About.jsx)      */
/* -------------------------------------------------------------------------- */

function Credential({ text, delay }) {
  const [ref, visible] = useScrollReveal()
  return (
    <li ref={ref} className="flex items-center gap-4">
      <span
        className="h-0.5 w-10 bg-yellow-500 shrink-0"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateX(-24px)',
          transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
        }}
      />
      <span
        className="font-heading text-base sm:text-lg tracking-[0.12em] uppercase text-neutral-200"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateX(20px)',
          transition: `opacity 0.6s ease ${delay + 140}ms, transform 0.6s ease ${delay + 140}ms`,
        }}
      >
        {text}
      </span>
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/*  Legacy lightbox                                                           */
/* -------------------------------------------------------------------------- */

function LegacyLightbox({ items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    // Only lock page scroll / bind keys while the lightbox is actually open
    // (this component stays mounted with index == null).
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-sm animate-[legacyFadeIn_0.2s_ease-out]"
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
          alt={item.caption || 'Legacy photo'}
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
/*  Scroll-revealed masonry image                                            */
/* -------------------------------------------------------------------------- */

function LegacyImage({ item, index, onOpen }) {
  const [ref, visible] = useScrollReveal()
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
            alt={item.caption || 'Legacy photo'}
            loading="lazy"
            className="block w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="aspect-square flex items-center justify-center bg-neutral-800">
            <span className="text-neutral-500 text-xs tracking-[0.25em] uppercase font-semibold">
              No Image
            </span>
          </div>
        )}
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
/*  THE JOURNEY — legacy photo masonry (hidden until photos exist)            */
/* -------------------------------------------------------------------------- */

function LegacySection() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchLegacy() {
      try {
        // Filter to this trainer; sort client-side by uploadedAt (newest first)
        // so we don't require a composite Firestore index.
        const q = query(
          collection(db, 'trainerLegacy'),
          where('trainerId', '==', 'afzal')
        )
        const snapshot = await getDocs(q)
        if (cancelled) return
        const data = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort(
            (a, b) =>
              (b.uploadedAt?.seconds || 0) - (a.uploadedAt?.seconds || 0)
          )
        console.log(`[Trainers] Loaded ${data.length} legacy photo(s).`, data)
        setItems(data)
      } catch (err) {
        // On error, simply keep the section hidden.
        console.error('[Trainers] Failed to load legacy photos:', err)
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchLegacy()
    return () => {
      cancelled = true
    }
  }, [])

  const total = items.length
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () =>
    setLightboxIndex((i) => (i == null ? i : (i - 1 + total) % total))
  const nextImage = () =>
    setLightboxIndex((i) => (i == null ? i : (i + 1) % total))

  // The section does not render at all until legacy photos exist.
  if (loading || total === 0) return null

  return (
    <section className="py-24 sm:py-32 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal from="none" className="text-center mb-16">
          <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-4">
            Moments &amp; Milestones
          </p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.04em] text-white leading-none">
            THE JOURNEY
          </h2>
          <span className="block mx-auto mt-8 h-1 w-24 bg-yellow-500" />
        </Reveal>

        <div
          className="columns-2 md:columns-3 lg:columns-4"
          style={{ columnGap: '12px' }}
        >
          {items.map((item, i) => (
            <LegacyImage
              key={item.id}
              item={item}
              index={i}
              onOpen={setLightboxIndex}
            />
          ))}
        </div>
      </div>

      <LegacyLightbox
        items={items}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Trainer profile — About-style founder spotlight                           */
/* -------------------------------------------------------------------------- */

function TrainerProfile({ trainer }) {
  const {
    name,
    profession,
    qualifications = [],
    experience,
    hometown,
    bio,
    imageUrl,
  } = trainer

  return (
    <>
      {/* PROFILE — yellow left border, photo (reticle) + details */}
      <section className="relative border-y border-neutral-900 bg-[#0a0a0a] py-24 sm:py-32 overflow-hidden">
        {/* 8px yellow left border (matches About founder section) */}
        <span className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.4)]" />
        {/* ambient glow */}
        <div
          className="absolute -right-40 top-1/3 w-[28rem] h-[28rem] rounded-full opacity-20 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(234,179,8,0.4) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-14">
          <Reveal from="none">
            <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-4">
              {profession || 'Head Instructor'}
            </p>
            <h2 className="font-display text-6xl sm:text-7xl md:text-8xl tracking-[0.04em] text-white leading-[0.9]">
              {name || 'Trainer Name'}
            </h2>
            <span className="block mt-6 h-1 w-24 bg-yellow-500" />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center mt-14">
            {/* Photo with corner reticle — slides in from left */}
            <Reveal
              from="left"
              className="lg:col-span-2 relative mx-auto w-full max-w-md"
            >
              <div
                className="absolute -inset-6 -z-0 opacity-50 blur-2xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(234,179,8,0.5) 0%, transparent 70%)',
                }}
                aria-hidden="true"
              />
              <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name || 'Trainer'}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div
                      className="absolute inset-0 opacity-[0.08]"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(45deg, #eab308 0 1px, transparent 1px 18px)',
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-heading text-neutral-500 text-xs tracking-[0.3em] uppercase font-bold">
                      Trainer Photo
                    </span>
                  </>
                )}

                {/* Corner reticles */}
                <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-yellow-500" />
                <span className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-yellow-500" />
                <span className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-yellow-500" />
                <span className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-yellow-500" />
                {/* Crosshair ticks */}
                <span className="absolute top-1/2 left-2 w-3 h-px bg-yellow-500/60" />
                <span className="absolute top-1/2 right-2 w-3 h-px bg-yellow-500/60" />
                <span className="absolute left-1/2 top-2 w-px h-3 bg-yellow-500/60" />
                <span className="absolute left-1/2 bottom-2 w-px h-3 bg-yellow-500/60" />
              </div>
            </Reveal>

            {/* Details — slide in from right */}
            <Reveal from="right" delay={120} className="lg:col-span-3">
              {qualifications.length > 0 && (
                <ul className="space-y-4 mb-10">
                  {qualifications.map((q, i) => (
                    <Credential key={q} text={q} delay={i * 150} />
                  ))}
                </ul>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {experience && (
                  <div className="border-l-2 border-yellow-500 pl-5">
                    <p className="font-heading text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold mb-1">
                      Experience
                    </p>
                    <p className="text-white text-lg font-semibold">
                      {experience}
                    </p>
                  </div>
                )}
                {hometown && (
                  <div className="border-l-2 border-yellow-500 pl-5">
                    <p className="font-heading text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold mb-1">
                      Hometown
                    </p>
                    <p className="text-white text-lg font-semibold">
                      {hometown}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BIO — large italic quote (matches About philosophy/values style) */}
      {bio && (
        <section className="relative py-24 sm:py-32 bg-[#111111] border-b border-neutral-900 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, #eab308 0 3px, transparent 3px 90px)',
            }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Reveal from="none">
              <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-6">
                In His Words
              </p>
            </Reveal>
            <Reveal from="up" delay={150}>
              <blockquote className="relative">
                <span
                  className="font-display text-6xl text-yellow-500/30 leading-none select-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="font-body italic text-2xl sm:text-3xl text-white leading-snug max-w-3xl mx-auto -mt-4">
                  {bio}
                </p>
                <span
                  className="font-display text-6xl text-yellow-500/30 leading-none select-none"
                  aria-hidden="true"
                >
                  &rdquo;
                </span>
              </blockquote>
            </Reveal>
          </div>
        </section>
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Loading / states                                                          */
/* -------------------------------------------------------------------------- */

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="relative w-16 h-16">
        <span className="absolute inset-0 rounded-full border-4 border-neutral-800" />
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 animate-spin" />
      </div>
      <p className="mt-6 font-heading text-xs tracking-[0.3em] uppercase text-neutral-500 font-bold">
        Loading Trainer
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Trainers() {
  const { t } = useContent()
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Always start at the top when this page mounts.
    window.scrollTo(0, 0)
    let cancelled = false

    async function fetchTrainers() {
      try {
        console.log('[Trainers] Fetching trainers from Firestore...')
        const snapshot = await getDocs(collection(db, 'trainers'))
        if (cancelled) return
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        console.log(`[Trainers] Received ${data.length} trainer(s):`, data)
        setTrainers(data)
      } catch (err) {
        if (cancelled) return
        console.error('[Trainers] Failed to load trainers:', err.code, err.message, err)
        setError(`${err.code || 'error'}: ${err.message || 'Failed to load trainers'}`)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTrainers()
    return () => {
      cancelled = true
    }
  }, [])

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

        <div className="relative z-10 text-center max-w-5xl">
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.04em] text-white leading-[0.95] min-h-[1.2em]">
            <Typewriter text={t('trainers_heading', 'OUR TRAINER.')} />
          </h1>
          <span className="block mx-auto mt-8 h-1 w-24 bg-yellow-500" />
          <p className="font-heading mt-8 text-sm sm:text-base md:text-lg tracking-[0.25em] uppercase text-neutral-400">
            {t('trainers_subtext', 'The master guiding every student on the path of the warrior')}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-heading text-[10px] tracking-[0.3em] uppercase text-neutral-600 font-bold">
            Scroll
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#eab308"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="scroll-arrow w-7 h-7 animate-bounce"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* ===================== STATES ===================== */}
      {loading && (
        <section className="py-16">
          <LoadingSpinner />
        </section>
      )}

      {!loading && error && (
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#171717] border-l-4 border-yellow-500 p-6 rounded-sm">
              <p className="font-heading text-xs tracking-[0.3em] uppercase text-yellow-500 font-bold mb-2">
                Error
              </p>
              <p className="text-neutral-300 break-all">{error}</p>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && trainers.length === 0 && (
        <section className="py-28">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="font-heading text-xs tracking-[0.3em] uppercase text-yellow-500 font-bold mb-3">
              Coming Soon
            </p>
            <h3 className="font-display text-4xl sm:text-5xl text-white tracking-wide mb-3">
              TRAINER PROFILE
            </h3>
            <p className="text-neutral-400">
              The trainer profile is being prepared. Check back soon to meet the
              team.
            </p>
          </div>
        </section>
      )}

      {/* ===================== PROFILE(S) ===================== */}
      {!loading &&
        !error &&
        trainers.map((trainer) => (
          <TrainerProfile key={trainer.id} trainer={trainer} />
        ))}

      {/* ===================== THE JOURNEY (legacy photos) ===================== */}
      <LegacySection />
    </div>
  )
}
