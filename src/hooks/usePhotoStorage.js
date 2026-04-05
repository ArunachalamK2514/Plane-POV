import { useEffect, useRef } from 'react'
import { DB_NAME, DB_VERSION, STORE_NAME, getDB } from '../utils/db'
import usePhotoStore from '../store/usePhotoStore'

export default function usePhotoStorage() {
  const hydrateFromStorage = usePhotoStore(s => s.hydrateFromStorage)
  const setStorageLoaded = usePhotoStore(s => s.setStorageLoaded)
  const setUploadOpen = usePhotoStore(s => s.setUploadOpen)
  const photos = usePhotoStore(s => s.photos)
  const dbRef = useRef(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const db = await getDB()
        dbRef.current = db
        const all = await db.getAll(STORE_NAME)
        if (!cancelled) {
          hydrateFromStorage(all)
          loadedRef.current = true
          setStorageLoaded(true)
          if (usePhotoStore.getState().photos.length === 0) {
            setUploadOpen(true)
          }
        }
      } catch (e) {
        console.warn('IndexedDB unavailable, using in-memory only:', e)
        loadedRef.current = true
        setStorageLoaded(true)
        setUploadOpen(true)
      }
    }
    init()
    return () => { cancelled = true }
  }, [hydrateFromStorage, setStorageLoaded, setUploadOpen])

  useEffect(() => {
    if (!loadedRef.current || !dbRef.current || photos.length === 0) return
    const db = dbRef.current
    const tx = db.transaction(STORE_NAME, 'readwrite')
    Promise.all([
      ...photos.map(photo => tx.store.put(photo)),
      tx.done,
    ]).catch(e => console.warn('Failed to sync photos to IndexedDB:', e))
  }, [photos])
}
