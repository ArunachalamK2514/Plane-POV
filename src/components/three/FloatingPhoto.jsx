import { useRef, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import usePhotoStore from '../../store/usePhotoStore'
import { getWorldRadius } from '../../utils/placementUtils'

function PhotoMesh({ photo }) {
  const texture = useTexture(photo.dataURL)
  const meshRef = useRef()
  const matRef = useRef()
  const posVec = useRef(new THREE.Vector3())
  const { camera } = useThree()
  const selectPhoto = usePhotoStore(s => s.selectPhoto)
  const photoCount = usePhotoStore(s => s.photos.length)

  const aspect = texture.image ? texture.image.width / texture.image.height : 1
  const w = aspect * 4
  const h = 4

  useFrame(() => {
    if (!meshRef.current || !matRef.current) return
    const worldRadius = getWorldRadius(photoCount)
    const pos = meshRef.current.getWorldPosition(posVec.current)
    const dist = camera.position.distanceTo(pos)
    const fade = Math.max(0, Math.min(1, 1 - (dist - worldRadius * 0.5) / (worldRadius * 0.3)))
    matRef.current.opacity = fade
  })

  return (
    <group>
      {/* White border */}
      <mesh>
        <planeGeometry args={[w + 0.4, h + 0.4]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>
      {/* Photo */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0.01]}
        onClick={(e) => { e.stopPropagation(); selectPhoto(photo.id) }}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
      >
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial ref={matRef} map={texture} side={THREE.DoubleSide} transparent />
      </mesh>
      {photo.likes > 0 && (
        <Html position={[w / 2 - 0.3, h / 2 + 0.3, 0.02]} center>
          <div style={{
            background: 'rgba(220,38,38,0.9)',
            color: 'white',
            borderRadius: '12px',
            padding: '2px 7px',
            fontSize: '11px',
            fontFamily: 'sans-serif',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            ♥ {photo.likes}
          </div>
        </Html>
      )}
    </group>
  )
}

export default function FloatingPhoto({ photo }) {
  return (
    <Float
      position={photo.position}
      speed={1.2}
      rotationIntensity={0.1}
      floatIntensity={0.8}
    >
      <Suspense fallback={null}>
        <PhotoMesh photo={photo} />
      </Suspense>
    </Float>
  )
}
