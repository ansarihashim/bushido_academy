import { createContext, useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

/* Defaults — used until the Firestore doc loads, and as fallbacks for any
   field the document doesn't define. The settings drawer writes to
   siteSettings/main; the first save creates the document. */
const DEFAULT_SETTINGS = {
  colorTheme: 'gold', // gold | red | silver
  galleryLayout: 'masonry', // masonry | grid | slideshow
  cursorTheme: 'crosshair', // crosshair | dot | none
  slideAnimation: 'fade', // fade | slide | zoom
  heroTagline: 'Discipline · Strength · Honor',
  karateDescription:
    'Shotokai is one of the most widely practiced styles of karate, developed by Gichin Funakoshi and his son Gigo Funakoshi. It is characterised by deep, long stances that build powerful, stable movement and explosive linear techniques.',
  kickboxingDescription:
    'Kickboxing is a high-intensity striking sport that blends powerful punches, kicks, and knee strikes with relentless footwork and conditioning. It is as much a fitness discipline as it is a combat art — building explosive power, stamina, and razor-sharp reflexes.',
  aboutText:
    'Bushido Karate Kickboxing & Sports Academy is a premier martial arts academy in Mumbai, founded on discipline, respect, and the spirit of the warrior.',
}

const SiteSettingsContext = createContext(null)

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Real-time subscription so admin changes apply live, no refresh.
    const unsub = onSnapshot(
      doc(db, 'siteSettings', 'main'),
      (snap) => {
        if (snap.exists()) {
          // Merge over defaults so missing fields keep a sane fallback.
          setSettings({ ...DEFAULT_SETTINGS, ...snap.data() })
        } else {
          setSettings(DEFAULT_SETTINGS)
        }
        setLoading(false)
      },
      (err) => {
        console.error('[SiteSettings] snapshot error:', err)
        setLoading(false)
      }
    )
    return () => unsub()
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext)
  if (ctx === null) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider')
  }
  return ctx
}
