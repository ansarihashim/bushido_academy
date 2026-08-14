import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import { useContent } from '../context/ContentContext'
import logo from '../assets/logo.jpeg'

/* -------------------------------------------------------------------------- */
/*  Dragon divider — academy logo as a faint floating accent between sections */
/* -------------------------------------------------------------------------- */

function DragonDivider() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0',
        opacity: 0.15,
        pointerEvents: 'none',
      }}
    >
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        style={{
          width: '180px',
          height: '180px',
          objectFit: 'contain',
          filter: 'sepia(1) saturate(2) hue-rotate(5deg)',
          mixBlendMode: 'screen',
          animation: 'dragonFloat 6s ease-in-out infinite',
        }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Background particles (positions fixed once at module load)                */
/* -------------------------------------------------------------------------- */

const PARTICLES = Array.from({ length: 20 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 3 + Math.random() * 5,
  delay: Math.random() * 6,
  duration: 6 + Math.random() * 8,
}))

/* -------------------------------------------------------------------------- */
/*  Reveal helper — directional scroll-in                                     */
/* -------------------------------------------------------------------------- */

function Reveal({
  children,
  from = 'up',
  delay = 0,
  as: Tag = 'div',
  className = '',
  ...rest
}) {
  const [ref, visible] = useScrollReveal()
  const hidden = {
    up: 'translateY(40px)',
    left: 'translateX(-60px)',
    right: 'translateX(60px)',
    none: 'none',
  }[from]

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : hidden,
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/*  Typewriter — types out letter by letter                                   */
/* -------------------------------------------------------------------------- */

function Typewriter({ text, speed = 95 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count >= text.length) return
    const id = setTimeout(() => setCount((c) => c + 1), speed)
    return () => clearTimeout(id)
  }, [count, text, speed])

  const done = count >= text.length
  return (
    <>
      {text.slice(0, count)}
      <span
        className={'type-caret text-yellow-500' + (done ? ' is-done' : '')}
        aria-hidden="true"
      >
        _
      </span>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Credential — dash slides in first, then the text                          */
/* -------------------------------------------------------------------------- */

function Credential({ text, delay }) {
  const [ref, visible] = useScrollReveal()
  return (
    <li ref={ref} className="flex items-center gap-4">
      <span
        className="h-0.5 w-10 bg-yellow-500 shrink-0"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateX(-24px)',
          transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
        }}
      />
      <span
        className="font-heading text-base sm:text-lg md:text-xl tracking-[0.12em] uppercase text-neutral-200"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateX(20px)',
          transition: `opacity 0.6s ease ${delay + 140}ms, transform 0.6s ease ${delay + 140}ms`,
        }}
      >
        {text}
      </span>
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const CREDENTIALS = [
  '4th Dan Black Belt, Karate Shotokan',
  'All India Karate Federation 2nd Dan Black Belt',
  'Kickboxing 2nd Dan Black Belt',
  'National Referee in Karate and State Referee in Kickboxing',
]

const VALUES = [
  {
    title: 'Discipline',
    key: 'about_discipline_quote',
    quote: 'Without discipline, strength is meaningless.',
  },
  {
    title: 'Honor',
    key: 'about_honor_quote',
    quote: 'Respect your opponent. Respect yourself.',
  },
  {
    title: 'Perseverance',
    key: 'about_perseverance_quote',
    quote: 'Fall seven times. Rise eight.',
  },
]

const MILESTONES = [
  { year: 'Year 1', title: 'Academy Founded' , text: 'Afzal Sultan Khan opens the doors of Bushido Academy in Mumbai, built on discipline and respect.' },
  { year: 'Year 5', title: 'First State Championship Students', text: 'Early students step onto the competition mat and bring home their first state-level honors.' },
  { year: 'Year 10', title: 'National Level Recognition', text: 'The academy earns recognition at the national stage for its standard of training and conduct.' },
  { year: 'Year 15', title: '100+ Students Trained', text: 'A growing community — over a hundred martial artists shaped across every age group.' },
  { year: 'Year 27', title: 'Still Going Strong', text: 'Nearly three decades on, the dojo still trains the next generation of warriors every single day.' },
]

