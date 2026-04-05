import { openDB } from 'idb'

export const DB_NAME = 'plane-pov-db'
export const DB_VERSION = 1
export const STORE_NAME = 'photos'

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })
}

export async function clearAllPhotosFromDB() {
  try {
    const db = await getDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    await tx.store.clear()
    await tx.done
  } catch (e) {
    console.warn('Failed to clear photos from IndexedDB:', e)
  }
}
