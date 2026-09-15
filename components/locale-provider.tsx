"use client"
import { Globe, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function LocaleSwitcher() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <span />
  const [lang, setLang] = useState(() => localStorage.getItem("gridcraft_lang") || "en")
  const toggle = () => {
    const next = lang === "en" ? "id" : "en"
    setLang(next)
    localStorage.setItem("gridcraft_lang", next)
    window.location.reload()
  }
  return (
    <button onClick={toggle} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
      <Globe className="h-4 w-4" />
      {lang === "en" ? "ID" : "EN"}
    </button>
  )
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <span />
  const [dark, setDark] = useState(() => localStorage.getItem("gridcraft_theme") === "dark")
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("gridcraft_theme", dark ? "dark" : "light")
  }, [dark])
  return (
    <button onClick={() => setDark(!dark)} className="p-2 rounded-md hover:bg-accent transition-colors" aria-label="Toggle theme">
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
