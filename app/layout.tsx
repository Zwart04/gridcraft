import '@/app/globals.css'
import { StoreProvider } from '@/lib/store'
import { LangProvider } from '@/lib/lang'

export const metadata = {
  title: 'GridCraft — Collaborative Grid Editor',
  description: 'Build game levels together in real-time. AI suggestions, GPU simulation, and export pipeline.',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <StoreProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
