import { nextTheme, THEMES } from '@/lib/theme'

import type { Command } from './types'

/* An unrecognised name cycles rather than erroring, because the button and the
   typed command share this path and a click cannot carry a bad argument. */
export const theme: Command = {
  name: 'theme',
  glyph: '◑',
  summary: 'change the palette',
  inNav: false,
  run: ([requested], context) => {
    const named = THEMES.find((name) => name === requested)

    return {
      status: 'effect',
      effect: { kind: 'theme', theme: named ?? nextTheme(context.theme) },
    }
  },
}
