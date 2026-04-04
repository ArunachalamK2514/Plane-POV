/* eslint-disable react-hooks/immutability */
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import useFlightControls from '../../hooks/useFlightControls'
import usePhotoStore from '../../store/usePhotoStore'
import { getWorldRadius } from '../../utils/placementUtils'
import { FLIGHT_SPEED, FLIGHT_DAMPING } from '../../utils/constants'

const AUTO_FORWARD = 0.025
const MAX_SPEED = 1.2

export default function FlightRig() {
  const { camera } = useThree()
  const { keysRef, velocityRef } = useFlightControls()
  const setPointerLocked = usePhotoStore(s => s.setPointerLocked)
  const photoCount = usePhotoStore(s => s.photos.length)
  const controlsRef = useRef()
  const tmpDir = useRef(new THREE.Vector3())

  useEffect(() => {
    camera.position.set(0, 80, 0)
  }, [camera])

  useFrame((_, delta) => {
    const keys = keysRef.current
    const vel = velocityRef.current
    const dt = Math.min(delta, 0.05) * 60 // normalize to 60fps

    // Desired input
    const inputX = ((keys.d ? 1 : 0) - (keys.a ? 1 : 0)) * FLIGHT_SPEED
    const inputY = ((keys.space ? 1 : 0) - (keys.shift ? 1 : 0)) * FLIGHT_SPEED
    const inputZ = ((keys.s ? 1 : 0) - (keys.w ? 1 : 0)) * FLIGHT_SPEED - AUTO_FORWARD

    // Apply damping then add input
    vel.x = vel.x * FLIGHT_DAMPING + inputX * (1 - FLIGHT_DAMPING)
    vel.y = vel.y * FLIGHT_DAMPING + inputY * (1 - FLIGHT_DAMPING)
    vel.z = vel.z * FLIGHT_DAMPING + inputZ * (1 - FLIGHT_DAMPING)

    // Clamp speed
    const speed = Math.sqrt(vel.x ** 2 + vel.z ** 2)
    if (speed > MAX_SPEED) {
      vel.x = (vel.x / speed) * MAX_SPEED
      vel.z = (vel.z / speed) * MAX_SPEED
    }

    // Convert local XZ movement to world space using camera orientation
    tmpDir.current.set(vel.x, 0, vel.z)
    tmpDir.current.applyQuaternion(camera.quaternion)

    camera.position.x += tmpDir.current.x * dt
    camera.position.y += vel.y * dt
    camera.position.z += tmpDir.current.z * dt

    // Clamp altitude
    camera.position.y = Math.max(10, Math.min(500, camera.position.y))

    // Soft world boundary
    const worldRadius = getWorldRadius(photoCount)
    const distFromOrigin = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2)
    if (distFromOrigin > worldRadius * 1.2) {
      const pushFactor = 0.02
      camera.position.x -= camera.position.x * pushFactor
      camera.position.z -= camera.position.z * pushFactor
    }
  })

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={() => setPointerLocked(true)}
      onUnlock={() => setPointerLocked(false)}
    />
  )
}
