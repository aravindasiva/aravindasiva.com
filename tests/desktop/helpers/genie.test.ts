import { describe, expect, it } from 'vitest'

import { genieFrames, genieShape } from '@/desktop/helpers/genie'
import type { Box } from '@/desktop/helpers/genie'

const open: Box = { x: 12, y: 12, width: 1256, height: 776 }
const parked: Box = { x: 1028, y: 748, width: 240, height: 40 }

describe('genieShape', () => {
  it('starts as the open window', () => {
    const shape = genieShape(0, open, parked)

    expect(shape.top).toBe(open.y)
    expect(shape.bottom).toBe(open.y + open.height)

    for (const row of shape.rows) {
      expect(row.left).toBe(open.x)
      expect(row.right).toBe(open.x + open.width)
    }
  })

  it('ends as the parked strip', () => {
    const shape = genieShape(1, open, parked)

    expect(shape.top).toBe(parked.y)
    expect(shape.bottom).toBe(parked.y + parked.height)

    for (const row of shape.rows) {
      expect(row.left).toBe(parked.x)
      expect(row.right).toBe(parked.x + parked.width)
    }
  })

  it('pinches the bottom before the top, which is what makes it a genie', () => {
    const widths = genieShape(0.5, open, parked).rows.map(
      (row) => row.right - row.left,
    )

    expect(widths).toEqual([...widths].sort((a, b) => b - a))
    expect(Math.max(...widths)).toBeGreaterThan(Math.min(...widths))
  })
})

describe('genieFrames', () => {
  const frames = genieFrames(open, parked, open)

  it('leaves the window untouched on the first frame', () => {
    expect(frames.at(0)?.transform).toBe('translate(0px, 0px) scale(1, 1)')
    expect(frames.at(0)?.opacity).toBe(1)
  })

  it('lands exactly on the strip and hands over to it', () => {
    const last = frames.at(-1)

    expect(last?.transform).toBe(
      `translate(${parked.x - open.x}px, ${parked.y - open.y}px) scale(${parked.width / open.width}, ${parked.height / open.height})`,
    )
    expect(last?.opacity).toBe(0)
  })

  it('keeps one point count in every outline, or clip-path cannot interpolate', () => {
    const counts = frames.map(
      (frame) => String(frame.clipPath).split(',').length,
    )

    expect(new Set(counts).size).toBe(1)
  })
})
