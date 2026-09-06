import { useEffect, useRef } from 'react'

import { Stack } from '@/components/Stack'

import type { Execution } from '../helpers/executionLog'
import { Block } from './Block'

type ScrollbackProps = {
  executions: Execution[]
  pulsedId: string | null
  onPulseEnd: () => void
}

/*
  Plain overflow, not a scroll-area primitive, whose viewport is not focusable.
  Focusable and labelled here because Chrome grants that to overflow containers
  and Firefox and Safari do not. Not a live region: a long listing read aloud in
  full is worse than silence, so announcements go through the shell's status line.
*/
export function Scrollback({
  executions,
  pulsedId,
  onPulseEnd,
}: ScrollbackProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [executions])

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Scrollback"
      className="min-h-0 flex-1 overflow-y-auto px-gutter py-gutter focus-visible:inset-ring-2 focus-visible:inset-ring-accent focus-visible:outline-none"
    >
      <Stack gap="block">
        {executions.map((execution) => (
          <Block
            key={execution.id}
            execution={execution}
            pulsing={pulsedId === execution.id}
            onPulseEnd={onPulseEnd}
          />
        ))}
        <div ref={endRef} />
      </Stack>
    </div>
  )
}
