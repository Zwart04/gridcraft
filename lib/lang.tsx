'use client'

import { ReactNode, createContext, useContext, useState, useEffect } from 'react'

type Lang = 'en' | 'id'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
}

const LangContext = createContext<LangContextType | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('gc_lang')
    if (stored === 'en' || stored === 'id') setLang(stored)
    else if (typeof navigator !== 'undefined' && navigator.language.startsWith('id')) setLang('id')
  }, [])

  useEffect(() => {
    if (mounted) localStorage.setItem('gc_lang', lang)
  }, [lang, mounted])

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) {
    // Fallback during SSR — return a safe default
    return { lang: 'en', setLang: () => {} }
  }
  return ctx
}
