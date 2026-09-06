import type { Outcome } from '@/commands/types'

export type Response = {
  tone: 'info' | 'error'
  text: string
}

/*
  Pure, so the copy is testable without rendering. Every message says what
  actually happened: nothing here claims a command works when it does not.

  `clear` leaves no block, so its line only ever reaches the live region.
*/
export function responseMessage(outcome: Outcome): Response {
  switch (outcome.status) {
    case 'effect':
      switch (outcome.effect.kind) {
        case 'theme':
          return { tone: 'info', text: `theme is now ${outcome.effect.theme}` }

        case 'clear':
          return { tone: 'info', text: 'screen cleared' }
      }
      break

    case 'output':
      switch (outcome.output.kind) {
        case 'help':
          return {
            tone: 'info',
            text: `${outcome.output.entries.length} commands`,
          }
      }
      break

    case 'pending':
      return { tone: 'info', text: `${outcome.name} is not wired up yet` }

    case 'unknown':
      return {
        tone: 'error',
        text: outcome.nearest
          ? `${outcome.input}: not found. did you mean ${outcome.nearest}?`
          : `${outcome.input}: not found`,
      }
  }
}
