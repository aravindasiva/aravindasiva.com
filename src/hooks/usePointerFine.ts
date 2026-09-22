'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(pointer: fine)'

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY)

  media.addEventListener('change', onChange)

  return () => media.removeEventListener('change', onChange)
}

/*
  False on the server, so a phone never renders a control that only makes sense
  with a cursor. Window management, hover reveal and focus-on-click are all
  gated on this: a touch device has no window to minimise, nothing behind it,
  and no way to hover.
*/
export function usePointerFine() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
