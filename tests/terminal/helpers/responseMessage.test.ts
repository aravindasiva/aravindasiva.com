import { describe, expect, it } from 'vitest'

import { responseMessage } from '@/terminal/helpers/responseMessage'

describe('responseMessage', () => {
  it('confirms a theme change', () => {
    expect(
      responseMessage({
        status: 'effect',
        effect: { kind: 'theme', theme: 'daylight' },
      }),
    ).toEqual({ tone: 'info', text: 'theme is now daylight' })
  })

  it('says plainly that a known command does nothing yet', () => {
    expect(responseMessage({ status: 'pending', name: 'projects' })).toEqual({
      tone: 'info',
      text: 'projects is not wired up yet',
    })
  })

  it('offers the near miss when there is one', () => {
    expect(
      responseMessage({
        status: 'unknown',
        input: 'expreience',
        nearest: 'experience',
      }),
    ).toEqual({
      tone: 'error',
      text: 'expreience: not found. did you mean experience?',
    })
  })

  it('does not invent a suggestion when there is none', () => {
    expect(
      responseMessage({ status: 'unknown', input: 'zzz', nearest: null }),
    ).toEqual({ tone: 'error', text: 'zzz: not found' })
  })
})
