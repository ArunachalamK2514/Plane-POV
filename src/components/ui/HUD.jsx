import usePhotoStore from '../../store/usePhotoStore'
import { getWorldRadius } from '../../utils/placementUtils'

export default function HUD() {
  const isPointerLocked = usePhotoStore(s => s.isPointerLocked)
  const storageLoaded = usePhotoStore(s => s.storageLoaded)
  const setUploadOpen = usePhotoStore(s => s.setUploadOpen)
  const setResetConfirmOpen = usePhotoStore(s => s.setResetConfirmOpen)
  const photoCount = usePhotoStore(s => s.photos.length)
  const flightSpeedMultiplier = usePhotoStore(s => s.flightSpeedMultiplier)
  const worldRadius = getWorldRadius(photoCount)
  const handleUpload = () => {
    document.exitPointerLock()
    setUploadOpen(true)
  }

  const handleReset = () => {
    document.exitPointerLock()
    setResetConfirmOpen(true)
  }

  const handleEnter = () => {
    if (!storageLoaded) return
    if (photoCount === 0) {
      setUploadOpen(true)
      return
    }
    const canvas = document.querySelector('canvas')
    if (canvas) canvas.requestPointerLock()
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      fontFamily: "'Courier New', monospace", color: 'white',
      userSelect: 'none',
    }}>
      {/* Pointer lock overlay */}
      {!isPointerLocked && (
        <div
          onClick={handleEnter}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.45)',
            pointerEvents: 'all', cursor: 'pointer',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '2px', textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>
            ✈ PLANE POV
          </div>
          <div style={{ fontSize: '15px', opacity: 0.8, animation: 'pulse 2s ease-in-out infinite' }}>
            {photoCount === 0 ? 'Upload a photo first, then click to fly' : 'Click to enter the sky'}
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
        </div>
      )}

      {/* Crosshair */}
      {isPointerLocked && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 6, height: 6, borderRadius: '50%',
          background: 'rgba(255,255,255,0.8)',
          boxShadow: '0 0 4px rgba(0,0,0,0.5)',
        }} />
      )}

      {/* Controls hint */}
      {isPointerLocked && (
        <div style={{
          position: 'absolute', bottom: '20px', left: '20px',
          fontSize: '12px', opacity: 0.7, lineHeight: 1.6,
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          animation: 'hintFade 1s ease 4s forwards',
        }}>
          WASD — move &nbsp;|&nbsp; Space — up &nbsp;|&nbsp; Shift — down<br />
          Mouse — look &nbsp;|&nbsp; ESC — exit &nbsp;|&nbsp; ↑↓ — speed
          <style>{`@keyframes hintFade { to { opacity: 0; } }`}</style>
        </div>
      )}

      {/* Speed indicator */}
      {isPointerLocked && (
        <div style={{
          position: 'absolute', bottom: '84px', right: '20px',
          background: 'rgba(0,0,0,0.45)',
          border: '1px solid rgba(255,255,255,0.25)',
          backdropFilter: 'blur(6px)',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '13px',
          letterSpacing: '1px',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          opacity: 0.85,
          textAlign: 'center',
          minWidth: '80px',
        }}>
          <div style={{ fontSize: '9px', opacity: 0.6, marginBottom: '2px' }}>SPEED</div>
          <div>{flightSpeedMultiplier.toFixed(1)}×</div>
        </div>
      )}

      {!isPointerLocked && photoCount > 0 && (
        <div
          onClick={handleReset}
          style={{
            position: 'absolute', bottom: '82px', right: '20px',
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'rgba(239,68,68,0.2)',
            border: '1.5px solid rgba(239,68,68,0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', cursor: 'pointer', pointerEvents: 'all',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
          title="Clear all photos"
        >
          🗑
        </div>
      )}

      {/* Upload button */}
      <div
        onClick={handleUpload}
        style={{
          position: 'absolute', bottom: '20px', right: '20px',
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '1.5px solid rgba(255,255,255,0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', cursor: 'pointer', pointerEvents: 'all',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        title="Upload photos"
      >
        📷
      </div>

      {/* World stats */}
      <div style={{
        position: 'absolute', top: '16px', right: '16px',
        fontSize: '11px', opacity: 0.65, textAlign: 'right',
        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        lineHeight: 1.7,
      }}>
        <div>{photoCount} photo{photoCount !== 1 ? 's' : ''} in the sky</div>
        <div>World radius: {Math.round(worldRadius)}u</div>
      </div>
    </div>
  )
}
