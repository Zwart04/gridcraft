'use client'
import { Button } from '@/components/ui/button'
import { useLang } from '@/lib/lang'
import { t } from '@/lib/i18n'
import { useState } from 'react'

export default function RegisterPage() {
  const { lang } = useLang()
  const t_ = lang === 'en' ? t.en : t.id
  const k = t_.auth
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) { setError(k.error); return }
    if (password !== confirm) { setError('Password tidak cocok'); return }
    if (password.length < 4) { setError('Password minimal 4 karakter'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))
    const users = JSON.parse(localStorage.getItem('gc_users') || '[]') as any[]
    const exists = users.find((u) => u.email === email)
    if (exists) { setError('Email sudah terdaftar'); setLoading(false); return }
    const newUser = { id: Math.random().toString(36).slice(2), name, email, password, loggedIn: true }
    users.push(newUser)
    localStorage.setItem('gc_users', JSON.stringify(users))
    localStorage.setItem('gc_user', JSON.stringify(newUser))
    window.location.href = '/dashboard'
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-6 border rounded-xl bg-card">
        <h1 className="text-2xl font-bold text-center">{k.register}</h1>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-9 px-3 rounded-md border bg-background text-sm"
            placeholder="Nama Anda"
          />
        </div>
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
            placeholder="Minimal 4 karakter"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">{k.confirm}</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full h-9 px-3 rounded-md border bg-background text-sm"
            placeholder="Ulangi kata sandi"
          />
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? '...' : k.submit}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {k.hasAccount}{' '}
          <a href="/login" className="text-primary hover:underline">{k.login}</a>
        </p>
      </form>
    </div>
  )
}
