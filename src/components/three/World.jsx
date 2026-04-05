import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { Vector2 } from 'three'
import SkyDome from './SkyDome'
import CloudField from './CloudField'
import PhotoGallery from './PhotoGallery'
import FlightRig from './FlightRig'

const CHROMATIC_OFFSET = new Vector2(0.0005, 0.0005)

export default function World() {
  return (
    <Canvas
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      camera={{ fov: 75, near: 0.1, far: 8000, position: [0, 80, 0] }}
      gl={{ antialias: true, alpha: false }}
      frameloop="always"
    >
      <fog attach="fog" args={['#b8d4f0', 200, 3000]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[100, 200, 50]} intensity={1.2} />

      <SkyDome />
      <CloudField />
      <PhotoGallery />
      <FlightRig />

      <EffectComposer>
        <Bloom luminanceThreshold={0.9} intensity={0.3} mipmapBlur />
        <ChromaticAberration offset={CHROMATIC_OFFSET} radialModulation={false} modulationOffset={0} />
      </EffectComposer>
    </Canvas>
  )
}
