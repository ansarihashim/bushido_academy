import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { updateTrainerQualifications } from '../../utils/seedData'

function StatCard({ label, value, hint, to, icon, loading }) {
  return (
    <Link
      to={to}
      className="group relative bg-[#171717] border border-neutral-800 hover:border-yellow-500 rounded-sm p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(234,179,8,0.4)] block"
    >
      <span className="absolute top-0 left-0 h-1 w-0 bg-yellow-500 group-hover:w-full transition-all duration-500" />
      <div className="flex items-start justify-between mb-6">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-yellow-950/40 border border-yellow-900/50 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
          {icon}
        </span>
        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold">
          Total
        </span>
      </div>
      <p className="text-xs tracking-[0.3em] uppercase text-yellow-500 font-bold mb-2">
        {label}
      </p>
      <p className="text-5xl sm:text-6xl font-black text-white tracking-tight tabular-nums">
        {loading ? (
          <span className="inline-block w-16 h-12 bg-neutral-800 rounded-sm animate-pulse" />
        ) : (
          value
        )}
      </p>
      {hint && (
        <p className="mt-3 text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
          {hint}
        </p>
      )}
    </Link>
  )
}

function IconCalendar() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function IconImage() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}

export default function AdminOverview() {
  const [eventsCount, setEventsCount] = useState(0)
  const [galleryCount, setGalleryCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')

  async function handleSyncQualifications() {
    if (syncing) return
    setSyncing(true)
    setSyncMsg('')
    try {
      const res = await updateTrainerQualifications()
      setSyncMsg(res.message)
    } catch (err) {
      setSyncMsg(err.message || 'Failed to update qualifications.')
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function fetchCounts() {
      try {
        const [eventsSnap, gallerySnap] = await Promise.all([
          getCountFromServer(collection(db, 'events')),
          getCountFromServer(collection(db, 'gallery')),
        ])
        if (cancelled) return
        setEventsCount(eventsSnap.data().count)
        setGalleryCount(gallerySnap.data().count)
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'Failed to load stats')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCounts()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-yellow-500 font-bold mb-2">
          Dashboard
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
          Overview
        </h1>
        <span className="block mt-4 h-1 w-16 bg-yellow-500" />
        <p className="mt-5 text-neutral-400 max-w-2xl">
          Manage events, gallery images, and trainer information for Bushido
          Academy.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-[#171717] border-l-4 border-yellow-500 p-4 rounded-sm">
          <p className="text-[10px] tracking-[0.3em] uppercase text-yellow-300 font-bold mb-1">
            Error
          </p>
          <p className="text-sm text-neutral-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
        <StatCard
          label="Events"
          value={eventsCount}
          hint="Tournaments, gradings, workshops"
          to="/admin/events"
          icon={<IconCalendar />}
          loading={loading}
        />
        <StatCard
          label="Gallery Images"
          value={galleryCount}
          hint="Photos in the public gallery"
          to="/admin/gallery"
          icon={<IconImage />}
          loading={loading}
        />
      </div>

      {/* Maintenance — one-click sync of the trainer qualifications list */}
      <div className="mt-10 max-w-4xl bg-[#171717] border border-neutral-800 rounded-sm p-6">
        <p className="text-xs tracking-[0.3em] uppercase text-yellow-500 font-bold mb-2">
          Maintenance
        </p>
        <p className="text-sm text-neutral-400 mb-4">
          Overwrite the live trainer document&apos;s qualifications with the
          current list (run once after updating the list in code).
        </p>
        <button
          type="button"
          onClick={handleSyncQualifications}
          disabled={syncing}
          className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-black font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-sm transition-colors"
        >
          {syncing ? 'Syncing…' : 'Sync Qualifications'}
        </button>
        {syncMsg && (
          <p className="mt-3 text-sm text-neutral-300">{syncMsg}</p>
        )}
      </div>
    </div>
  )
}
