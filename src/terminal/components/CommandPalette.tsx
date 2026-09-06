'use client'

import { ALL_COMMANDS } from '@/interpreter/allCommands'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRun: (input: string) => void
}

/*
  Two traps in the vendored primitives. CommandDialog supplies only the dialog,
  not the cmdk context, so children must be wrapped in Command or CommandInput
  throws. And cmdk writes data-selected on every item, "true" or "false", so the
  bare data-selected variant, which tests presence, highlights the whole list.
*/
export function CommandPalette({
  open,
  onOpenChange,
  onRun,
}: CommandPaletteProps) {
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Commands"
      description="Search for a command to run"
      className="border border-line bg-chrome"
    >
      <Command className="bg-transparent">
        <CommandInput placeholder="type a command" />
        <CommandList>
          <CommandEmpty>no such command</CommandEmpty>
          <CommandGroup>
            {ALL_COMMANDS.map((command) => (
              <CommandItem
                key={command.name}
                value={`${command.name} ${command.summary}`}
                onSelect={() => {
                  onRun(command.name)
                  onOpenChange(false)
                }}
                className="data-[selected=true]:bg-selected data-[selected=true]:text-bright"
              >
                <span aria-hidden className="w-4 text-accent">
                  {command.glyph}
                </span>
                <span className="text-fg">{command.name}</span>
                <span className="ml-auto text-micro text-dim">
                  {command.summary}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
