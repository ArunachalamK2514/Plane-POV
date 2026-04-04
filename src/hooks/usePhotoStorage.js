import { useEffect, useRef } from 'react'
import { openDB } from 'idb'
import usePhotoStore from '../store/usePhotoStore'

const DB_NAME = 'plane-pov-db'
const DB_VERSION = 1
const STORE_NAME = 'photos'

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })
}

export default function usePhotoStorage() {
  const hydrateFromStorage = usePhotoStore(s => s.hydrateFromStorage)
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
        }
      } catch (e) {
        console.warn('IndexedDB unavailable, using in-memory only:', e)
        loadedRef.current = true
      }
    }
    init()
    return () => { cancelled = true }
  }, [hydrateFromStorage])

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
