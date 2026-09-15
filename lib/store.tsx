'use client'

import { ReactNode, createContext, useContext, useState, useEffect, useCallback } from 'react'

type Lang = 'en' | 'id'
type Theme = 'light' | 'dark'

interface User {
  id: string
  name: string
  email: string
  password?: string
  loggedIn: boolean
}

interface GalleryLevel {
  id: string
  name: string
  difficulty: string
  size: number
  creator: string
  played: number
  liked: number
  grid: unknown
  time: string
}

interface AttendanceEntry {
  date: string
  count: number
}

interface ActivityEntry {
  action: string
  time: string
  detail: string
}

interface FinanceEntry {
  id: string
  type: string
  amount: number
  time: string
  detail: string
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
  recentActivity: ActivityEntry[]
  setRecentActivity: (a: ActivityEntry[]) => void
  financeEntries: FinanceEntry[]
  setFinanceEntries: (e: FinanceEntry[]) => void
  addFinanceEntry: (type: string, amount: number, detail: string) => void
  galleryLevels: GalleryLevel[]
  setGalleryLevels: (l: GalleryLevel[]) => void
  addGalleryLevel: (level: GalleryLevel) => void
  attendance: AttendanceEntry[]
  setAttendance: (a: AttendanceEntry[]) => void
  lang: Lang
  setLang: (l: Lang) => void
  theme: Theme
  setTheme: (t: Theme) => void
}

const defaultUser: User = { id: 'default', name: 'Guest', email: '', loggedIn: false }

const AppContext = createContext<AppState | null>(null)

// --- Safe helpers that guard against SSR ---

function isClient(): boolean {
  return typeof window !== 'undefined'
}

