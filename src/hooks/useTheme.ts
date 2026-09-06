'use client'

import { useCallback, useSyncExternalStore } from 'react'

import type { ThemeName } from '@/lib/theme'
import { THEMES } from '@/lib/theme'
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/lib/theme'

export function isThemeName(value: unknown): value is ThemeName {
  return (THEMES as readonly unknown[]).includes(value)
}

/*
  data-theme on <html> is the source of truth, not React state, because a script
  sets it before first paint. Subscribing means the writer sets it and every
  reader follows, with no cascading render on mount.
*/
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)

  observer.observe(document.documentElement, {
    attributeFilter: ['data-theme'],
  })

  return () => observer.disconnect()
}

function getSnapshot(): ThemeName {
  const current = document.documentElement.dataset['theme']

  return isThemeName(current) ? current : DEFAULT_THEME
}

function getServerSnapshot(): ThemeName {
  return DEFAULT_THEME
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setTheme = useCallback((next: ThemeName) => {
    document.documentElement.dataset['theme'] = next

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      /* Blocked storage. The theme still applies for this page. */
    }
  }, [])

  return { theme, setTheme }
}
