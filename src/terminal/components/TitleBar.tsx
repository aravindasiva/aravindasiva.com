import { Folder } from 'lucide-react'

import type { ThemeName } from '@/lib/theme'
import { Row } from '@/components/Row'
import { PROMPT_PATH } from '@/lib/site'

import { MenuButton } from './MenuButton'
import { NavItems } from './NavItems'
import { ThemeControl } from './ThemeControl'
import { TrafficLights } from './TrafficLights'

type TitleBarProps = {
  theme: ThemeName
  fullscreen: boolean
  windowControls: boolean
  onRun: (input: string) => void
  onOpenPalette: () => void
  onMinimise: () => void
  onClose: () => void
  onToggleFullscreen: () => void
}

export function TitleBar({
  theme,
  fullscreen,
  windowControls,
  onRun,
  onOpenPalette,
  onMinimise,
  onClose,
  onToggleFullscreen,
}: TitleBarProps) {
  return (
    <Row
      gap="base"
      className="h-titlebar flex-none border-b border-line bg-chrome px-3"
    >
      <TrafficLights
        interactive={windowControls}
        fullscreen={fullscreen}
        onClose={onClose}
        onMinimise={onMinimise}
        onToggleFullscreen={onToggleFullscreen}
      />

      <Row gap="snug" className="min-w-0">
        <Folder aria-hidden className="size-3.5 flex-none text-dim" />
        <span className="truncate text-micro text-dim">{PROMPT_PATH}</span>
      </Row>

      <div className="flex-1" />

      <NavItems onRun={onRun} />
      <MenuButton onOpen={onOpenPalette} />
      <ThemeControl theme={theme} onRun={onRun} />
    </Row>
  )
}
