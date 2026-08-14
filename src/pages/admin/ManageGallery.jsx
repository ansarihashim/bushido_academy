import { useEffect, useRef, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { uploadImage } from '../../utils/cloudinary'
import Toast, { useToast } from '../../components/admin/Toast'
import ImagePreview from '../../components/admin/ImagePreview'
import UploadProgress from '../../components/admin/UploadProgress'
import DropZone from '../../components/admin/DropZone'

const TAG_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'karate', label: 'Karate' },
  { value: 'kickboxing', label: 'Kickboxing' },
]

export default function ManageGallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([]) // { id, file, caption }
  const [tag, setTag] = useState('general')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [result, setResult] = useState(null) // { status, successCount, failed }
  const [deletingId, setDeletingId] = useState(null)
  const [resetSignal, setResetSignal] = useState(0)
  const { toast, showToast } = useToast()
  const idRef = useRef(0)

  async function loadGallery() {
    try {
      const q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'))
      const snapshot = await getDocs(q)
      setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error('[ManageGallery] Load failed:', err.code, err.message, err)
      showToast(
        `${err.code || 'error'}: ${err.message || 'Failed to load gallery'}`,
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadGallery()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addFiles(files) {
    if (!files || files.length === 0) return
    setResult(null)
    setSelected((prev) => [
      ...prev,
      ...files.map((file) => ({ id: ++idRef.current, file, caption: '' })),
    ])
  }

  function updateCaption(id, caption) {
    setSelected((prev) =>
      prev.map((s) => (s.id === id ? { ...s, caption } : s))
    )
  }

  function removeSelected(id) {
    setSelected((prev) => prev.filter((s) => s.id !== id))
  }

  function clearSelection() {
    setSelected([])
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
      const { file, caption } = selected[i]
      try {
        const imageUrl = await uploadImage(file, 'gallery')
        await addDoc(collection(db, 'gallery'), {
          imageUrl,
          caption: caption.trim(),
          tag,
          uploadedAt: serverTimestamp(),
        })
        success++
      } catch (err) {
        console.error('[ManageGallery] Upload failed for', file.name, err)
        failed.push(file.name)
      }
    }

    setUploading(false)
    if (failed.length === 0) {
      setResult({ status: 'done', successCount: success, failed: [] })
      showToast(
        `${success} ${success === 1 ? 'image' : 'images'} uploaded successfully`
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
    await loadGallery()
  }

  async function handleDelete(id) {
    if (deletingId) return
    if (!window.confirm('Delete this image? This cannot be undone.')) return

    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'gallery', id))
      showToast('Image deleted.')
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch (err) {
      showToast(err.message || 'Failed to delete image.', 'error')
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
          Gallery
        </h1>
        <span className="block mt-4 h-1 w-16 bg-yellow-500" />
      </div>

      {/* UPLOAD FORM */}
      <section className="mb-12 bg-[#171717] border border-neutral-800 rounded-sm p-6 sm:p-8">
        <h2 className="text-xl font-black text-white tracking-wide mb-6">
          Upload Images
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          <div>
            <label
              htmlFor="gallery-tag-select"
              className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2"
            >
              Tag (applied to all)
            </label>
            <select
              id="gallery-tag-select"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white px-4 py-3 rounded-sm transition-colors cursor-pointer"
            >
              {TAG_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-neutral-500">
              Used to group images on the Karate &amp; Kickboxing pages.
            </p>
          </div>
        </div>

        {/* PREVIEW GRID */}
        {selected.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <p className="text-sm font-bold text-white">
                {selected.length} {selected.length === 1 ? 'image' : 'images'}{' '}
                ready
              </p>
              <button
                type="button"
                onClick={clearSelection}
                disabled={uploading}
                className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-yellow-500 disabled:opacity-50 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {selected.map((s) => (
                <ImagePreview
                  key={s.id}
                  file={s.file}
                  captionValue={s.caption}
                  onCaptionChange={(v) => updateCaption(s.id, v)}
                  onRemove={uploading ? undefined : () => removeSelected(s.id)}
                />
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

      {/* IMAGE GRID */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <h2 className="text-2xl font-black text-white tracking-wide">
            All Images
          </h2>
          {!loading && (
            <span className="text-sm text-neutral-500 font-semibold">
              {items.length} {items.length === 1 ? 'image' : 'images'}
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

        {!loading && items.length === 0 && (
          <div className="bg-[#171717] border border-dashed border-neutral-800 rounded-sm p-10 text-center">
            <p className="text-neutral-400">No images yet. Upload one above.</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#171717] border border-neutral-800 rounded-sm overflow-hidden flex flex-col"
              >
                <div className="relative aspect-square bg-neutral-900 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.caption || 'Gallery image'}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                      <span className="text-neutral-500 text-xs uppercase tracking-wider">
                        No Image
                      </span>
                    </div>
                  )}
                  {item.tag && item.tag !== 'general' && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-500 text-black text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm">
                      {item.tag}
                    </span>
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
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="w-full inline-flex items-center justify-center gap-2 bg-yellow-950/40 hover:bg-yellow-500 border border-yellow-900/60 hover:border-yellow-500 text-yellow-300 hover:text-white disabled:opacity-60 font-bold uppercase tracking-wider text-[10px] px-4 py-2 rounded-sm transition-colors"
                  >
                    {deletingId === item.id ? 'Deleting...' : 'Delete'}
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
