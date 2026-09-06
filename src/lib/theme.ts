/* A palette is not a command's concept, so the theme command imports this. */
export const THEMES = ['midnight', 'nocturne', 'daylight'] as const

export type ThemeName = (typeof THEMES)[number]

export const DEFAULT_THEME: ThemeName = 'midnight'

export const THEME_STORAGE_KEY = 'theme'

export function isThemeName(value: unknown): value is ThemeName {
  return (THEMES as readonly unknown[]).includes(value)
}

export function nextTheme(current: ThemeName): ThemeName {
  return THEMES[(THEMES.indexOf(current) + 1) % THEMES.length] ?? current
}
