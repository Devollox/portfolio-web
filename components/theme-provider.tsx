'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider> & {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
