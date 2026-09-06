import { Menu } from 'lucide-react'

import { Tooltip } from '@/components/Tooltip'

type MenuButtonProps = {
  onOpen: () => void
}

/* Replaces the nav on small screens, rather than shrinking labels into glyphs. */
export function MenuButton({ onOpen }: MenuButtonProps) {
  return (
    <Tooltip content="all commands">
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open all commands"
        className="flex size-7 flex-none cursor-pointer items-center justify-center rounded text-dim transition-colors hover:bg-card hover:text-bright md:hidden"
      >
        <Menu aria-hidden className="size-4" />
      </button>
    </Tooltip>
  )
}
