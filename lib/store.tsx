'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { t } from '@/lib/i18n'

interface User {
  id: string
  name: string
  email: string
  password?: string
  loggedIn: boolean
}

interface AppState {
  user: User
  setUser: (u: User) => void
  users: User[]
  setUsers: (u: User[]) => void
  levelsCreated: number
  setLevelsCreated: (n: number) => void
  levelsPlayed: number
  setLevelsPlayed: (n: number) => void
  exports: number
  setExports: (n: number) => void
  sessionTime: number
  setSessionTime: (n: number) => void
  recentActivity: { action: string; time: string; detail: string }[]
  setRecentActivity: (a: { action: string; time: string; detail: string }[]) => void
  financeEntries: { id: string; type: string; amount: number; time: string; detail: string }[]
  setFinanceEntries: (e: { id: string; type: string; amount: number; time: string; detail: string }[]) => void
  galleryLevels: { id: string; name: string; difficulty: string; size: number; creator: string; played: number; liked: number; grid: unknown; time: string }[]
  setGalleryLevels: (l: { id: string; name: string; difficulty: string; size: number; creator: string; played: number; liked: number; grid: unknown; time: string }[]) => void
  attendance: { date: string; count: number }[]
  setAttendance: (a: { date: string; count: number }[]) => void
  lang: 'en' | 'id'
  setLang: (l: 'en' | 'id') => void
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
}

const defaultUser: User = { id: 'default', name: 'Guest', email: '', loggedIn: false }

