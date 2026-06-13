import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import Toast, { useToast } from '../../components/admin/Toast'

export default function ManageTrainerBio() {
  const [trainerId, setTrainerId] = useState(null)
  const [trainerName, setTrainerName] = useState('')
  const [bio, setBio] = useState('')
  const [originalBio, setOriginalBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const { toast, showToast } = useToast()

  useEffect(() => {
    let cancelled = false

    async function fetchTrainer() {
      try {
        const q = query(collection(db, 'trainers'), limit(1))
        const snapshot = await getDocs(q)
        if (cancelled) return

        if (snapshot.empty) {
          setError(
            'No trainer document found. Add one in Firestore to enable bio editing.'
          )
          return
        }

        const docSnap = snapshot.docs[0]
        const data = docSnap.data()
        setTrainerId(docSnap.id)
        setTrainerName(data.name || '')
        setBio(data.bio || '')
        setOriginalBio(data.bio || '')
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'Failed to load trainer.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTrainer()
    return () => {
      cancelled = true
    }
  }, [])

  const isDirty = bio !== originalBio

  async function handleSave(e) {
    e.preventDefault()
    if (saving || !trainerId || !isDirty) return

    setSaving(true)
    try {
      await updateDoc(doc(db, 'trainers', trainerId), {
        bio: bio.trim(),
        updatedAt: serverTimestamp(),
      })
      setOriginalBio(bio.trim())
      setBio(bio.trim())
      showToast('Bio saved successfully.')
    } catch (err) {
      showToast(err.message || 'Failed to save bio.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Toast toast={toast} onClose={() => showToast('')} />

      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-2">
          Manage
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
          Trainer Bio
        </h1>
        <span className="block mt-4 h-1 w-16 bg-red-600" />
        <p className="mt-5 text-neutral-400 max-w-2xl">
          Update the public-facing bio shown on the Trainers page.
        </p>
      </div>

      <div className="max-w-3xl">
        {loading && (
          <div className="bg-[#171717] border border-neutral-800 rounded-sm p-10 flex items-center justify-center">
            <div className="relative w-12 h-12">
              <span className="absolute inset-0 rounded-full border-4 border-neutral-800" />
              <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 animate-spin" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-[#171717] border-l-4 border-red-600 p-6 rounded-sm">
            <p className="text-[10px] tracking-[0.3em] uppercase text-red-400 font-bold mb-2">
              Unable to Load
            </p>
            <p className="text-neutral-300">{error}</p>
          </div>
        )}

        {!loading && !error && trainerId && (
          <form
            onSubmit={handleSave}
            className="bg-[#171717] border border-neutral-800 rounded-sm p-6 sm:p-8"
          >
            {trainerName && (
              <div className="mb-6 pb-6 border-b border-neutral-800">
                <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold mb-1">
                  Editing Bio For
                </p>
                <p className="text-xl font-black text-white tracking-wide">
                  {trainerName}
                </p>
              </div>
            )}

            <label
              htmlFor="bio"
              className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              rows={10}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write the trainer's biography..."
              className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-red-600 focus:outline-none text-white px-4 py-3 rounded-sm placeholder:text-neutral-600 transition-colors resize-y leading-relaxed"
            />
            <p className="mt-2 text-xs text-neutral-500">
              {bio.length} characters
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={saving || !isDirty}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                {saving ? 'Saving...' : 'Save Bio'}
              </button>
              {isDirty && !saving && (
                <span className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-bold">
                  Unsaved changes
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
