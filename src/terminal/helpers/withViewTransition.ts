import { flushSync } from 'react-dom'

/*
  flushSync is required: startViewTransition snapshots the DOM after its callback
  returns, and a batched React update would not have landed yet.

  Only safe for changes that repaint the whole viewport. Naming an element inside
  a scroll container leaks its snapshot past the container's clip.
*/
export function withViewTransition(update: () => void) {
  const supported =
    typeof document !== 'undefined' &&
    typeof document.startViewTransition === 'function'

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!supported || reduced) {
    update()
    return
  }

  document.startViewTransition(() => {
    flushSync(update)
  })
}
