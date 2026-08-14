import { createContext, useContext, useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { CONTENT_DEFAULTS } from '../utils/seedContent'

const ContentContext = createContext({})

export function ContentProvider({ children }) {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'content'),
      (snapshot) => {
        const data = {}
        snapshot.docs.forEach((d) => {
          data[d.id] = d.data().value
        })
        setContent(data)
        setLoading(false)
      },
      (err) => {
        console.error('[Content] snapshot error:', err)
        setLoading(false)
      }
    )
    return () => unsub()
  }, [])

  // Get text by key. Falls back to an explicit arg, then the bundled default.
  const t = (key, fallback) => {
    const live = content[key]
    if (live !== undefined && live !== null && live !== '') return live
    if (fallback !== undefined) return fallback
    return CONTENT_DEFAULTS[key] ?? ''
  }

  return (
    <ContentContext.Provider value={{ content, t, loading }}>
      {children}
    </ContentContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useContent = () => useContext(ContentContext)
