import { Link } from 'react-router-dom'

function AwardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function FlameIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

const HIGHLIGHTS = [
  {
    icon: <AwardIcon />,
    title: '27+ Years Experience',
    text: 'Nearly three decades of shaping martial artists, champions, and disciplined athletes.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Expert Martial Arts Training',
    text: 'Structured curriculum, certified instruction, and a focus on technique, discipline, and respect.',
  },
  {
    icon: <FlameIcon />,
    title: 'Karate & Kickboxing',
    text: 'Master traditional Shotokan Karate alongside modern, high-intensity Kickboxing.',
  },
]

export default function Home() {
  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5]">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 20% 30%, rgba(220,38,38,0.18), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(153,27,27,0.18), transparent 55%), #0a0a0a',
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #dc2626 0 2px, transparent 2px 80px)',
          }}
        />

        <span className="absolute top-24 left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        <span className="absolute bottom-24 right-0 h-px w-1/3 bg-gradient-to-l from-transparent via-red-600 to-transparent" />

        <span className="absolute left-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-600 animate-ping" />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-600 animate-ping [animation-delay:1s]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-red-900/60 rounded-full bg-red-950/30 backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs tracking-[0.25em] uppercase text-red-400 font-semibold">
              Est. Tradition · Forged in Discipline
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.08em] text-white leading-none">
            BUSHIDO
          </h1>
          <p className="mt-4 text-xs sm:text-sm md:text-base font-bold tracking-[0.35em] text-neutral-400">
            KARATE KICKBOXING &amp; SPORTS ACADEMY
          </p>

          <div className="flex items-center justify-center gap-4 mt-10">
            <span className="h-px w-12 bg-red-600" />
            <p className="text-lg sm:text-xl md:text-2xl font-semibold tracking-[0.2em] text-red-600 uppercase">
              Discipline · Strength · Honor
            </p>
            <span className="h-px w-12 bg-red-600" />
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.6)]"
            >
              Explore Events
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </Link>
            <Link
              to="/trainers"
              className="group inline-flex items-center gap-2 border-2 border-red-600 hover:bg-red-600 text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              Meet Our Trainer
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <span className="w-px h-10 bg-gradient-to-b from-red-600 to-transparent" />
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-20 sm:py-24 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="group relative bg-[#171717] border border-neutral-800 hover:border-red-600 p-8 rounded-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(220,38,38,0.4)]"
              >
                <span className="absolute top-0 left-0 h-1 w-0 bg-red-600 group-hover:w-full transition-all duration-500" />
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-red-950/40 border border-red-900/50 text-red-600 mb-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  {h.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white mb-3">
                  {h.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-400">
                  {h.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCIPLINES */}
      <section className="py-20 sm:py-24 border-t border-neutral-900 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-3">
              Our Curriculum
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wide text-white">
              What We Teach
            </h2>
            <div className="flex items-center justify-center gap-3 mt-5">
              <span className="h-px w-8 bg-neutral-700" />
              <span className="w-2 h-2 bg-red-600 rotate-45" />
              <span className="h-px w-8 bg-neutral-700" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group bg-[#171717] border-l-4 border-red-600 p-8 sm:p-10 rounded-sm hover:bg-neutral-900 transition-all duration-300">
              <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-3">
                Traditional
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-5 tracking-wide">
                Karate Shotokan
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-4">
                Rooted in centuries of Japanese tradition, Shotokan Karate
                emphasizes powerful strikes, deep stances, and unwavering
                discipline. Students develop technical precision, body
                conditioning, and the inner calm of a true martial artist.
              </p>
              <ul className="text-sm text-neutral-400 space-y-2 mt-6">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-red-600 rotate-45" />
                  Kata, Kihon &amp; Kumite training
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-red-600 rotate-45" />
                  Belt grading &amp; rank progression
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-red-600 rotate-45" />
                  Self-defense &amp; tournament prep
                </li>
              </ul>
            </div>

            <div className="group bg-[#171717] border-l-4 border-red-600 p-8 sm:p-10 rounded-sm hover:bg-neutral-900 transition-all duration-300">
              <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-3">
                Modern Combat
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-5 tracking-wide">
                Kickboxing
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-4">
                A dynamic, high-intensity striking sport combining punches,
                kicks, knees and footwork. Build explosive power, cardiovascular
                endurance, and razor-sharp reflexes while developing real-world
                fight conditioning.
              </p>
              <ul className="text-sm text-neutral-400 space-y-2 mt-6">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-red-600 rotate-45" />
                  Pad work, bag drills &amp; sparring
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-red-600 rotate-45" />
                  Strength &amp; conditioning programs
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-red-600 rotate-45" />
                  Competition &amp; ring readiness
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER SPOTLIGHT */}
      <section className="py-20 sm:py-24 border-t border-neutral-900 bg-[#0a0a0a] relative overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 -z-0"
          style={{
            background:
              'radial-gradient(circle, rgba(220,38,38,0.3) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-3">
              Leadership
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wide text-white">
              Meet the Founder
            </h2>
            <div className="flex items-center justify-center gap-3 mt-5">
              <span className="h-px w-8 bg-neutral-700" />
              <span className="w-2 h-2 bg-red-600 rotate-45" />
              <span className="h-px w-8 bg-neutral-700" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-3 border-2 border-red-600 rounded-sm -z-0" />
              <div className="relative aspect-[4/5] bg-neutral-800 rounded-sm flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, #dc2626 0 1px, transparent 1px 16px)',
                  }}
                />
                <span className="relative text-neutral-500 text-sm tracking-[0.25em] uppercase font-semibold">
                  Trainer Photo
                </span>
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" />
              </div>
            </div>

            <div>
              <h3 className="text-4xl sm:text-5xl font-black text-white tracking-wide mb-3">
                Afzal Sultan Khan
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-red-950/40 border border-red-900/60 text-red-400 rounded-sm">
                  4th Dan Black Belt
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-red-950/40 border border-red-900/60 text-red-400 rounded-sm">
                  27+ Years Experience
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-red-950/40 border border-red-900/60 text-red-400 rounded-sm">
                  National Referee
                </span>
              </div>
              <p className="text-neutral-400 text-lg leading-relaxed mb-8 border-l-2 border-red-600 pl-5">
                Founder of Bushido Academy and a dedicated martial artist with
                over two decades of experience shaping champions.
              </p>
              <Link
                to="/trainers"
                className="group inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.6)]"
              >
                View Full Profile
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 sm:py-28 border-t-2 border-red-600 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(135deg, #0a0a0a 0%, #1a0606 50%, #0a0a0a 100%)',
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #dc2626 0 1px, transparent 1px 24px)',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wide text-white leading-tight">
            Ready to Begin Your{' '}
            <span className="text-red-600">Journey?</span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto">
            Join Bushido Academy and train under expert guidance. Build
            discipline, strength, and the warrior spirit.
          </p>
          <div className="mt-10">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-base px-10 py-5 rounded-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.7)]"
            >
              Contact Us
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
