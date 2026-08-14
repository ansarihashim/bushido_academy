import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo.jpeg'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    [
      'relative px-1 py-2 font-heading text-sm font-semibold tracking-[0.18em] uppercase transition-colors duration-200',
      isActive ? 'text-yellow-500' : 'text-neutral-200 hover:text-yellow-500',
    ].join(' ')

  const mobileLinkClass = ({ isActive }) =>
    [
      'relative block px-5 py-3 font-heading text-base font-semibold tracking-[0.18em] uppercase border-l-4 transition-colors duration-200',
      isActive
        ? 'text-yellow-500 border-yellow-500 bg-neutral-900'
        : 'text-neutral-200 border-transparent hover:text-yellow-500 hover:border-yellow-500 hover:bg-neutral-900',
    ].join(' ')

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(234,179,8,0.18)] border-b border-yellow-900/40'
          : 'bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-neutral-900',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 leading-none group">
            <img
              src={logo}
              alt="Bushido Academy"
              className="h-12 w-12 object-contain"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(234,179,8,0.5))',
                mixBlendMode: 'screen',
              }}
            />
            <div className="flex flex-col leading-none">
              <span className="font-display text-4xl sm:text-5xl tracking-[0.18em] text-white group-hover:text-yellow-500 transition-colors duration-200">
                BUSHIDO
              </span>
              <span className="font-heading text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] text-neutral-400 group-hover:text-yellow-500/80 transition-colors duration-200 mt-0.5">
                KARATE KICKBOXING &middot; SPORTS ACADEMY
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={linkClass}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.7)]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="lg:hidden inline-flex items-center justify-center p-2 text-neutral-200 hover:text-yellow-500 hover:bg-neutral-900 transition-colors"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className={[
          'lg:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out',
          open ? 'max-h-96' : 'max-h-0',
        ].join(' ')}
      >
        <nav className="bg-[#0a0a0a] border-t border-neutral-900 py-2">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={mobileLinkClass}
            >
              {({ isActive }) => (
                <>
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute right-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.7)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Animated red line that sweeps across on page load */}
      <span
        aria-hidden="true"
        className="absolute left-0 bottom-0 h-0.5 w-full bg-yellow-500 animate-expand-x"
      />
    </header>
  )
}
