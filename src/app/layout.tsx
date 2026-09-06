import type { Metadata } from 'next'
import { Atkinson_Hyperlegible, JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/lib/theme'

import './globals.css'

/*
  next/font serves these from our own origin, so there is no runtime request to
  Google. Atkinson Hyperlegible rather than the newer Next, because next/font has
  no fallback metrics for Next and the prose shifts while it loads.
*/
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const ui = Atkinson_Hyperlegible({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-atkinson',
  display: 'swap',
})

/* Blocking on purpose: deferring it would show the default palette first. */
const applyStoredTheme = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t)document.documentElement.dataset.theme=t}catch(e){}`

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
}

type RootLayoutProps = {
  children: ReactNode
}

/* suppressHydrationWarning on <html> for the script above, and on <body> for
   extensions like ColorZilla. React names both as the only defensible uses. */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={`${mono.variable} ${ui.variable}`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="h-dvh overflow-hidden bg-wall p-0 sm:p-desk"
      >
        <script dangerouslySetInnerHTML={{ __html: applyStoredTheme }} />
        <TooltipProvider delay={800}>{children}</TooltipProvider>
      </body>
    </html>
  )
}
