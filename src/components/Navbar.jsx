import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/trainers', label: 'Trainers' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
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
      'relative px-1 py-2 text-sm font-semibold tracking-wide uppercase transition-colors duration-200',
      isActive
        ? 'text-red-600'
        : 'text-neutral-200 hover:text-red-600',
      'after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-red-600 after:transition-all after:duration-300',
      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full',
    ].join(' ')

  const mobileLinkClass = ({ isActive }) =>
    [
      'block px-4 py-3 text-base font-semibold tracking-wide uppercase border-l-4 transition-colors duration-200',
      isActive
        ? 'text-red-600 border-red-600 bg-neutral-900'
        : 'text-neutral-200 border-transparent hover:text-red-600 hover:border-red-600 hover:bg-neutral-900',
    ].join(' ')

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full transition-all duration-300',
        'bg-[#0a0a0a]/95 backdrop-blur',
        scrolled
          ? 'shadow-[0_2px_20px_rgba(220,38,38,0.15)] border-b border-red-900/40'
          : 'border-b border-neutral-900',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex flex-col leading-none group">
            <span className="text-2xl sm:text-3xl font-black tracking-widest text-white group-hover:text-red-600 transition-colors duration-200">
              BUSHIDO
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] text-neutral-400 group-hover:text-red-600/80 transition-colors duration-200 mt-0.5">
              KARATE KICKBOXING &amp; SPORTS ACADEMY
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-200 hover:text-red-600 hover:bg-neutral-900 transition-colors"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

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
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
