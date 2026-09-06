import { useState } from 'react'
import type { KeyboardEvent, RefObject } from 'react'

import { completion } from '@/interpreter/completion'
import { CHIP_COMMANDS } from '@/interpreter/allCommands'
import { Row } from '@/components/Row'
import { Stack } from '@/components/Stack'

import { PromptLine } from './PromptLine'

type PromptProps = {
  history: string[]
  onRun: (input: string) => void
  inputRef: RefObject<HTMLInputElement | null>
}

/*
  Right arrow accepts the completion, as fish does. Tab is left alone, because
  capturing it would make the prompt a keyboard trap.

  The caret is drawn, since caret-shape has not shipped anywhere. It stands in
  only while the field is empty and sits where the first character will land, so
  typing replaces it. Hollow when unfocused, the convention every terminal uses.
*/
export function Prompt({ history, onRun, inputRef }: PromptProps) {
  const [value, setValue] = useState('')
  const [recalled, setRecalled] = useState<number | null>(null)
  const [focused, setFocused] = useState(false)

  const isEmpty = value === ''
  const suggestion = completion(value)
  const ghost = suggestion?.slice(value.trimStart().length) ?? ''

  function recall(step: number) {
    if (history.length === 0) return

    const from = recalled ?? history.length
    const index = Math.min(Math.max(from + step, 0), history.length)

    setRecalled(index === history.length ? null : index)
    setValue(index === history.length ? '' : (history[index] ?? ''))
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onRun(value)
      setValue('')
      setRecalled(null)
      return
    }

    /* The resting hint promises the arrow does something. */
    if (event.key === 'ArrowRight' && isEmpty) {
      event.preventDefault()
      onRun('help')
      return
    }

    /* Only at end of line, so it still moves the caret inside text. */
    if (event.key === 'ArrowRight' && suggestion) {
      const field = event.currentTarget
      const atEnd =
        field.selectionStart === value.length &&
        field.selectionEnd === value.length

      if (atEnd) {
        event.preventDefault()
        setValue(suggestion)
      }

      return
    }

    if (event.key === 'Escape') {
      setValue('')
      setRecalled(null)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      recall(-1)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      recall(1)
    }
  }

  return (
    <div className="flex-none border-t border-line bg-surface px-gutter py-3">
      <Stack gap="snug">
        <Row gap="snug" className="min-w-0">
          <PromptLine />

          <span className="relative flex min-w-0 flex-1 items-center">
            <label className="sr-only" htmlFor="prompt">
              Type a command
            </label>
            <input
              id="prompt"
              ref={inputRef}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-describedby={ghost ? 'prompt-completion' : undefined}
              className={`w-full bg-transparent text-ui text-bright outline-none ${
                isEmpty ? 'caret-transparent' : 'caret-accent'
              }`}
            />

            {isEmpty ? (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 flex min-w-0 items-center gap-2"
              >
                <span
                  className={`h-caret-h w-caret-w flex-none ${
                    focused
                      ? 'animate-caret bg-accent'
                      : 'border border-accent bg-transparent'
                  }`}
                />
                <span className="truncate text-ui whitespace-nowrap text-dim">
                  type a command
                  <span className="hidden sm:inline">, or press →</span>
                </span>
              </span>
            ) : null}

            {ghost ? (
              <span
                id="prompt-completion"
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-ui whitespace-pre"
              >
                <span className="invisible">{value}</span>
                <span className="text-dim">{ghost}</span>
              </span>
            ) : null}
          </span>
        </Row>

        <Row gap="tight" className="min-w-0 flex-wrap justify-between">
          <Row gap="tight" className="flex-wrap">
            {CHIP_COMMANDS.map((command) => (
              <button
                key={command.name}
                type="button"
                onClick={() => onRun(command.name)}
                className="cursor-pointer rounded-full border border-line px-3 py-1 text-micro text-dim transition-colors hover:border-accent hover:text-accent"
              >
                {command.name}
              </button>
            ))}
          </Row>

          <span className="hidden flex-none text-micro text-dim sm:block">
            ⌘ + K for all commands
          </span>
        </Row>
      </Stack>
    </div>
  )
}
