'use client'

import { SquareTerminal } from 'lucide-react'
import { useCallback, useEffect, useReducer, useRef } from 'react'

import { Terminal } from '@/terminal/Terminal'

import { DesktopIcon } from './components/DesktopIcon'
import { MinimisedWindow } from './components/MinimisedWindow'
import { Wallpaper } from './components/Wallpaper'
import { playGenie } from './helpers/playGenie'
import type { WindowAction } from './helpers/windowState'
import { motionFor, OPEN_WINDOW, windowReducer } from './helpers/windowState'

const TERMINAL = 'terminal'

/*
  Minimise and restore are played on the live frame by playGenie, so the frame's
  CSS never animates into or out of minimised. Its own motion is only the
  fullscreen resize and the close fade.
*/
const FRAME = {
  open: 'transition-[inset,opacity,scale] duration-300 ease-win',
  minimised: 'invisible pointer-events-none',
  closed:
    'invisible pointer-events-none scale-95 opacity-0 transition-[opacity,scale,visibility] duration-300 ease-win',
}

export function Desktop() {
  const [windowState, dispatch] = useReducer(windowReducer, OPEN_WINDOW)
  const frameRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLButtonElement>(null)
  const iconRef = useRef<HTMLButtonElement>(null)
  const { mode } = windowState
  const fullscreen = windowState.mode === 'open' && windowState.fullscreen

  /* The one door for window changes, as run() is for the shell. */
  const act = useCallback(
    (action: WindowAction) => {
      const motion = motionFor(windowState, action)
      const frame = frameRef.current

      if (motion && frame) {
        playGenie(
          motion,
          frame,
          () => stripRef.current,
          () => dispatch(action),
        )
      } else {
        dispatch(action)
      }
    },
    [windowState],
  )

  const open = useCallback(() => act({ type: 'open' }), [act])

  useEffect(() => {
    if (mode === 'open') return

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') open()
    }

    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mode, open])

  /* Focus follows whatever just appeared, so Enter is always the way back in. */
  useEffect(() => {
    if (mode === 'minimised') restoreRef.current?.focus()
    if (mode === 'closed') iconRef.current?.focus()
  }, [mode])

  return (
    <div data-window={mode} className="relative h-dvh overflow-hidden bg-wall">
      <Wallpaper />

      <div
        inert={mode === 'open'}
        className="flex h-full flex-col items-start gap-4 p-gutter"
      >
        <DesktopIcon
          ref={iconRef}
          icon={SquareTerminal}
          label={TERMINAL}
          onOpen={open}
        />
        {/* --fg, not --dim: measured, --dim clears 4.5:1 on no theme's wall. */}
        <p className="mt-auto w-full text-center text-micro text-fg">
          double-click the icon, or press Enter, to open the terminal
        </p>
      </div>

      {mode === 'minimised' ? (
        <MinimisedWindow
          ref={stripRef}
          restoreRef={restoreRef}
          onRestore={open}
          onClose={() => act({ type: 'close' })}
        />
      ) : null}

      <div
        ref={frameRef}
        className={`absolute origin-bottom-right shadow-window ${
          fullscreen ? 'inset-0' : 'inset-0 sm:inset-desk'
        } ${FRAME[mode]}`}
      >
        <div inert={mode !== 'open'} className="h-full">
          <Terminal
            visible={mode === 'open'}
            fullscreen={fullscreen}
            onMinimise={() => act({ type: 'minimise' })}
            onClose={() => act({ type: 'close' })}
            onToggleFullscreen={() => act({ type: 'toggleFullscreen' })}
          />
        </div>
      </div>
    </div>
  )
}
