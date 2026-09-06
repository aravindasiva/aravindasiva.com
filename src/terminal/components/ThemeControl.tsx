import { Moon, MoonStar, Sun } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { ThemeName } from '@/lib/theme'
import { Tooltip } from '@/components/Tooltip'

/* Two moons then a sun: nocturne is the deeper night, not a different idea. */
const THEME_ICON: Record<ThemeName, LucideIcon> = {
  midnight: Moon,
  nocturne: MoonStar,
  daylight: Sun,
}

type ThemeControlProps = {
  theme: ThemeName
  onRun: (input: string) => void
}

/* Dispatches the command rather than setting state, so the two cannot drift.
   The accessible name says which palette is active, because a bare cycling
   control leaves a screen reader user cycling blind. */
export function ThemeControl({ theme, onRun }: ThemeControlProps) {
  const Icon = THEME_ICON[theme]

  return (
    <Tooltip content="switch theme">
      <button
        type="button"
        onClick={() => onRun('theme')}
        aria-label={`Switch theme. Current theme is ${theme}`}
        className="flex size-7 flex-none cursor-pointer items-center justify-center rounded text-accent transition-colors hover:bg-card"
      >
        <Icon aria-hidden className="size-3.5" />
      </button>
    </Tooltip>
  )
}
