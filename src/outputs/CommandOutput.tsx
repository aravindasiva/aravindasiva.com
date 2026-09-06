import type { ReactElement } from 'react'

import type { Output } from '@/commands/types'

import { HelpOutput } from './HelpOutput'

type CommandOutputProps = {
  output: Output
}

/* The explicit return type is what makes this exhaustive: a missing case widens
   the inferred return to include undefined, which fails to satisfy it. */
export function CommandOutput({ output }: CommandOutputProps): ReactElement {
  switch (output.kind) {
    case 'help':
      return <HelpOutput entries={output.entries} />
  }
}
