'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { resolve } from '@/interpreter/resolve'
import { usePointerFine } from '@/hooks/usePointerFine'
import { useTheme } from '@/hooks/useTheme'

import { CommandPalette } from './components/CommandPalette'
import { Prompt } from './components/Prompt'
import { Scrollback } from './components/Scrollback'
import { TitleBar } from './components/TitleBar'
import type { Execution } from './helpers/executionLog'
import {
  appendExecution,
  blockKeyFor,
  visibleExecutions,
} from './helpers/executionLog'
import { responseMessage } from './helpers/responseMessage'
import { withViewTransition } from './helpers/withViewTransition'

type TerminalProps = {
  visible: boolean
  fullscreen: boolean
  onMinimise: () => void
  onClose: () => void
  onToggleFullscreen: () => void
}

/*
  The only door into the shell. The nav, the chips, the palette, the theme control
  and the prompt all call `run`, so a nav click echoes exactly the block that
  typing the command would.
*/
export function Terminal({
  visible,
  fullscreen,
  onMinimise,
  onClose,
  onToggleFullscreen,
}: TerminalProps) {
  const { theme, setTheme } = useTheme()
  const pointerFine = usePointerFine()
  const [log, setLog] = useState<Execution[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [announcement, setAnnouncement] = useState('')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [pulsedId, setPulsedId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const run = useCallback(
    (raw: string) => {
      const outcome = resolve(raw, { theme })

      if (!outcome) return

      const input = raw.trim().replace(/\s+/g, ' ')

      setHistory((previous) => [...previous, input])

      /* Safe here and nowhere else: a palette swap snapshots the whole viewport,
         so nothing can escape a scroll container's clip. */
      if (outcome.status === 'effect' && outcome.effect.kind === 'theme') {
        const next = outcome.effect.theme
        withViewTransition(() => setTheme(next))
      }

      setLog((previous) => appendExecution(previous, input, outcome))
      setPulsedId(blockKeyFor(outcome))
      setAnnouncement(responseMessage(outcome).text)

      if (pointerFine) inputRef.current?.focus()
    },
    [theme, setTheme, pointerFine],
  )

  /* Focus follows the window back, but never on touch, where it summons a keyboard. */
  useEffect(() => {
    if (visible && pointerFine) inputRef.current?.focus()
  }, [visible, pointerFine])

  useEffect(() => {
    if (!visible) return

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key.toLowerCase() !== 'k') return
      if (!event.metaKey && !event.ctrlKey) return

      event.preventDefault()
      setPaletteOpen((open) => !open)
    }

    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [visible])

  const clearPulse = useCallback(() => setPulsedId(null), [])

  /* Memoised because Scrollback scrolls to the end whenever this changes identity,
     and a fresh array every render would drag the view down on any state change. */
  const executions = useMemo(() => visibleExecutions(log), [log])

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden bg-surface ${
        fullscreen ? '' : 'sm:rounded-window sm:border sm:border-line'
      }`}
    >
      <TitleBar
        theme={theme}
        fullscreen={fullscreen}
        windowControls={pointerFine}
        onRun={run}
        onOpenPalette={() => setPaletteOpen(true)}
        onMinimise={onMinimise}
        onClose={onClose}
        onToggleFullscreen={onToggleFullscreen}
      />
      <Scrollback
        executions={executions}
        pulsedId={pulsedId}
        onPulseEnd={clearPulse}
      />
      <Prompt history={history} onRun={run} inputRef={inputRef} />

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onRun={run}
      />

      {/* One polite line for the whole shell. */}
      <p aria-live="polite" aria-atomic className="sr-only">
        {announcement}
      </p>
    </div>
  )
}
