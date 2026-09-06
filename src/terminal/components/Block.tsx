import { CommandOutput } from '@/outputs/CommandOutput'
import { Stack } from '@/components/Stack'

import type { Execution } from '../helpers/executionLog'
import { responseMessage } from '../helpers/responseMessage'
import { PromptLine } from './PromptLine'

type BlockProps = {
  execution: Execution
  pulsing: boolean
  onPulseEnd: () => void
}

/*
  No view-transition-name here: those pseudo-elements clip to the viewport, not to
  the scrollback, so a scrolled-out block drew its ghost over the title bar.

  The pulse class and its animationend handler must share an element, because
  animation events bubble up from the animated node.
*/
export function Block({ execution, pulsing, onPulseEnd }: BlockProps) {
  const { outcome } = execution
  const message = responseMessage(outcome)

  return (
    <Stack
      gap="snug"
      className={`-mx-2 rounded px-2 py-1 ${pulsing ? 'animate-pulse-block' : ''}`}
      onAnimationEnd={onPulseEnd}
    >
      <PromptLine input={execution.input} />

      {outcome.status === 'output' ? (
        <CommandOutput output={outcome.output} />
      ) : (
        <p
          className={`text-ui ${message.tone === 'error' ? 'text-error' : 'text-dim'}`}
        >
          {message.text}
        </p>
      )}
    </Stack>
  )
}
