'use client'
import { Tabs, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { useLang } from '@/lib/lang'
import { t } from '@/lib/i18n'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import { useEffect, useState } from 'react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function AnalyticsPage() {
  const { lang } = useLang()
  const t_ = lang === 'en' ? t.en : t.id
  const k = t_.analytics
  const [pageviewCount, setPageviewCount] = useState(0)
  const [utmSource, setUtmSource] = useState('direct')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = parseInt(localStorage.getItem('gc_pageviews') || '0')
      setPageviewCount(stored + 1)
      localStorage.setItem('gc_pageviews', String(stored + 1))

      const params = new URLSearchParams(window.location.search)
      const source = params.get('utm_source') || localStorage.getItem('gc_source') || 'direct'
      if (!localStorage.getItem('gc_source')) localStorage.setItem('gc_source', source)
      setUtmSource(source)
    }
  }, [])

  const trendData = [
    { name: 'Week 1', levels: 2 }, { name: 'Week 2', levels: 5 }, { name: 'Week 3', levels: 3 },
    { name: 'Week 4', levels: 8 }, { name: 'Week 5', levels: 6 }, { name: 'Week 6', levels: 11 },
  ]
  const distData = [
    { name: 'Easy', value: 40 }, { name: 'Medium', value: 35 }, { name: 'Hard', value: 20 }, { name: 'Custom', value: 5 },
  ]
  const sourceData = [
    { name: 'Direct', value: 65 }, { name: 'GitHub', value: 20 }, { name: 'Twitter', value: 10 }, { name: 'Other', value: 5 },
  ]
  const sessionData = [
    { date: 'Mon', pages: 12 }, { date: 'Tue', pages: 18 }, { date: 'Wed', pages: 15 },
    { date: 'Thu', pages: 22 }, { date: 'Fri', pages: 20 }, { date: 'Sat', pages: 8 }, { date: 'Sun', pages: 5 },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{k.title}</h1>

      <Tabs.Root defaultValue="trend">
        <Tabs.List className="flex gap-1">
          <Tabs.Trigger value="trend">{k.trend}</Tabs.Trigger>
          <Tabs.Trigger value="dist">{k.distribution}</Tabs.Trigger>
          <Tabs.Trigger value="heatmap">{k.heatmap}</Tabs.Trigger>
          <Tabs.Trigger value="source">{k.source}</Tabs.Trigger>
          <Tabs.Trigger value="sessions">{k.sessions}</Tabs.Trigger>
        </Tabs.List>

        <Card>
          <Tabs.Content value="trend" className="p-4">
            <h2 className="font-semibold mb-4">{k.trend}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="levels" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Tabs.Content>

          <Tabs.Content value="dist" className="p-4">
            <h2 className="font-semibold mb-4">{k.distribution}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={distData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {distData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Tabs.Content>

          <Tabs.Content value="heatmap" className="p-4">
            <h2 className="font-semibold mb-4">{k.heatmap}</h2>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className="aspect-square rounded bg-muted/50" style={{ backgroundColor: `rgba(59, 130, 246, ${0.1 + Math.random() * 0.8})` }} title={`Day ${i + 1}: ${Math.floor(Math.random() * 10) + 1} sessions`}></div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span>Less</span>
              {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
                <div key={i} className="w-3 h-3 rounded bg-blue-500" style={{ opacity: v }}></div>
              ))}
              <span>More</span>
            </div>
          </Tabs.Content>

          <Tabs.Content value="source" className="p-4">
            <h2 className="font-semibold mb-2">{k.source}</h2>
            <p className="text-xs text-muted-foreground mb-4">{k.sourceNote}</p>
            <p className="text-sm mb-4">Current session source: <span className="font-mono font-bold">{utmSource}</span></p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Tabs.Content>

          <Tabs.Content value="sessions" className="p-4">
            <h2 className="font-semibold mb-4">{k.sessions}</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pages" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Tabs.Content>
        </Card>
      </Tabs.Root>
    </div>
  )
}
