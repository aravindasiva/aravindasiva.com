import type { Command } from './types'

export const clear: Command = {
  name: 'clear',
  glyph: '⌫',
  summary: 'clear the screen',
  inNav: false,
  run: () => ({ status: 'effect', effect: { kind: 'clear' } }),
}
