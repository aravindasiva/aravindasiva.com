import type { ComponentProps } from 'react'

import type { Align, Gap } from '@/lib/layout'
import { ALIGN, GAP } from '@/lib/layout'

type RowProps = ComponentProps<'div'> & {
  gap?: Gap
  align?: Align
  /* Placement only: flex-1, min-w-0, overflow. Never spacing. */
  className?: string
}

export function Row({
  gap = 'base',
  align = 'center',
  className = '',
  ...props
}: RowProps) {
  return (
    <div
      className={`flex ${ALIGN[align]} ${GAP[gap]} ${className}`}
      {...props}
    />
  )
}
