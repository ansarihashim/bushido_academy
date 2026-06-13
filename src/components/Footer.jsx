import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

function InstagramIcon({ size = 18 }) {
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

function FacebookIcon({ size = 18 }) {
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
  { to: '/about', label: 'About' },
  { to: '/trainers', label: 'Trainers' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

const EMAIL = 'bushidokksa@gmail.com'
const INSTAGRAM_URL =
  'https://www.instagram.com/bushido_karate_kickboxing_dojo'
const FACEBOOK_URL = 'https://www.facebook.com/share/18iEX41qZh/'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-neutral-300 border-t border-neutral-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-black tracking-widest text-white">
                BUSHIDO
              </h3>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-red-600 mt-1">
                KARATE KICKBOXING &amp; SPORTS ACADEMY
              </p>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              Training warriors in karate, kickboxing, and sports disciplines.
              Building discipline, strength, and honor through traditional
              martial arts and modern athletic training.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-4 relative inline-block">
              Quick Links
              <span className="absolute left-0 -bottom-2 h-0.5 w-10 bg-red-600" />
            </h4>
            <ul className="space-y-2 mt-6">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-400 hover:text-red-600 transition-colors duration-200 inline-flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-red-600 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-4 relative inline-block">
              Connect
              <span className="absolute left-0 -bottom-2 h-0.5 w-10 bg-red-600" />
            </h4>
            <div className="mt-6 space-y-3">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 text-sm text-neutral-400 hover:text-red-600 transition-colors duration-200 group"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 group-hover:bg-red-800 transition-colors duration-200">
                  <Mail size={16} />
                </span>
                <span className="break-all">{EMAIL}</span>
              </a>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900 text-neutral-300 hover:bg-red-600 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                >
                  <InstagramIcon size={18} />
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900 text-neutral-300 hover:bg-red-600 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                >
                  <FacebookIcon size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-center text-xs text-neutral-500">
            &copy; 2025 Bushido Karate Kickboxing &amp; Sports Academy. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
