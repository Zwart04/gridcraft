import { Button } from '@/components/ui/button'
import { Sparkles, Eye, GitBranch, History, Download, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">GridCraft</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Build game levels together in real-time. AI suggestions, GPU simulation, and export pipeline.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/editor">Open Editor</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/gallery">View Gallery</Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
        {[
          { icon: Sparkles, title: 'AI Level Suggestion', desc: 'Mock LLM heuristic analyzes your grid and suggests balance improvements, symmetry, and flow optimization.' },
          { icon: Eye, title: 'GPU Simulation', desc: 'Web Worker offscreen simulation runs AI player agent at 60fps without blocking the main thread.' },
          { icon: GitBranch, title: 'Collaborative Editing', desc: 'BroadcastChannel API syncs multi-tab edits in real-time with presence indicators.' },
          { icon: History, title: 'Version History', desc: 'Auto-save every 30s with full version timeline. Restore any previous state with diff highlight.' },
          { icon: Download, title: 'Export Pipeline', desc: 'Export as PNG (800x450 clean), JSON (shareable), or WebM animation — all from the editor.' },
          { icon: BarChart3, title: 'Analytics & Finance', desc: 'Recharts dashboard with trend, distribution, heatmap, and auto-finance journal on every export.' },
        ].map((f, i) => (
          <div key={i} className="p-6 border rounded-xl bg-card hover:border-primary/50 transition-colors">
            <f.icon className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
