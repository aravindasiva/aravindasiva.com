export type Box = { x: number; y: number; width: number; height: number }

export type GenieShape = {
  top: number
  bottom: number
  rows: { y: number; left: number; right: number }[]
}

const ROWS = 10
const FRAMES = 20

/*
  One curve for both directions. Restore plays the same frames in reverse, and a
  reversed ease-in is an ease-out, so the window decelerates out of the corner
  exactly as it accelerated into it.
*/
export const GENIE_TIMING = {
  duration: 500,
  easing: 'cubic-bezier(0.45, 0, 0.85, 0.5)',
}

/*
  The window at progress t. Each row narrows toward the strip at its own time,
  bottom first and top last, so the top is still wide while the bottom is already
  in the corner. That funnel is what reads as a genie rather than a shrink. The
  top follows it down a beat later.
*/
export function genieShape(t: number, open: Box, parked: Box): GenieShape {
  const top = mix(open.y, parked.y, phase(t, 0.3, 1))
  const bottom = mix(
    open.y + open.height,
    parked.y + parked.height,
    phase(t, 0, 0.6),
  )

  const rows = Array.from({ length: ROWS + 1 }, (_, index) => {
    const depth = index / ROWS
    const start = (1 - depth) * 0.5
    const pinch = phase(t, start, start + 0.5)

    return {
      y: mix(top, bottom, depth),
      left: mix(open.x, parked.x, pinch),
      right: mix(open.x + open.width, parked.x + parked.width, pinch),
    }
  })

  return { top, bottom, rows }
}

/*
  A transform can scale a box but never bend it, so each frame squashes the whole
  window into the bounds of that frame's shape, then cuts the shape out with
  clip-path. layout is where the frame's own CSS has already put it, which is not
  where the genie starts when minimising out of fullscreen.
*/
export function genieFrames(open: Box, parked: Box, layout: Box): Keyframe[] {
  return Array.from({ length: FRAMES + 1 }, (_, index) => {
    const t = index / FRAMES
    const { top, bottom, rows } = genieShape(t, open, parked)
    const left = Math.min(...rows.map((row) => row.left))
    const right = Math.max(...rows.map((row) => row.right))
    const width = right - left
    const height = bottom - top

    const at = (x: number, y: number) =>
      `${percent((x - left) / width)} ${percent((y - top) / height)}`

    const outline = [
      ...rows.map((row) => at(row.left, row.y)),
      ...[...rows].reverse().map((row) => at(row.right, row.y)),
    ]

    return {
      offset: t,
      visibility: 'visible',
      opacity: 1 - phase(t, 0.88, 1),
      transformOrigin: '0 0',
      transform: `translate(${left - layout.x}px, ${top - layout.y}px) scale(${width / layout.width}, ${height / layout.height})`,
      clipPath: `polygon(${outline.join(', ')})`,
    }
  })
}

function phase(t: number, start: number, end: number) {
  const x = Math.min(Math.max((t - start) / (end - start), 0), 1)

  return x * x * (3 - 2 * x)
}

function mix(from: number, to: number, amount: number) {
  return from + (to - from) * amount
}

function percent(fraction: number) {
  return `${(fraction * 100).toFixed(3)}%`
}