const STYLES = `
  @keyframes floatDot {
    0%   { transform: translateY(0) scale(1); opacity: 0.15; }
    50%  { transform: translateY(-32px) scale(1.4); opacity: 0.85; }
    100% { transform: translateY(0) scale(1); opacity: 0.15; }
  }
  .float-dot { animation-name: floatDot; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }

  @keyframes caretBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  .type-caret { animation: caretBlink 1s step-end infinite; }
  .type-caret.is-done { animation: caretBlink 1s step-end infinite; }

  @media (prefers-reduced-motion: reduce) {
    .float-dot, .type-caret, .scroll-arrow { animation: none !important; }
  }
`

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function About() {
  const { t } = useContent()
  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] overflow-hidden">
      <style>{STYLES}</style>

      {/* ===================== 1. OPENING HERO ===================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden px-4">
        {/* Floating yellow particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="float-dot absolute rounded-full bg-yellow-500"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-5xl">
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.04em] text-white leading-[0.95] min-h-[1.2em]">
            <Typewriter text={t('about_hero_heading', 'BORN FROM DISCIPLINE.')} />
          </h1>
          <p className="font-heading mt-8 text-sm sm:text-base md:text-lg tracking-[0.25em] uppercase text-neutral-400">
            {t('about_hero_subtext', 'The story of Bushido Karate Kickboxing & Sports Academy')}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-heading text-[10px] tracking-[0.3em] uppercase text-neutral-600 font-bold">
            Scroll
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#eab308"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="scroll-arrow w-7 h-7 animate-bounce"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* ===================== 2. FOUNDING STORY ===================== */}
      <section className="relative py-28 sm:py-36 border-t border-neutral-900 overflow-hidden">
        {/* huge faded year */}
        <span
          className="pointer-events-none select-none absolute -top-6 right-0 sm:right-10 font-display text-[9rem] sm:text-[16rem] md:text-[20rem] leading-none text-yellow-500/[0.06] tracking-tight"
          aria-hidden="true"
        >
          1997
        </span>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pl-10 sm:pl-16">
            {/* vertical timeline line + dot */}
            <span className="absolute left-1.5 sm:left-3 top-2 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 to-transparent" />
            <span className="absolute left-0 sm:left-1.5 top-2 flex items-center justify-center w-4 h-4 rounded-full bg-yellow-500 ring-4 ring-[#0a0a0a]" />

            <Reveal from="left">
              <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-4">
                {t('about_story_label', '27 Years Ago')}
              </p>
              <h2 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.04em] text-white leading-none mb-8">
                {t('about_story_heading', 'WHERE IT BEGAN')}
              </h2>
            </Reveal>

            <Reveal from="left" delay={150} className="space-y-5 max-w-2xl text-lg text-neutral-300 leading-relaxed">
              <p className="text-white font-medium">{t('about_story_text', 'Bushido Karate Kickboxing & Sports Academy is a premier martial arts academy based in Mumbai, founded by Afzal Sultan Khan. What began as a handful of students in a modest hall has grown into a home for warriors — a place where sweat, respect, and perseverance are taught in equal measure.')}</p>
              <p>
                In the heart of Mumbai, a young martial artist named{' '}
                <span className="text-white font-semibold">
                  Afzal Sultan Khan
                </span>{' '}
                set out with a single conviction — that the discipline of the
                dojo could shape not just fighters, but people of honor.
              </p>
              <p className="text-neutral-400">
                With little more than a worn mat and an unbreakable will, he
                founded Bushido Academy. What started as a handful of students
                in a modest hall became a home for warriors — a place where
                sweat, respect, and perseverance are taught in equal measure.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== 3. THE FOUNDER ===================== */}
      <section className="relative border-y border-neutral-900 bg-[#0a0a0a] py-24 sm:py-32 overflow-hidden">
        {/* 8px yellow left border */}
        <span className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.4)]" />
        <div
          className="absolute -right-40 top-1/3 w-[28rem] h-[28rem] rounded-full opacity-20 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(234,179,8,0.4) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-14">
          <Reveal from="right">
            <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-4">
              The Founder
            </p>
            <h2 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.04em] text-white leading-[0.9]">
              AFZAL
              <br />
              SULTAN KHAN
            </h2>
          </Reveal>

          <ul className="mt-12 space-y-5">
            {CREDENTIALS.map((cred, i) => (
              <Credential key={cred} text={cred} delay={i * 150} />
            ))}
          </ul>
        </div>
      </section>

      <DragonDivider />

      {/* ===================== 4. VALUES ===================== */}
      <section className="py-24 sm:py-32 border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal from="none" className="text-center mb-16">
            <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-4">
              Our Creed
            </p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.04em] text-white leading-none">
              {t('about_philosophy_heading', 'THE WAY OF THE WARRIOR')}
            </h2>
          </Reveal>

          <div className="space-y-12">
            {VALUES.map((v, i) => (
              <div key={v.title}>
                {i > 0 && (
                  <hr className="border-0 h-px bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent mb-12" />
                )}
                <Reveal from="none" delay={i * 120} className="text-center">
                  <p className="font-heading text-sm tracking-[0.4em] uppercase text-yellow-500 font-bold mb-5">
                    {v.title}
                  </p>
                  <blockquote className="relative">
                    <span
                      className="font-display text-6xl text-yellow-500/30 leading-none select-none"
                      aria-hidden="true"
                    >
                      &ldquo;
                    </span>
                    <p className="font-body italic text-2xl sm:text-3xl md:text-4xl text-white leading-snug max-w-3xl mx-auto -mt-4">
                      {t(v.key, v.quote)}
                    </p>
                    <span
                      className="font-display text-6xl text-yellow-500/30 leading-none select-none"
                      aria-hidden="true"
                    >
                      &rdquo;
                    </span>
                  </blockquote>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 5. PHILOSOPHY ===================== */}
      <section className="relative py-28 sm:py-40 bg-black overflow-hidden">
        {/* diagonal yellow stripe decoration */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #eab308 0 3px, transparent 3px 90px)',
          }}
        />
        <div
          className="absolute -inset-y-32 left-1/3 w-48 bg-yellow-500/[0.06] -skew-x-12 pointer-events-none"
          aria-hidden="true"
        />
        {/* giant Japanese characters behind */}
        <span
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center font-display text-[12rem] sm:text-[20rem] md:text-[28rem] text-white/[0.04] leading-none"
          aria-hidden="true"
        >
          武士道
        </span>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal from="none">
            <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-6">
              The Philosophy
            </p>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-[0.04em] text-white leading-tight">
              BUSHIDO
              <span className="text-yellow-500"> — 武士道 — </span>
              THE WAY OF THE WARRIOR
            </h2>
            <span className="block mx-auto mt-8 h-1 w-24 bg-yellow-500" />
          </Reveal>

          <Reveal from="up" delay={150} className="mt-10 space-y-5 text-lg text-neutral-300 leading-relaxed">
            <p>
              Bushido — literally &ldquo;the way of the warrior&rdquo; — was the
              moral code of the samurai, built on courage, integrity, respect,
              and self-control. It was never only about combat. It was a way to
              live.
            </p>
            <p className="text-neutral-400">
              At Bushido Academy we carry that code into the modern world. The
              same principles that forged warriors centuries ago build
              confident, focused, and respectful people today — on the mat, in
              the classroom, and in life.
            </p>
          </Reveal>
        </div>
      </section>

      <DragonDivider />

      {/* ===================== 6. JOURNEY MILESTONES ===================== */}
      <section className="py-24 sm:py-32 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal from="none" className="text-center mb-16">
            <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-4">
              The Journey
            </p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.04em] text-white leading-none">
              MILESTONES
            </h2>
          </Reveal>

          <div className="relative pl-10 sm:pl-16">
            {/* connecting yellow line */}
            <span className="absolute left-2 sm:left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-yellow-500 via-yellow-700 to-yellow-500/20" />
            <div className="space-y-12">
              {MILESTONES.map((m, i) => (
                <Reveal
                  key={m.title}
                  from="left"
                  delay={i * 100}
                  className="relative"
                >
                  <span className="absolute -left-8 sm:-left-12 top-1 flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500 ring-4 ring-[#0a0a0a]">
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  </span>
                  <p className="font-display text-4xl sm:text-5xl text-yellow-500 leading-none tracking-wide mb-2">
                    {m.year}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-black tracking-wide text-white mb-2">
                    {m.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed max-w-xl">
                    {m.text}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 7. CTA ===================== */}
      <section className="relative py-28 sm:py-36 bg-black border-t border-neutral-900 overflow-hidden">
        <div
          className="absolute inset-0 -z-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(234,179,8,0.25), transparent 65%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal from="up">
            <h2 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-[0.04em] text-white leading-none">
              BECOME PART
              <br />
              OF THE STORY
            </h2>
            <p className="mt-8 text-lg text-neutral-400 max-w-xl mx-auto">
              Your chapter starts the moment you step onto the mat. Train with
              discipline. Live with honor.
            </p>
            <div className="mt-10">
              <Link to="/contact" className="btn-primary group">
                Join Us
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
