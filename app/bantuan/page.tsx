'use client'
import { useEffect } from 'react'
export default function BantuanRedirect() {
  useEffect(() => { window.location.replace('/help?lang=id') }, [])
  return null
}