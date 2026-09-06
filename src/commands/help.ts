import type { Command } from './types'

/* Takes the list from context rather than importing it, which avoids a cycle. */
export const help: Command = {
  name: 'help',
  glyph: '?',
  summary: 'everything you can type',
  inNav: true,
  hideNavLabel: true,
  run: (_args, context) => ({
    status: 'output',
    name: 'help',
    output: {
      kind: 'help',
      entries: context.commands.map((command) => ({
        name: command.name,
        glyph: command.glyph,
        summary: command.summary,
      })),
    },
  }),
}
