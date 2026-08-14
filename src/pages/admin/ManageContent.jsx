import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useContent } from '../../context/ContentContext'
import {
  CONTENT_DEFAULTS,
  CONTENT_GROUPS,
  seedContent,
} from '../../utils/seedContent'
import Toast, { useToast } from '../../components/admin/Toast'

function ContentItem({ contentKey, liveValue }) {
  const current =
    liveValue !== undefined ? liveValue : (CONTENT_DEFAULTS[contentKey] ?? '')
  const [value, setValue] = useState(current)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const dirty = value !== current
  const isLong = current.length > 60 || value.length > 60

  async function save(next) {
    const v = next !== undefined ? next : value
    setSaving(true)
    try {
      await setDoc(doc(db, 'content', contentKey), { value: v })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('[ManageContent] save failed:', contentKey, err)
    } finally {
      setSaving(false)
    }
  }

  function resetToDefault() {
    const def = CONTENT_DEFAULTS[contentKey] ?? ''
    setValue(def)
    save(def)
  }

  return (
    <div className="py-4 border-b border-neutral-800/70 last:border-0">
      <div className="flex items-center justify-between gap-3 mb-2">
        <code className="text-[11px] text-neutral-500 font-mono tracking-wide">
          {contentKey}
        </code>
        <button
          type="button"
          onClick={resetToDefault}
          className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 hover:text-yellow-500 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
        {isLong ? (
          <textarea
            rows={Math.min(6, Math.max(2, Math.ceil(value.length / 60)))}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-[#0a0a0a] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white text-sm px-3 py-2 rounded-sm resize-y leading-relaxed"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-[#0a0a0a] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white text-sm px-3 py-2 rounded-sm"
          />
        )}
        <button
          type="button"
          onClick={() => save()}
          disabled={saving || !dirty}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-wider text-[11px] px-4 py-2 rounded-sm transition-colors"
        >
          {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default function ManageContent() {
  const { content } = useContent()
  const { toast, showToast } = useToast()
  const [queryStr, setQueryStr] = useState('')
  const [seeding, setSeeding] = useState(false)

  const q = queryStr.trim().toLowerCase()

  function matches(key) {
    if (!q) return true
    const val = (content[key] ?? CONTENT_DEFAULTS[key] ?? '').toLowerCase()
    return key.toLowerCase().includes(q) || val.includes(q)
  }

  async function handleSeed() {
    if (seeding) return
    setSeeding(true)
    try {
      const count = await seedContent()
      showToast(`Seeded ${count} content entries.`)
    } catch (err) {
      showToast(err.message || 'Seed failed.', 'error')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div>
      <Toast toast={toast} onClose={() => showToast('')} />

      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-yellow-500 font-bold mb-2">
          Manage
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
          Edit Text
        </h1>
        <span className="block mt-4 h-1 w-16 bg-yellow-500" />
        <p className="mt-5 text-neutral-400 max-w-2xl">
          Edit any text on the site. Changes save to Firestore and appear live
          instantly.
        </p>
      </div>

      {/* Search + seed */}
      <div className="sticky top-0 z-10 bg-[#0f0f0f] pb-4 mb-2 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={queryStr}
          onChange={(e) => setQueryStr(e.target.value)}
          placeholder="Search keys or text…"
          className="flex-1 min-w-[200px] bg-[#171717] border border-neutral-800 focus:border-yellow-500 focus:outline-none text-white text-sm px-4 py-2.5 rounded-sm"
        />
        {import.meta.env.DEV && (
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-2 border border-yellow-900/60 hover:border-yellow-500 text-yellow-400 hover:text-yellow-300 disabled:opacity-50 font-bold uppercase tracking-wider text-[11px] px-4 py-2.5 rounded-sm transition-colors"
          >
            {seeding ? 'Seeding…' : 'Seed Default Content'}
          </button>
        )}
      </div>

      {CONTENT_GROUPS.map((group) => {
        const keys = group.keys.filter(matches)
        if (keys.length === 0) return null
        return (
          <section
            key={group.title}
            className="mb-8 bg-[#171717] border border-neutral-800 rounded-sm p-5 sm:p-6"
          >
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-yellow-500 mb-2">
              {group.title}
            </h2>
            <div>
              {keys.map((key) => (
                <ContentItem
                  key={key}
                  contentKey={key}
                  liveValue={content[key]}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
