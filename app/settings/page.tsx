'use client'
import { Button } from '@/components/ui/button'
import { useLang } from '@/lib/lang'
import { t } from '@/lib/i18n'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const { lang } = useLang()
  const t_ = lang === 'en' ? t.en : t.id
  const k = t_.settings
  const [langVal, setLangVal] = useState(lang)
  const [gridSizeVal, setGridSizeVal] = useState(16)
  const [autosaveVal, setAutosaveVal] = useState(30)

  const handleLangChange = (l: 'en' | 'id') => {
    setLangVal(l)
    localStorage.setItem('gc_lang', l)
  }

  const handleGridSizeChange = (s: number) => {
    setGridSizeVal(s)
    localStorage.setItem('gc_default_grid_size', String(s))
  }

  const handleAutosaveChange = (s: number) => {
    setAutosaveVal(s)
    localStorage.setItem('gc_autosave_interval', String(s))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">{k.title}</h1>

      <div className="p-4 border rounded-xl bg-card space-y-4">
        <div className="flex items-center justify-between">
          <label className="font-medium">{k.language}</label>
          <div className="flex gap-2">
            <Button
              variant={langVal === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleLangChange('en')}
            >
              EN
            </Button>
            <Button
              variant={langVal === 'id' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleLangChange('id')}
            >
              ID
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="font-medium">{k.gridDefault}</label>
          <input
            type="number"
            min={8}
            max={64}
            value={gridSizeVal}
            onChange={(e) => handleGridSizeChange(parseInt(e.target.value) || 16)}
            className="w-24 h-9 px-3 rounded-md border bg-background text-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="font-medium">{k.autosaveInterval}</label>
          <input
            type="number"
            min={10}
            max={300}
            step={10}
            value={autosaveVal}
            onChange={(e) => handleAutosaveChange(parseInt(e.target.value) || 30)}
            className="w-24 h-9 px-3 rounded-md border bg-background text-sm"
          />
        </div>
      </div>
    </div>
  )
}
