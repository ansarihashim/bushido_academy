import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { uploadImage } from '../../utils/cloudinary'
import Toast, { useToast } from '../../components/admin/Toast'
import DropZone from '../../components/admin/DropZone'
import UploadProgress from '../../components/admin/UploadProgress'

const LEGACY_TRAINER_ID = 'afzal'

export default function ManageTrainerBio() {
  const [trainerId, setTrainerId] = useState(null)
  const [trainerName, setTrainerName] = useState('')
  const [bio, setBio] = useState('')
  const [originalBio, setOriginalBio] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // ---- Legacy photos state ----
  const [legacyItems, setLegacyItems] = useState([])
  const [legacyLoading, setLegacyLoading] = useState(true)
  const [legacyFiles, setLegacyFiles] = useState([])
  const [legacyCaptions, setLegacyCaptions] = useState([])
  const [legacyUploading, setLegacyUploading] = useState(false)
  const [legacyProgress, setLegacyProgress] = useState({ current: 0, total: 0 })
  const [legacyResult, setLegacyResult] = useState(null)
  const [legacyResetSignal, setLegacyResetSignal] = useState(0)
  const [deletingLegacyId, setDeletingLegacyId] = useState(null)

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
        setImageUrl(data.imageUrl || '')
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

  async function loadLegacy() {
    try {
      const q = query(
        collection(db, 'trainerLegacy'),
        orderBy('uploadedAt', 'desc')
      )
      const snapshot = await getDocs(q)
      setLegacyItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error('[ManageTrainerBio] Load legacy failed:', err)
      showToast(err.message || 'Failed to load legacy photos.', 'error')
    } finally {
      setLegacyLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLegacy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLegacyUpload() {
    if (legacyUploading || legacyFiles.length === 0) return

    setLegacyUploading(true)
    setLegacyResult(null)
    const total = legacyFiles.length
    const failed = []
    let success = 0

    for (let i = 0; i < legacyFiles.length; i++) {
      setLegacyProgress({ current: i + 1, total })
      const file = legacyFiles[i]
      try {
        const imageUrl = await uploadImage(file, 'trainers/legacy')
        await addDoc(collection(db, 'trainerLegacy'), {
          imageUrl,
          caption: (legacyCaptions[i] || '').trim(),
          uploadedAt: serverTimestamp(),
          trainerId: LEGACY_TRAINER_ID,
        })
        success++
      } catch (err) {
        console.error('[ManageTrainerBio] Legacy upload failed for', file.name, err)
        failed.push(file.name)
      }
    }

    setLegacyUploading(false)
    if (failed.length === 0) {
      setLegacyResult({ status: 'done', successCount: success, failed: [] })
      showToast(
        `${success} legacy ${success === 1 ? 'photo' : 'photos'} uploaded`
      )
    } else {
      setLegacyResult({ status: 'error', successCount: success, failed })
      showToast(
        `${success} uploaded, ${failed.length} failed. See details below.`,
        'error'
      )
    }
    setLegacyFiles([])
    setLegacyCaptions([])
    setLegacyResetSignal((s) => s + 1)
    await loadLegacy()
  }

  async function handleLegacyDelete(id) {
    if (deletingLegacyId) return
    if (!window.confirm('Delete this legacy photo? This cannot be undone.'))
      return

    setDeletingLegacyId(id)
    try {
      await deleteDoc(doc(db, 'trainerLegacy', id))
      showToast('Legacy photo deleted.')
      setLegacyItems((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      showToast(err.message || 'Failed to delete legacy photo.', 'error')
    } finally {
      setDeletingLegacyId(null)
    }
  }

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

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file || uploading || !trainerId) return

    setUploading(true)
    try {
      const url = await uploadImage(file, 'trainers')
      await updateDoc(doc(db, 'trainers', trainerId), {
        imageUrl: url,
        updatedAt: serverTimestamp(),
      })
      setImageUrl(url)
      showToast('Trainer photo uploaded successfully.')
    } catch (err) {
      showToast(err.message || 'Failed to upload photo.', 'error')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <Toast toast={toast} onClose={() => showToast('')} />

      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-yellow-500 font-bold mb-2">
          Manage
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
          Trainer Bio
        </h1>
        <span className="block mt-4 h-1 w-16 bg-yellow-500" />
        <p className="mt-5 text-neutral-400 max-w-2xl">
          Update the public-facing bio shown on the Trainers page.
        </p>
      </div>

      <div className="max-w-3xl">
        {loading && (
          <div className="bg-[#171717] border border-neutral-800 rounded-sm p-10 flex items-center justify-center">
            <div className="relative w-12 h-12">
              <span className="absolute inset-0 rounded-full border-4 border-neutral-800" />
              <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 animate-spin" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-[#171717] border-l-4 border-yellow-500 p-6 rounded-sm">
            <p className="text-[10px] tracking-[0.3em] uppercase text-yellow-300 font-bold mb-2">
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

            <div className="mb-7 pb-7 border-b border-neutral-800">
              <label
                htmlFor="trainer-photo-input"
                className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-3"
              >
                Upload Trainer Photo
              </label>

              {imageUrl && (
                <div className="mb-4">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold mb-2">
                    Current Photo
                  </p>
                  <div className="relative w-40 aspect-4/5 bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800">
                    <img
                      src={imageUrl}
                      alt={trainerName || 'Trainer'}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <input
                id="trainer-photo-input"
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={handlePhotoUpload}
                className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-yellow-500 file:text-black hover:file:bg-yellow-600 file:cursor-pointer cursor-pointer bg-[#0a0a0a] border border-neutral-800 rounded-sm py-2 px-3 disabled:opacity-60"
              />
              {uploading && (
                <p className="mt-2 text-xs tracking-[0.25em] uppercase text-yellow-400 font-bold">
                  Uploading...
                </p>
              )}
            </div>

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
              className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white px-4 py-3 rounded-sm placeholder:text-neutral-600 transition-colors resize-y leading-relaxed"
            />
            <p className="mt-2 text-xs text-neutral-500">
              {bio.length} characters
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={saving || !isDirty}
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
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

      {/* ===================== LEGACY PHOTOS ===================== */}
      <div className="max-w-3xl mt-12">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            Legacy Photos
          </h2>
          <span className="block mt-3 h-1 w-16 bg-yellow-500" />
          <p className="mt-4 text-neutral-400">
            Photos showcasing Afzal&apos;s journey, achievements, and training
            moments — shown on the Trainer detail page.
          </p>
        </div>

        {/* UPLOAD */}
        <section className="mb-10 bg-[#171717] border border-neutral-800 rounded-sm p-6 sm:p-8">
          <h3 className="text-lg font-black text-white tracking-wide mb-5">
            Add Legacy Photos
          </h3>

          <DropZone
            multiple
            withCaptions
            resetSignal={legacyResetSignal}
            onFilesSelected={setLegacyFiles}
            onCaptionsChange={setLegacyCaptions}
          />

          {(legacyUploading || legacyResult) && (
            <UploadProgress
              current={legacyProgress.current}
              total={legacyProgress.total}
              status={legacyUploading ? 'uploading' : legacyResult?.status}
              successCount={legacyResult?.successCount}
              failed={legacyResult?.failed || []}
            />
          )}

          <button
            type="button"
            onClick={handleLegacyUpload}
            disabled={legacyUploading || legacyFiles.length === 0}
            className="mt-6 inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            {legacyUploading && (
              <span
                aria-hidden="true"
                className="inline-block w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin"
              />
            )}
            {legacyUploading
              ? 'Uploading...'
              : `Upload Legacy Photos${
                  legacyFiles.length > 0 ? ` (${legacyFiles.length})` : ''
                }`}
          </button>
        </section>

        {/* EXISTING LEGACY PHOTOS */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-5 flex-wrap">
            <h3 className="text-xl font-black text-white tracking-wide">
              Current Legacy Photos
            </h3>
            {!legacyLoading && (
              <span className="text-sm text-neutral-500 font-semibold">
                {legacyItems.length}{' '}
                {legacyItems.length === 1 ? 'photo' : 'photos'}
              </span>
            )}
          </div>

          {legacyLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="relative w-10 h-10">
                <span className="absolute inset-0 rounded-full border-4 border-neutral-800" />
                <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 animate-spin" />
              </div>
            </div>
          )}

          {!legacyLoading && legacyItems.length === 0 && (
            <div className="bg-[#171717] border border-dashed border-neutral-800 rounded-sm p-8 text-center">
              <p className="text-neutral-400">
                No legacy photos yet. Add some above.
              </p>
            </div>
          )}

          {!legacyLoading && legacyItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {legacyItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#171717] border border-neutral-800 rounded-sm overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-square bg-neutral-900 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.caption || 'Legacy photo'}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                        <span className="text-neutral-500 text-xs uppercase tracking-wider">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    {item.caption && (
                      <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2 flex-1 mb-3">
                        {item.caption}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => handleLegacyDelete(item.id)}
                      disabled={deletingLegacyId === item.id}
                      className="w-full inline-flex items-center justify-center gap-2 bg-yellow-950/40 hover:bg-yellow-500 border border-yellow-900/60 hover:border-yellow-500 text-yellow-300 hover:text-black disabled:opacity-60 font-bold uppercase tracking-wider text-[10px] px-4 py-2 rounded-sm transition-colors mt-auto"
                    >
                      {deletingLegacyId === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
