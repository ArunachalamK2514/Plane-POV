import { useEffect, useRef } from 'react'

export default function useFlightControls() {
  const keysRef = useRef({
    w: false, a: false, s: false, d: false,
    space: false, shift: false,
  })
  const velocityRef = useRef({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    const onKeyDown = (e) => {
      const k = keysRef.current
      if (e.code === 'KeyW') k.w = true
      if (e.code === 'KeyA') k.a = true
      if (e.code === 'KeyS') k.s = true
      if (e.code === 'KeyD') k.d = true
      if (e.code === 'Space') { e.preventDefault(); k.space = true }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') k.shift = true
    }
    const onKeyUp = (e) => {
      const k = keysRef.current
      if (e.code === 'KeyW') k.w = false
      if (e.code === 'KeyA') k.a = false
      if (e.code === 'KeyS') k.s = false
      if (e.code === 'KeyD') k.d = false
      if (e.code === 'Space') k.space = false
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') k.shift = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return { keysRef, velocityRef }
}
