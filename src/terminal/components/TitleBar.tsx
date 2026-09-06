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
  onRun: (input: string) => void
  onOpenPalette: () => void
}

export function TitleBar({ theme, onRun, onOpenPalette }: TitleBarProps) {
  return (
    <Row
      gap="base"
      className="h-titlebar flex-none border-b border-line bg-chrome px-3"
    >
      <TrafficLights />

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
