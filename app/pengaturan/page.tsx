'use client'
import { useEffect } from 'react'
export default function PengaturanRedirect() {
  useEffect(() => { window.location.replace('/settings?lang=id') }, [])
  return null
}