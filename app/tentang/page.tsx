'use client'
import { useEffect } from 'react'
export default function TentangRedirect() {
  useEffect(() => { window.location.replace('/about?lang=id') }, [])
  return null
}