function safeLocalStorageGet(key: string, fallback: unknown): unknown {
  if (!isClient()) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function safeLocalStorageSet(key: string, value: unknown): void {
  if (!isClient()) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

// --- StoreProvider ---

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(defaultUser)
  const [users, setUsersState] = useState<User[]>([])
  const [levelsCreated, setLevelsCreated] = useState(0)
  const [levelsPlayed, setLevelsPlayed] = useState(0)
  const [exports, setExports] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [recentActivity, setRecentActivity] = useState<ActivityEntry[]>([])
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>([])
  const [galleryLevels, setGalleryLevels] = useState<GalleryLevel[]>([])
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([])
  const [lang, setLangState] = useState<Lang>('en')
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Initial load from localStorage
  useEffect(() => {
    if (!isClient()) return
    setMounted(true)

    const storedLang = localStorage.getItem('gc_lang')
    if (storedLang === 'en' || storedLang === 'id') setLangState(storedLang)
    else if (navigator.language.startsWith('id')) setLangState('id')

    const storedTheme = localStorage.getItem('gc_theme')
    if (storedTheme === 'light' || storedTheme === 'dark') setThemeState(storedTheme)

    setUsersState(safeLocalStorageGet('gc_users', []) as User[])
    const rawUser = safeLocalStorageGet('gc_user', null)
    if (rawUser && typeof rawUser === 'object' && (rawUser as User).loggedIn) {
      setUserState(rawUser as User)
    }
    const stats = safeLocalStorageGet('gc_stats', {} as Record<string, number>)
    if (stats && typeof stats === 'object') {
      const s = stats as Record<string, number>
      if (s.levelsCreated != null) setLevelsCreated(s.levelsCreated)
      if (s.levelsPlayed != null) setLevelsPlayed(s.levelsPlayed)
      if (s.exports != null) setExports(s.exports)
      if (s.sessionTime != null) setSessionTime(s.sessionTime)
    }
    setRecentActivity(safeLocalStorageGet('gc_activity', []) as ActivityEntry[])
    setFinanceEntries(safeLocalStorageGet('gc_finance', []) as FinanceEntry[])
    setGalleryLevels(safeLocalStorageGet('gc_gallery', []) as GalleryLevel[])
    setAttendance(safeLocalStorageGet('gc_attendance', []) as AttendanceEntry[])
  }, [])

  // Persist lang
  useEffect(() => {
    if (mounted) safeLocalStorageSet('gc_lang', lang)
  }, [lang, mounted])

  // Persist theme
  useEffect(() => {
    if (mounted) {
      safeLocalStorageSet('gc_theme', theme)
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    }
  }, [theme, mounted])

  const saveUserSession = useCallback((u: User) => {
    safeLocalStorageSet('gc_user', u)
    setUserState(u)
  }, [])

  const saveUsers = useCallback((u: User[]) => {
    safeLocalStorageSet('gc_users', u)
    setUsersState(u)
  }, [])

  const addActivity = useCallback((action: string, detail: string) => {
    const entry: ActivityEntry = { action, time: new Date().toISOString(), detail }
    setRecentActivity(prev => {
      const next = [entry, ...prev.slice(0, 49)]
      safeLocalStorageSet('gc_activity', next)
      return next
    })
  }, [])

  const addFinanceEntry = useCallback((type: string, amount: number, detail: string) => {
    const entry: FinanceEntry = { id: Math.random().toString(36).slice(2), type, amount, time: new Date().toISOString(), detail }
    setFinanceEntries(prev => {
      const next = [entry, ...prev.slice(0, 99)]
      safeLocalStorageSet('gc_finance', next)
      return next
    })
  }, [])

  const addGalleryLevelFn = useCallback((level: GalleryLevel) => {
    setGalleryLevels(prev => {
      const next = [level, ...prev.slice(0, 99)]
      safeLocalStorageSet('gc_gallery', next)
      return next
    })
  }, [])

  const addAttendanceFn = useCallback((date: string) => {
    setAttendance(prev => {
      const existing = prev.find(a => a.date === date)
      let next: AttendanceEntry[]
      if (existing) {
        next = prev.map(a => a.date === date ? { ...a, count: a.count + 1 } : a)
      } else {
        next = [{ date, count: 1 }, ...prev]
      }
      safeLocalStorageSet('gc_attendance', next)
      return next
    })
  }, [])

  const persistStats = useCallback((overrides?: Partial<{ levelsCreated: number; levelsPlayed: number; exports: number; sessionTime: number }>) => {
    const obj = {
      levelsCreated,
      levelsPlayed,
      exports,
      sessionTime,
      ...overrides,
    }
    safeLocalStorageSet('gc_stats', obj)
  }, [levelsCreated, levelsPlayed, exports, sessionTime])

  const incrementLevelsCreated = useCallback(() => {
    setLevelsCreated(prev => {
      const next = prev + 1
      persistStats({ levelsCreated: next })
      addActivity('created', 'Level created')
      return next
    })
  }, [persistStats, addActivity])

  const incrementLevelsPlayed = useCallback(() => {
    setLevelsPlayed(prev => {
      const next = prev + 1
      persistStats({ levelsPlayed: next })
      addActivity('played', 'Level played')
      return next
    })
  }, [persistStats, addActivity])

  const incrementExports = useCallback(() => {
    setExports(prev => {
      const next = prev + 1
      persistStats({ exports: next })
      addActivity('exported', 'Level exported')
      return next
    })
  }, [persistStats, addActivity])

  const addSessionTime = useCallback((seconds: number) => {
    setSessionTime(prev => {
      const next = prev + seconds
      persistStats({ sessionTime: next })
      return next
    })
  }, [persistStats])

  const login = useCallback((email: string, password: string): boolean => {
    if (!isClient()) return false
    const found = users.find(u => u.email === email && (u as any).password === password)
    if (found) {
      const sessionUser: User = { id: found.id, name: found.name, email: found.email, loggedIn: true }
      saveUserSession(sessionUser)
      addActivity('login', `${sessionUser.name} logged in`)
      return true
    }
    return false
  }, [users, saveUserSession, addActivity])

  const register = useCallback((name: string, email: string, password: string): boolean => {
    if (!isClient()) return false
    const exists = users.find(u => u.email === email)
    if (exists) return false
    const newUser: User = { id: Math.random().toString(36).slice(2), name, email, password: password as any, loggedIn: true }
    const next = [...users, newUser]
    saveUsers(next)
    saveUserSession(newUser)
    addActivity('register', `${name} registered`)
    return true
  }, [users, saveUsers, saveUserSession, addActivity])

  const logout = useCallback(() => {
    if (!isClient()) return
    saveUserSession(defaultUser)
    addActivity('logout', `${user.name} logged out`)
  }, [user, saveUserSession, addActivity])

  const value: AppState = {
    user, setUser: saveUserSession, users, setUsers: saveUsers,
    levelsCreated, setLevelsCreated, levelsPlayed, setLevelsPlayed,
    exports, setExports, sessionTime, setSessionTime,
    recentActivity, setRecentActivity,
    financeEntries, setFinanceEntries,
    addFinanceEntry,
    galleryLevels, setGalleryLevels,
    addGalleryLevel: addGalleryLevelFn,
    attendance, setAttendance,
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
  if (!ctx) {
    return {
      user: defaultUser, setUser: () => {}, users: [], setUsers: () => [],
      levelsCreated: 0, setLevelsCreated: () => {}, levelsPlayed: 0, setLevelsPlayed: () => {},
      exports: 0, setExports: () => {}, sessionTime: 0, setSessionTime: () => {},
      recentActivity: [], setRecentActivity: () => {},
      financeEntries: [], setFinanceEntries: () => {},
      addFinanceEntry: () => {},
      galleryLevels: [], setGalleryLevels: () => {},
      addGalleryLevel: () => {},
      attendance: [], setAttendance: () => {},
      lang: 'en', setLang: () => {},
      theme: 'light', setTheme: () => {},
    }
  }
  return ctx
}

export type { User, GalleryLevel, AttendanceEntry, ActivityEntry, FinanceEntry }
