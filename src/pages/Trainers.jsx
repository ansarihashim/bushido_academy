import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

function TrainerCard({ trainer }) {
  const {
    name,
    profession,
    qualifications = [],
    experience,
    hometown,
    bio,
    imageUrl,
  } = trainer

  return (
    <article className="bg-[#171717] border border-neutral-800 hover:border-red-600 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-[0_30px_60px_-25px_rgba(220,38,38,0.4)] group">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* PHOTO */}
        <div className="lg:col-span-2 relative aspect-4/5 lg:aspect-auto bg-neutral-900 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name || 'Trainer'}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
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
            </div>
          )}
          <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" />
        </div>

        {/* DETAILS */}
        <div className="lg:col-span-3 p-8 sm:p-10">
          <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-3">
            {profession || 'Head Instructor'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide mb-4">
            {name || 'Trainer Name'}
          </h2>

          {qualifications.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {qualifications.map((q) => (
                <span
                  key={q}
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-red-950/40 border border-red-900/60 text-red-400 rounded-sm"
                >
                  {q}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {experience && (
              <div className="border-l-2 border-red-600 pl-4">
                <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold mb-1">
                  Experience
                </p>
                <p className="text-white font-semibold">{experience}</p>
              </div>
            )}
            {hometown && (
              <div className="border-l-2 border-red-600 pl-4">
                <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold mb-1">
                  Hometown
                </p>
                <p className="text-white font-semibold">{hometown}</p>
              </div>
            )}
          </div>

          {bio && (
            <p className="text-neutral-400 leading-relaxed">{bio}</p>
          )}
        </div>
      </div>
    </article>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="relative w-16 h-16">
        <span className="absolute inset-0 rounded-full border-4 border-neutral-800" />
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 animate-spin" />
      </div>
      <p className="mt-6 text-xs tracking-[0.3em] uppercase text-neutral-500 font-bold">
        Loading Trainers
      </p>
    </div>
  )
}

export default function Trainers() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchTrainers() {
      try {
        const snapshot = await getDocs(collection(db, 'trainers'))
        if (cancelled) return
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setTrainers(data)
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'Failed to load trainers')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTrainers()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen">
      {/* HERO BANNER */}
      <section className="relative py-24 sm:py-28 border-b border-neutral-900 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.18), transparent 60%), #0a0a0a',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-4">
            The Senseis
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-wide text-white">
            Our Trainers
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-neutral-700" />
            <span className="h-1 w-24 bg-red-600" />
            <span className="h-px w-12 bg-neutral-700" />
          </div>
          <p className="mt-8 text-lg text-neutral-400 max-w-2xl mx-auto">
            Meet the dedicated instructors guiding every student on the path of
            the warrior.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <LoadingSpinner />}

          {!loading && error && (
            <div className="max-w-2xl mx-auto bg-[#171717] border-l-4 border-red-600 p-6 rounded-sm">
              <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-2">
                Error
              </p>
              <p className="text-neutral-300">{error}</p>
            </div>
          )}

          {!loading && !error && trainers.length === 0 && (
            <div className="max-w-2xl mx-auto text-center py-16">
              <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-3">
                Coming Soon
              </p>
              <h3 className="text-3xl font-black text-white tracking-wide mb-3">
                Trainer Profiles
              </h3>
              <p className="text-neutral-400">
                Our trainer profiles are being prepared. Check back soon to meet
                the team.
              </p>
            </div>
          )}

          {!loading && !error && trainers.length > 0 && (
            <div className="grid grid-cols-1 gap-8">
              {trainers.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
