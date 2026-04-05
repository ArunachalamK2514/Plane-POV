import { Stars } from '@react-three/drei'
import * as THREE from 'three'

export default function SkyDome() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[4500, 32, 32]} />
        <meshBasicMaterial color="#5b9bd5" side={THREE.BackSide} />
      </mesh>
      <Stars radius={2000} depth={50} count={800} factor={2} saturation={0} fade />
    </>
  )
}
