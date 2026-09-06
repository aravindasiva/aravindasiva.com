import { describe, expect, it } from 'vitest'

import type { Outcome } from '@/commands/types'
import type { Execution } from '@/terminal/helpers/executionLog'
import {
  appendExecution,
  blockKeyFor,
  visibleExecutions,
} from '@/terminal/helpers/executionLog'

const pending = (name: string): Outcome => ({ status: 'pending', name })
const unknown = (input: string): Outcome => ({
  status: 'unknown',
  input,
  nearest: null,
})

function log(...names: string[]): Execution[] {
  return names.map((name) => ({
    id: name === 'oops' ? 'error' : name,
    input: name,
    outcome: name === 'oops' ? unknown(name) : pending(name),
  }))
}

const ids = (executions: Execution[]) => executions.map((e) => e.id)

describe('visibleExecutions', () => {
  it('keeps a single run untouched', () => {
    expect(ids(visibleExecutions(log('experience')))).toEqual(['experience'])
  })

  it('keeps only the last occurrence, in execution order', () => {
    const derived = visibleExecutions(log('experience', 'stack', 'experience'))

    expect(ids(derived)).toEqual(['stack', 'experience'])
  })

  it('leaves the most recent command where it is when re-run', () => {
    const derived = visibleExecutions(log('experience', 'stack', 'stack'))

    expect(ids(derived)).toEqual(['experience', 'stack'])
  })

  it('never grows past one block per identity, however long the log', () => {
    const derived = visibleExecutions(
      log(
        ...Array.from({ length: 40 }, (_, i) => (i % 2 ? 'stack' : 'projects')),
      ),
    )

    expect(ids(derived)).toEqual(['projects', 'stack'])
  })

  it('collapses every unknown input into one error slot', () => {
    const derived = visibleExecutions(log('oops', 'stack', 'oops'))

    expect(ids(derived)).toEqual(['stack', 'error'])
  })
})

describe('blockKeyFor', () => {
  it('keys a known command by its name', () => {
    expect(blockKeyFor(pending('projects'))).toBe('projects')
  })

  it('keys every unknown input to the shared error slot', () => {
    expect(blockKeyFor(unknown('asdf'))).toBe('error')
    expect(blockKeyFor(unknown('qwer'))).toBe('error')
  })

  it('gives theme a block and clear none', () => {
    expect(
      blockKeyFor({
        status: 'effect',
        effect: { kind: 'theme', theme: 'nocturne' },
      }),
    ).toBe('theme')
    expect(
      blockKeyFor({ status: 'effect', effect: { kind: 'clear' } }),
    ).toBeNull()
  })
})

describe('appendExecution', () => {
  it('appends a block for a command that produces one', () => {
    const next = appendExecution([], 'projects', pending('projects'))

    expect(ids(next)).toEqual(['projects'])
  })

  it('empties everything on clear', () => {
    const next = appendExecution(log('experience', 'stack'), 'clear', {
      status: 'effect',
      effect: { kind: 'clear' },
    })

    expect(next).toEqual([])
  })
})
