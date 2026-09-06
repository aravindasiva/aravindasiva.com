import { describe, expect, it } from 'vitest'

import { ALL_COMMANDS } from '@/interpreter/allCommands'
import { resolve } from '@/interpreter/resolve'
import type { ShellContext } from '@/commands/types'
import { blockKeyFor } from '@/terminal/helpers/executionLog'

const context: ShellContext = { theme: 'midnight' }

describe('help', () => {
  it('produces output rather than reporting itself unwired', () => {
    const outcome = resolve('help', context)

    expect(outcome?.status).toBe('output')
  })

  it('lists every registered command, and only those', () => {
    const outcome = resolve('help', context)

    if (outcome?.status !== 'output' || outcome.output.kind !== 'help') {
      throw new Error('expected help output')
    }

    expect(outcome.output.entries.map((entry) => entry.name)).toEqual(
      ALL_COMMANDS.map((command) => command.name),
    )
  })

  it('keys to its own name so re-running replaces rather than stacks', () => {
    const outcome = resolve('help', context)

    expect(outcome && blockKeyFor(outcome)).toBe('help')
  })
})
