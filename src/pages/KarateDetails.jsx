import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { Activity, Award, Swords, Target } from 'lucide-react'
import { db } from '../firebase/config'
import { useContent } from '../context/ContentContext'

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const LEARN_CARDS = [
  {
    icon: Activity,
    key: 'kata',
    title: 'Kata',
    text: 'Choreographed sequences of movements that encode the principles of attack and defense. Kata builds form, balance, and mental focus.',
  },
  {
    icon: Target,
    key: 'kihon',
    title: 'Kihon',
    text: 'The fundamentals — stances, strikes, blocks, and kicks drilled to perfection. Strong basics are the foundation of every technique.',
  },
  {
    icon: Swords,
    key: 'kumite',
    title: 'Kumite',
    text: 'Controlled sparring against a partner. Apply timing, distance, and strategy under pressure in a safe, disciplined setting.',
  },
  {
    icon: Award,
    key: 'belt_grading',
    title: 'Belt Grading',
    text: 'Structured examinations that mark your progress from white belt to black belt and beyond, recognising skill and dedication.',
  },
]

const BELTS = [
  { label: 'White', color: '#f5f5f5', ring: '#d4d4d4' },
  { label: 'Yellow', color: '#eab308', ring: '#ca8a04' },
  { label: 'Orange', color: '#f97316', ring: '#ea580c' },
  { label: 'Green', color: '#22c55e', ring: '#16a34a' },
  { label: 'Blue', color: '#3b82f6', ring: '#2563eb' },
  { label: 'Maroon', color: '#800000', ring: '#5c0000' },
  { label: 'Brown', color: '#78350f', ring: '#5c2a0c' },
  { label: 'Black', color: '#171717', ring: '#000000' },
]

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function KarateDetails() {
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
        const tagged = all.filter((i) => i.tag === 'karate')
        // If any images are tagged "karate" use those, otherwise the first 6.
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
              'repeating-linear-gradient(135deg, #eab308 0 2px, transparent 2px 80px)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-heading text-xs tracking-[0.4em] uppercase text-yellow-500 font-bold mb-5">
            Traditional Martial Art
          </p>
          <h1 className="font-display text-6xl sm:text-8xl md:text-9xl tracking-[0.06em] text-white leading-none">
            {t('karate_page_heading', 'KARATE SHOTOKAI')}
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
            {t('karate_what_heading', 'What is Karate Shotokai?')}
          </h2>
          <span className="block mb-8 h-1 w-20 bg-yellow-500" />
          <div className="space-y-5 text-lg text-neutral-400 leading-relaxed">
            <p>{t('karate_what_text', 'Shotokai is one of the most widely practiced styles of karate, developed by Gichin Funakoshi and his son Gigo Funakoshi. It is characterised by deep, long stances that build powerful, stable movement and explosive linear techniques.')}</p>
            <p>
              Training is built on three pillars — <strong className="text-yellow-300">kihon</strong>{' '}
              (basics), <strong className="text-yellow-300">kata</strong>{' '}
              (forms), and <strong className="text-yellow-300">kumite</strong>{' '}
              (sparring). Together they forge not only physical strength and
              precision, but the mental discipline, respect, and humility at the
              heart of the martial way.
            </p>
            <p>
              At Bushido Academy, students of every age and level train under
              expert instruction, progressing through a structured belt system
              that rewards consistent effort and genuine mastery.
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
              {t('karate_learn_heading', 'What You Will Learn')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEARN_CARDS.map((card) => {
              const { icon: Icon, title } = card
              return (
                <div
                  key={title}
                  className="group bg-[#171717] border border-neutral-800 hover:border-yellow-500 rounded-sm p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(234,179,8,0.4)]"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-sm bg-yellow-950/40 border border-yellow-900/60 text-yellow-500 mb-5 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                    <Icon size={26} />
                  </div>
                  <h3 className="font-display text-3xl tracking-[0.04em] text-white mb-3">
                    {t(card.key + '_title', card.title)}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {t(card.key + '_desc', card.text)}
                  </p>
                </div>
              )
            })}
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
                    alt={img.caption || 'Karate'}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BELT PROGRESSION */}
      <section className="py-16 sm:py-24 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-heading text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold mb-3">
              The Path
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.05em] text-white">
              Belt Progression
            </h2>
          </div>

          <div className="relative">
            {/* connecting line */}
            <div className="absolute left-0 right-0 top-7 h-1 bg-gradient-to-r from-neutral-700 via-yellow-700 to-yellow-500 rounded-full hidden sm:block" />
            <ol className="relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-y-10 gap-x-4">
              {BELTS.map((belt, i) => (
                <li
                  key={belt.label}
                  className="flex flex-col items-center text-center"
                >
                  <span
                    className="w-14 h-14 rounded-full border-4 shadow-lg"
                    style={{
                      backgroundColor: belt.color,
                      borderColor: belt.ring,
                    }}
                    aria-hidden="true"
                  />
                  <span className="mt-4 font-heading text-[11px] tracking-[0.25em] uppercase text-neutral-300 font-bold">
                    {belt.label}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-600 font-bold mt-1">
                    {i === 0
                      ? 'Start'
                      : i === BELTS.length - 1
                        ? 'Mastery'
                        : `Level ${i}`}
                  </span>
                </li>
              ))}
            </ol>
          </div>
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
