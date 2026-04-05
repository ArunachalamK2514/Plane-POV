import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import usePhotoStore from '../../store/usePhotoStore'
import { clearAllPhotosFromDB } from '../../utils/db'

export default function ConfirmResetModal() {
  const [deleting, setDeleting] = useState(false)
  const isOpen = usePhotoStore(s => s.isResetConfirmOpen)
  const setResetConfirmOpen = usePhotoStore(s => s.setResetConfirmOpen)
  const clearAllPhotos = usePhotoStore(s => s.clearAllPhotos)
  const photoCount = usePhotoStore(s => s.photos.length)

  const handleDelete = async () => {
    setDeleting(true)
    await clearAllPhotosFromDB()
    clearAllPhotos()
    setResetConfirmOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setResetConfirmOpen(false)}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 30,
            pointerEvents: 'all',
          }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'rgba(10,15,30,0.95)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '32px',
              width: '420px',
              maxWidth: '90vw',
              color: 'white',
              fontFamily: "'Courier New', monospace",
              textAlign: 'center',
            }}
          >
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              marginBottom: '20px',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}>
              ⚠ CLEAR ALL PHOTOS
            </div>

            <div style={{
              fontSize: '13px',
              lineHeight: 1.6,
              opacity: 0.75,
              marginBottom: '28px',
            }}>
              This will permanently delete all {photoCount} photo{photoCount !== 1 ? 's' : ''} from the sky and from local storage.
              <br /><br />
              This action cannot be undone.
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
            }}>
              <button
                onClick={() => setResetConfirmOpen(false)}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px',
                  letterSpacing: '1px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontFamily: "'Courier New', monospace",
                  opacity: deleting ? 0.5 : 1,
                  transition: 'background 0.2s, opacity 0.2s',
                }}
                onMouseEnter={e => !deleting && (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => !deleting && (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              >
                CANCEL
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: deleting ? 'rgba(239,68,68,0.6)' : 'rgba(239,68,68,0.75)',
                  border: '1px solid rgba(239,68,68,0.5)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px',
                  letterSpacing: '1px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontFamily: "'Courier New', monospace",
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => !deleting && (e.currentTarget.style.background = 'rgba(239,68,68,0.95)')}
                onMouseLeave={e => !deleting && (e.currentTarget.style.background = 'rgba(239,68,68,0.75)')}
              >
                {deleting ? 'DELETING...' : 'DELETE ALL'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
