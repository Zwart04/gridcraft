'use client'
import { Button } from '@/components/ui/button'
import { useLang } from '@/lib/lang'
import { t } from '@/lib/t'
import Link from 'next/link'

const cellTypes = [
  { id: 'wall', label: 'Wall', color: 'bg-gray-700 dark:bg-gray-600' },
  { id: 'floor', label: 'Floor', color: 'bg-orange-100 dark:bg-orange-900/40' },
  { id: 'spike', label: 'Spike', color: 'bg-red-500' },
  { id: 'coin', label: 'Coin', color: 'bg-yellow-400' },
  { id: 'exit', label: 'Exit', color: 'bg-green-500' },
  { id: 'spawn', label: 'Spawn', color: 'bg-blue-500' },
  { id: 'hazard', label: 'Hazard', color: 'bg-purple-500' },
] as const

export default function HelpPage() {
  const { lang } = useLang()
  const t_ = lang === 'en' ? t.en : t.id
  const help = lang === 'en' ? t_.help : t_.help

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{help.title}</h1>

      {/* Editor Guide */}
      <div className="border rounded-xl bg-card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          {help.editorGuide}
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>1. Select a cell type from the palette on the left.</p>
          <p>2. Click on the grid to place the selected cell.</p>
          <p>3. Drag across cells to paint multiple cells at once.</p>
          <p>4. Use Undo (Z) and Redo (Y) to revert changes.</p>
          <p>5. Click Simulate to test your level with an AI agent.</p>
          <p>6. Click AI Suggest for smart improvement recommendations.</p>
          <p>7. Export your level as PNG, JSON, or WebM.</p>
          <p>8. Share your level via the copyable share link.</p>
        </div>
      </div>

      {/* Grid Legend */}
      <div className="border rounded-xl bg-card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          {help.legend}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cellTypes.map((cell) => (
            <div key={cell.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className={`w-6 h-6 rounded ${cell.color}`}></div>
              <span className="text-sm font-medium">{cell.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="border rounded-xl bg-card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          {help.shortcuts}
        </h2>
        <div className="flex flex-wrap gap-2">
          {help.shortcutsList.split(', ').map((s, i) => (
            <kbd key={i} className="px-2 py-1 text-xs border rounded bg-muted font-mono">{s.trim()}</kbd>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="border rounded-xl bg-card p-6">
        <h2 className="text-lg font-semibold mb-3">Tips & Tricks</h2>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li>Start with a simple layout and gradually add complexity.</li>
          <li>Use symmetry patterns for cleaner level design.</li>
          <li>Balance difficulty by spacing out hazards and placing coins strategically.</li>
          <li>Test with the simulator before sharing your level.</li>
          <li>Use the AI suggest feature to get fresh ideas.</li>
        </ul>
      </div>
    </div>
  )
}
