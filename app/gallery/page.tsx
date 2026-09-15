'use client'
import { useApp } from '@/lib/store'
import { useLang } from '@/lib/lang'
import { t } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function GalleryPage() {
  const { lang } = useLang()
  const { galleryLevels, addGalleryLevel } = useApp()
  const [search, setSearch] = useState('')
  const [filterDiff, setFilterDiff] = useState('all')
  const [filterSize, setFilterSize] = useState('all')
  const t_ = lang === 'en' ? t.en : t.id
  const k = t_.gallery

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gc_gallery_levels')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach((level: any) => addGalleryLevel(level))
          }
        } catch {}
      }
    }
  }, [])

  const levels = galleryLevels.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase())
    const matchDiff = filterDiff === 'all' || l.difficulty === filterDiff
    const matchSize = filterSize === 'all' || String(l.size) === filterSize
    return matchSearch && matchDiff && matchSize
  })

  const handleExport = (level: any) => {
    const data = { grid: level.grid, name: level.name, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${level.name}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = (level: any) => {
    const encoded = btoa(JSON.stringify({ grid: level.grid, name: level.name }))
    const url = `${window.location.origin}/gallery/${level.id}?data=${encoded}`
    navigator.clipboard.writeText(url).catch(() => prompt('Salin link:', url))
  }

  const handleLike = (level: any) => {
    level.liked += 1
    localStorage.setItem('gc_gallery_levels', JSON.stringify(galleryLevels))
  }

  const sampleLevels = [
    { id: '1', name: 'First Quest', difficulty: 'easy', size: 16, creator: 'Guest', played: 42, liked: 12, grid: Array.from({ length: 16 }, () => Array(16).fill('floor')), time: '2026-09-15T10:00:00Z' },
    { id: '2', name: 'Maze Runner', difficulty: 'medium', size: 24, creator: 'Guest', played: 128, liked: 34, grid: Array.from({ length: 24 }, () => Array(24).fill('floor')), time: '2026-09-14T15:00:00Z' },
    { id: '3', name: 'Spike Fortress', difficulty: 'hard', size: 32, creator: 'Guest', played: 89, liked: 21, grid: Array.from({ length: 32 }, () => Array(32).fill('floor')), time: '2026-09-13T08:00:00Z' },
  ]

  const displayLevels = levels.length > 0 ? levels : sampleLevels

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{k.title}</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder={k.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-10 px-4 rounded-md border bg-background"
        />
        <select value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)} className="h-10 px-4 rounded-md border bg-background">
          <option value="all">{k.difficulty} (semua)</option>
          <option value="easy">Mudah</option>
          <option value="medium">Sedang</option>
          <option value="hard">Sulit</option>
        </select>
        <select value={filterSize} onChange={(e) => setFilterSize(e.target.value)} className="h-10 px-4 rounded-md border bg-background">
          <option value="all">{k.size} (semua)</option>
          <option value="16">16x16</option>
          <option value="24">24x24</option>
          <option value="32">32x32</option>
          <option value="48">48x48</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayLevels.map((level) => (
          <div key={level.id} className="p-4 border rounded-xl bg-card hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold truncate">{level.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{level.difficulty}</span>
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              {k.creator}: {level.creator} | {k.size}: {level.size}x{level.size}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span>{k.played}: {level.played}</span>
              <span>{k.liked}: {level.liked}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleShare(level)}>{k.share}</Button>
              <Button size="sm" variant="outline" onClick={() => handleExport(level)}>{t_.editor.exportJson}</Button>
              <Button size="sm" variant="outline" onClick={() => handleLike(level)}>{k.like}</Button>
              <Button size="sm" asChild>
                <a href={`/editor?load=${level.id}`}>{k.edit}</a>
              </Button>
            </div>
          </div>
        ))}
      </div>
      {displayLevels.length === 0 && (
        <p className="text-center text-muted-foreground py-12">{k.empty}</p>
      )}
    </div>
  )
}
