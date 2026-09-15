import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "GridCraft — Collaborative Grid Game Editor",
  description: "Edit game levels together in real-time on a shared grid. AI-powered suggestions, GPU-accelerated simulation, and export to PNG, JSON, or WebM.",
  icons: { icon: "/icon.svg" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
