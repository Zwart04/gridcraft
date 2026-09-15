'use client'
import { useApp } from '@/lib/store'
import { useLang } from '@/lib/lang'
import { t } from '@/lib/i18n'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Download, TrendingUp } from 'lucide-react'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

export default function FinancePage() {
  const { lang } = useLang()
  const { financeEntries, addFinanceEntry } = useApp()
  const t_ = lang === 'en' ? t.en : t.id
  const k = t_.finance

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('gc_finance_seen')
      if (!seen) {
        localStorage.setItem('gc_finance_seen', '1')
        addFinanceEntry('creative', 12.5, 'Initial project scaffolding credit')
        addFinanceEntry('export', 1.0, 'Gallery level export fee')
      }
    }
  }, [])

  const total = financeEntries.reduce((sum, e) => sum + e.amount, 0)
  const catLabel = (type: string) => {
    if (type === 'creative') return k.catCreative
    if (type === 'export') return k.catExport
    return k.catSimulation
  }

  const exportPdf = () => {
    const doc = new jsPDF()
    doc.setFontSize(12)
    doc.text(k.title, 20, 20)
    doc.text(`${k.total}: $${total.toFixed(2)}`, 20, 40)
    financeEntries.forEach((e, i) => {
      doc.text(`${e.time} — ${catLabel(e.type)} — $${e.amount.toFixed(2)} — ${e.detail}`, 20, 60 + i * 10)
    })
    doc.save('gridcraft-finance-journal.pdf')
  }

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(financeEntries.map(e => ({
      date: new Date(e.time).toLocaleString(),
      category: catLabel(e.type),
      amount: e.amount,
      detail: e.detail,
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Finance Journal')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'gridcraft-finance.xlsx'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{k.title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportPdf}><Download size={14} className="mr-1" />PDF</Button>
          <Button variant="outline" size="sm" onClick={exportExcel}><Download size={14} className="mr-1" />Excel</Button>
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
              {financeEntries.map((e) => (
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