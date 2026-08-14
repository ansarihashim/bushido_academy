import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'

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

export default function AdminLogin() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      console.log('[AdminLogin] User already signed in, redirecting:', user.email)
      navigate('/admin', { replace: true })
    }
  }, [authLoading, user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setError('')
    setSubmitting(true)
    console.log('[AdminLogin] Attempting sign in for:', email)
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      console.log('[AdminLogin] Sign in success:', credential.user?.email)
      navigate('/admin', { replace: true })
    } catch (err) {
      console.error('[AdminLogin] Sign in failed:', err.code, err.message, err)
      setError(`${mapAuthError(err.code)} (${err.code || 'unknown'})`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(234,179,8,0.18), transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(161,98,7,0.18), transparent 55%), #0a0a0a',
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #eab308 0 2px, transparent 2px 80px)',
        }}
      />

      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8 group">
          <span className="text-3xl font-black tracking-widest text-white group-hover:text-yellow-500 transition-colors">
            BUSHIDO
          </span>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-neutral-400 mt-1">
            KARATE KICKBOXING &amp; SPORTS ACADEMY
          </p>
        </Link>

        <div className="relative bg-[#171717] border border-neutral-800 rounded-sm p-8 sm:p-10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
          <span className="absolute top-0 left-0 right-0 h-1 bg-yellow-500" />

          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-yellow-500 font-bold mb-2">
              Restricted Area
            </p>
            <h1 className="text-3xl font-black tracking-wide text-white">
              Admin Sign In
            </h1>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-neutral-700" />
              <span className="w-2 h-2 bg-yellow-500 rotate-45" />
              <span className="h-px w-8 bg-neutral-700" />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 bg-yellow-950/40 border-l-4 border-yellow-500 p-4 rounded-sm"
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-yellow-300 font-bold mb-1">
                Error
              </p>
              <p className="text-sm text-neutral-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bushido.com"
                className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white px-4 py-3 rounded-sm placeholder:text-neutral-600 transition-colors"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white px-4 py-3 rounded-sm placeholder:text-neutral-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm px-6 py-4 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(234,179,8,0.6)]"
            >
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          <Link
            to="/"
            className="hover:text-yellow-500 transition-colors tracking-wider uppercase font-semibold"
          >
            ← Back to Website
          </Link>
        </p>
      </div>
    </div>
  )
}
