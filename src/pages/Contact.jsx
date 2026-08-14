import { useContent } from '../context/ContentContext'

const INSTAGRAM_URL =
  'https://www.instagram.com/bushido_karate_kickboxing_dojo'
const FACEBOOK_URL = 'https://www.facebook.com/share/18iEX41qZh/'
const EMAIL = 'bushidokksa@gmail.com'
const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.0!2d72.8!3d19.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEyJzAwLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890'

function InstagramIcon({ size = 48 }) {
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

function FacebookIcon({ size = 48 }) {
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

const STYLES = `
  @keyframes drawLine { from { width: 0; } to { width: 100%; } }
  .draw-line { animation: drawLine 1.5s ease 0.2s both; }
  @media (prefers-reduced-motion: reduce) {
    .draw-line { animation: none; width: 100%; }
  }
`

export default function Contact() {
  const { t } = useContent()
  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen">
      <style>{STYLES}</style>

      {/* ===================== 1. HERO ===================== */}
      <section className="relative py-28 sm:py-36 bg-black border-b border-neutral-900 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(234,179,8,0.18), transparent 60%), #000',
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #eab308 0 2px, transparent 2px 80px)',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-heading text-xs tracking-[0.4em] uppercase text-yellow-500 font-bold mb-6">
            Step Onto the Mat
          </p>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.04em] text-white leading-none">
            {t('contact_heading', 'THE DOJO AWAITS YOU')}
          </h1>
          {/* Animated underline draws itself in on load */}
          <div className="mx-auto mt-8 w-64 max-w-full flex justify-center">
            <span className="draw-line h-1.5 bg-yellow-500 rounded-full" />
          </div>
          <p className="mt-8 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {t(
              'contact_subtext',
              'Every champion started with a single step. Take yours today.'
            )}
          </p>
        </div>
      </section>

      {/* ===================== 2. PERSONAL MESSAGE ===================== */}
      <section className="relative bg-black border-b border-neutral-900 py-20 sm:py-28 overflow-hidden">
        <span className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.4)]" />
        {/* giant background quote mark */}
        <span
          className="pointer-events-none select-none absolute -top-10 left-6 sm:left-16 font-display text-[16rem] sm:text-[22rem] leading-none text-yellow-500/[0.07]"
          aria-hidden="true"
        >
          &ldquo;
        </span>

        <div className="relative max-w-4xl mx-auto px-6 sm:px-10 lg:px-14">
          <blockquote className="font-body italic text-2xl sm:text-3xl md:text-4xl text-white leading-snug">
            {t(
              'contact_quote',
              'Whether you’re a beginner finding your path or a seasoned martial artist seeking mastery — there is a place for you at Bushido Academy.'
            )}
          </blockquote>
          <footer className="mt-8 flex items-center gap-4">
            <span className="h-px w-12 bg-yellow-500" />
            <p className="font-heading text-sm sm:text-base tracking-[0.18em] uppercase text-yellow-500 font-bold">
              Afzal Sultan Khan
              <span className="text-neutral-500 font-semibold"> — Founder</span>
            </p>
          </footer>
        </div>
      </section>

      {/* ===================== 3. SOCIAL CONNECT ===================== */}
      <section className="py-20 sm:py-28 border-b border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-heading text-xs tracking-[0.4em] uppercase text-yellow-500 font-bold mb-4">
              Join the Community
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.04em] text-white leading-none">
              FIND US ON SOCIAL MEDIA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* INSTAGRAM CARD */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-[#171717] border-t-4 border-yellow-500 border-x border-b border-neutral-800 rounded-sm p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-20px_rgba(234,179,8,0.5)]"
            >
              <div className="text-yellow-500 mb-6 transition-transform duration-300 group-hover:scale-110">
                <InstagramIcon size={48} />
              </div>
              <p className="text-white font-bold text-lg break-all mb-4">
                @bushido_karate_kickboxing_dojo
              </p>
              <p className="text-neutral-400 leading-relaxed flex-1 mb-8">
                Follow our journey — training moments, tournament victories, and
                daily dojo life.
              </p>
              <span className="inline-flex items-center justify-center gap-2 bg-yellow-500 group-hover:bg-yellow-400 text-black font-heading font-bold uppercase tracking-[0.15em] text-sm px-6 py-3.5 rounded-sm transition-colors">
                Follow Us on Instagram
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>

            {/* FACEBOOK CARD */}
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-[#171717] border-t-4 border-yellow-500 border-x border-b border-neutral-800 rounded-sm p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-20px_rgba(234,179,8,0.5)]"
            >
              <div className="text-yellow-500 mb-6 transition-transform duration-300 group-hover:scale-110">
                <FacebookIcon size={48} />
              </div>
              <p className="text-white font-bold text-lg break-all mb-4">
                Bushido Academy
              </p>
              <p className="text-neutral-400 leading-relaxed flex-1 mb-8">
                Like our page for event announcements, results, and community
                updates.
              </p>
              <span className="inline-flex items-center justify-center gap-2 bg-yellow-500 group-hover:bg-yellow-400 text-black font-heading font-bold uppercase tracking-[0.15em] text-sm px-6 py-3.5 rounded-sm transition-colors">
                Like Us on Facebook
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ===================== 4. MAP ===================== */}
      <section className="py-20 sm:py-28 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-heading text-xs tracking-[0.4em] uppercase text-yellow-500 font-bold mb-4">
              Come Train With Us
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.04em] text-white leading-none">
              {t('contact_map_heading', 'VISIT THE DOJO')}
            </h2>
            <p className="mt-6 text-lg text-neutral-400">
              {t('contact_map_subtext', 'Train where champions are made.')}
            </p>
          </div>

          <div
            onClick={() =>
              window.open(
                'https://www.google.com/maps/place/Bushido+karate+%26+kickboxing+sports+academy/@20.5537301,74.5355496,16z/data=!3m1!4b1!4m6!3m5!1s0x3bde9945d4aba6bf:0x4c620e07c2b2c379!8m2!3d20.5544735!4d74.538618!16s%2Fg%2F11tchktwlj',
                '_blank'
              )
            }
            style={{ cursor: 'pointer', position: 'relative' }}
            className="border-2 border-yellow-500 rounded-sm overflow-hidden shadow-[0_30px_70px_-30px_rgba(234,179,8,0.5)]"
          >
            <iframe
              src={MAP_EMBED}
              title="Bushido Academy Location"
              width="100%"
              height="450"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                border: 0,
                display: 'block',
                filter: 'grayscale(0.4) contrast(1.1)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                background: '#eab308',
                color: 'black',
                padding: '8px 16px',
                fontFamily: 'Oswald, sans-serif',
                fontWeight: 'bold',
                fontSize: '14px',
                letterSpacing: '0.1em',
              }}
            >
              OPEN IN GOOGLE MAPS →
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 5. EMAIL ===================== */}
      <section className="py-16 sm:py-20">
        <p className="text-center text-lg text-neutral-400">
          Or reach us directly:{' '}
          <a
            href={`mailto:${EMAIL}`}
            className="group relative inline-block text-white font-semibold hover:text-yellow-500 transition-colors"
          >
            {EMAIL}
            <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-yellow-500 group-hover:w-full transition-all duration-300" />
          </a>
        </p>
      </section>
    </div>
  )
}
