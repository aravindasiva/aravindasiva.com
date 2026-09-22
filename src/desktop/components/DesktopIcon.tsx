import type { LucideIcon } from 'lucide-react'
import type { KeyboardEvent, Ref } from 'react'

type DesktopIconProps = {
  icon: LucideIcon
  label: string
  onOpen: () => void
  ref?: Ref<HTMLButtonElement>
}

/*
  Selection is focus. That is why there is no selected state to hold and nothing to
  clear: pressing bare desktop blurs the icon and the highlight leaves with it.

  One press selects and only the second opens, so opening hangs off the keys and off
  dblclick, never off click. Safari will not focus a button on press, which would
  otherwise leave a mouse user with no visible selection at all.
*/
export function DesktopIcon({
  icon: Icon,
  label,
  onOpen,
  ref,
}: DesktopIconProps) {
  function openOnEnterOrSpace(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    onOpen()
  }

  return (
    <button
      ref={ref}
      type="button"
      onPointerDown={(event) => event.currentTarget.focus()}
      onDoubleClick={onOpen}
      onKeyDown={openOnEnterOrSpace}
      className="flex w-20 cursor-default flex-col items-center gap-2 rounded p-2 text-micro text-fg transition-colors select-none focus:bg-selected focus:text-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Icon aria-hidden className="size-8 text-accent" />
      {label}
    </button>
  )
}
