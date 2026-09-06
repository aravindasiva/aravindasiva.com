import { PROMPT_PATH } from '@/lib/site'

type PromptLineProps = {
  input?: string
}

/* Costume, not state. The arrow borrows the secret colour as a quiet hint. */
export function PromptLine({ input }: PromptLineProps) {
  return (
    <span className="flex flex-none items-baseline gap-2 text-ui">
      <span className="font-bold text-secret">❯</span>
      <span className="font-bold text-accent">{PROMPT_PATH}</span>
      <span className="hidden text-meta sm:inline">git:(main)</span>
      {input ? <span className="text-bright">{input}</span> : null}
    </span>
  )
}
