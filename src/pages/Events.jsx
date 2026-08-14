import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import useScrollReveal from '../hooks/useScrollReveal'
import { useContent } from '../context/ContentContext'
import EventDetailModal from '../components/EventDetailModal'

const EMAIL = 'bushidokksa@gmail.com'
const INSTAGRAM_URL =
  'https://www.instagram.com/bushido_karate_kickboxing_dojo'
const DAY_MS = 86_400_000

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

  @keyframes caretBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  .type-caret { animation: caretBlink 1s step-end infinite; }
  .type-caret.is-done { animation: caretBlink 1s step-end infinite; }

  @media (prefers-reduced-motion: reduce) {
    .float-dot, .type-caret, .scroll-arrow { animation: none !important; }
  }
`

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function toDate(value) {
  if (!value) return null
  if (typeof value.toDate === 'function') return value.toDate()
  if (value instanceof Date) return value
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function formatLong(date) {
  if (!date) return 'DATE TBA'
  return date
    .toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase()
}

function formatShort(date) {
  if (!date) return 'Date TBA'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getBadge(title) {
  const t = (title || '').toLowerCase()
  if (
    t.includes('championship') ||
    t.includes('tournament') ||
    t.includes('national')
  )
    return 'CHAMPIONSHIP EVENT'
  if (t.includes('grading') || t.includes('belt') || t.includes('dan'))
    return 'BELT GRADING CEREMONY'
  if (t.includes('workshop') || t.includes('seminar'))
    return 'SPECIAL WORKSHOP'
  if (t.includes('camp') || t.includes('bootcamp')) return 'TRAINING CAMP'
  return 'UPCOMING EVENT'
}

function isToday(date, now) {
  if (!date) return false
  const n = new Date(now)
  return (
    date.getFullYear() === n.getFullYear() &&
    date.getMonth() === n.getMonth() &&
    date.getDate() === n.getDate()
  )
}

function getCountdown(date, now) {
  if (!date) return null
  const diff = date.getTime() - now
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / DAY_MS),
    hours: Math.floor((diff % DAY_MS) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

function relativeWhen(date, now) {
  if (!date) return ''
  const diff = date.getTime() - now
  if (diff <= 0) return 'Today'
  const days = Math.ceil(diff / DAY_MS)
  if (days === 1) return 'Tomorrow'
  return `in ${days} days`
}

const pad = (n) => String(n).padStart(2, '0')

function mailtoFor(title) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(
    `I'm interested: ${title || 'Event'}`
  )}`
}

function truncate(text, n = 100) {
  if (!text) return ''
  return text.length > n ? text.substring(0, n) + '...' : text
}

/* Card thumbnail: dedicated thumbnailUrl, falling back to the cover image. */
function getThumbnail(event) {
  return event.thumbnailUrl || event.imageUrl || null
}

const DETAIL_HINT =
  'font-heading text-[10px] tracking-[0.3em] uppercase text-yellow-500/60 font-bold'

/* -------------------------------------------------------------------------- */
/*  Reveal helper (matches About.jsx exactly)                                 */
/* -------------------------------------------------------------------------- */

function Reveal({ children, from = 'up', delay = 0, as: Tag = 'div', className = '', ...rest }) {
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
/*  Section heading (About-style)                                             */
/* -------------------------------------------------------------------------- */

function SectionHeading({ eyebrow, title }) {
  return (
    <Reveal from="none" className="mb-12">
      <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-4">
        {eyebrow}
      </p>
      <h2 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.04em] text-white leading-none">
        {title}
      </h2>
      <span className="block mt-6 h-1 w-24 bg-yellow-500" />
    </Reveal>
  )
}

/* -------------------------------------------------------------------------- */
/*  Feature card (first upcoming event)                                       */
/* -------------------------------------------------------------------------- */

function FeatureCard({ event, now, onOpen }) {
  const badge = getBadge(event.title)
  const today = isToday(event.date, now)
  const cd = today ? null : getCountdown(event.date, now)
  const thumbnail = getThumbnail(event)
  const bg = thumbnail
    ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.85)), url(${thumbnail})`
    : 'linear-gradient(135deg, #1c1c1c 0%, #0a0a0a 100%)'

  return (
    <Reveal from="up">
      <div
        onClick={() => onOpen(event)}
        className="relative w-full min-h-[400px] rounded-sm overflow-hidden border-y border-r border-neutral-900 hover:border-yellow-500 flex flex-col p-8 sm:p-12 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_50px_-12px_rgba(234,179,8,0.5)]"
      >
        {/* full-bleed background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: bg,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* 8px yellow left border (matches About content blocks) */}
        <span className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.4)]" />

        <span className="self-start inline-flex items-center px-4 py-1.5 bg-yellow-500 text-black text-xs sm:text-sm font-heading font-bold uppercase tracking-[0.2em] rounded-sm">
          {badge}
        </span>

        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <h2 className="font-display text-5xl sm:text-6xl md:text-[64px] leading-none tracking-[0.03em] text-white">
            {event.title || 'Untitled Event'}
          </h2>
          <p className="mt-5 font-heading text-sm sm:text-base tracking-[0.2em] text-neutral-200 font-semibold">
            {formatLong(event.date)}
          </p>

          {today ? (
            <p className="mt-4 font-heading text-lg sm:text-xl tracking-[0.2em] uppercase text-yellow-400 font-bold animate-pulse">
              Today — Don&rsquo;t Miss It!
            </p>
          ) : (
            cd && (
              <p className="mt-4 font-heading text-base sm:text-xl tracking-[0.18em] text-yellow-400 font-bold tabular-nums">
                {cd.days} DAYS · {cd.hours} HRS · {cd.minutes} MIN ·{' '}
                {pad(cd.seconds)} SEC
              </p>
            )
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          {event.description && (
            <p className="text-neutral-300 leading-relaxed max-w-xl">
              {truncate(event.description, 100)}
              {event.description.length > 100 && (
                <span className="text-yellow-500 font-semibold"> Read more →</span>
              )}
            </p>
          )}
          <a
            href={mailtoFor(event.title)}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-heading font-bold uppercase tracking-[0.18em] text-sm px-7 py-3.5 rounded-sm transition-colors"
          >
            I&rsquo;m Interested →
          </a>
        </div>

        <p className={`mt-6 text-center ${DETAIL_HINT}`}>Tap to view details</p>
      </div>
    </Reveal>
  )
}

