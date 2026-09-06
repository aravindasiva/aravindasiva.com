import { all } from '@/commands/all'
import { clear } from '@/commands/clear'
import { contact } from '@/commands/contact'
import { cv } from '@/commands/cv'
import { education } from '@/commands/education'
import { experience } from '@/commands/experience'
import { help } from '@/commands/help'
import { projects } from '@/commands/projects'
import { stack } from '@/commands/stack'
import { theme } from '@/commands/theme'
import { tip } from '@/commands/tip'
import type { Command } from '@/commands/types'
import { whoami } from '@/commands/whoami'

/* Nav, completion, the palette, help and the sitemap all read this. */
export const ALL_COMMANDS: Command[] = [
  all,
  whoami,
  experience,
  projects,
  stack,
  education,
  cv,
  contact,
  theme,
  clear,
  tip,
  help,
]

export const NAV_COMMANDS = ALL_COMMANDS.filter((command) => command.inNav)

export const CHIP_COMMANDS = ALL_COMMANDS.filter((command) =>
  ['all', 'whoami', 'theme'].includes(command.name),
)

export function findCommand(name: string): Command | undefined {
  return ALL_COMMANDS.find((command) => command.name === name)
}
