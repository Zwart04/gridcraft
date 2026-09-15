'use client'

import { LangProvider } from '@/lib/lang'
import { StoreProvider } from '@/lib/store'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <StoreProvider>
        {children}
        <Toaster />
      </StoreProvider>
    </LangProvider>
  )
}
