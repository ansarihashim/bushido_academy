import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import Toast, { useToast } from '../../components/admin/Toast'

const THEMES = [
  { key: 'gold', label: 'Gold', swatch: '#eab308' },
  { key: 'red', label: 'Red', swatch: '#dc2626' },
  { key: 'silver', label: 'Silver', swatch: '#94a3b8' },
]
const LAYOUTS = ['masonry', 'grid', 'slideshow']
const CURSORS = ['crosshair', 'dot', 'none']
const ANIMATIONS = ['fade', 'slide', 'zoom']

function SectionTitle({ children }) {
  return (
    <h2 className="text-xl font-black text-white tracking-wide mb-4">
      {children}
    </h2>
  )
}

/* Capitalize a value label for toggle buttons. */
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function ManageSiteSettings() {
  const { settings } = useSiteSettings()
  const { toast, showToast } = useToast()

  async function update(field, value) {
    try {
      await setDoc(
        doc(db, 'siteSettings', 'main'),
        { [field]: value },
        { merge: true }
      )
      showToast('Settings updated.')
    } catch (err) {
      console.error('[ManageSiteSettings] update failed:', err)
      showToast(err.message || 'Failed to update settings.', 'error')
    }
  }

  const toggleBtn = (active) =>
    'px-4 py-2.5 rounded-sm font-bold uppercase tracking-wider text-xs transition-colors border ' +
    (active
      ? 'bg-yellow-500 border-yellow-500 text-black'
      : 'bg-[#0a0a0a] border-neutral-800 text-neutral-300 hover:border-yellow-500 hover:text-yellow-500')

  return (
    <div>
      <Toast toast={toast} onClose={() => showToast('')} />

      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-yellow-500 font-bold mb-2">
          Manage
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
          Site Settings
        </h1>
        <span className="block mt-4 h-1 w-16 bg-yellow-500" />
        <p className="mt-5 text-neutral-400 max-w-2xl">
          Changes apply across the live site instantly.
        </p>
      </div>

      {/* COLOR THEME */}
      <section className="mb-10 bg-[#171717] border border-neutral-800 rounded-sm p-6 sm:p-8">
        <SectionTitle>Color Theme</SectionTitle>
        <div className="grid grid-cols-3 gap-4">
          {THEMES.map((t) => {
            const active = settings.colorTheme === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => update('colorTheme', t.key)}
                className={
                  'flex flex-col items-center gap-3 p-5 rounded-sm border-2 transition-colors ' +
                  (active
                    ? 'border-yellow-500 bg-yellow-950/20'
                    : 'border-neutral-800 hover:border-neutral-600')
                }
              >
                <span
                  className="w-12 h-12 rounded-full border border-black/30"
                  style={{ background: t.swatch }}
                />
                <span className="text-sm font-bold uppercase tracking-wider text-white">
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* GALLERY LAYOUT */}
      <section className="mb-10 bg-[#171717] border border-neutral-800 rounded-sm p-6 sm:p-8">
        <SectionTitle>Gallery Layout</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {LAYOUTS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => update('galleryLayout', v)}
              className={toggleBtn(settings.galleryLayout === v)}
            >
              {cap(v)}
            </button>
          ))}
        </div>
      </section>

      {/* CURSOR STYLE */}
      <section className="mb-10 bg-[#171717] border border-neutral-800 rounded-sm p-6 sm:p-8">
        <SectionTitle>Cursor Style</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {CURSORS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => update('cursorTheme', v)}
              className={toggleBtn(settings.cursorTheme === v)}
            >
              {cap(v)}
            </button>
          ))}
        </div>
      </section>

      {/* SLIDE ANIMATION */}
      <section className="mb-10 bg-[#171717] border border-neutral-800 rounded-sm p-6 sm:p-8">
        <SectionTitle>Slide Animation</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {ANIMATIONS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => update('slideAnimation', v)}
              className={toggleBtn(settings.slideAnimation === v)}
            >
              {cap(v)}
            </button>
          ))}
        </div>
      </section>

      <p className="text-sm text-neutral-500">
        Editing page text? Use the <span className="text-yellow-500 font-semibold">Edit Text</span> panel.
      </p>
    </div>
  )
}
