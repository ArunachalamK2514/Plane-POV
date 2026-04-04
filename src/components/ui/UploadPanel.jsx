import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import usePhotoStore from '../../store/usePhotoStore'
import { MAX_PHOTOS } from '../../utils/constants'

export default function UploadPanel() {
  const isOpen = usePhotoStore(s => s.isUploadOpen)
  const setUploadOpen = usePhotoStore(s => s.setUploadOpen)
  const addPhoto = usePhotoStore(s => s.addPhoto)
  const isAdding = usePhotoStore(s => s.isAdding)
  const photoCount = usePhotoStore(s => s.photos.length)

  const fileInputRef = useRef()
  const [previews, setPreviews] = useState([])
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const successTimerRef = useRef(null)

  useEffect(() => {
    return () => clearTimeout(successTimerRef.current)
  }, [])

  const validate = (file) => {
    if (!file.type.startsWith('image/')) return 'Not an image file'
    if (file.size > 10 * 1024 * 1024) return 'File exceeds 10MB limit'
    return null
  }

  const handleFiles = (files) => {
    const arr = Array.from(files)
    const newErrors = []
    const newPreviews = []
    arr.forEach(f => {
      const err = validate(f)
      if (err) { newErrors.push(`${f.name}: ${err}`); return }
      newPreviews.push({ file: f, url: URL.createObjectURL(f), name: f.name })
    })
    setErrors(newErrors)
    setPreviews(prev => [...prev, ...newPreviews].slice(0, MAX_PHOTOS - photoCount))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleUpload = async () => {
    if (previews.length === 0) return
    for (const p of previews) {
      await addPhoto(p.file)
    }
    previews.forEach(p => URL.revokeObjectURL(p.url))
    setPreviews([])
    setSuccess(true)
    successTimerRef.current = setTimeout(() => {
      setSuccess(false)
      setUploadOpen(false)
      const canvas = document.querySelector('canvas')
      if (canvas) canvas.requestPointerLock()
    }, 1500)
  }

  const handleClose = () => {
    previews.forEach(p => URL.revokeObjectURL(p.url))
    setPreviews([])
    setErrors([])
    setUploadOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            zIndex: 10,
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{
              background: 'rgba(10,15,30,0.92)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '32px',
              width: '480px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              color: 'white',
              fontFamily: "'Courier New', monospace",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', letterSpacing: '2px' }}>☁ ADD TO THE SKY</h2>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>

            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '20px' }}>
                Photos are floating up! ☁️
              </div>
            ) : (
              <>
                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isDragging ? '#60a5fa' : 'rgba(255,255,255,0.25)'}`,
                    borderRadius: '10px',
                    padding: '32px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    background: isDragging ? 'rgba(96,165,250,0.08)' : 'transparent',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                  <div style={{ fontSize: '13px', opacity: 0.7 }}>
                    Drag & drop images here, or click to browse
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.4, marginTop: '6px' }}>
                    JPEG / PNG / WebP · max 10MB each · up to {MAX_PHOTOS - photoCount} more
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={e => handleFiles(e.target.files)}
                  />
                </div>

                {/* Errors */}
                {errors.map((e, i) => (
                  <div key={i} style={{ color: '#f87171', fontSize: '12px', marginBottom: '4px' }}>⚠ {e}</div>
                ))}

                {/* Previews */}
                {previews.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {previews.map((p, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img
                          src={p.url}
                          alt={p.name}
                          style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)' }}
                        />
                        <button
                          onClick={() => setPreviews(prev => { URL.revokeObjectURL(p.url); return prev.filter((_, idx) => idx !== i) })}
                          style={{
                            position: 'absolute', top: '-6px', right: '-6px',
                            background: '#ef4444', border: 'none', color: 'white',
                            borderRadius: '50%', width: '18px', height: '18px',
                            fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                <button
                  onClick={handleUpload}
                  disabled={previews.length === 0 || isAdding}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: previews.length > 0 && !isAdding ? 'rgba(96,165,250,0.8)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    letterSpacing: '1px',
                    cursor: previews.length > 0 && !isAdding ? 'pointer' : 'not-allowed',
                    transition: 'background 0.2s',
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {isAdding ? 'UPLOADING...' : `SEND TO THE SKY (${previews.length})`}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
