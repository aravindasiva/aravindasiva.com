import { ALL_COMMANDS } from './allCommands'

/* Case insensitive, but the caller keeps the user's casing for the ghost text.
   Safe because the prompt is monospace and both strings are the same length. */
export function completion(value: string): string | null {
  const typed = value.trimStart().toLowerCase()

  if (!typed) return null

  const match = ALL_COMMANDS.find(
    (command) => command.name.startsWith(typed) && command.name !== typed,
  )

  return match?.name ?? null
}