/* -------------------------------------------------------------------------- */
/*  Compact upcoming card (2nd, 3rd, ...)                                     */
/* -------------------------------------------------------------------------- */

function UpcomingCard({ event, now, delay, onOpen }) {
  const badge = getBadge(event.title)
  const thumbnail = getThumbnail(event)
  return (
    <Reveal
      delay={delay}
      onClick={() => onOpen(event)}
      className="bg-[#0a0a0a] border-y border-r border-neutral-900 border-l-4 border-l-yellow-500 hover:border-y-yellow-500 hover:border-r-yellow-500 rounded-sm overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_40px_-14px_rgba(234,179,8,0.5)]"
    >
      <div className="flex gap-0 h-full">
        <div className="relative w-28 sm:w-36 shrink-0 bg-neutral-900 border-r border-yellow-500/20">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={event.title || 'Event'}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-neutral-600 text-[9px] tracking-[0.2em] uppercase font-bold">
                No Image
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 p-5">
          <p className="font-heading text-[10px] tracking-[0.2em] uppercase text-yellow-500 font-bold mb-1.5">
            {badge}
          </p>
          <h3 className="text-lg font-black text-white tracking-wide mb-1 line-clamp-1">
            {event.title || 'Untitled Event'}
          </h3>
          <p className="text-xs text-neutral-400 font-semibold">
            {formatShort(event.date)}
          </p>
          <p className="mt-2 text-sm font-heading font-bold tracking-[0.1em] uppercase text-yellow-400">
            {relativeWhen(event.date, now)}
          </p>
          <p className={`mt-3 ${DETAIL_HINT}`}>Tap to view details</p>
        </div>
      </div>
    </Reveal>
  )
}

/* -------------------------------------------------------------------------- */
/*  Past (legacy) card                                                        */
/* -------------------------------------------------------------------------- */

