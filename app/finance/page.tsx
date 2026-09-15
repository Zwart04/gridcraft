'use client'
import { useApp } from '@/lib/store'
import { useLang } from '@/lib/lang'
import { t } from '@/lib/i18n'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, TrendingUp } from 'lucide-react'

export default function FinancePage() {
  const { lang } = useLang()
  const { financeEntries, addFinanceEntry } = useApp()
  const t_ = lang === 'en' ? t.en : t.id
  const k = t_.finance

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const seen = localStorage.getItem('gc_finance_seen')
        if (!seen) {
          localStorage.setItem('gc_finance_seen', '1')
          addFinanceEntry('creative', 12.5, 'Initial project scaffolding credit')
          addFinanceEntry('export', 1.0, 'Gallery level export fee')
        }
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const total = financeEntries.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0)
  const catLabel = (type: string) => {
    if (type === 'creative') return k.catCreative
    if (type === 'export') return k.catExport
    return k.catSimulation
  }

  const exportCsv = () => {
    const header = 'Date,Category,Amount,Detail\n'
    const rows = financeEntries.map((e: { time: string; type: string; amount: number; detail: string }) => {
      const d = new Date(e.time).toLocaleString()
      const cat = catLabel(e.type)
      const amt = e.amount.toFixed(2)
      const det = `"${e.detail.replace(/"/g, '""')}"`
      return `${d},${cat},${amt},${det}`
    }).join('\n')
    const csv = '﻿' + header + rows
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'gridcraft-finance.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const exportPdfText = () => {
    const lines: string[] = [
      'GridCraft — Finance Journal',
      '='.repeat(40),
      '',
      `Total: $${total.toFixed(2)}`,
      `Entries: ${financeEntries.length}`,
      '',
      '-'.repeat(80),
      `${'Date'.padEnd(25)} ${'Category'.padEnd(20)} ${'Amount'.padEnd(10)} Detail`,
      '-'.repeat(80),
    ]
    financeEntries.forEach((e: { time: string; type: string; amount: number; detail: string }) => {
      const d = new Date(e.time).toLocaleString().slice(0, 24).padEnd(25)
      const cat = catLabel(e.type).slice(0, 19).padEnd(20)
      const amt = ('$' + e.amount.toFixed(2)).padEnd(10)
      const det = e.detail
      lines.push(`${d}${cat}${amt}${det}`)
    })
    lines.push('-'.repeat(80))
    const text = lines.join('\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'gridcraft-finance.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{k.title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv}><Download size={14} className="mr-1" />CSV</Button>
          <Button variant="outline" size="sm" onClick={exportPdfText}><Download size={14} className="mr-1" />TXT</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded-xl bg-card">
          <div className="text-sm text-muted-foreground">{k.entries}</div>
          <div className="text-2xl font-bold">{financeEntries.length}</div>
        </div>
        <div className="p-4 border rounded-xl bg-card col-span-2">
          <div className="text-sm text-muted-foreground flex items-center gap-1"><TrendingUp size={14} />{k.total}</div>
          <div className="text-2xl font-bold">${total.toFixed(2)}</div>
        </div>
      </div>

      {financeEntries.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">{k.empty}</p>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Category</th>
                <th className="text-right p-3">Amount</th>
                <th className="text-left p-3">Detail</th>
              </tr>
            </thead>
            <tbody>
              {financeEntries.map((e: { id: string; time: string; type: string; amount: number; detail: string }) => (
                <tr key={e.id} className="border-b">
                  <td className="p-3 text-muted-foreground">{new Date(e.time).toLocaleString()}</td>
                  <td className="p-3">{catLabel(e.type)}</td>
                  <td className="p-3 text-right font-mono">${e.amount.toFixed(2)}</td>
                  <td className="p-3">{e.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}