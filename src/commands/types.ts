import type { ThemeName } from '@/lib/theme'

export type HelpEntry = {
  name: string
  glyph: string
  summary: string
}

/* Never markup: a route resolves its command on the server and hands this to
   the client shell as a plain prop. */
export type Output = { kind: 'help'; entries: HelpEntry[] }

export type Effect = { kind: 'theme'; theme: ThemeName } | { kind: 'clear' }

export type Outcome =
  | { status: 'effect'; effect: Effect }
  | { status: 'output'; name: string; output: Output }
  | { status: 'pending'; name: string }
  | { status: 'unknown'; input: string; nearest: string | null }

export type ShellContext = {
  theme: ThemeName
}

/* The interpreter adds `commands`, so help can describe them all without
   importing the list and creating a cycle. */
export type RunContext = ShellContext & {
  commands: Command[]
}

/*
  name          what you type
  glyph         shown beside it everywhere
  summary       one line, used by help, the palette and tooltips
  inNav         shown in the title bar. everything else is typed
  hideNavLabel  glyph only, for the command whose glyph already says it
  run           optional. without it the command answers `pending`, which is
                how a command exists before its behaviour does
*/
export type Command = {
  name: string
  glyph: string
  summary: string
  inNav: boolean
  hideNavLabel?: boolean
  run?: (args: string[], context: RunContext) => Outcome
}
