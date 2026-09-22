import { describe, expect, it } from 'vitest'

import {
  motionFor,
  OPEN_WINDOW,
  windowReducer,
} from '@/desktop/helpers/windowState'
import type { WindowState } from '@/desktop/helpers/windowState'

const fullscreen: WindowState = { mode: 'open', fullscreen: true }
const minimised: WindowState = { mode: 'minimised' }
const closed: WindowState = { mode: 'closed' }

describe('windowReducer', () => {
  it('starts open, because a deep link must never land on the desktop', () => {
    expect(OPEN_WINDOW).toEqual({ mode: 'open', fullscreen: false })
  })

  it('separates minimised from closed, so each can offer its own way back', () => {
    expect(windowReducer(OPEN_WINDOW, { type: 'minimise' }).mode).toBe(
      'minimised',
    )
    expect(windowReducer(OPEN_WINDOW, { type: 'close' }).mode).toBe('closed')
  })

  it('leaves fullscreen behind when the window is put away', () => {
    expect(windowReducer(fullscreen, { type: 'minimise' })).toEqual(minimised)
    expect(windowReducer(fullscreen, { type: 'close' })).toEqual(closed)
  })

  it('reopens windowed, never into a mode nobody chose', () => {
    expect(windowReducer(minimised, { type: 'open' })).toEqual(OPEN_WINDOW)
    expect(windowReducer(closed, { type: 'open' })).toEqual(OPEN_WINDOW)
  })

  it('toggles fullscreen both ways', () => {
    const on = windowReducer(OPEN_WINDOW, { type: 'toggleFullscreen' })

    expect(on).toEqual(fullscreen)
    expect(windowReducer(on, { type: 'toggleFullscreen' })).toEqual(OPEN_WINDOW)
  })

  it('ignores fullscreen while the window is away', () => {
    expect(windowReducer(minimised, { type: 'toggleFullscreen' })).toBe(
      minimised,
    )
    expect(windowReducer(closed, { type: 'toggleFullscreen' })).toBe(closed)
  })

  it('never reaches a state with no way back', () => {
    const reachable: WindowState[] = [
      OPEN_WINDOW,
      fullscreen,
      minimised,
      closed,
    ]

    for (const state of reachable) {
      expect(windowReducer(state, { type: 'open' })).toEqual(OPEN_WINDOW)
    }
  })
})

describe('motionFor', () => {
  it('gives the genie to the window leaving for the strip and coming back', () => {
    expect(motionFor(OPEN_WINDOW, { type: 'minimise' })).toBe('minimise')
    expect(motionFor(fullscreen, { type: 'minimise' })).toBe('minimise')
    expect(motionFor(minimised, { type: 'open' })).toBe('restore')
  })

  it('leaves close, fullscreen and reopening from closed to plain CSS', () => {
    expect(motionFor(OPEN_WINDOW, { type: 'close' })).toBeNull()
    expect(motionFor(OPEN_WINDOW, { type: 'toggleFullscreen' })).toBeNull()
    expect(motionFor(closed, { type: 'open' })).toBeNull()
    expect(motionFor(minimised, { type: 'close' })).toBeNull()
  })
})
