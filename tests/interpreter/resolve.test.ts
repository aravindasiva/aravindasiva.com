import { describe, expect, it } from 'vitest'

import { resolve } from '@/interpreter/resolve'
import type { ShellContext } from '@/commands/types'

const context: ShellContext = { theme: 'midnight' }

describe('resolve', () => {
  it('ignores empty and whitespace-only input', () => {
    expect(resolve('', context)).toBeNull()
    expect(resolve('   ', context)).toBeNull()
  })

  it('normalises case and collapses internal whitespace', () => {
    expect(resolve('  ExPeRiEnCe  ', context)).toEqual({
      status: 'pending',
      name: 'experience',
    })
    expect(resolve('theme    daylight', context)).toEqual({
      status: 'effect',
      effect: { kind: 'theme', theme: 'daylight' },
    })
  })

  it('reports a known command as pending until it is wired up', () => {
    expect(resolve('projects', context)).toEqual({
      status: 'pending',
      name: 'projects',
    })
  })

  it('cycles the theme when given no argument, and wraps', () => {
    expect(resolve('theme', { theme: 'midnight' })).toEqual({
      status: 'effect',
      effect: { kind: 'theme', theme: 'nocturne' },
    })
    expect(resolve('theme', { theme: 'daylight' })).toEqual({
      status: 'effect',
      effect: { kind: 'theme', theme: 'midnight' },
    })
  })

  it('jumps straight to a named theme', () => {
    expect(resolve('theme daylight', { theme: 'midnight' })).toEqual({
      status: 'effect',
      effect: { kind: 'theme', theme: 'daylight' },
    })
  })

  it('falls back to cycling when the theme name is not real', () => {
    expect(resolve('theme neon', { theme: 'midnight' })).toEqual({
      status: 'effect',
      effect: { kind: 'theme', theme: 'nocturne' },
    })
  })

  it('suggests a near miss', () => {
    expect(resolve('expreience', context)).toEqual({
      status: 'unknown',
      input: 'expreience',
      nearest: 'experience',
    })
  })

  it('suggests nothing when the input is nowhere near a command', () => {
    expect(resolve('zzzzzzzzzz', context)).toEqual({
      status: 'unknown',
      input: 'zzzzzzzzzz',
      nearest: null,
    })
  })
})
