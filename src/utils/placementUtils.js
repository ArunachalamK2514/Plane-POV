import { BASE_RADIUS, RADIUS_PER_PHOTO, CLOUD_BASE_COUNT, CLOUD_PER_PHOTO, PHOTO_MIN_Y, PHOTO_MAX_Y, PHOTO_MIN_SEPARATION } from './constants'

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

export function getWorldRadius(photoCount) {
  return BASE_RADIUS + photoCount * RADIUS_PER_PHOTO
}

export function getCloudCount(photoCount) {
  return Math.floor(CLOUD_BASE_COUNT + photoCount * CLOUD_PER_PHOTO)
}

export function generatePhotoPosition(photoId, existingPositions, worldRadius) {
  const rand = mulberry32(hashString(photoId))
  const minR = 50
  const maxR = worldRadius * 0.85

  for (let attempt = 0; attempt < 30; attempt++) {
    const angle = rand() * Math.PI * 2
    const r = minR + rand() * (maxR - minR)
    const x = Math.cos(angle) * r
    const z = Math.sin(angle) * r
    const y = PHOTO_MIN_Y + rand() * (PHOTO_MAX_Y - PHOTO_MIN_Y)

    const candidate = [x, y, z]
    const tooClose = existingPositions.some(pos => {
      const dx = pos[0] - x
      const dy = pos[1] - y
      const dz = pos[2] - z
      return Math.sqrt(dx*dx + dy*dy + dz*dz) < PHOTO_MIN_SEPARATION
    })

    if (!tooClose) return candidate
  }

  // fallback: just place it
  const angle = rand() * Math.PI * 2
  const r = minR + rand() * (maxR - minR)
  return [Math.cos(angle) * r, PHOTO_MIN_Y + rand() * (PHOTO_MAX_Y - PHOTO_MIN_Y), Math.sin(angle) * r]
}

export function generateCloudConfigs(count, worldRadius, seed = 42) {
  const rand = mulberry32(seed)
  return Array.from({ length: count }, (_, i) => {
    const angle = rand() * Math.PI * 2
    const r = 30 + rand() * worldRadius * 0.95
    return {
      id: i,
      position: [
        Math.cos(angle) * r,
        60 + rand() * 120,
        Math.sin(angle) * r,
      ],
      scale: 0.6 + rand() * 1.4,
      opacity: 0.5 + rand() * 0.4,
      speed: 0.1 + rand() * 0.3,
    }
  })
}
