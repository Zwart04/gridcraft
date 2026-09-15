import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">About</h1>
      <div className="p-4 border rounded-xl bg-card space-y-4">
        <div>
          <h2 className="font-semibold mb-1">Version</h2>
          <p className="text-sm text-muted-foreground">1.0.0</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Tech Stack</h2>
          <p className="text-sm text-muted-foreground">
            Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + Recharts + lucide-react
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Attribution</h2>
          <p className="text-sm text-muted-foreground">
            Source tracked via UTM/URL params and localStorage.source, charted in
            the /analytics tab. No third-party trackers (no Pixel, no GA).
          </p>
        </div>
        <div className="flex items-center gap-4 pt-2">
          <Button asChild>
            <a
              href="https://github.com/Zwart04/gridcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Github size={16} className="mr-2" />
              View on GitHub
            </a>
          </Button>
          <Button asChild>
            <a
              href="https://gridcraft.zwart.qzz.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Open App
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
