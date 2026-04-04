import { create } from 'zustand'
import { generatePhotoPosition, getWorldRadius } from '../utils/placementUtils'
import { MAX_PHOTOS } from '../utils/constants'

function resizeImage(file, maxWidth = 1920) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image — file may be corrupt'))
    }
    img.src = url
  })
}

const usePhotoStore = create((set, get) => ({
  photos: [],
  selectedPhotoId: null,
  isPointerLocked: false,
  isUploadOpen: false,
  isAdding: false,

  hydrateFromStorage: (photos) => set({ photos }),

  addPhoto: async (file) => {
    const state = get()
    if (state.photos.length >= MAX_PHOTOS) return { error: `Max ${MAX_PHOTOS} photos reached` }
    if (!file.type.startsWith('image/')) return { error: 'File must be an image' }
    if (file.size > 10 * 1024 * 1024) return { error: 'Image must be under 10MB' }

    set({ isAdding: true })
    try {
      const dataURL = await resizeImage(file)
      const id = crypto.randomUUID()
      const existingPositions = get().photos.map(p => p.position)
      const worldRadius = getWorldRadius(existingPositions.length + 1)
      const position = generatePhotoPosition(id, existingPositions, worldRadius)

      const photo = {
        id,
        dataURL,
        position,
        likes: 0,
        likedByUser: false,
        uploadedAt: Date.now(),
        filename: file.name,
      }

      set(state => ({ photos: [...state.photos, photo], isAdding: false }))
      return { photo }
    } catch (e) {
      set({ isAdding: false })
      return { error: e.message }
    }
  },

  likePhoto: (id) => set(state => ({
    photos: state.photos.map(p =>
      p.id === id && !p.likedByUser
        ? { ...p, likes: p.likes + 1, likedByUser: true }
        : p
    )
  })),

  selectPhoto: (id) => set({ selectedPhotoId: id }),
  setPointerLocked: (val) => set({ isPointerLocked: val }),
  setUploadOpen: (val) => set({ isUploadOpen: val }),
}))

export default usePhotoStore
