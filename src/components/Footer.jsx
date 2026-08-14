import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpeg'
import { useContent } from '../context/ContentContext'

function InstagramIcon({ size = 40 }) {
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
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const INSTAGRAM_URL =
  'https://www.instagram.com/bushido_karate_kickboxing_dojo'
const FACEBOOK_URL = 'https://www.facebook.com/share/18iEX41qZh/'

export default function Footer() {
  const { t } = useContent()

  return (
    <footer className="relative bg-[#111111] text-neutral-300">
      {/* Angled yellow slash along the top edge */}
      <div
        className="absolute -top-6 left-0 right-0 h-6 bg-yellow-500"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)' }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center">
        {/* DRAGON CROWN — academy logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <img
            src={logo}
            alt="Bushido Academy"
            style={{
              width: '140px',
              height: '140px',
              objectFit: 'contain',
              filter:
                'sepia(1) saturate(2) hue-rotate(5deg) brightness(1.1) drop-shadow(0 0 20px rgba(234,179,8,0.5))',
              mixBlendMode: 'screen',
              animation: 'dragonFloat 8s ease-in-out infinite',
            }}
          />
        </div>

        {/* TOP — wordmark */}
        <h2 className="font-display text-[80px] leading-none text-yellow-500 tracking-[0.04em]">
          BUSHIDO
        </h2>
        <p className="font-heading mt-2 text-xs sm:text-sm tracking-[0.4em] uppercase text-yellow-600/80 font-semibold">
          {t('footer_description', 'Karate Kickboxing & Sports Academy')}
        </p>

        {/* MIDDLE — nav */}
        <span className="block w-full max-w-sm h-px bg-yellow-500/60 my-10" />

        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          {NAV_LINKS.map((link, i) => (
            <span key={link.to} className="inline-flex items-center gap-4">
              {i > 0 && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-yellow-500"
                  aria-hidden="true"
                />
              )}
              <Link
                to={link.to}
                className="font-heading text-sm tracking-[0.2em] uppercase text-neutral-300 hover:text-yellow-500 transition-colors duration-200"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>

        {/* SOCIAL */}
        <div className="flex items-center justify-center gap-8 mt-10">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-neutral-300 hover:text-yellow-500 transition-all duration-200 hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(234,179,8,0.7)]"
          >
            <InstagramIcon size={40} />
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-neutral-300 hover:text-yellow-500 transition-all duration-200 hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(234,179,8,0.7)]"
          >
            <FacebookIcon size={40} />
          </a>
        </div>

        {/* BOTTOM */}
        <span className="block w-full max-w-sm h-px bg-yellow-500/30 my-10" />

        <p className="text-xs text-neutral-500">
          {t('footer_copyright', '© 2025 Bushido Karate Kickboxing & Sports Academy. All rights reserved.')}
        </p>
        <p className="text-xs text-neutral-600 mt-1.5">
          Built with <span className="text-yellow-500">❤️</span> for the Dojo
        </p>
      </div>
    </footer>
  )
}
