import { useEffect, useRef } from 'react'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function CustomCursor() {
  const { settings } = useSiteSettings()
  const cursorTheme = settings.cursorTheme || 'crosshair'
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const target = useRef({ x: -100, y: -100 })
  const dot = useRef({ x: -100, y: -100 })
  const rafRef = useRef(null)
  const ringSize = useRef(30)

  useEffect(() => {
    if (cursorTheme === 'none') return
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches
    if (isTouch) return

    function onMove(e) {
      target.current.x = e.clientX
      target.current.y = e.clientY

      const ring = ringRef.current
      if (ring) {
        const size = ringSize.current
        ring.style.transform = `translate3d(${e.clientX - size / 2}px, ${
          e.clientY - size / 2
        }px, 0)`
      }
    }

    function isInteractive(target) {
      if (!target) return false
      const el =
        target.closest && target.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]')
      return Boolean(el)
    }

    function onOver(e) {
      const ring = ringRef.current
      if (!ring) return
      if (isInteractive(e.target)) {
        ring.classList.add('is-active')
        ringSize.current = 50
      } else {
        ring.classList.remove('is-active')
        ringSize.current = 30
      }
    }

    function onLeave() {
      const ring = ringRef.current
      const dotEl = dotRef.current
      if (ring) ring.style.opacity = '0'
      if (dotEl) dotEl.style.opacity = '0'
    }

    function onEnter() {
      const ring = ringRef.current
      const dotEl = dotRef.current
      if (ring) ring.style.opacity = '1'
      if (dotEl) dotEl.style.opacity = '1'
    }

    function tick() {
      dot.current.x += (target.current.x - dot.current.x) * 0.18
      dot.current.y += (target.current.y - dot.current.y) * 0.18
      const dotEl = dotRef.current
      if (dotEl) {
        dotEl.style.transform = `translate3d(${dot.current.x - 3}px, ${
          dot.current.y - 3
        }px, 0)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(rafRef.current)
    }
  }, [cursorTheme])

  // "none" hides the custom cursor entirely (native cursor restored via CSS).
  if (cursorTheme === 'none') return null

  return (
    <>
      {/* "dot" mode shows only the dot — no crosshair ring. */}
      {cursorTheme !== 'dot' && (
        <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      )}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
