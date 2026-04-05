import World from './components/three/World'
import HUD from './components/ui/HUD'
import UploadPanel from './components/ui/UploadPanel'
import PhotoModal from './components/ui/PhotoModal'
import ConfirmResetModal from './components/ui/ConfirmResetModal'
import usePhotoStorage from './hooks/usePhotoStorage'

export default function App() {
  usePhotoStorage()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <World />
      <HUD />
      <UploadPanel />
      <PhotoModal />
      <ConfirmResetModal />
    </div>
  )
}
