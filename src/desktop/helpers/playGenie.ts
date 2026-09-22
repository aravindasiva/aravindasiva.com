import { flushSync } from 'react-dom'

import type { Box } from './genie'
import { GENIE_TIMING, genieFrames } from './genie'
import type { WindowMotion } from './windowState'

const STRIP_ARRIVES: Keyframe[] = [
  { opacity: 0 },
  { opacity: 0, offset: 0.8 },
  { opacity: 1 },
]

/*
  commit is the state change, flushed synchronously so the DOM already shows
  where the window ends up before the first frame paints. The frame's own CSS
  owns the resting state on either side and the animation only covers the trip,
  which is why the frames hold visibility open: minimised CSS hides the frame,
  and the genie has to be seen leaving.

  The strip only exists while minimised, so it is read after the commit when
  minimising and before it when restoring.
*/
export function playGenie(
  motion: WindowMotion,
  frame: HTMLElement,
  strip: () => HTMLElement | null,
  commit: () => void,
) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    commit()
    return
  }

  for (const running of frame.getAnimations()) running.cancel()

  if (motion === 'minimise') {
    const from = boxOf(frame)

    flushSync(commit)

    const parked = strip()

    if (!parked) return

    frame.animate(genieFrames(from, boxOf(parked), boxOf(frame)), GENIE_TIMING)
    parked.animate(STRIP_ARRIVES, GENIE_TIMING)
    return
  }

  const parked = strip()
  const from = parked ? boxOf(parked) : null

  flushSync(commit)

  if (!from) return

  const opened = boxOf(frame)

  frame.animate(genieFrames(opened, from, opened), {
    ...GENIE_TIMING,
    direction: 'reverse',
  })
}

function boxOf(element: HTMLElement): Box {
  const { x, y, width, height } = element.getBoundingClientRect()

  return { x, y, width, height }
}
