import { useMemo } from 'react'
import { Cloud } from '@react-three/drei'
import usePhotoStore from '../../store/usePhotoStore'
import { getCloudCount, getWorldRadius, generateCloudConfigs } from '../../utils/placementUtils'

export default function CloudField() {
  const photoCount = usePhotoStore(s => s.photos.length)
  const cloudCount = getCloudCount(photoCount)
  const worldRadius = getWorldRadius(photoCount)

  const configs = useMemo(
    () => generateCloudConfigs(cloudCount, worldRadius),
    [cloudCount, worldRadius]
  )

  return (
    <group>
      {configs.map(cfg => (
        <Cloud
          key={cfg.id}
          position={cfg.position}
          scale={cfg.scale}
          opacity={cfg.opacity}
          speed={cfg.speed}
          segments={16}
          color="#ffffff"
        />
      ))}
    </group>
  )
}
