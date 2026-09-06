import { describe, expect, it } from 'vitest'

import { completion } from '@/interpreter/completion'

describe('completion', () => {
  it('offers nothing for an empty prompt', () => {
    expect(completion('')).toBeNull()
    expect(completion('   ')).toBeNull()
  })

  it('completes a prefix', () => {
    expect(completion('ex')).toBe('experience')
    expect(completion('con')).toBe('contact')
  })

  it('ignores case', () => {
    expect(completion('EXP')).toBe('experience')
  })

  it('offers nothing once the command is already complete', () => {
    expect(completion('experience')).toBeNull()
  })

  it('offers nothing when no command starts with the input', () => {
    expect(completion('zzz')).toBeNull()
  })

  it('takes the first match in registry order when several share a prefix', () => {
    expect(completion('c')).toBe('cv')
  })
})
