/**
 * Token Sync Component
 * Ensures auth token is synced with cookies for middleware
 */

'use client'

import { useEffect } from 'react'

export function TokenSync() {
  useEffect(() => {
    // Sync token from localStorage to cookie on mount
    const syncToken = () => {
      const token = localStorage.getItem('evdms_auth_token')
      
      if (token) {
        // Set cookie with 7 days expiration
        const expires = new Date()
        expires.setDate(expires.getDate() + 7)
        document.cookie = `evdms_auth_token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
      } else {
        // Clear cookie if no token
        document.cookie = 'evdms_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
      }
    }

    // Initial sync
    syncToken()

    // Listen for storage changes (e.g., logout from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'evdms_auth_token') {
        syncToken()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return null
}
