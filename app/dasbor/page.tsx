'use client'
import { useEffect } from 'react'
export default function DasborRedirect() {
  useEffect(() => { window.location.replace('/dashboard?lang=id') }, [])
  return null
}