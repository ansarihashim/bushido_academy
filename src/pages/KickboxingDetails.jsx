import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { Dumbbell, HeartPulse, Swords, Trophy } from 'lucide-react'
import { db } from '../firebase/config'
import { useContent } from '../context/ContentContext'

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const LEARN_CARDS = [
  {
    icon: Trophy,
    key: 'padwork',
    title: 'Pad Work',
    text: 'Sharpen your strikes on focus mitts and Thai pads. Develop accuracy, speed, and combinations while a coach reads and corrects your form.',
  },
  {
    icon: Swords,
    key: 'sparring',
    title: 'Sparring',
    text: 'Test your skills against a live partner. Controlled rounds build timing, defense, footwork, and the composure to perform under pressure.',
  },
  {
    icon: HeartPulse,
    key: 'conditioning',
    title: 'Conditioning',
    text: 'High-intensity drills that build explosive power, endurance, and fight-ready cardio. Get stronger, faster, and tougher every session.',
  },
  {
    icon: Dumbbell,
    key: 'ringready',
    title: 'Ring Ready',
    text: 'Put it all together. Strategy, rounds, and fight preparation that take you from the heavy bag to competing with confidence in the ring.',
  },
]

const LEVELS = [
  {
    label: 'Beginner',
    text: 'Stance, guard, and the fundamental punches and kicks.',
    color: '#22c55e',
    ring: '#16a34a',
  },
  {
    label: 'Intermediate',
    text: 'Combinations, footwork, and controlled pad rounds.',
    color: '#3b82f6',
    ring: '#2563eb',
  },
  {
    label: 'Advanced',
    text: 'Live sparring, defense, and ring strategy.',
    color: '#f97316',
    ring: '#ea580c',
  },
  {
    label: 'Pro',
    text: 'Fight preparation and competition conditioning.',
    color: '#eab308',
    ring: '#ca8a04',
  },
]

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function KickboxingDetails() {
  const { t } = useContent()
  const [images, setImages] = useState([])

  useEffect(() => {
    let cancelled = false
    async function fetchGallery() {
      try {
        const q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'))
        const snap = await getDocs(q)
        if (cancelled) return
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        const tagged = all.filter((i) => i.tag === 'kickboxing')
        // If any images are tagged "kickboxing" use those, otherwise the first 6.
        setImages(tagged.length > 0 ? tagged : all.slice(0, 6))
      } catch {
        // leave gallery empty on error
      }
    }
    fetchGallery()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen">
      {/* HERO */}
      <section className="relative py-28 sm:py-36 border-b border-neutral-900 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(234,179,8,0.22), transparent 60%), #0a0a0a',
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #eab308 0 2px, transparent 2px 80px)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-heading text-xs tracking-[0.4em] uppercase text-yellow-500 font-bold mb-5">
            Modern Combat Sport
          </p>
          <h1 className="font-display text-6xl sm:text-8xl md:text-9xl tracking-[0.06em] text-white leading-none">
            {t('kickboxing_page_heading', 'KICKBOXING')}
          </h1>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-neutral-700" />
            <span className="h-1 w-24 bg-yellow-500" />
            <span className="h-px w-12 bg-neutral-700" />
          </div>
        </div>
      </section>

      {/* WHAT IS IT */}
      <section className="py-16 sm:py-24 border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-3">
            The Discipline
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.05em] text-white mb-6">
            {t('kickboxing_what_heading', 'What is Kickboxing?')}
          </h2>
          <span className="block mb-8 h-1 w-20 bg-yellow-500" />
          <div className="space-y-5 text-lg text-neutral-400 leading-relaxed">
            <p>{t('kickboxing_what_text', 'High-intensity combat sport combining punches and kicks with relentless footwork and conditioning. It is as much a fitness discipline as it is a combat art — building explosive power, stamina, and razor-sharp reflexes.')}</p>
            <p>
              Training combines <strong className="text-yellow-300">pad work</strong>,{' '}
              <strong className="text-yellow-300">sparring</strong>, and{' '}
              <strong className="text-yellow-300">conditioning</strong> to forge
              fighters who are fast, durable, and tactically sharp inside the
              ring.
            </p>
            <p>
              At Bushido Academy, students progress from the fundamentals to
              fight-ready training under expert coaching, whether your goal is
              fitness, self-defense, or stepping into competition.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT YOU WILL LEARN */}
      <section className="py-16 sm:py-24 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-3">
              The Curriculum
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.05em] text-white">
              What You Will Learn
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEARN_CARDS.map(({ icon: Icon, key, title, text }) => (
              <div
                key={key}
                className="group bg-[#171717] border border-neutral-800 hover:border-yellow-500 rounded-sm p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(234,179,8,0.4)]"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-sm bg-yellow-950/40 border border-yellow-900/60 text-yellow-500 mb-5 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                  <Icon size={26} />
                </div>
                <h3 className="font-display text-3xl tracking-[0.04em] text-white mb-3">
                  {t(key + '_title', title)}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {t(key + '_desc', text)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {images.length > 0 && (
        <section className="py-16 sm:py-24 border-b border-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-3">
                In Action
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.05em] text-white">
                Gallery
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-square bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800 hover:border-yellow-500 transition-colors"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.caption || 'Kickboxing'}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRAINING LEVELS */}
      <section className="py-16 sm:py-24 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-3">
              The Path
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.05em] text-white">
              Training Levels
            </h2>
          </div>

          <div className="relative">
            {/* connecting line */}
            <div className="absolute left-0 right-0 top-7 h-1 bg-gradient-to-r from-green-600 via-orange-500 to-yellow-500 rounded-full hidden sm:block" />
            <ol className="relative grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
              {LEVELS.map((level, i) => (
                <li
                  key={level.label}
                  className="flex flex-col items-center text-center"
                >
                  <span
                    className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full border-4 shadow-lg font-display text-2xl text-white"
                    style={{
                      backgroundColor: level.color,
                      borderColor: level.ring,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="mt-4 font-heading text-sm tracking-[0.2em] uppercase text-white font-bold">
                    {level.label}
                  </span>
                  <span className="mt-2 text-xs text-neutral-500 leading-relaxed max-w-[14rem]">
                    {level.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-14 text-center font-heading text-sm sm:text-base tracking-[0.25em] uppercase text-neutral-400 font-bold">
            Beginner <span className="text-yellow-500">→</span> Intermediate{' '}
            <span className="text-yellow-500">→</span> Advanced{' '}
            <span className="text-yellow-500">→</span> Pro
          </p>
        </div>
      </section>

      {/* BACK */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-heading font-bold uppercase tracking-[0.2em] text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
