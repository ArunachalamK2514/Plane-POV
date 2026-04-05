import { Sky, Stars } from '@react-three/drei'

export default function SkyDome() {
  return (
    <>
      <Sky
        sunPosition={[100, 20, 100]}
        turbidity={8}
        rayleigh={0.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        distance={450000}
      />
      <Stars radius={2000} depth={50} count={800} factor={2} saturation={0} fade />
    </>
  )
}
