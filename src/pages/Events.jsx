import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'

function toDate(value) {
  if (!value) return null
  if (typeof value.toDate === 'function') return value.toDate()
  if (value instanceof Date) return value
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function formatDate(date) {
  if (!date) return 'Date TBA'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="relative w-16 h-16">
        <span className="absolute inset-0 rounded-full border-4 border-neutral-800" />
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 animate-spin" />
      </div>
      <p className="mt-6 text-xs tracking-[0.3em] uppercase text-neutral-500 font-bold">
        Loading Events
      </p>
    </div>
  )
}

function EventCard({ event, status }) {
  const { title, description, imageUrl, date } = event
  const isUpcoming = status === 'upcoming'

  return (
    <article className="group bg-[#171717] border border-neutral-800 hover:border-red-600 rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(220,38,38,0.4)] flex flex-col">
      <div className="relative aspect-video bg-neutral-900 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || 'Event'}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #dc2626 0 1px, transparent 1px 16px)',
              }}
            />
            <span className="relative text-neutral-500 text-xs tracking-[0.25em] uppercase font-semibold">
              Event Image
            </span>
          </div>
        )}

        <span
          className={
            'absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm ' +
            (isUpcoming
              ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
              : 'bg-neutral-800/90 text-neutral-400 border border-neutral-700')
          }
        >
          {isUpcoming && (
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          )}
          {isUpcoming ? 'Upcoming' : 'Past'}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs tracking-[0.25em] uppercase text-red-600 font-bold mb-2">
          {formatDate(date)}
        </p>
        <h3 className="text-xl font-black text-white tracking-wide mb-3 line-clamp-2">
          {title || 'Untitled Event'}
        </h3>
        {description && (
          <p className="text-sm text-neutral-400 leading-relaxed line-clamp-4 flex-1">
            {description}
          </p>
        )}
      </div>
    </article>
  )
}

function SectionHeading({ eyebrow, title, count }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-2">
          {eyebrow}
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
          {title}
        </h2>
        <span className="block mt-4 h-1 w-16 bg-red-600" />
      </div>
      {typeof count === 'number' && (
        <span className="text-sm text-neutral-500 font-semibold">
          {count} {count === 1 ? 'event' : 'events'}
        </span>
      )}
    </div>
  )
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchEvents() {
      try {
        const q = query(collection(db, 'events'), orderBy('date', 'desc'))
        const snapshot = await getDocs(q)
        if (cancelled) return
        const data = snapshot.docs.map((doc) => {
          const raw = doc.data()
          return { id: doc.id, ...raw, date: toDate(raw.date) }
        })
        setEvents(data)
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'Failed to load events')
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
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const up = []
    const pa = []
    for (const e of events) {
      if (e.date && e.date >= now) up.push(e)
      else pa.push(e)
    }
    up.sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0))
    return { upcoming: up, past: pa }
  }, [events])

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen">
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
            Tournaments · Workshops · Gradings
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-wide text-white">
            Events
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-neutral-700" />
            <span className="h-1 w-24 bg-red-600" />
            <span className="h-px w-12 bg-neutral-700" />
          </div>
          <p className="mt-8 text-lg text-neutral-400 max-w-2xl mx-auto">
            Stay updated on competitions, belt gradings, and special training
            workshops at Bushido Academy.
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

          {!loading && !error && events.length === 0 && (
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-white tracking-wide mb-3">
                No events yet
              </h3>
              <p className="text-neutral-400">Check back soon!</p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="space-y-20">
              {upcoming.length > 0 && (
                <div>
                  <SectionHeading
                    eyebrow="What's Next"
                    title="Upcoming Events"
                    count={upcoming.length}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcoming.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        status="upcoming"
                      />
                    ))}
                  </div>
                </div>
              )}

              {past.length > 0 && (
                <div>
                  <SectionHeading
                    eyebrow="The Archive"
                    title="Past Events"
                    count={past.length}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {past.map((event) => (
                      <EventCard key={event.id} event={event} status="past" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
