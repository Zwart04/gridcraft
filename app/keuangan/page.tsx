'use client'
import { useEffect } from 'react'
export default function KeuanganRedirect() {
  useEffect(() => { window.location.replace('/finance?lang=id') }, [])
  return null
}