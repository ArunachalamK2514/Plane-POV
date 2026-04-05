import test from 'node:test'
import assert from 'node:assert/strict'
import { FLIGHT_DAMPING, FLIGHT_SPEED } from './constants'

test('flight constants match tuned movement values', () => {
  assert.equal(FLIGHT_SPEED, 0.4)
  assert.equal(FLIGHT_DAMPING, 0.90)
})
