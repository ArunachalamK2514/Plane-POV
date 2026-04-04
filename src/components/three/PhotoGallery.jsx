import usePhotoStore from '../../store/usePhotoStore'
import FloatingPhoto from './FloatingPhoto'

export default function PhotoGallery() {
  const photos = usePhotoStore(s => s.photos)

  return (
    <group>
      {photos.map(photo => (
        <FloatingPhoto key={photo.id} photo={photo} />
      ))}
    </group>
  )
}
