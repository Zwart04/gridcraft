'use client'
import { useApp } from '@/lib/store'
import { useLang } from '@/lib/lang'
import { t } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { BarChart3, Play, Download, Timer } from 'lucide-react'

export default function DashboardPage() {
  const { lang } = useLang()
  const { levelsCreated, levelsPlayed, exports: exportCount, sessionTime, recentActivity, financeEntries } = useApp()
  const [pageviewCount, setPageviewCount] = useState(0)
  const t_ = lang === 'en' ? t.en : t.id
  const k = t_.dashboard

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = parseInt(localStorage.getItem('gc_pageviews') || '0')
      setPageviewCount(stored + 1)
      localStorage.setItem('gc_pageviews', String(stored + 1))
    }
  }, [])

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    return `${h}h ${m}m ${sec}s`
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{k.title}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border rounded-xl bg-card">
          <BarChart3 className="w-5 h-5 text-primary mb-2" />
          <div className="text-sm text-muted-foreground mb-1">{k.levels}</div>
          <div className="text-2xl font-bold">{levelsCreated}</div>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <Play className="w-5 h-5 text-primary mb-2" />
          <div className="text-sm text-muted-foreground mb-1">{k.played}</div>
          <div className="text-2xl font-bold">{levelsPlayed}</div>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <Download className="w-5 h-5 text-primary mb-2" />
          <div className="text-sm text-muted-foreground mb-1">{k.exports}</div>
          <div className="text-2xl font-bold">{exportCount}</div>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <Timer className="w-5 h-5 text-primary mb-2" />
          <div className="text-sm text-muted-foreground mb-1">{k.session}</div>
          <div className="text-2xl font-bold">{formatDuration(sessionTime)}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-xl bg-card">
          <h2 className="font-semibold mb-3">Level Creation Trend</h2>
          <div className="h-48 flex items-end gap-2">
            {[2, 5, 3, 8, 6, 11].map((v, i) => (
              <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${v * 8}px` }}>
                <div className="text-xs text-center mt-1 text-muted-foreground">{v}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].map((w, i) => <span key={i}>{w}</span>)}
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card">
          <h2 className="font-semibold mb-3">Difficulty Distribution</h2>
          <div className="flex h-48 gap-1">
            <div className="bg-blue-500 rounded-l" style={{ width: '40%' }}></div>
            <div className="bg-green-500" style={{ width: '35%' }}></div>
            <div className="bg-yellow-500" style={{ width: '20%' }}></div>
            <div className="bg-red-500 rounded-r" style={{ width: '5%' }}></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Easy 40%</span><span>Med 35%</span><span>Hard 20%</span><span>Custom 5%</span>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-card">
        <h2 className="font-semibold mb-3">Session Heatmap</h2>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="aspect-square rounded bg-muted/50" style={{ backgroundColor: `rgba(59, 130, 246, ${0.1 + Math.random() * 0.8})` }}></div>
          ))}
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-card">
        <h2 className="font-semibold mb-3">Traffic Sources (Attribution)</h2>
        <p className="text-xs text-muted-foreground mb-3">{t_.analytics.sourceNote}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Direct</span><span className="font-mono">65%</span></div>
          <div className="flex justify-between"><span>utm_source=github</span><span className="font-mono">20%</span></div>
          <div className="flex justify-between"><span>utm_source=twitter</span><span className="font-mono">10%</span></div>
          <div className="flex justify-between"><span>Other</span><span className="font-mono">5%</span></div>
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-card">
        <h2 className="font-semibold mb-3">{k.finance}</h2>
        {financeEntries.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">{k.emptyJournal}</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-auto">
            {financeEntries.slice(0, 5).map((e) => (
              <div key={e.id} className="flex justify-between text-sm py-1 border-b">
                <span>{e.detail}</span>
                <span className="font-mono">${e.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
