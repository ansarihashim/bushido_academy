import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import ManageGallery from '../pages/admin/ManageGallery'
import ManageEvents from '../pages/admin/ManageEvents'
import ManageSlides from '../pages/admin/ManageSlides'
import ManageTrainerBio from '../pages/admin/ManageTrainerBio'
import ManageSiteSettings from '../pages/admin/ManageSiteSettings'
import ManageContent from '../pages/admin/ManageContent'

/* -------------------------------------------------------------------------- */
/*  Inline animation styles                                                   */
/* -------------------------------------------------------------------------- */

const STYLES = `
  @keyframes afbFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes afbSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes afbPop { from { opacity: 0; transform: translateY(12px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }

  /* Drawer height: 70vh on desktop, near-fullscreen on mobile. */
  .afb-drawer { height: 70vh; }

  /* Toolbar buttons — icon + label, min 44px touch target. */
  .afb-tbtn {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #1a1a1a;
    border: 1px solid #333;
    color: #f5f5f5;
    padding: 8px 16px;
    border-radius: 4px;
    font-family: 'Oswald', sans-serif;
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    transition: border-color 0.2s, color 0.2s;
  }
  .afb-tbtn:hover { border-color: #eab308; color: #eab308; }
  .afb-tbtn-logout:hover { border-color: #ef4444; color: #ef4444; }
  .afb-tbtn:disabled { opacity: 0.6; cursor: default; }

  @media (max-width: 640px) {
    .afb-drawer { height: 90vh; }
    /* Toolbar buttons fill two columns and read larger on phones. */
    .afb-tbtn { flex: 1 1 calc(50% - 8px); font-size: 0.95rem; }
    /* Respect the iOS home-indicator safe area. */
    .afb-toolbar { padding-bottom: max(8px, env(safe-area-inset-bottom)); }
    /* Comfortable, zoom-proof form controls inside drawers. */
    .afb-drawer input,
    .afb-drawer select,
    .afb-drawer textarea {
      font-size: 16px !important;
      min-height: 44px;
    }
    .afb-drawer button { min-height: 44px; }
  }
`

/* -------------------------------------------------------------------------- */
/*  Toolbar icons — minimal line icons, inherit color via currentColor.       */
/* -------------------------------------------------------------------------- */

const iconBase = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

