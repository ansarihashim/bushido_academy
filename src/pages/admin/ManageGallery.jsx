import { useEffect, useState } from 'react'
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

const EMPTY_FORM = { file: null, caption: '' }

export default function ManageGallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const { toast, showToast } = useToast()

  async function loadGallery() {
    try {
      const q = query(
        collection(db, 'gallery'),
        orderBy('uploadedAt', 'desc')
      )
      const snapshot = await getDocs(q)
      setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      showToast(err.message || 'Failed to load gallery', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGallery()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function resetForm() {
    setForm(EMPTY_FORM)
    const input = document.getElementById('gallery-image-input')
    if (input) input.value = ''
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (submitting) return
    if (!form.file) {
      showToast('Please choose an image to upload.', 'error')
      return
    }

    setSubmitting(true)
    try {
      const imageUrl = await uploadImage(form.file, 'gallery')
      await addDoc(collection(db, 'gallery'), {
        imageUrl,
        caption: form.caption.trim(),
        uploadedAt: serverTimestamp(),
      })
      showToast('Image uploaded.')
      resetForm()
      await loadGallery()
    } catch (err) {
      showToast(err.message || 'Failed to upload image.', 'error')
    } finally {
      setSubmitting(false)
    }
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
        <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-2">
          Manage
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
          Gallery
        </h1>
        <span className="block mt-4 h-1 w-16 bg-red-600" />
      </div>

      {/* UPLOAD FORM */}
      <section className="mb-12 bg-[#171717] border border-neutral-800 rounded-sm p-6 sm:p-8">
        <h2 className="text-xl font-black text-white tracking-wide mb-6">
          Upload New Image
        </h2>
        <form onSubmit={handleUpload}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
                Image
              </label>
              <input
                id="gallery-image-input"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    file: e.target.files?.[0] || null,
                  }))
                }
                className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer cursor-pointer bg-[#0a0a0a] border border-neutral-800 rounded-sm py-2 px-3"
              />
              {form.file && (
                <p className="mt-2 text-xs text-neutral-500">
                  Selected: {form.file.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
                Caption (optional)
              </label>
              <input
                type="text"
                value={form.caption}
                onChange={(e) =>
                  setForm((f) => ({ ...f, caption: e.target.value }))
                }
                placeholder="A brief description"
                className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-red-600 focus:outline-none text-white px-4 py-3 rounded-sm placeholder:text-neutral-600 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            {submitting ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
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
              <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 animate-spin" />
            </div>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="bg-[#171717] border border-dashed border-neutral-800 rounded-sm p-10 text-center">
            <p className="text-neutral-400">
              No images yet. Upload one above.
            </p>
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
                    className="w-full inline-flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-600 border border-red-900/60 hover:border-red-600 text-red-400 hover:text-white disabled:opacity-60 font-bold uppercase tracking-wider text-[10px] px-4 py-2 rounded-sm transition-colors"
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
