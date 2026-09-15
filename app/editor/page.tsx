'use client'
import { Button } from '@/components/ui/button'
import { useLang } from '@/lib/lang'
import { t } from '@/lib/i18n'
import { useEffect, useState, useRef } from 'react'
import { Sparkles, Play, RotateCcw, RotateCw, Download, Copy, Trash2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

type CellType = 'wall' | 'floor' | 'spike' | 'coin' | 'exit' | 'spawn' | 'hazard'

const CELL_COLORS: Record<CellType, string> = {
  wall: 'bg-gray-700 dark:bg-gray-600 border border-gray-600',
  floor: 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900',
  spike: 'bg-red-500 border border-red-700',
  coin: 'bg-yellow-400 border border-yellow-600',
  exit: 'bg-green-500 border border-green-700',
  spawn: 'bg-blue-500 border border-blue-700',
  hazard: 'bg-purple-500 border border-purple-700',
}

interface GridState {
  grid: CellType[][]
  selectedCell: CellType
  gridSize: number
  history: CellType[][][]
  historyIndex: number
  zoom: number
}

const DEFAULT_GRID: CellType[][] = Array.from({ length: 16 }, () => Array(16).fill('floor'))

function createEmptyGrid(size: number): CellType[][] {
  return Array.from({ length: size }, () => Array(size).fill('floor'))
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }

export default function EditorPage() {
  const { lang } = useLang()
  const t_ = lang === 'en' ? t.en : t.id
  const ed = t_.editor
  const [grid, setGrid] = useState<CellType[][]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gc_editor_grid')
      if (saved) { try { return JSON.parse(saved) } catch { return DEFAULT_GRID } }
    }
    return DEFAULT_GRID
  })
  const [selectedCell, setSelectedCell] = useState<CellType>('wall')
  const [gridSize, setGridSize] = useState(16)
  const [history, setHistory] = useState<CellType[][][]>([DEFAULT_GRID])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState<{ coins: number; deaths: number; time: number } | null>(null)
  const [aiSuggesting, setAiSuggesting] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<CellType[][] | null>(null)
  const [aiThrottle, setAiThrottle] = useState(0)
  const [usersOnline, setUsersOnline] = useState(0)
  const [shareUrl, setShareUrl] = useState('')
  const dragCellRef = useRef<CellType | null>(null)

  useEffect(() => {
    const ch = new BroadcastChannel('gc_collab')
    ch.onmessage = (e) => { if (e.data.type === 'cursor') setUsersOnline((u) => Math.max(1, u + 1)) }
    const id = setInterval(() => { try { localStorage.setItem('gc_editor_grid', JSON.stringify(grid)) } catch {} }, 30000)
    return () => { ch.close(); clearInterval(id) }
  }, [grid])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ch = new BroadcastChannel('gc_collab')
    ch.postMessage({ type: 'join' })
    setTimeout(() => ch.postMessage({ type: 'leave' }), 5000)
    setTimeout(() => setUsersOnline(1), 100)
    return () => ch.close()
  }, [])

  const pushHistory = (g: CellType[][]) => {
    const newHist = history.slice(0, historyIndex + 1)
    newHist.push(g.map(row => [...row]))
    setHistory(newHist.slice(-50))
    setHistoryIndex(newHist.length - 1)
  }

  const setCell = (r: number, c: number, type: CellType) => {
    setGrid(prev => {
      const next = prev.map(row => [...row])
      next[r][c] = type
      pushHistory(next)
      return next
    })
  }

  const undo = () => { if (historyIndex > 0) { setHistoryIndex(historyIndex - 1); setGrid(history[historyIndex - 1].map(r => [...r])) } }
  const redo = () => { if (historyIndex < history.length - 1) { setHistoryIndex(historyIndex + 1); setGrid(history[historyIndex + 1].map(r => [...r])) } }
  const clearGrid = () => { pushHistory(createEmptyGrid(gridSize)); setGrid(createEmptyGrid(gridSize)) }

  const simulate = () => {
    setSimulating(true); setSimResult(null)
    setTimeout(() => {
      let coins = 0, deaths = 0
      let pos: [number, number] | null = null
      const size = grid.length
      for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++)
          if (grid[r][c] === 'spawn') { pos = [r, c]; break }
      if (!pos) { setSimulating(false); return }
      let visited = new Set<string>()
      let steps = 0
      while (pos && steps < size * size * 2) {
        const [r, c] = pos
        const key = `${r},${c}`
        if (visited.has(key)) break
        visited.add(key)
        const cell = grid[r][c]
        if (cell === 'coin') coins++
        if (cell === 'spike' || cell === 'hazard') { deaths++; break }
        if (cell === 'exit') break
        const dirs: [number, number][] = [[0, 1], [1, 0], [0, -1], [-1, 0]]
        let moved = false
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited.has(`${nr},${nc}`) && grid[nr][nc] !== 'wall') {
            pos = [nr, nc]; moved = true; break
          }
        }
        if (!moved) break
        steps++
      }
      setSimResult({ coins, deaths, time: steps * 16 })
      setSimulating(false)
    }, 400)
  }

  const aiSuggestLevel = () => {
    if (aiThrottle > 0) return
    setAiSuggesting(true)
    setTimeout(() => {
      const suggested = grid.map(row => [...row])
      let coinCount = 0, wallCount = 0
      for (const row of grid)
        for (const cell of row) { if (cell === 'coin') coinCount++; if (cell === 'wall') wallCount++ }
      const size = grid.length
      if (coinCount < size * 0.1) {
        for (let i = 0; i < Math.min(3, size * size * 0.05); i++) {
          const r = Math.floor(Math.random() * size), c = Math.floor(Math.random() * size)
          if (suggested[r][c] === 'floor') suggested[r][c] = 'coin'
        }
      }
      if (wallCount < size * 0.05) {
        for (let i = 0; i < Math.min(2, size * 0.05); i++) {
          const r = Math.floor(Math.random() * size), c = Math.floor(Math.random() * size)
          if (suggested[r][c] === 'floor') suggested[r][c] = 'wall'
        }
      }
      setAiSuggestion(suggested)
      setAiSuggesting(false)
      setAiThrottle(30)
      const iv = setInterval(() => setAiThrottle((t) => Math.max(0, t - 1)), 1000)
      setTimeout(() => clearInterval(iv), 31000)
    }, 600)
  }

  const exportPNG = async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 800; canvas.height = 450
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 0, 80)
    grad.addColorStop(0, '#2563eb'); grad.addColorStop(1, '#7c3aed')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 800, 80)
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 28px sans-serif'; ctx.fillText('GridCraft Level', 20, 52)
    const size = grid.length
    const cellW = 760 / size, cellH = 340 / size
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++) {
        const x = 20 + c * cellW, y = 100 + r * cellH
        ctx.fillStyle = '#e5e7eb'; ctx.fillRect(x, y, cellW - 1, cellH - 1)
        ctx.strokeStyle = '#d1d5db'; ctx.strokeRect(x, y, cellW - 1, cellH - 1)
      }
    ctx.fillStyle = '#f0f0f0'
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++) {
        const x = 20 + c * cellW + cellW / 2, y = 100 + r * cellH + cellH / 2
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, 2 * Math.PI); ctx.fill()
      }
    const link = document.createElement('a')
    link.download = 'gridcraft-level.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const exportJSON = () => {
    const data = { grid, size: grid.length, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'gridcraft-level.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (data.grid && Array.isArray(data.grid)) { setGrid(data.grid); pushHistory(data.grid) }
      } catch {}
    }
    reader.readAsText(file)
  }

  const copyShareLink = async () => {
    const encoded = btoa(JSON.stringify({ grid, size: grid.length }))
    const url = `${window.location.origin}/editor?data=${encoded}`
    setShareUrl(url)
    try { await navigator.clipboard.writeText(url) } catch { prompt('Salin link:', url) }
  }

  const handleGridMouseDown = (r: number, c: number) => { dragCellRef.current = selectedCell; setCell(r, c, selectedCell) }
  const handleGridMouseEnter = (r: number, c: number) => { if (dragCellRef.current) setCell(r, c, dragCellRef.current) }
  const handleGridMouseUp = () => { dragCellRef.current = null }

  const renderCell = (type: CellType, r: number, c: number) => {
    const isActive = type === selectedCell
    return (
      <button
        key={`${r}-${c}`}
        onMouseDown={() => handleGridMouseDown(r, c)}
        onMouseEnter={() => handleGridMouseEnter(r, c)}
        onMouseUp={handleGridMouseUp}
        className={`w-full h-full rounded-sm transition-colors ${CELL_COLORS[type]} ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-400'}`}
        aria-label={`Cell ${r},${c} ${type}`}
      />
    )
  }

  const cellTypes: CellType[] = ['wall', 'floor', 'spike', 'coin', 'exit', 'spawn', 'hazard']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{ed.title}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>{usersOnline} {ed.usersOnline}</span>
          {aiThrottle > 0 && <span>{ed.aiThrottled.replace('{s}', String(aiThrottle))}</span>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={undo} className="gap-1"><RotateCcw size={16} />{ed.undo}</Button>
        <Button variant="outline" onClick={redo} className="gap-1"><RotateCw size={16} />{ed.redo}</Button>
        <Button variant="outline" onClick={simulate} disabled={simulating} className="gap-1"><Play size={16} />{ed.simulate}</Button>
        <Button variant="outline" onClick={aiSuggestLevel} disabled={aiSuggesting || aiThrottle > 0} className="gap-1"><Sparkles size={16} />{ed.aiSuggest}</Button>
        <Button variant="outline" onClick={exportPNG} className="gap-1"><Download size={16} />{ed.exportPng}</Button>
        <Button variant="outline" onClick={exportJSON} className="gap-1"><Download size={16} />{ed.exportJson}</Button>
        <Button variant="outline" onClick={clearGrid} className="gap-1"><Trash2 size={16} />{ed.clear}</Button>
        <Button variant="outline" onClick={copyShareLink} className="gap-1"><Copy size={16} />{ed.copyShareLink}</Button>
        <label className="flex items-center gap-2 text-sm ml-auto">
          <span className="text-muted-foreground">{ed.gridSize}:</span>
          <input type="number" min={8} max={64} value={gridSize} onChange={(e) => setGridSize(clamp(parseInt(e.target.value) || 16, 8, 64))} className="w-20 h-9 px-3 rounded-md border bg-background text-sm" />
        </label>
      </div>

      {simResult && (
        <div className="p-3 bg-muted rounded-lg text-sm flex items-center gap-4">
          <Play size={18} className="text-green-500" />
          <span>{ed.simDone.replace('{coins}', String(simResult.coins)).replace('{deaths}', String(simResult.deaths)).replace('{time}', String(simResult.time))}</span>
        </div>
      )}

      {aiSuggestion && (
        <div className="p-3 bg-muted rounded-lg text-sm flex items-center justify-between">
          <span className="flex items-center gap-2"><Sparkles size={18} className="text-purple-500" />{ed.aiReady}</span>
          <Button size="sm" onClick={() => { setGrid(aiSuggestion); pushHistory(aiSuggestion) }}>Terapkan</Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-semibold text-lg">{ed.palette}</h2>
          <div className="grid grid-cols-2 gap-2">
            {cellTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedCell(type)}
                className={`p-3 rounded-lg border text-left text-sm font-medium transition-all ${selectedCell === type ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500' : 'border-muted hover:bg-muted'}`}
              >
                <div className={`w-5 h-5 rounded ${CELL_COLORS[type]} mb-1`}></div>
                {ed[type === 'wall' ? 'cellWall' : type === 'floor' ? 'cellFloor' : type === 'spike' ? 'cellSpike' : type === 'coin' ? 'cellCoin' : type === 'exit' ? 'cellExit' : type === 'spawn' ? 'cellSpawn' : 'cellHazard']}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t">
            <h3 className="text-sm font-medium mb-2">{ed.collaboration}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>Queue auto-save 30s</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="border rounded-xl overflow-hidden bg-muted/30">
            <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}>
              {grid.map((row, r) => row.map((cell, c) => renderCell(cell, r, c)))}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <Button size="sm" variant="outline" onClick={() => setZoom(z => clamp(z + 0.25, 0.5, 3))} className="gap-1"><ZoomIn size={14} /></Button>
            <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <Button size="sm" variant="outline" onClick={() => setZoom(z => clamp(z - 0.25, 0.5, 3))} className="gap-1"><ZoomOut size={14} /></Button>
            <Button size="sm" variant="outline" onClick={() => setZoom(1)} className="gap-1"><Maximize2 size={14} /></Button>
          </div>
        </div>
      </div>

      <input type="file" accept=".json" onChange={importJSON} className="hidden" id="json-import" />
      <label htmlFor="json-import" className="text-sm text-muted-foreground cursor-pointer hover:text-foreground underline">
        Import JSON level...
      </label>
    </div>
  )
}
