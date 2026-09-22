export type WindowAction =
  | { type: 'minimise' }
  | { type: 'close' }
  | { type: 'open' }
  | { type: 'toggleFullscreen' }

/*
  Minimised and closed are separate states because they now recover differently:
  a minimised window leaves something in the corner to click, a closed one leaves
  only the desktop icon. Fullscreen belongs to the open window alone, which is why
  it lives on that member and not beside the mode, so no reachable state can be
  both fullscreen and put away.
*/
export type WindowState =
  | { mode: 'open'; fullscreen: boolean }
  | { mode: 'minimised' }
  | { mode: 'closed' }

export const OPEN_WINDOW: WindowState = { mode: 'open', fullscreen: false }

export type WindowMotion = 'minimise' | 'restore'

export function windowReducer(
  state: WindowState,
  action: WindowAction,
): WindowState {
  switch (action.type) {
    case 'minimise':
      return { mode: 'minimised' }

    case 'close':
      return { mode: 'closed' }

    case 'open':
      return OPEN_WINDOW

    case 'toggleFullscreen':
      return state.mode === 'open'
        ? { mode: 'open', fullscreen: !state.fullscreen }
        : state
  }
}

/*
  Only the moves between the window and the parked strip get the genie. Close
  and fullscreen are plain CSS on the frame, and playing the genie as well would
  animate the same change twice.
*/
export function motionFor(
  state: WindowState,
  action: WindowAction,
): WindowMotion | null {
  if (state.mode === 'open' && action.type === 'minimise') return 'minimise'
  if (state.mode === 'minimised' && action.type === 'open') return 'restore'

  return null
}
