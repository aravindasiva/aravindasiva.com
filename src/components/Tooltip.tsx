'use client'

import type { ReactElement, ReactNode } from 'react'

import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type TooltipProps = {
  content: ReactNode
  children: ReactElement
  side?: 'top' | 'bottom' | 'left' | 'right'
}

/*
  Children must be one interactive element: the render prop merges trigger
  behaviour onto the real control. The vendored content bakes in an arrow and a
  high-contrast chip, both overridden here rather than by editing registry output.
*/
export function Tooltip({ content, children, side = 'bottom' }: TooltipProps) {
  return (
    <TooltipRoot>
      <TooltipTrigger render={children} />
      <TooltipContent
        side={side}
        sideOffset={6}
        className="rounded border border-line bg-chrome px-2 py-1 text-micro text-fg shadow-none [&>*:last-child]:hidden"
      >
        {content}
      </TooltipContent>
    </TooltipRoot>
  )
}
