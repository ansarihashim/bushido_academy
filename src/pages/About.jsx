function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7"
      aria-hidden="true"
    >
      <path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7"
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7"
      aria-hidden="true"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

const WHY_US = [
  {
    icon: <StarIcon />,
    title: 'Expert Trainer',
    text: '4th Dan Black Belt founder with 27+ years of teaching and national-level refereeing experience.',
  },
  {
    icon: <BookIcon />,
    title: 'Structured Curriculum',
    text: 'Carefully designed progression from white belt fundamentals to advanced black belt techniques.',
  },
  {
    icon: <UsersIcon />,
    title: 'All Age Groups',
    text: 'Programs for kids, teens, and adults — every student trained at their own pace and level.',
  },
  {
    icon: <TrophyIcon />,
    title: 'Competition Training',
    text: 'Specialized coaching for tournament and championship participants at state and national levels.',
  },
]

const MILESTONES = [
  {
    year: 'Founded',
    title: 'Bushido Academy Established',
    text: 'Founded in Mumbai by Sensei Afzal Sultan Khan with a vision to teach traditional martial arts rooted in discipline and respect.',
  },
  {
    year: '27+ Yrs',
    title: 'Decades of Training Excellence',
    text: 'Over twenty-seven years of consistent training, mentoring countless martial artists across all age groups.',
  },
  {
    year: 'State / National',
    title: 'Champions Produced',
    text: 'Multiple students have represented at state and national level competitions in karate and kickboxing.',
  },
]

export default function About() {
  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5]">
      {/* HERO BANNER */}
      <section className="relative py-24 sm:py-32 border-b border-neutral-900 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.18), transparent 60%), #0a0a0a',
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #dc2626 0 2px, transparent 2px 80px)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-4">
            Who We Are
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-wide text-white">
            About Us
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-neutral-700" />
            <span className="h-1 w-24 bg-red-600" />
            <span className="h-px w-12 bg-neutral-700" />
          </div>
          <p className="mt-8 text-lg text-neutral-400 max-w-2xl mx-auto">
            A legacy of discipline, honor, and martial arts excellence — built
            in Mumbai, shaped by tradition.
          </p>
        </div>
      </section>

      {/* OUR ACADEMY */}
      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-1">
              <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-3">
                Our Story
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-wide">
                Our Academy
              </h2>
              <span className="block mt-5 h-1 w-16 bg-red-600" />
            </div>
            <div className="lg:col-span-2 space-y-5 text-neutral-300 leading-relaxed text-lg">
              <p>
                Bushido Karate Kickboxing &amp; Sports Academy is a premier
                martial arts academy based in Mumbai, founded by{' '}
                <span className="text-white font-semibold">
                  Sensei Afzal Sultan Khan
                </span>
                . For over two decades, we have been dedicated to teaching
                traditional Karate Shotokan and modern Kickboxing with an
                unwavering commitment to discipline, honor, and personal growth.
              </p>
              <p className="text-neutral-400">
                We believe martial arts is more than physical training — it is a
                lifelong practice of self-mastery. Our academy welcomes students
                of every age and skill level, offering structured programs that
                shape not only skilled fighters, but disciplined and respectful
                individuals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="py-20 sm:py-24 border-t border-neutral-900 bg-[#0a0a0a] relative overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(220,38,38,0.3) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-3">
              The Way We Walk
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-wide">
              Our Philosophy
            </h2>
            <div className="flex items-center justify-center gap-3 mt-5">
              <span className="h-px w-8 bg-neutral-700" />
              <span className="w-2 h-2 bg-red-600 rotate-45" />
              <span className="h-px w-8 bg-neutral-700" />
            </div>
          </div>

          <div className="bg-[#171717] border-l-4 border-red-600 p-8 sm:p-12 rounded-sm">
            <p className="text-xl sm:text-2xl text-white font-semibold italic leading-relaxed">
              &ldquo;Bushido — the way of the warrior — is the code our academy
              lives by.&rdquo;
            </p>
            <p className="mt-6 text-neutral-400 leading-relaxed text-lg">
              Rooted in centuries of samurai tradition, Bushido teaches us that
              true strength comes from discipline of the body, clarity of the
              mind, and integrity of the heart. We instill these timeless values
              in every student who steps onto our mat.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-2">
                  01
                </p>
                <h4 className="text-white text-xl font-black tracking-wide mb-2">
                  Discipline
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Daily commitment to training, technique, and self-control.
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-2">
                  02
                </p>
                <h4 className="text-white text-xl font-black tracking-wide mb-2">
                  Respect
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Honor for teachers, fellow students, and the art itself.
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-2">
                  03
                </p>
                <h4 className="text-white text-xl font-black tracking-wide mb-2">
                  Perseverance
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Strength through struggle — never giving up on the path.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 sm:py-24 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-3">
              The Bushido Edge
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-wide">
              Why Choose Us?
            </h2>
            <div className="flex items-center justify-center gap-3 mt-5">
              <span className="h-px w-8 bg-neutral-700" />
              <span className="w-2 h-2 bg-red-600 rotate-45" />
              <span className="h-px w-8 bg-neutral-700" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {WHY_US.map((item) => (
              <div
                key={item.title}
                className="group flex gap-5 bg-[#171717] border border-neutral-800 hover:border-red-600 p-6 sm:p-8 rounded-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(220,38,38,0.4)]"
              >
                <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-sm bg-red-950/40 border border-red-900/50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-wide text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-400">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MILESTONES TIMELINE */}
      <section className="py-20 sm:py-24 border-t border-neutral-900 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-3">
              Our Journey
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-wide">
              Milestones
            </h2>
            <div className="flex items-center justify-center gap-3 mt-5">
              <span className="h-px w-8 bg-neutral-700" />
              <span className="w-2 h-2 bg-red-600 rotate-45" />
              <span className="h-px w-8 bg-neutral-700" />
            </div>
          </div>

          <div className="relative pl-8 sm:pl-12">
            <span className="absolute left-0 sm:left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-red-600 via-red-900 to-transparent" />
            <div className="space-y-10">
              {MILESTONES.map((m) => (
                <div key={m.title} className="relative">
                  <span className="absolute -left-8 sm:-left-12 top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-red-600 ring-4 ring-[#0a0a0a]">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </span>
                  <p className="text-xs tracking-[0.25em] uppercase text-red-600 font-bold mb-2">
                    {m.year}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-wide text-white mb-2">
                    {m.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
