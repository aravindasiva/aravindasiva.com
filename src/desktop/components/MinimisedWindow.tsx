import { Folder } from 'lucide-react'
import type { Ref } from 'react'

import { Row } from '@/components/Row'
import { WindowLight } from '@/components/WindowLight'
import { PROMPT_PATH } from '@/lib/site'

type MinimisedWindowProps = {
  onRestore: () => void
  onClose: () => void
  ref?: Ref<HTMLDivElement>
  restoreRef?: Ref<HTMLButtonElement>
}

/*
  The window rolled up to its own title bar, the way classic Mac OS WindowShade
  did, parked in the corner the genie funnels into.

  Two lights, not three: the window is already minimised, so a minimise button
  here would be a control that does nothing. They sit in their own gapless row,
  as in the title bar, so they keep the same 24px pitch and do not read as a
  missing middle light.
*/
export function MinimisedWindow({
  onRestore,
  onClose,
  ref,
  restoreRef,
}: MinimisedWindowProps) {
  return (
    <Row
      ref={ref}
      gap="base"
      className="absolute right-desk bottom-desk h-titlebar w-60 overflow-hidden rounded-window border border-line bg-chrome px-3 shadow-window"
    >
      <div className="group/lights flex flex-none">
        <WindowLight
          tone="bg-light-close"
          label="Close terminal"
          glyph="✕"
          onPress={onClose}
        />
        <WindowLight
          tone="bg-light-fullscreen"
          label="Reopen terminal"
          glyph="⤢"
          onPress={onRestore}
        />
      </div>

      <button
        ref={restoreRef}
        type="button"
        onClick={onRestore}
        aria-label="Reopen terminal"
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      >
        <Folder aria-hidden className="size-3.5 flex-none text-dim" />
        <span className="truncate text-micro text-dim">{PROMPT_PATH}</span>
      </button>
    </Row>
  )
}
