import { Stack } from '@/components/Stack'
import type { HelpEntry } from '@/commands/types'

type HelpOutputProps = {
  entries: HelpEntry[]
}

export function HelpOutput({ entries }: HelpOutputProps) {
  return (
    <Stack gap="none" className="text-ui">
      {entries.map((entry) => (
        <div key={entry.name} className="flex gap-3">
          <span aria-hidden className="w-4 flex-none text-accent">
            {entry.glyph}
          </span>
          <span className="w-28 flex-none text-fg">{entry.name}</span>
          <span className="min-w-0 text-dim">{entry.summary}</span>
        </div>
      ))}
    </Stack>
  )
}
