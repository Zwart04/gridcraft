import type { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'

export function AppProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem>{children}</ThemeProvider>
}
