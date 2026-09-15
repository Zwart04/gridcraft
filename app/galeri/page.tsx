'use client'
import { useEffect } from 'react'
export default function GaleriRedirect() {
  useEffect(() => { window.location.replace('/gallery?lang=id') }, [])
  return null
}