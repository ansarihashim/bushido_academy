import { useState } from 'react'
import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { Menu, X } from 'lucide-react'
import { auth } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import { seedFirestore } from '../../utils/seedData'

function IconHome() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg
      width="18"
      height="18"
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
      width="18"
      height="18"
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

function IconUser() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: <IconHome />, end: true },
  { to: '/admin/events', label: 'Events', icon: <IconCalendar /> },
  { to: '/admin/gallery', label: 'Gallery', icon: <IconImage /> },
  {
    to: '/admin/trainer-bio',
    label: 'Trainer Bio',
    icon: <IconUser />,
  },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [seedStatus, setSeedStatus] = useState(null)

  async function handleLogout() {
    await signOut(auth)
    navigate('/admin/login', { replace: true })
  }

  async function handleSeed() {
    if (seeding) return
    setSeeding(true)
    setSeedStatus(null)
    try {
      const result = await seedFirestore()
      setSeedStatus({ type: result.seeded ? 'ok' : 'skip', message: result.message })
    } catch (err) {
      setSeedStatus({ type: 'err', message: err.message || 'Seed failed.' })
    } finally {
      setSeeding(false)
    }
  }

  const linkClass = ({ isActive }) =>
    [
      'flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-bold uppercase tracking-wider border-l-4 transition-all duration-200',
      isActive
        ? 'text-red-600 border-red-600 bg-neutral-900'
        : 'text-neutral-400 border-transparent hover:text-white hover:border-red-600 hover:bg-neutral-900/60',
    ].join(' ')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex">
      {/* SIDEBAR */}
      <aside
        className={[
          'fixed lg:sticky top-0 left-0 z-40 w-72 h-screen bg-[#0a0a0a] border-r border-neutral-900 flex flex-col transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="px-6 py-6 border-b border-neutral-900">
          <p className="text-2xl font-black tracking-widest text-white">
            BUSHIDO
          </p>
          <p className="text-[9px] font-semibold tracking-[0.18em] text-red-600 mt-1">
            ADMIN PANEL
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={linkClass}
            >
              <span className="shrink-0">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-neutral-900 space-y-3">
          {user?.email && (
            <div className="px-4">
              <p className="text-[9px] tracking-[0.3em] uppercase text-neutral-500 font-bold mb-1">
                Signed in as
              </p>
              <p className="text-xs text-neutral-300 truncate">{user.email}</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
          >
            <IconLogout />
            Logout
          </button>

          {import.meta.env.DEV && (
            <div className="px-1 pt-2">
              <button
                type="button"
                onClick={handleSeed}
                disabled={seeding}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] border border-dashed border-neutral-700 text-neutral-400 hover:border-red-600 hover:text-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                title="Dev only: seeds founder document to Firestore"
              >
                {seeding ? 'Seeding...' : 'Seed Data'}
              </button>
              {seedStatus && (
                <p
                  className={
                    'mt-2 px-1 text-[10px] leading-snug ' +
                    (seedStatus.type === 'err'
                      ? 'text-red-400'
                      : seedStatus.type === 'ok'
                      ? 'text-green-500'
                      : 'text-neutral-500')
                  }
                >
                  {seedStatus.message}
                </p>
              )}
            </div>
          )}
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-neutral-900 px-4 py-3 flex items-center justify-between">
          <p className="text-lg font-black tracking-widest text-white">
            BUSHIDO <span className="text-red-600">ADMIN</span>
          </p>
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex items-center justify-center p-2 rounded-sm text-neutral-200 hover:text-red-600 hover:bg-neutral-900 transition-colors"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