function CameraIcon() {
  return (
    <svg {...iconBase}>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg {...iconBase}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function SlidesIcon() {
  return (
    <svg {...iconBase}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg {...iconBase}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function EditTextIcon() {
  return (
    <svg {...iconBase}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg {...iconBase}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

/* The four admin panels, reusing the existing self-contained Manage* screens. */
const DRAWERS = {
  gallery: { label: 'Add to Gallery', title: 'Manage Gallery', Component: ManageGallery, Icon: CameraIcon },
  events: { label: 'Add Event', title: 'Manage Events', Component: ManageEvents, Icon: CalendarIcon },
  slides: { label: 'Hero Slides', title: 'Manage Slides', Component: ManageSlides, Icon: SlidesIcon },
  'trainer-bio': { label: 'Trainer Bio', title: 'Trainer Bio', Component: ManageTrainerBio, Icon: UserIcon },
  content: { label: 'Edit Text', title: 'Edit Text', Component: ManageContent, Icon: EditTextIcon },
  settings: { label: 'Site Settings', title: 'Site Settings', Component: ManageSiteSettings, Icon: SettingsIcon },
}

function mapAuthError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.'
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.'
    default:
      return 'Sign in failed. Please try again.'
  }
}

/* -------------------------------------------------------------------------- */
/*  Icons                                                                     */
/* -------------------------------------------------------------------------- */

function CloseIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*  Login modal                                                               */
/* -------------------------------------------------------------------------- */

function LoginModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setError('')
    setSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // AuthContext picks up the new user; this modal unmounts via parent.
      onClose()
    } catch (err) {
      console.error('[AdminFloatingButton] Sign in failed:', err.code, err.message)
      setError(`${mapAuthError(err.code)} (${err.code || 'unknown'})`)
      setSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admin Access"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'overlayFadeIn 300ms ease forwards',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '400px',
          maxHeight: '85vh',
          overflowY: 'auto',
          background: '#111111',
          border: '1px solid #eab308',
          borderRadius: '8px',
          padding: '32px',
          boxShadow: '0 30px 60px -20px rgba(0,0,0,0.8)',
          zIndex: 99999,
          animation: 'modalFadeIn 350ms cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}
      >
        <h2
          className="font-heading"
          style={{
            color: '#eab308',
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          Admin Access
        </h2>
        <p style={{ color: '#a3a3a3', fontSize: '0.8rem', marginBottom: '24px' }}>
          Sign in to manage site content.
        </p>

        {error && (
          <div
            role="alert"
            style={{
              marginBottom: '20px',
              background: 'rgba(234,179,8,0.1)',
              borderLeft: '4px solid #eab308',
              padding: '12px 14px',
              borderRadius: '4px',
              color: '#fde68a',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="afb-email"
            style={labelStyle}
          >
            Email
          </label>
          <input
            id="afb-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@bushido.com"
            style={inputStyle}
          />

          <label
            htmlFor="afb-password"
            style={{ ...labelStyle, marginTop: '16px' }}
          >
            Password
          </label>
          <input
            id="afb-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
          />

          <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 1,
                minHeight: '48px',
                background: '#eab308',
                color: '#000',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '16px',
                padding: '13px',
                borderRadius: '4px',
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1,
                transition: 'background 0.2s',
              }}
            >
              {submitting ? 'Logging in…' : 'Login'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                minHeight: '48px',
                background: 'transparent',
                color: '#fff',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '16px',
                padding: '13px',
                borderRadius: '4px',
                border: '1px solid #404040',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '0.65rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: '#a3a3a3',
  fontWeight: 700,
  marginBottom: '8px',
}

const inputStyle = {
  width: '100%',
  minHeight: '48px',
  background: '#0a0a0a',
  border: '1px solid #404040',
  color: '#fff',
  padding: '12px 14px',
  borderRadius: '4px',
  outline: 'none',
  // 16px prevents iOS Safari from auto-zooming when the field is focused.
  fontSize: '16px',
}

/* -------------------------------------------------------------------------- */
/*  Slide-up admin drawer (hosts an existing Manage* panel)                   */
/* -------------------------------------------------------------------------- */

function AdminDrawer({ drawerKey, onClose }) {
  const { title, Component } = DRAWERS[drawerKey]

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'flex-end',
        animation: 'afbFadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="afb-drawer"
        style={{
          width: '100%',
          background: '#0f0f0f',
          borderTop: '2px solid #eab308',
          overflowY: 'auto',
          animation: 'afbSlideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative',
        }}
      >
        {/* Sticky drawer header with close button */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            background: '#0f0f0f',
            borderBottom: '1px solid #262626',
          }}
        >
          <span
            className="font-heading"
            style={{
              color: '#eab308',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontSize: '0.85rem',
            }}
          >
            {title}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '4px',
              background: '#1a1a1a',
              border: '1px solid #404040',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* The real admin panel — same Firestore/Cloudinary logic as /admin */}
        <div style={{ padding: '24px 20px 48px' }}>
          <Component />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Bottom admin toolbar (shown when logged in)                               */
/* -------------------------------------------------------------------------- */

function AdminToolbar({ onOpenDrawer, onLogout, loggingOut, closing }) {
  return (
    <div
      className="afb-toolbar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#111111',
        borderTop: '2px solid #eab308',
        padding: '8px 12px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap',
        zIndex: 9997,
        boxShadow: '0 -10px 30px -10px rgba(0,0,0,0.7)',
        animation: closing
          ? 'toolbarSlideDown 200ms ease forwards'
          : 'toolbarSlideUp 400ms cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}
    >
      <span
        className="font-heading"
        style={{
          color: '#eab308',
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          paddingRight: '4px',
          whiteSpace: 'nowrap',
          width: '100%',
        }}
      >
        Admin Mode
      </span>

      {Object.entries(DRAWERS).map(([key, { label, Icon }]) => (
        <button
          key={key}
          type="button"
          className="afb-tbtn"
          onClick={() => onOpenDrawer(key)}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}

      <button
        type="button"
        className="afb-tbtn afb-tbtn-logout"
        onClick={onLogout}
        disabled={loggingOut}
      >
        <LogoutIcon />
        <span>{loggingOut ? 'Logging out…' : 'Logout'}</span>
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main floating control                                                     */
/* -------------------------------------------------------------------------- */

export default function AdminFloatingButton() {
  const { user, loading } = useAuth()
  const { pathname } = useLocation()
  const [showLogin, setShowLogin] = useState(false)
  const [activeDrawer, setActiveDrawer] = useState(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [toolbarClosing, setToolbarClosing] = useState(false)

  const tapCount = useRef(0)
  const tapTimer = useRef(null)

  const loggedIn = Boolean(user)
  const onAdminRoute = pathname.startsWith('/admin')

  // Lock background scroll whenever a modal or drawer is open.
  useEffect(() => {
    const open = showLogin || activeDrawer
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [showLogin, activeDrawer])

  // Secret access: there is NO visible entry point for regular visitors.
  // Admins reveal the login modal with Ctrl + Shift + A.
  useEffect(() => {
    if (onAdminRoute) return
    function handleKeyDown(e) {
      // e.key is 'A' when Shift is held; guard with the secret combo only.
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault()
        setShowLogin(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onAdminRoute])

  // Mobile secret access: triple-tap anywhere within 500ms.
  useEffect(() => {
    if (onAdminRoute) return
    function handleTouchEnd() {
      tapCount.current += 1

      if (tapTimer.current) clearTimeout(tapTimer.current)
      tapTimer.current = setTimeout(() => {
        tapCount.current = 0
      }, 500)

      if (tapCount.current >= 3) {
        tapCount.current = 0
        clearTimeout(tapTimer.current)
        if (!showLogin) setShowLogin(true)
      }
    }

    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchend', handleTouchEnd)
      if (tapTimer.current) clearTimeout(tapTimer.current)
    }
  }, [onAdminRoute, showLogin])

  function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    setActiveDrawer(null)
    setShowLogin(false)
    // Let the toolbar play its slide-down before we sign out (unmounts it).
    setToolbarClosing(true)
    setTimeout(async () => {
      try {
        await signOut(auth)
      } catch (err) {
        console.error('[AdminFloatingButton] Sign out failed:', err)
      } finally {
        setLoggingOut(false)
        setToolbarClosing(false)
      }
    }, 200)
  }

  // Never render on the dedicated /admin dashboard routes — this is a
  // convenience layer for the public site only. Avoid flashing the wrong
  // state while auth is still resolving.
  if (loading || onAdminRoute) return null

  return (
    <>
      <style>{STYLES}</style>

      {/*
        No visible button: regular visitors see nothing. The login modal is
        revealed only via the secret Ctrl+Shift+A shortcut (desktop) or a
        triple-tap anywhere (mobile, handled above).
      */}
      {showLogin && !loggedIn && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Admin toolbar + drawers — ONLY rendered when authenticated. */}
      {loggedIn && (
        <>
          <AdminToolbar
            onOpenDrawer={setActiveDrawer}
            onLogout={handleLogout}
            loggingOut={loggingOut}
            closing={toolbarClosing}
          />
          {activeDrawer && (
            <AdminDrawer
              drawerKey={activeDrawer}
              onClose={() => setActiveDrawer(null)}
            />
          )}
        </>
      )}
    </>
  )
}
