import type { ComponentProps } from 'react'

import type { Gap } from '@/lib/layout'
import { GAP } from '@/lib/layout'

type StackProps = ComponentProps<'div'> & {
  gap?: Gap
  /* Placement only: flex-1, min-h-0, overflow. Never spacing. */
  className?: string
}

export function Stack({ gap = 'base', className = '', ...props }: StackProps) {
  return <div className={`flex flex-col ${GAP[gap]} ${className}`} {...props} />
}
