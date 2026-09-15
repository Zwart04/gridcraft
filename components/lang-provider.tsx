'use client'
import { createContext, useContext, useEffect, useState } from 'react'

interface LangContextType {
  lang: 'en' | 'id'
  setLang: (l: 'en' | 'id') => void
}

const LangContext = createContext<LangContextType | undefined>(undefined)

const STORAGE_KEY = 'gridcraft-lang'

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'en' | 'id'>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'id') setLang(stored)
    else {
      const nav = navigator.language
      if (nav.startsWith('id')) setLang('id')
    }
  }, [])

  useEffect(() => {
    if (mounted) localStorage.setItem(STORAGE_KEY, lang)
  }, [lang, mounted])

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