function LegacyCard({ event, delay, onOpen }) {
  return (
    <Reveal delay={delay}>
      <div
        onClick={() => onOpen(event)}
        className="group cursor-pointer opacity-60 hover:opacity-100 hover:scale-[1.02] transition-all duration-300 bg-[#0a0a0a] border border-neutral-900 hover:border-yellow-500 border-l-4 border-l-yellow-500/60 rounded-sm overflow-hidden flex flex-col h-full"
      >
        <div className="relative aspect-video bg-neutral-900 overflow-hidden">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title || 'Event'}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-neutral-600 text-xs tracking-[0.2em] uppercase font-bold">
                No Image
              </span>
            </div>
          )}
          <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 bg-neutral-800/90 text-neutral-400 border border-neutral-700 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm">
            Past
          </span>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 font-bold mb-2">
            {formatShort(event.date)}
          </p>
          <h3 className="text-lg font-black text-white tracking-wide mb-2 line-clamp-1">
            {event.title || 'Untitled Event'}
          </h3>
          {event.description && (
            <p className="text-sm text-neutral-400 leading-relaxed">
              {truncate(event.description, 100)}
              {event.description.length > 100 && (
                <span className="text-yellow-500 font-semibold"> Read more →</span>
              )}
            </p>
          )}
          <p className={`mt-4 ${DETAIL_HINT}`}>Tap to view details</p>
        </div>
      </div>
    </Reveal>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="relative w-16 h-16">
        <span className="absolute inset-0 rounded-full border-4 border-neutral-800" />
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 animate-spin" />
      </div>
      <p className="mt-6 text-xs tracking-[0.3em] uppercase text-neutral-500 font-bold">
        Loading Events
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Events() {
  const { t } = useContent()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [now, setNow] = useState(() => Date.now())
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchEvents() {
      try {
        const q = query(collection(db, 'events'), orderBy('date', 'desc'))
        const snapshot = await getDocs(q)
        if (cancelled) return
        setEvents(
          snapshot.docs.map((doc) => {
            const raw = doc.data()
            return { id: doc.id, ...raw, date: toDate(raw.date) }
          })
        )
      } catch (err) {
        if (cancelled) return
        setError(
          `${err.code || 'error'}: ${err.message || 'Failed to load events'}`
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchEvents()
    return () => {
      cancelled = true
    }
  }, [])

  const { upcoming, past } = useMemo(() => {
    const midnight = new Date()
    midnight.setHours(0, 0, 0, 0)
    const up = []
    const pa = []
    for (const e of events) {
      if (e.date && e.date >= midnight) up.push(e)
      else pa.push(e)
    }
    up.sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0))
    return { upcoming: up, past: pa }
  }, [events])

  // Live countdown ticker — one interval drives the feature card + relatives.
  useEffect(() => {
    if (upcoming.length === 0) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [upcoming.length])

  const feature = upcoming[0]
  const restUpcoming = upcoming.slice(1)

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
            <Typewriter text={t('events_heading', 'THE BATTLE AWAITS.')} />
          </h1>
          <p className="font-heading mt-8 text-sm sm:text-base md:text-lg tracking-[0.25em] uppercase text-neutral-400">
            {t('events_subtext', 'Tournaments, workshops & gradings at Bushido Academy')}
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

      {/* ===================== CONTENT ===================== */}
      <section className="py-24 sm:py-32 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <LoadingSpinner />}

          {!loading && error && (
            <div
              role="alert"
              className="max-w-2xl mx-auto bg-red-950/40 border-2 border-red-600 p-6 rounded-sm"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-red-400 font-bold mb-2">
                Failed to load events
              </p>
              <pre className="text-sm text-red-200 whitespace-pre-wrap break-all font-mono">
                {error}
              </pre>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* UPCOMING */}
              {upcoming.length > 0 ? (
                <>
                  <SectionHeading eyebrow="What's Next" title="UPCOMING EVENTS" />
                  <FeatureCard event={feature} now={now} onOpen={setSelectedEvent} />

                  {restUpcoming.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                      {restUpcoming.map((event, i) => (
                        <UpcomingCard
                          key={event.id}
                          event={event}
                          now={now}
                          delay={i * 80}
                          onOpen={setSelectedEvent}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Reveal from="none" className="text-center py-16">
                  <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.04em] text-white leading-tight">
                    THE NEXT BATTLE IS BEING PLANNED.
                  </h2>
                  <p className="mt-6 text-lg text-neutral-400">
                    Follow us on Instagram to be the first to know.
                  </p>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-heading font-bold uppercase tracking-[0.18em] text-sm px-8 py-3.5 rounded-sm transition-colors"
                  >
                    Follow on Instagram →
                  </a>
                </Reveal>
              )}
            </>
          )}
        </div>
      </section>

      {/* PAST / LEGACY — alternating black section */}
      {!loading && !error && past.length > 0 && (
        <section className="py-24 sm:py-32 bg-black border-t border-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="The Archive" title="PAST EVENTS" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event, i) => (
                <LegacyCard
                  key={event.id}
                  event={event}
                  delay={(i % 3) * 80}
                  onOpen={setSelectedEvent}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedEvent && (
        <EventDetailModal
          key={selectedEvent.id}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
}
