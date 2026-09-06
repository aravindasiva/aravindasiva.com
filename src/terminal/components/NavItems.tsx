import { NAV_COMMANDS } from '@/interpreter/allCommands'
import { Tooltip } from '@/components/Tooltip'

type NavItemsProps = {
  onRun: (input: string) => void
}

/* Buttons only while no command has a route. Once the routes exist these become
   <a href>, so the site is crawlable and works with JavaScript off. */
export function NavItems({ onRun }: NavItemsProps) {
  return (
    <nav aria-label="Commands" className="hidden flex-none gap-1 md:flex">
      {NAV_COMMANDS.map((command) => (
        <Tooltip key={command.name} content={command.summary}>
          <button
            type="button"
            onClick={() => onRun(command.name)}
            aria-label={`${command.name}: ${command.summary}`}
            className="flex flex-none cursor-pointer items-center gap-1 rounded px-2 py-1 text-ui whitespace-nowrap text-dim transition-colors hover:bg-card hover:text-bright"
          >
            <span aria-hidden className="text-accent">
              {command.glyph}
            </span>
            {command.hideNavLabel ? null : <span>{command.name}</span>}
          </button>
        </Tooltip>
      ))}
    </nav>
  )
}
