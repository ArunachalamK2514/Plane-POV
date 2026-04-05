import test from 'node:test'
import assert from 'node:assert/strict'
import usePhotoStore from './usePhotoStore'

test('setStorageLoaded updates storageLoaded flag', () => {
  usePhotoStore.setState({ storageLoaded: false })
  usePhotoStore.getState().setStorageLoaded(true)
  assert.equal(usePhotoStore.getState().storageLoaded, true)
})

test('setFlightSpeedMultiplier clamps within allowed range', () => {
  usePhotoStore.getState().setFlightSpeedMultiplier(6)
  assert.equal(usePhotoStore.getState().flightSpeedMultiplier, 5.0)

  usePhotoStore.getState().setFlightSpeedMultiplier(0.1)
  assert.equal(usePhotoStore.getState().flightSpeedMultiplier, 0.5)
})
