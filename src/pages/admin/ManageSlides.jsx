import { useEffect, useRef, useState } from 'react'
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { uploadImage } from '../../utils/cloudinary'
import Toast, { useToast } from '../../components/admin/Toast'
import ImagePreview from '../../components/admin/ImagePreview'
import UploadProgress from '../../components/admin/UploadProgress'
import DropZone from '../../components/admin/DropZone'

export default function ManageSlides() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([]) // { id, file, caption, order }
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [result, setResult] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [resetSignal, setResetSignal] = useState(0)
  const { toast, showToast } = useToast()
  const idRef = useRef(0)

  async function loadSlides() {
    try {
      const q = query(collection(db, 'slides'), orderBy('order', 'asc'))
      const snapshot = await getDocs(q)
      setSlides(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      showToast(err.message || 'Failed to load slides', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSlides()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addFiles(files) {
    if (!files || files.length === 0) return
    setResult(null)
    setSelected((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: ++idRef.current,
        file,
        caption: '',
        order: '',
      })),
    ])
  }

  function updateField(id, field, value) {
    setSelected((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  function removeSelected(id) {
    setSelected((prev) => prev.filter((s) => s.id !== id))
  }

  async function handleUploadAll() {
    if (uploading || selected.length === 0) return

    setUploading(true)
    setResult(null)
    const total = selected.length
    const failed = []
    let success = 0

    for (let i = 0; i < selected.length; i++) {
      setProgress({ current: i + 1, total })
      const { file, caption, order } = selected[i]
      try {
        const imageUrl = await uploadImage(file, 'slides')
        // Use the typed order if valid, otherwise fall back to a timestamp.
        const orderVal =
          order !== '' && !Number.isNaN(Number(order))
            ? Number(order)
            : Date.now() + i
        await addDoc(collection(db, 'slides'), {
          imageUrl,
          caption: caption.trim(),
          order: orderVal,
          createdAt: Timestamp.now(),
        })
        success++
      } catch (err) {
        console.error('[ManageSlides] Upload failed for', file.name, err)
        failed.push(file.name)
      }
    }

    setUploading(false)
    if (failed.length === 0) {
      setResult({ status: 'done', successCount: success, failed: [] })
      showToast(
        `${success} ${success === 1 ? 'slide' : 'slides'} uploaded successfully`
      )
    } else {
      setResult({ status: 'error', successCount: success, failed })
      showToast(
        `${success} uploaded, ${failed.length} failed. See details below.`,
        'error'
      )
    }
    setSelected([])
    setResetSignal((s) => s + 1)
    await loadSlides()
  }

  async function handleDelete(id) {
    if (deletingId) return
    if (!window.confirm('Delete this slide? This cannot be undone.')) return

    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'slides', id))
      showToast('Slide deleted.')
      setSlides((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      showToast(err.message || 'Failed to delete slide.', 'error')
    } finally {
      setDeletingId(null)
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
          Hero Slides
        </h1>
        <span className="block mt-4 h-1 w-16 bg-yellow-500" />
        <p className="mt-5 text-neutral-400 max-w-2xl">
          Slides shown in the home page hero carousel. Ordered by the order
          number (ascending).
        </p>
      </div>

      {/* ADD SLIDE FORM */}
      <section className="mb-12 bg-[#171717] border border-neutral-800 rounded-sm p-6 sm:p-8">
        <h2 className="text-xl font-black text-white tracking-wide mb-6">
          Add New Slides
        </h2>

        <div>
          <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
            Images (select one or more)
          </label>
          <DropZone
            multiple
            showPreview={false}
            onFilesSelected={addFiles}
            resetSignal={resetSignal}
          />
        </div>

        {/* PREVIEW GRID */}
        {selected.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <p className="text-sm font-bold text-white">
                {selected.length} {selected.length === 1 ? 'slide' : 'slides'}{' '}
                ready
              </p>
              <button
                type="button"
                onClick={() => setSelected([])}
                disabled={uploading}
                className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-yellow-500 disabled:opacity-50 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selected.map((s) => (
                <ImagePreview
                  key={s.id}
                  file={s.file}
                  captionValue={s.caption}
                  onCaptionChange={(v) => updateField(s.id, 'caption', v)}
                  onRemove={uploading ? undefined : () => removeSelected(s.id)}
                >
                  <input
                    type="number"
                    value={s.order}
                    onChange={(e) => updateField(s.id, 'order', e.target.value)}
                    placeholder="Order # (optional)"
                    className="w-full bg-[#171717] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white text-sm px-3 py-2 rounded-sm placeholder:text-neutral-600 transition-colors"
                  />
                </ImagePreview>
              ))}
            </div>
          </div>
        )}

        {/* PROGRESS */}
        {(uploading || result) && (
          <UploadProgress
            current={progress.current}
            total={progress.total}
            status={uploading ? 'uploading' : result?.status}
            successCount={result?.successCount}
            failed={result?.failed || []}
          />
        )}

        <button
          type="button"
          onClick={handleUploadAll}
          disabled={uploading || selected.length === 0}
          className="mt-7 inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
        >
          {uploading && (
            <span
              aria-hidden="true"
              className="inline-block w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin"
            />
          )}
          {uploading
            ? 'Uploading...'
            : `Upload All${selected.length > 0 ? ` (${selected.length})` : ''}`}
        </button>
      </section>

      {/* SLIDE LIST */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <h2 className="text-2xl font-black text-white tracking-wide">
            Current Slides
          </h2>
          {!loading && (
            <span className="text-sm text-neutral-500 font-semibold">
              {slides.length} {slides.length === 1 ? 'slide' : 'slides'}
            </span>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="relative w-12 h-12">
              <span className="absolute inset-0 rounded-full border-4 border-neutral-800" />
              <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 animate-spin" />
            </div>
          </div>
        )}

        {!loading && slides.length === 0 && (
          <div className="bg-[#171717] border border-dashed border-neutral-800 rounded-sm p-10 text-center">
            <p className="text-neutral-400">
              No slides yet. The hero will show gradient placeholders until you
              add one.
            </p>
          </div>
        )}

        {!loading && slides.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="bg-[#171717] border border-neutral-800 rounded-sm overflow-hidden"
              >
                <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                  {slide.imageUrl ? (
                    <img
                      src={slide.imageUrl}
                      alt={slide.caption || 'Slide'}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                      <span className="text-neutral-500 text-xs uppercase tracking-[0.25em] font-semibold">
                        No Image
                      </span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500 text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm">
                    Order {slide.order ?? '—'}
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  {slide.caption ? (
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {slide.caption}
                    </p>
                  ) : (
                    <p className="text-sm text-neutral-600 italic">No caption</p>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(slide.id)}
                    disabled={deletingId === slide.id}
                    className="self-start inline-flex items-center gap-2 bg-yellow-950/40 hover:bg-yellow-500 hover:text-black border border-yellow-900/60 hover:border-yellow-500 text-yellow-300 disabled:opacity-60 font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-sm transition-colors"
                  >
                    {deletingId === slide.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
