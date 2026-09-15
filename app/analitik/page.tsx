'use client'
import { useEffect } from 'react'
export default function AnalitikRedirect() {
  useEffect(() => { window.location.replace('/analytics?lang=id') }, [])
  return null
}