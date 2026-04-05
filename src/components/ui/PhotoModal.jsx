import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import usePhotoStore from '../../store/usePhotoStore'

export default function PhotoModal() {
  const photos = usePhotoStore(s => s.photos)
  const selectedPhotoId = usePhotoStore(s => s.selectedPhotoId)
  const selectPhoto = usePhotoStore(s => s.selectPhoto)
  const likePhoto = usePhotoStore(s => s.likePhoto)

  const photo = photos.find(p => p.id === selectedPhotoId) || null

  useEffect(() => {
    if (selectedPhotoId) document.exitPointerLock()
  }, [selectedPhotoId])

  useEffect(() => {
    const onKey = (e) => { if (e.code === 'Escape') selectPhoto(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectPhoto])

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => selectPhoto(null)}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
            zIndex: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'rgba(10,15,30,0.95)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '85vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              color: 'white',
              fontFamily: "'Courier New', monospace",
            }}
          >
            {/* Close */}
            <div style={{ alignSelf: 'flex-end', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }} onClick={() => selectPhoto(null)}>×</div>

            {/* Photo */}
            <img
              src={photo.dataURL}
              alt={photo.filename}
              style={{ maxWidth: '80vw', maxHeight: '65vh', objectFit: 'contain', borderRadius: '8px' }}
            />

            {/* Filename */}
            <div style={{ fontSize: '11px', opacity: 0.5 }}>{photo.filename}</div>

            {/* Like button */}
            <motion.button
              whileTap={{ scale: 1.4 }}
              onClick={() => likePhoto(photo.id)}
              disabled={photo.likedByUser}
              style={{
                background: photo.likedByUser ? 'rgba(220,38,38,0.8)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${photo.likedByUser ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '24px',
                padding: '8px 20px',
                color: 'white',
                fontSize: '15px',
                cursor: photo.likedByUser ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Courier New', monospace",
              }}
            >
              <span>{photo.likedByUser ? '♥' : '♡'}</span>
              <span>{photo.likes} {photo.likes === 1 ? 'like' : 'likes'}</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
