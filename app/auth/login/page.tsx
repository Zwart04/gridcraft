'use client'
import { Button } from '@/components/ui/button'
import { useLang } from '@/lib/lang'
import { t } from '@/lib/i18n'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const { lang } = useLang()
  const t_ = lang === 'en' ? t.en : t.id
  const k = t_.auth
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))
    if (email && password) {
      const users = JSON.parse(localStorage.getItem('gc_users') || '[]') as any[]
      const found = users.find((u) => u.email === email && u.password === password)
      if (found) {
        localStorage.setItem('gc_user', JSON.stringify({ id: found.id, name: found.name, email: found.email, loggedIn: true }))
        window.location.href = '/dashboard'
      } else {
        setError(k.error)
      }
    } else {
      setError(k.error)
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-6 border rounded-xl bg-card">
        <h1 className="text-2xl font-bold text-center">{k.login}</h1>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">{k.email}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-9 px-3 rounded-md border bg-background text-sm"
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">{k.password}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-9 px-3 rounded-md border bg-background text-sm"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? '...' : k.submit}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {k.noAccount}{' '}
          <a href="/register" className="text-primary hover:underline">{k.register}</a>
        </p>
      </form>
    </div>
  )
}
