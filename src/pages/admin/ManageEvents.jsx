import { useEffect, useState } from 'react'
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { uploadImage } from '../../utils/cloudinary'
import Toast, { useToast } from '../../components/admin/Toast'
import DropZone from '../../components/admin/DropZone'

function toDate(value) {
  if (!value) return null
  if (typeof value.toDate === 'function') return value.toDate()
  if (value instanceof Date) return value
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function dateInputValue(date) {
  if (!date) return ''
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function formatDate(date) {
  if (!date) return 'Date TBA'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const EMPTY_FORM = {
  title: '',
  date: '',
  description: '',
  file: null,
  thumbnailFile: null,
}

export default function ManageEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    date: '',
    description: '',
  })
  const [editSaving, setEditSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [resetSignal, setResetSignal] = useState(0)
  const [additionalFiles, setAdditionalFiles] = useState([])
  const [editExtraFiles, setEditExtraFiles] = useState([])
  const [editExtraResetSignal, setEditExtraResetSignal] = useState(0)
  const [extraBusy, setExtraBusy] = useState(false)
  const [editThumbnailFile, setEditThumbnailFile] = useState(null)
  const [editThumbnailResetSignal, setEditThumbnailResetSignal] = useState(0)
  const [thumbnailBusy, setThumbnailBusy] = useState(false)
  const { toast, showToast } = useToast()

  async function loadEvents() {
    console.log('[ManageEvents] Loading events from Firestore...')
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'desc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map((d) => {
        const raw = d.data()
        return { id: d.id, ...raw, date: toDate(raw.date) }
      })
      console.log(`[ManageEvents] Loaded ${data.length} document(s).`)
      setEvents(data)
    } catch (err) {
      console.error('[ManageEvents] Load failed:', err.code, err.message, err)
      showToast(`${err.code || 'error'}: ${err.message || 'Failed to load events'}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function resetForm() {
    setForm(EMPTY_FORM)
    setAdditionalFiles([])
    setResetSignal((s) => s + 1)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (submitting) return
    if (!form.title.trim() || !form.date || !form.description.trim()) {
      showToast('Title, date and description are required.', 'error')
      return
    }

    setSubmitting(true)
    try {
      let imageUrl = ''
      if (form.file) {
        imageUrl = await uploadImage(form.file, 'events')
      }
      let thumbnailUrl = ''
      if (form.thumbnailFile) {
        thumbnailUrl = await uploadImage(form.thumbnailFile, 'events/thumbnails')
      }
      const ref = await addDoc(collection(db, 'events'), {
        title: form.title.trim(),
        description: form.description.trim(),
        date: Timestamp.fromDate(new Date(form.date)),
        imageUrl,
        thumbnailUrl,
        images: [],
        createdAt: serverTimestamp(),
      })
      // Upload any additional gallery images into a per-event folder.
      if (additionalFiles.length > 0) {
        const urls = []
        for (const file of additionalFiles) {
          urls.push(await uploadImage(file, `events/gallery/${ref.id}`))
        }
        await updateDoc(doc(db, 'events', ref.id), { images: urls })
      }
      showToast('Event added successfully')
      resetForm()
      await loadEvents()
    } catch (err) {
      console.error('[ManageEvents] Add failed:', err.code, err.message, err)
      showToast(`${err.code || 'error'}: ${err.message || 'Failed to add event.'}`, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  function startEdit(event) {
    setEditingId(event.id)
    setEditForm({
      title: event.title || '',
      date: dateInputValue(event.date),
      description: event.description || '',
    })
    setEditExtraFiles([])
    setEditExtraResetSignal((s) => s + 1)
    setEditThumbnailFile(null)
    setEditThumbnailResetSignal((s) => s + 1)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm({ title: '', date: '', description: '' })
    setEditExtraFiles([])
    setEditThumbnailFile(null)
  }

  async function saveThumbnail(eventId) {
    if (thumbnailBusy || !editThumbnailFile) return
    setThumbnailBusy(true)
    try {
      const url = await uploadImage(editThumbnailFile, 'events/thumbnails')
      await updateDoc(doc(db, 'events', eventId), { thumbnailUrl: url })
      showToast('Thumbnail updated.')
      setEditThumbnailFile(null)
      setEditThumbnailResetSignal((s) => s + 1)
      await loadEvents()
    } catch (err) {
      showToast(err.message || 'Failed to upload thumbnail.', 'error')
    } finally {
      setThumbnailBusy(false)
    }
  }

  async function removeThumbnail(eventId) {
    if (thumbnailBusy) return
    if (!window.confirm('Remove this thumbnail?')) return
    setThumbnailBusy(true)
    try {
      await updateDoc(doc(db, 'events', eventId), { thumbnailUrl: '' })
      showToast('Thumbnail removed.')
      await loadEvents()
    } catch (err) {
      showToast(err.message || 'Failed to remove thumbnail.', 'error')
    } finally {
      setThumbnailBusy(false)
    }
  }

  async function addExtraImages(eventId) {
    if (extraBusy || editExtraFiles.length === 0) return
    setExtraBusy(true)
    try {
      const urls = []
      for (const file of editExtraFiles) {
        urls.push(await uploadImage(file, `events/gallery/${eventId}`))
      }
      const current = events.find((e) => e.id === eventId)?.images || []
      await updateDoc(doc(db, 'events', eventId), {
        images: [...current, ...urls],
      })
      showToast(`${urls.length} image(s) added.`)
      setEditExtraFiles([])
      setEditExtraResetSignal((s) => s + 1)
      await loadEvents()
    } catch (err) {
      showToast(err.message || 'Failed to add images.', 'error')
    } finally {
      setExtraBusy(false)
    }
  }

  async function removeExtraImage(eventId, url) {
    if (extraBusy) return
    if (!window.confirm('Remove this image?')) return
    setExtraBusy(true)
    try {
      const current = events.find((e) => e.id === eventId)?.images || []
      await updateDoc(doc(db, 'events', eventId), {
        images: current.filter((u) => u !== url),
      })
      showToast('Image removed.')
      await loadEvents()
    } catch (err) {
      showToast(err.message || 'Failed to remove image.', 'error')
    } finally {
      setExtraBusy(false)
    }
  }

  async function saveEdit(id) {
    if (editSaving) return
    if (
      !editForm.title.trim() ||
      !editForm.date ||
      !editForm.description.trim()
    ) {
      showToast('Title, date and description are required.', 'error')
      return
    }

    setEditSaving(true)
    try {
      await updateDoc(doc(db, 'events', id), {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        date: Timestamp.fromDate(new Date(editForm.date)),
        updatedAt: serverTimestamp(),
      })
      showToast('Event updated.')
      cancelEdit()
      await loadEvents()
    } catch (err) {
      showToast(err.message || 'Failed to update event.', 'error')
    } finally {
      setEditSaving(false)
    }
  }

  async function handleDelete(id) {
    if (deletingId) return
    if (!window.confirm('Delete this event? This cannot be undone.')) return

    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'events', id))
      showToast('Event deleted.')
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      showToast(err.message || 'Failed to delete event.', 'error')
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
          Events
        </h1>
        <span className="block mt-4 h-1 w-16 bg-yellow-500" />
      </div>

      {/* ADD EVENT FORM */}
      <section className="mb-12 bg-[#171717] border border-neutral-800 rounded-sm p-6 sm:p-8">
        <h2 className="text-xl font-black text-white tracking-wide mb-6">
          Add New Event
        </h2>
        <form onSubmit={handleAdd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="State Karate Championship"
                className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white px-4 py-3 rounded-sm placeholder:text-neutral-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white px-4 py-3 rounded-sm transition-colors"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Describe the event..."
              className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white px-4 py-3 rounded-sm placeholder:text-neutral-600 transition-colors resize-y"
            />
          </div>

          <div className="mt-5">
            <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
              Cover Image
            </label>
            <p className="text-xs text-neutral-500 mb-2">
              Main image used inside the event details.
            </p>
            <DropZone
              multiple={false}
              resetSignal={resetSignal}
              onFilesSelected={(files) =>
                setForm((f) => ({ ...f, file: files[0] || null }))
              }
            />
          </div>

          <div className="mt-5">
            <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
              Event Thumbnail
            </label>
            <p className="text-xs text-neutral-500 mb-2">
              Image displayed on the Upcoming Events card.
            </p>
            <DropZone
              multiple={false}
              resetSignal={resetSignal}
              onFilesSelected={(files) =>
                setForm((f) => ({ ...f, thumbnailFile: files[0] || null }))
              }
            />
          </div>

          <div className="mt-5">
            <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
              Additional Images (shown in event detail gallery) — optional
            </label>
            <DropZone
              multiple
              resetSignal={resetSignal}
              onFilesSelected={setAdditionalFiles}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            {submitting && (
              <span
                aria-hidden="true"
                className="inline-block w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin"
              />
            )}
            {submitting ? 'Saving...' : 'Add Event'}
          </button>
        </form>
      </section>

      {/* EVENT LIST */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <h2 className="text-2xl font-black text-white tracking-wide">
            All Events
          </h2>
          {!loading && (
            <span className="text-sm text-neutral-500 font-semibold">
              {events.length} {events.length === 1 ? 'event' : 'events'}
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

        {!loading && events.length === 0 && (
          <div className="bg-[#171717] border border-dashed border-neutral-800 rounded-sm p-10 text-center">
            <p className="text-neutral-400">No events yet. Add one above.</p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event) => {
              const isEditing = editingId === event.id

              return (
                <div
                  key={event.id}
                  className="bg-[#171717] border border-neutral-800 rounded-sm overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="md:col-span-1 relative aspect-video md:aspect-auto md:min-h-[180px] bg-neutral-900">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title || 'Event'}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                          <span className="text-neutral-500 text-xs tracking-[0.25em] uppercase font-semibold">
                            No Image
                          </span>
                        </div>
                      )}
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500" />
                    </div>

                    <div className="md:col-span-3 p-5 sm:p-6">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  title: e.target.value,
                                }))
                              }
                              className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white px-4 py-2.5 rounded-sm transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
                              Date
                            </label>
                            <input
                              type="date"
                              value={editForm.date}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  date: e.target.value,
                                }))
                              }
                              className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white px-4 py-2.5 rounded-sm transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              value={editForm.description}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  description: e.target.value,
                                }))
                              }
                              className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white px-4 py-2.5 rounded-sm transition-colors resize-y"
                            />
                          </div>

                          {/* Additional images manager */}
                          <div className="pt-2 border-t border-neutral-800">
                            <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-3">
                              Additional Images
                            </label>
                            {event.images && event.images.length > 0 ? (
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                                {event.images.map((url) => (
                                  <div
                                    key={url}
                                    className="relative aspect-square bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800"
                                  >
                                    <img
                                      src={url}
                                      alt=""
                                      className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeExtraImage(event.id, url)
                                      }
                                      disabled={extraBusy}
                                      aria-label="Remove image"
                                      className="absolute top-1 right-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm leading-none"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-neutral-500 mb-4">
                                No additional images yet.
                              </p>
                            )}

                            <DropZone
                              multiple
                              resetSignal={editExtraResetSignal}
                              onFilesSelected={setEditExtraFiles}
                            />
                            <button
                              type="button"
                              onClick={() => addExtraImages(event.id)}
                              disabled={extraBusy || editExtraFiles.length === 0}
                              className="mt-3 inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-sm transition-colors"
                            >
                              {extraBusy
                                ? 'Working…'
                                : `Upload${
                                    editExtraFiles.length > 0
                                      ? ` (${editExtraFiles.length})`
                                      : ''
                                  }`}
                            </button>
                          </div>

                          {/* Thumbnail manager */}
                          <div className="pt-2 border-t border-neutral-800">
                            <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-1">
                              Event Thumbnail
                            </label>
                            <p className="text-xs text-neutral-500 mb-3">
                              Image displayed on the Upcoming Events card.
                            </p>
                            {event.thumbnailUrl ? (
                              <div className="relative w-32 aspect-video bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800 mb-4">
                                <img
                                  src={event.thumbnailUrl}
                                  alt=""
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeThumbnail(event.id)}
                                  disabled={thumbnailBusy}
                                  aria-label="Remove thumbnail"
                                  className="absolute top-1 right-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm leading-none"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <p className="text-xs text-neutral-500 mb-4">
                                No thumbnail uploaded.
                              </p>
                            )}

                            <DropZone
                              multiple={false}
                              resetSignal={editThumbnailResetSignal}
                              onFilesSelected={(files) =>
                                setEditThumbnailFile(files[0] || null)
                              }
                            />
                            <button
                              type="button"
                              onClick={() => saveThumbnail(event.id)}
                              disabled={thumbnailBusy || !editThumbnailFile}
                              className="mt-3 inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-sm transition-colors"
                            >
                              {thumbnailBusy
                                ? 'Working…'
                                : event.thumbnailUrl
                                  ? 'Replace Thumbnail'
                                  : 'Upload Thumbnail'}
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => saveEdit(event.id)}
                              disabled={editSaving}
                              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-white font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-sm transition-colors"
                            >
                              {editSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="inline-flex items-center gap-2 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-sm transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs tracking-[0.25em] uppercase text-yellow-500 font-bold mb-2">
                            {formatDate(event.date)}
                          </p>
                          <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide mb-2">
                            {event.title || 'Untitled Event'}
                          </h3>
                          {event.description && (
                            <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3 mb-5">
                              {event.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => startEdit(event)}
                              className="inline-flex items-center gap-2 border border-neutral-700 hover:border-yellow-500 text-neutral-200 hover:text-yellow-500 font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-sm transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(event.id)}
                              disabled={deletingId === event.id}
                              className="inline-flex items-center gap-2 bg-yellow-950/40 hover:bg-yellow-500 border border-yellow-900/60 hover:border-yellow-500 text-yellow-300 hover:text-white disabled:opacity-60 font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-sm transition-colors"
                            >
                              {deletingId === event.id
                                ? 'Deleting...'
                                : 'Delete'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
