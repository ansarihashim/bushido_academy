import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import useScrollReveal from '../hooks/useScrollReveal'
import { useCountUp } from '../hooks/useCountUp'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { useContent } from '../context/ContentContext'
import RedDivider from '../components/RedDivider'
import Footer from '../components/Footer'
import dragonFly from '../assets/dragon-fly.gif'

/* -------------------------------------------------------------------------- */
/*  Icons (inline SVG, no UI lib)                                             */
/* -------------------------------------------------------------------------- */

function ChopHandIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g fill="#eab308">
        {/* forearm */}
        <rect x="42" y="6" width="16" height="56" rx="5" />
        {/* hand — flat chop */}
        <path d="M 30 60 L 70 60 L 76 86 L 60 92 L 40 92 L 24 86 Z" />
      </g>
    </svg>
  )
}

function KickLegIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g fill="#eab308">
        {/* thigh */}
        <rect x="42" y="4" width="16" height="48" rx="5" />
        {/* shin — bent at knee */}
        <path d="M 40 48 L 60 48 L 72 80 L 80 92 L 64 96 L 52 80 Z" />
        {/* foot */}
        <ellipse cx="76" cy="94" rx="11" ry="5" />
      </g>
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function ArrowRight() {
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

/* -------------------------------------------------------------------------- */
/*  Hero carousel                                                             */
/* -------------------------------------------------------------------------- */

const DARK_SLIDE = {
  id: 'fallback-dark',
  imageUrl: '',
  caption: '',
  background:
    'radial-gradient(ellipse at 50% 30%, #1c1c1c 0%, #0a0a0a 70%), #0a0a0a',
}

function HeroCarousel() {
  const { settings } = useSiteSettings()
  const { t } = useContent()
  const slideAnimation = settings.slideAnimation || 'fade'
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchSlides() {
      try {
        const q = query(collection(db, 'slides'), orderBy('order', 'asc'))
        const snap = await getDocs(q)
        if (cancelled) return
        setSlides(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setActive(0)
      } catch {
        if (!cancelled) setSlides([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchSlides()
    return () => {
      cancelled = true
    }
  }, [])

  // After loading, show real slides — or a single dark gradient fallback.
  const displaySlides = slides.length > 0 ? slides : [DARK_SLIDE]
  const total = displaySlides.length

  const next = useCallback(() => setActive((i) => (i + 1) % total), [total])
  const prev = useCallback(
    () => setActive((i) => (i - 1 + total) % total),
    [total]
  )

  // Auto-advance only once slides are fetched and there's more than one.
  useEffect(() => {
    if (loading || paused || total < 2) return
    const timer = setInterval(() => {
      setActive((prevI) => (prevI + 1) % total)
    }, 2000)
    return () => clearInterval(timer)
  }, [loading, paused, total])

  // While fetching: pure black screen with a small yellow spinner.
  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="relative w-12 h-12">
          <span className="absolute inset-0 rounded-full border-4 border-neutral-800" />
          <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 animate-spin" />
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Carousel slides — transition style driven by site settings */}
      {displaySlides.map((slide, i) => {
        const hasImage = Boolean(slide.imageUrl)
        const isActive = i === active
        const motion =
          slideAnimation === 'slide'
            ? {
                transform: isActive ? 'translateX(0)' : 'translateX(100%)',
                opacity: isActive ? 1 : 0,
                transition:
                  'transform 600ms ease-in-out, opacity 600ms ease-in-out',
              }
            : slideAnimation === 'zoom'
              ? {
                  transform: isActive ? 'scale(1)' : 'scale(1.1)',
                  opacity: isActive ? 1 : 0,
                  transition:
                    'transform 700ms ease-out, opacity 600ms ease-in-out',
                }
              : {
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 600ms ease-in-out',
                }
        const bg = hasImage
          ? {
              backgroundImage: `url(${slide.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { background: slide.background }
        return (
          <div
            key={slide.id ?? i}
            className="absolute inset-0"
            style={{ ...bg, ...motion, zIndex: isActive ? 1 : 0 }}
            aria-hidden={!isActive}
          >
            {/* darkening overlay for image legibility */}
            {hasImage && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.75) 70%, rgba(10,10,10,0.9) 100%)',
                }}
              />
            )}
            {/* slide caption / tagline */}
            {slide.caption && (
              <div className="absolute inset-x-0 bottom-32 sm:bottom-40 flex justify-center px-6">
                <p className="font-heading text-xs sm:text-sm tracking-[0.4em] uppercase text-yellow-400 font-bold text-center">
                  {slide.caption}
                </p>
              </div>
            )}
          </div>
        )
      })}

      {/* Fire glow + rising embers */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '350px',
          background: `radial-gradient(ellipse 30% 60% at 50% 100%,
            rgba(234,179,8,0.35) 0%,
            rgba(251,146,60,0.2) 30%,
            rgba(239,68,68,0.1) 55%,
            transparent 75%)`,
          animation: 'fireRise 2.5s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <div style={{ position: 'absolute', bottom: '20px', left: '45%',
          width: '5px', height: '5px', borderRadius: '50%',
          background: '#eab308',
          animation: 'ember1 2s ease-out infinite',
          animationDelay: '0s' }} />
        <div style={{ position: 'absolute', bottom: '30px', left: '50%',
          width: '4px', height: '4px', borderRadius: '50%',
          background: '#fb923c',
          animation: 'ember2 2.5s ease-out infinite',
          animationDelay: '0.4s' }} />
        <div style={{ position: 'absolute', bottom: '15px', left: '55%',
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#eab308',
          animation: 'ember3 1.8s ease-out infinite',
          animationDelay: '0.8s' }} />
        <div style={{ position: 'absolute', bottom: '25px', left: '48%',
          width: '3px', height: '3px', borderRadius: '50%',
          background: '#fbbf24',
          animation: 'ember4 2.2s ease-out infinite',
          animationDelay: '1.2s' }} />
        <div style={{ position: 'absolute', bottom: '10px', left: '52%',
          width: '5px', height: '5px', borderRadius: '50%',
          background: '#f97316',
          animation: 'ember5 2.8s ease-out infinite',
          animationDelay: '0.2s' }} />
      </div>

      {/* Hero foreground */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-yellow-900/60 bg-yellow-950/30 backdrop-blur">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
          <span className="font-heading text-[11px] tracking-[0.3em] uppercase text-yellow-300 font-bold">
            {t('hero_badge', 'Forged in Discipline')}
          </span>
        </div>

        <div className="hero-title-container">
          {/* Dragon's breath pulsing on the wordmark */}
          <div className="text-fire" aria-hidden="true" />

          {/* Fire-breathing dragon orbiting the wordmark (behind the text) */}
          <div className="dragon-orbit-ellipse" aria-hidden="true">
            <div className="dragon-orbit-wrapper">
              <img
                src={dragonFly}
                alt=""
                aria-hidden="true"
                className="dragon-orbit-img"
              />
            </div>
          </div>

          {/* The burning wordmark */}
          <h1 className="hero-title font-display text-[7rem] sm:text-[10rem] md:text-[13rem] lg:text-[17rem] leading-[0.85] tracking-[0.06em]">
            BUSHIDO
          </h1>

          {/* Embers rising off the burning letters */}
          <span className="hero-ember" style={{ left: '14%', background: '#fb923c', animation: 'ember1 2s ease-out infinite' }} />
          <span className="hero-ember" style={{ left: '32%', background: '#eab308', animation: 'ember3 1.8s ease-out infinite 0.5s' }} />
          <span className="hero-ember" style={{ left: '50%', background: '#fbbf24', animation: 'ember2 2.4s ease-out infinite 0.2s' }} />
          <span className="hero-ember" style={{ left: '64%', background: '#f97316', animation: 'ember5 2.6s ease-out infinite 0.8s' }} />
          <span className="hero-ember" style={{ left: '80%', background: '#fb923c', animation: 'ember4 2.1s ease-out infinite 1.1s' }} />
          <span className="hero-ember" style={{ left: '92%', background: '#eab308', animation: 'ember1 2.3s ease-out infinite 0.4s' }} />
        </div>
        <p className="font-heading text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.45em] text-neutral-300 mt-2">
          {t('hero_subtitle', 'KARATE KICKBOXING · SPORTS ACADEMY')}
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <span className="h-px w-10 bg-yellow-500" />
          <p className="font-heading text-lg sm:text-xl md:text-2xl font-bold tracking-[0.3em] text-yellow-500 uppercase">
            {t('hero_tagline', 'Discipline · Strength · Honor')}
          </p>
          <span className="h-px w-10 bg-yellow-500" />
        </div>

        <div className="mt-10 flex items-center justify-center">
          <Link to="/events" className="btn-primary group">
            Explore Events
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </div>

      {/* Carousel arrows (only when more than one slide) */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center w-12 h-12 text-white/70 hover:text-yellow-500 hover:bg-black/30 transition-colors"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center w-12 h-12 text-white/70 hover:text-yellow-500 hover:bg-black/30 transition-colors"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={
              'h-1 transition-all duration-300 ' +
              (i === active
                ? 'w-10 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.7)]'
                : 'w-5 bg-white/30 hover:bg-white/60')
            }
          />
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Reveal wrapper                                                            */
/* -------------------------------------------------------------------------- */

function Reveal({ children, as: Tag = 'div', className = '', delay = 0, ...rest }) {
  const [ref, visible] = useScrollReveal()
  return (
    <Tag
      ref={ref}
      className={
        'reveal ' + (visible ? 'is-visible ' : '') + className
      }
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/*  Highlights — raw stat blocks                                              */
/* -------------------------------------------------------------------------- */

const STATS = [
  { target: 27, suffix: '+', label: 'Years Experience', labelKey: 'stat_years_label', duration: 2000 },
  { target: 1000, suffix: '+', label: 'Students Trained', labelKey: 'stat_students_label', duration: 2000 },
  { target: 2, suffix: '', label: 'Martial Arts', labelKey: 'stat_disciplines_label', duration: 1000 },
]

function StatBlock({ target, suffix, label, labelKey, duration, delay }) {
  const { t } = useContent()
  const [ref, visible] = useScrollReveal()
  const count = useCountUp(target, duration, visible)
  return (
    <div
      ref={ref}
      className={
        'reveal px-6 py-10 sm:py-6 flex flex-col items-center justify-center text-center ' +
        (visible ? 'is-visible' : '')
      }
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      <p className="font-display text-7xl sm:text-8xl md:text-9xl text-white leading-none tracking-wide tabular-nums">
        {count}
        {suffix}
      </p>
      <p className="font-heading mt-4 text-xs sm:text-sm tracking-[0.35em] uppercase text-yellow-500 font-bold">
        {t(labelKey, label)}
      </p>
    </div>
  )
}

function HighlightsSection() {
  return (
    <section className="relative bg-[#0a0a0a] py-20 sm:py-28 border-t border-neutral-900 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #eab308 0 1px, transparent 1px 60px)',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-y sm:divide-y-0 divide-yellow-900/70">
          {STATS.map((s, i) => (
            <StatBlock
              key={s.label}
              target={s.target}
              suffix={s.suffix}
              label={s.label}
              labelKey={s.labelKey}
              duration={s.duration}
              delay={i * 100}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Disciplines — clip-path diagonal blocks                                   */
/* -------------------------------------------------------------------------- */

function DisciplinesSection() {
  const { t } = useContent()
  return (
    <section className="relative bg-[#0a0a0a] py-20 sm:py-28 border-t border-neutral-900 overflow-hidden">
      <Reveal className="relative text-center mb-14 px-4">
        <div className="relative inline-block">
          <span
            aria-hidden="true"
            className="absolute -inset-x-8 top-1/2 -translate-y-1/2 h-3 bg-yellow-500/80 -skew-y-6"
          />
          <h2 className="relative font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.08em] text-white">
            WHAT WE TEACH
          </h2>
        </div>
        <RedDivider variant="diamond" className="mt-8" />
      </Reveal>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left — Karate (deep red) */}
          <Reveal
            as={Link}
            to="/karate"
            className="group block relative bg-[#713f12] min-h-[26rem] md:min-h-[34rem] overflow-hidden transition-all duration-300 hover:brightness-110"
            data-cursor="hover"
          >
            <div
              className="absolute inset-0 hidden md:block bg-[#713f12]"
              style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }}
            />
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #000 0 1px, transparent 1px 14px)',
              }}
            />
            <div className="relative h-full p-8 sm:p-12 flex flex-col justify-end">
              <ChopHandIcon className="w-15 h-15 mb-4 animate-chop" />
              <p className="font-heading text-xs tracking-[0.3em] uppercase text-yellow-100 font-bold mb-3">
                {t('karate_label', 'Traditional')}
              </p>
              <h3 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.05em] text-white leading-none">
                {t('karate_title', 'KARATE SHOTOKAI')}
              </h3>
              <p className="font-body mt-5 text-base text-yellow-100/90 leading-relaxed max-w-md">
                {t(
                  'karate_desc',
                  'Rooted in centuries of Japanese tradition. Powerful strikes, deep stances, and unwavering discipline. Master kata, kihon, and kumite on the path of the warrior.'
                )}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-heading text-[11px] tracking-[0.25em] uppercase text-yellow-100 font-bold">
                <span>— Kata</span>
                <span>— Kihon</span>
                <span>— Kumite</span>
                <span>— Belt Grading</span>
              </div>
            </div>
          </Reveal>

          {/* Right — Kickboxing (near black) */}
          <Reveal
            as={Link}
            to="/kickboxing"
            delay={120}
            className="group block relative bg-[#0a0a0a] min-h-[26rem] md:min-h-[34rem] overflow-hidden transition-all duration-300 hover:brightness-125 md:-ml-12"
            data-cursor="hover"
          >
            <div
              className="absolute inset-0 hidden md:block bg-[#0a0a0a]"
              style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)' }}
            />
            <div
              className="absolute inset-0 opacity-[0.1] pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(-45deg, #eab308 0 1px, transparent 1px 14px)',
              }}
            />
            <div className="relative h-full p-8 sm:p-12 md:pl-20 flex flex-col justify-end">
              <KickLegIcon className="w-15 h-15 mb-4 animate-kick" />
              <p className="font-heading text-xs tracking-[0.3em] uppercase text-yellow-400 font-bold mb-3">
                {t('kickboxing_label', 'Modern Combat')}
              </p>
              <h3 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.05em] text-white leading-none">
                {t('kickboxing_title', 'KICKBOXING')}
              </h3>
              <p className="font-body mt-5 text-base text-neutral-300 leading-relaxed max-w-md">
                {t(
                  'kickboxing_desc',
                  'High-intensity striking. Punches, kicks, knees, and footwork. Build explosive power, fight conditioning, and razor reflexes inside the ring.'
                )}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-heading text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-bold">
                <span>— Pad Work</span>
                <span>— Sparring</span>
                <span>— Conditioning</span>
                <span>— Ring Ready</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Founder section — reticle frame                                           */
/* -------------------------------------------------------------------------- */

function FounderSection() {
  const { t } = useContent()
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetchFounderPhoto() {
      try {
        const q = query(collection(db, 'trainers'), limit(1))
        const snap = await getDocs(q)
        if (cancelled || snap.empty) return
        setImageUrl(snap.docs[0].data().imageUrl || '')
      } catch {
        // keep placeholder on error
      }
    }
    fetchFounderPhoto()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="relative bg-[#0a0a0a] py-20 sm:py-28 border-t border-neutral-900 overflow-hidden">
      {/* large red vertical bar on the left */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-16 bottom-16 w-1.5 sm:w-2 bg-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.4)]"
      />
      {/* ambient glow */}
      <div
        className="absolute -right-40 top-1/3 w-[28rem] h-[28rem] rounded-full opacity-25 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(234,179,8,0.4) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <Reveal>
          <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-3">
            {t('founder_label', 'The Founder')}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.06em] text-white">
            {t('founder_heading', 'MEET THE SENSEI')}
          </h2>
          <span className="block mt-5 h-1 w-20 bg-yellow-500" />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center mt-12">
          {/* Photo with corner reticle */}
          <Reveal className="lg:col-span-2 relative mx-auto w-full max-w-md">
            {/* red glow behind */}
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
                  alt="Founder"
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

              {/* Crosshair lines */}
              <span className="absolute top-1/2 left-2 w-3 h-px bg-yellow-500/60" />
              <span className="absolute top-1/2 right-2 w-3 h-px bg-yellow-500/60" />
              <span className="absolute left-1/2 top-2 w-px h-3 bg-yellow-500/60" />
              <span className="absolute left-1/2 bottom-2 w-px h-3 bg-yellow-500/60" />
            </div>
          </Reveal>

          {/* Details */}
          <Reveal delay={120} className="lg:col-span-3">
            <h3 className="font-display text-6xl sm:text-7xl md:text-8xl tracking-[0.05em] text-white leading-[0.9]">
              {t('founder_name', 'AFZAL SULTAN KHAN')}
            </h3>
            <ul className="mt-8 space-y-3">
              {[
                '4th Dan Black Belt, Karate Shotokan',
                'All India Karate Federation 2nd Dan Black Belt',
                'Kickboxing 2nd Dan Black Belt',
                'National Referee in Karate and State Referee in Kickboxing',
              ].map((cred) => (
                <li
                  key={cred}
                  className="flex items-center gap-4 font-heading text-sm sm:text-base tracking-[0.12em] uppercase text-neutral-200"
                >
                  <span className="h-px w-8 bg-yellow-500 shrink-0" />
                  {cred}
                </li>
              ))}
            </ul>
            <p className="font-body mt-8 text-lg text-neutral-400 leading-relaxed max-w-2xl border-l-2 border-yellow-500 pl-5">
              {t(
                'founder_bio',
                'Founder of Bushido Academy and a dedicated martial artist with over two decades of experience shaping champions.'
              )}
            </p>
            <div className="mt-10">
              <Link to="/trainers" className="btn-primary group">
                View Full Profile
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  CTA — aggressive diagonal top edge                                        */
/* -------------------------------------------------------------------------- */

function CtaSection() {
  const { t } = useContent()
  return (
    <section
      className="relative overflow-hidden"
      style={{ clipPath: 'polygon(0 6%, 100% 0, 100% 100%, 0 100%)' }}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, #713f12 0%, #eab308 60%, #713f12 100%)',
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #000 0 1px, transparent 1px 24px)',
        }}
      />
      {/* dark bar at bottom to anchor */}
      <span className="absolute inset-x-0 bottom-0 h-1 bg-black/60" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20 sm:pb-28 text-center">
        <Reveal>
          <p className="font-heading text-xs sm:text-sm tracking-[0.4em] uppercase text-yellow-100 font-bold mb-5">
            Step Onto the Mat
          </p>
          <h2 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.06em] text-white leading-none">
            {t('cta_heading', 'ARE YOU READY?')}
          </h2>
          <p className="font-heading mt-8 text-base sm:text-lg tracking-[0.15em] uppercase text-yellow-100 font-semibold max-w-2xl mx-auto">
            {t(
              'cta_subtext',
              'Join Bushido Academy and train under expert guidance'
            )}
          </p>
          <div className="mt-10">
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-2 bg-black hover:bg-yellow-500 text-white font-heading font-bold uppercase tracking-[0.2em] text-base border-2 border-yellow-500 hover:border-yellow-500 px-10 py-5 transition-all duration-200 active:scale-[0.97] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)]"
            >
              Contact Us
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                <ArrowRight />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Home() {
  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5]">
      <HeroCarousel />
      <HighlightsSection />
      <DisciplinesSection />
      <FounderSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
