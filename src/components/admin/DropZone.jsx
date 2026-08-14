import { useEffect, useRef, useState } from 'react'

/**
 * Reusable drag-and-drop upload zone.
 *
 * Always reports the chosen File objects through `onFilesSelected(files)`.
 * Optional features:
 *  - showPreview: render an internal thumbnail grid (with remove buttons)
 *  - withCaptions: add a caption input under each thumbnail and report the
 *    captions (aligned by index) through `onCaptionsChange(captions)`
 *  - resetSignal: bump this number from the parent to clear the selection
 *    (e.g. after a successful upload)
 */
export default function DropZone({
  onFilesSelected,
  multiple = true,
  accept = 'image/*',
  showPreview = true,
  withCaptions = false,
  onCaptionsChange,
  resetSignal = 0,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [items, setItems] = useState([]) // { file, url, caption }
  const inputRef = useRef(null)

  // Clear the internal selection whenever the parent bumps resetSignal.
  useEffect(() => {
    if (resetSignal === 0) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems((prev) => {
      prev.forEach((it) => it.url && URL.revokeObjectURL(it.url))
      return []
    })
    if (inputRef.current) inputRef.current.value = ''
  }, [resetSignal])

  // Revoke any outstanding object URLs on unmount.
  useEffect(() => {
    return () => {
      setItems((prev) => {
        prev.forEach((it) => it.url && URL.revokeObjectURL(it.url))
        return prev
      })
    }
  }, [])

  function emit(next) {
    onFilesSelected(next.map((it) => it.file))
    if (withCaptions && onCaptionsChange) {
      onCaptionsChange(next.map((it) => it.caption))
    }
  }

  function selectFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) =>
      f.type.startsWith('image/')
    )
    if (files.length === 0) return
    const sliced = multiple ? files : files.slice(0, 1)

    // Replace the previous selection; release its preview URLs first.
    items.forEach((it) => it.url && URL.revokeObjectURL(it.url))
    const next = sliced.map((file) => ({
      file,
      url: showPreview ? URL.createObjectURL(file) : null,
      caption: '',
    }))
    setItems(next)
    emit(next)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    selectFiles(e.dataTransfer.files)
  }

  function handleChange(e) {
    selectFiles(e.target.files)
    // Allow re-picking the same file after a reset.
    e.target.value = ''
  }

  function removeAt(i) {
    const removed = items[i]
    if (removed?.url) URL.revokeObjectURL(removed.url)
    const next = items.filter((_, idx) => idx !== i)
    setItems(next)
    emit(next)
  }

  function updateCaption(i, caption) {
    const next = items.map((it, idx) =>
      idx === i ? { ...it, caption } : it
    )
    setItems(next)
    if (withCaptions && onCaptionsChange) {
      onCaptionsChange(next.map((it) => it.caption))
    }
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current && inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#eab308' : '#444'}`,
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? 'rgba(234,179,8,0.05)' : '#1a1a1a',
          transition: 'all 0.2s ease',
          color: '#a3a3a3',
        }}
      >
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>📁</div>
        <p style={{ color: '#eab308', fontWeight: 'bold', margin: 0 }}>
          Drag &amp; drop {multiple ? 'images' : 'an image'} here
        </p>
        <p style={{ fontSize: '13px', marginTop: '4px' }}>
          or click to browse files
        </p>
        {multiple && (
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            You can select multiple images at once
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      {showPreview && items.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <p
            style={{
              color: '#eab308',
              fontSize: '13px',
              marginBottom: '8px',
            }}
          >
            {items.length} file(s) selected:
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: withCaptions
                ? 'repeat(auto-fill, minmax(140px, 1fr))'
                : 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '10px',
            }}
          >
            {items.map((it, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={it.url}
                    alt=""
                    style={{
                      width: '100%',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #333',
                      display: 'block',
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeAt(i)
                    }}
                    aria-label="Remove image"
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
                {withCaptions && (
                  <input
                    type="text"
                    value={it.caption}
                    onChange={(e) => updateCaption(i, e.target.value)}
                    placeholder="Caption (optional)"
                    style={{
                      width: '100%',
                      marginTop: '6px',
                      background: '#0a0a0a',
                      border: '1px solid #333',
                      color: '#fff',
                      fontSize: '12px',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      outline: 'none',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
