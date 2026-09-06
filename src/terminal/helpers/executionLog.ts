import type { Outcome } from '@/commands/types'

export type Execution = {
  id: string
  input: string
  outcome: Outcome
}

/*
  The whole scrollback model: the visible list is the log filtered to the last
  occurrence of each key, in that order. Pulse, replace-and-append and append-new
  are not three rules, they are this one plus what the view animates.
*/
export function visibleExecutions(log: Execution[]): Execution[] {
  const lastIndex = new Map<string, number>()

  log.forEach((execution, index) => {
    lastIndex.set(execution.id, index)
  })

  return log.filter((execution, index) => lastIndex.get(execution.id) === index)
}

/* Every unknown input shares one key, so typos replace rather than stack.
   Null means no block at all, which is only `clear`. */
export function blockKeyFor(outcome: Outcome): string | null {
  switch (outcome.status) {
    case 'effect':
      return outcome.effect.kind === 'clear' ? null : outcome.effect.kind

    case 'output':
    case 'pending':
      return outcome.name

    case 'unknown':
      return 'error'
  }
}

export function appendExecution(
  log: Execution[],
  input: string,
  outcome: Outcome,
): Execution[] {
  if (outcome.status === 'effect' && outcome.effect.kind === 'clear') return []

  const id = blockKeyFor(outcome)

  if (id === null) return log

  return [...log, { id, input, outcome }]
}
