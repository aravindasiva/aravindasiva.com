import type { Outcome, ShellContext } from '@/commands/types'

import { ALL_COMMANDS, findCommand } from './allCommands'
import { didYouMean } from './didYouMean'

/* Every affordance arrives here, so none of them can grow a private code path. */
export function resolve(raw: string, context: ShellContext): Outcome | null {
  const trimmed = raw.trim().replace(/\s+/g, ' ')

  if (!trimmed) return null

  const [name = '', ...args] = trimmed.toLowerCase().split(' ')
  const command = findCommand(name)

  if (!command) {
    return {
      status: 'unknown',
      input: trimmed,
      nearest: didYouMean(
        name,
        ALL_COMMANDS.map((entry) => entry.name),
      ),
    }
  }

  if (!command.run) return { status: 'pending', name: command.name }

  return command.run(args, { ...context, commands: ALL_COMMANDS })
}