const AppContext = createContext<AppState | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User>(defaultUser)
  const [users, setUsersState] = useState<User[]>([])
  const [levelsCreated, setLevelsCreated] = useState(0)
  const [levelsPlayed, setLevelsPlayed] = useState(0)
  const [exports, setExports] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [recentActivity, setRecentActivity] = useState<{ action: string; time: string; detail: string }[]>([])
  const [financeEntries, setFinanceEntries] = useState<{ id: string; type: string; amount: number; time: string; detail: string }[]>([])
  const [galleryLevels, setGalleryLevels] = useState<{ id: string; name: string; difficulty: string; size: number; creator: string; played: number; liked: number; grid: unknown; time: string }[]>([])
  const [attendance, setAttendance] = useState<{ date: string; count: number }[]>([])
  const [lang, setLangState] = useState<'en' | 'id'>('en')
  const [theme, setThemeState] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedLang = localStorage.getItem('gc_lang')
    if (storedLang === 'en' || storedLang === 'id') setLangState(storedLang)
    else if (navigator.language.startsWith('id')) setLangState('id')
    const storedTheme = localStorage.getItem('gc_theme')
    if (storedTheme === 'light' || storedTheme === 'dark') setThemeState(storedTheme)

    const rawUsers = localStorage.getItem('gc_users')
    if (rawUsers) { try { setUsersState(JSON.parse(rawUsers)) } catch {} }
    const rawUser = localStorage.getItem('gc_user')
    if (rawUser) { try { const u = JSON.parse(rawUser); if (u && u.loggedIn) setUserState(u) } catch {} }
    const stats = localStorage.getItem('gc_stats')
    if (stats) {
      try {
        const s = JSON.parse(stats)
        if (s.levelsCreated) setLevelsCreated(s.levelsCreated)
        if (s.levelsPlayed) setLevelsPlayed(s.levelsPlayed)
        if (s.exports) setExports(s.exports)
        if (s.sessionTime) setSessionTime(s.sessionTime)
      } catch {}
    }
    const rawActivity = localStorage.getItem('gc_activity')
    if (rawActivity) { try { setRecentActivity(JSON.parse(rawActivity)) } catch {} }
    const rawFinance = localStorage.getItem('gc_finance')
    if (rawFinance) { try { setFinanceEntries(JSON.parse(rawFinance)) } catch {} }
    const rawGallery = localStorage.getItem('gc_gallery')
    if (rawGallery) { try { setGalleryLevels(JSON.parse(rawGallery)) } catch {} }
    const rawAttendance = localStorage.getItem('gc_attendance')
    if (rawAttendance) { try { setAttendance(JSON.parse(rawAttendance)) } catch {} }
  }, [])

  useEffect(() => { if (mounted) localStorage.setItem('gc_lang', lang) }, [lang, mounted])
  useEffect(() => {
    if (mounted) localStorage.setItem('gc_theme', theme)
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme, mounted])

  const saveUserSession = (u: User) => { localStorage.setItem('gc_user', JSON.stringify(u)); setUserState(u) }
  const saveUsers = (u: User[]) => { localStorage.setItem('gc_users', JSON.stringify(u)); setUsersState(u) }

  const addActivity = (action: string, detail: string) => {
    const entry = { action, time: new Date().toISOString(), detail }
    const next = [entry, ...recentActivity.slice(0, 49)]
    setRecentActivity(next)
    localStorage.setItem('gc_activity', JSON.stringify(next))
  }

  const addFinanceEntry = (type: string, amount: number, detail: string) => {
    const entry = { id: Math.random().toString(36).slice(2), type, amount, time: new Date().toISOString(), detail }
    const next = [entry, ...financeEntries.slice(0, 99)]
    setFinanceEntries(next)
    localStorage.setItem('gc_finance', JSON.stringify(next))
  }

  const addGalleryLevel = (level: { id: string; name: string; difficulty: string; size: number; creator: string; played: number; liked: number; grid: unknown; time: string }) => {
    const next = [level, ...galleryLevels.slice(0, 99)]
    setGalleryLevels(next)
    localStorage.setItem('gc_gallery', JSON.stringify(next))
  }

  const addAttendance = (date: string) => {
    const existing = attendance.find(a => a.date === date)
    if (existing) {
      const next = attendance.map(a => a.date === date ? { ...a, count: a.count + 1 } : a)
      setAttendance(next)
    } else {
      const next = [{ date, count: 1 }, ...attendance]
      setAttendance(next)
    }
    localStorage.setItem('gc_attendance', JSON.stringify(next))
  }

  const incrementLevelsCreated = () => {
    const next = levelsCreated + 1
    setLevelsCreated(next)
    localStorage.setItem('gc_stats', JSON.stringify({ levelsCreated: next, levelsPlayed, exports, sessionTime }))
    addActivity('created', 'Level created')
  }
  const incrementLevelsPlayed = () => {
    const next = levelsPlayed + 1
    setLevelsPlayed(next)
    localStorage.setItem('gc_stats', JSON.stringify({ levelsCreated, levelsPlayed: next, exports, sessionTime }))
    addActivity('played', 'Level played')
  }
  const incrementExports = () => {
    const next = exports + 1
    setExports(next)
    localStorage.setItem('gc_stats', JSON.stringify({ levelsCreated, levelsPlayed, exports: next, sessionTime }))
    addActivity('exported', 'Level exported')
  }
  const addSessionTime = (seconds: number) => {
    const next = sessionTime + seconds
    setSessionTime(next)
    localStorage.setItem('gc_stats', JSON.stringify({ levelsCreated, levelsPlayed, exports, sessionTime: next }))
  }

  const login = (email: string, password: string) => {
    const found = users.find(u => u.email === email && (u as any).password === password)
    if (found) {
      const sessionUser: User = { id: found.id, name: found.name, email: found.email, loggedIn: true }
      saveUserSession(sessionUser)
      addActivity('login', `${sessionUser.name} logged in`)
      return true
    }
    return false
  }
  const register = (name: string, email: string, password: string) => {
    const exists = users.find(u => u.email === email)
    if (exists) return false
    const newUser: User = { id: Math.random().toString(36).slice(2), name, email, password: password as any, loggedIn: true }
    const next = [...users, newUser]
    saveUsers(next)
    saveUserSession(newUser)
    addActivity('register', `${name} registered`)
    return true
  }
  const logout = () => { saveUserSession(defaultUser); addActivity('logout', `${user.name} logged out`) }

  const value: AppState = {
    user, setUser: saveUserSession, users, setUsers: saveUsers,
    levelsCreated, setLevelsCreated, levelsPlayed, setLevelsPlayed,
    exports, setExports, sessionTime, setSessionTime,
    recentActivity, setRecentActivity,
    financeEntries, setFinanceEntries,
    galleryLevels, setGalleryLevels: addGalleryLevel,
    attendance, setAttendance: addAttendance,
    lang, setLang: setLangState,
    theme, setTheme: setThemeState,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within StoreProvider')
  return ctx
}

export type { User }
