/* Static maps, because Tailwind reads class names out of source. */
export const GAP = {
  none: 'gap-0',
  tight: 'gap-1',
  snug: 'gap-2',
  base: 'gap-3',
  loose: 'gap-4',
  block: 'gap-block',
} as const

export const ALIGN = {
  start: 'items-start',
  center: 'items-center',
  baseline: 'items-baseline',
  end: 'items-end',
} as const

export type Gap = keyof typeof GAP
export type Align = keyof typeof ALIGN
