import { describe, expect, it } from 'vitest'

import { didYouMean } from '@/interpreter/didYouMean'

const COMMANDS = ['experience', 'projects', 'stack', 'contact', 'help']

describe('didYouMean', () => {
  it('finds a single-character typo', () => {
    expect(didYouMean('stak', COMMANDS)).toBe('stack')
  })

  it('finds a transposition', () => {
    expect(didYouMean('expreience', COMMANDS)).toBe('experience')
  })

  it('suggests nothing when nothing is close', () => {
    expect(didYouMean('zzzzzzzzzz', COMMANDS)).toBeNull()
  })

  it('respects the threshold, because a bad suggestion is worse than none', () => {
    expect(didYouMean('helping-hand', COMMANDS)).toBeNull()
    expect(didYouMean('helo', COMMANDS, 1)).toBe('help')
    expect(didYouMean('heo', COMMANDS, 1)).toBeNull()
  })

  it('returns the closest, not merely the first acceptable', () => {
    expect(didYouMean('contct', COMMANDS)).toBe('contact')
  })
})
