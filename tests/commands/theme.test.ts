import { describe, expect, it } from 'vitest'

import { theme } from '@/commands/theme'
import { ALL_COMMANDS } from '@/interpreter/allCommands'

const context = { theme: 'midnight' as const, commands: ALL_COMMANDS }

function run(args: string[], from: 'midnight' | 'nocturne' | 'daylight') {
  return theme.run?.(args, { ...context, theme: from })
}

describe('theme', () => {
  it('cycles when given no argument, and wraps', () => {
    expect(run([], 'midnight')).toEqual({
      status: 'effect',
      effect: { kind: 'theme', theme: 'nocturne' },
    })
    expect(run([], 'daylight')).toEqual({
      status: 'effect',
      effect: { kind: 'theme', theme: 'midnight' },
    })
  })

  it('jumps straight to a named palette', () => {
    expect(run(['daylight'], 'midnight')).toEqual({
      status: 'effect',
      effect: { kind: 'theme', theme: 'daylight' },
    })
  })

  it('cycles rather than erroring on a palette that does not exist', () => {
    expect(run(['neon'], 'midnight')).toEqual({
      status: 'effect',
      effect: { kind: 'theme', theme: 'nocturne' },
    })
  })
})
