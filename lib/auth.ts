'use client'
import { useApp } from '@/lib/store'

export function useUser() {
  const { user, setUser, users } = useApp()
  return { user, setUser, users }
}

export function useStoredUsers() {
  const { users, setUsers } = useApp()
  return { users, setUsers }
}

export function DEFAULT_USER() {
  return { id: 'default', name: 'Guest', email: '', loggedIn: false }
}

export function getStoredUsers() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('gridcraft_users')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return []
  }
}

export function saveStoredUsers(users: any[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('gridcraft_users', JSON.stringify(users))
}
