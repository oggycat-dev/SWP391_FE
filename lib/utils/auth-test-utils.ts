/**
 * Auth Testing Utilities
 * Helper functions to test authentication features
 */

/**
 * Test 1: Simulate expired token
 * Forces token expiration to test auto-refresh
 */
export function simulateExpiredToken() {
  if (typeof window === 'undefined') return

  const token = localStorage.getItem('evdms_auth_token')
  if (!token) {
    console.error('No token found to expire')
    return
  }

  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid token format')
      return
    }

    const payload = JSON.parse(atob(parts[1]))
    console.log('Current token expires at:', new Date(payload.exp * 1000))
    console.log('Token will be considered expired on next API call')
    console.log('Make any API call to trigger auto-refresh')
  } catch (error) {
    console.error('Failed to parse token:', error)
  }
}

/**
 * Test 2: Check token expiration
 * Returns token expiration info
 */
export function checkTokenExpiration() {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('evdms_auth_token')
  if (!token) {
    return { hasToken: false }
  }

  try {
    const parts = token.split('.')
    const payload = JSON.parse(atob(parts[1]))
    const exp = payload.exp * 1000
    const now = Date.now()
    const timeUntilExpiry = exp - now
    const isExpired = timeUntilExpiry <= 0

    return {
      hasToken: true,
      expiresAt: new Date(exp),
      isExpired,
      timeUntilExpiry: isExpired ? 0 : timeUntilExpiry,
      timeUntilExpiryMinutes: isExpired ? 0 : Math.floor(timeUntilExpiry / 1000 / 60),
    }
  } catch (error) {
    console.error('Failed to check token expiration:', error)
    return { hasToken: true, error: 'Invalid token format' }
  }
}

/**
 * Test 3: Verify auth state
 * Checks all auth-related storage
 */
export function verifyAuthState() {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('evdms_auth_token')
  const refreshToken = localStorage.getItem('evdms_refresh_token')
  const user = localStorage.getItem('evdms_user')
  const cookies = document.cookie

  const tokenCookie = cookies
    .split('; ')
    .find(row => row.startsWith('evdms_auth_token='))
    ?.split('=')[1]

  console.log('=== Auth State ===')
  console.log('Access Token (localStorage):', token ? '✅ Present' : '❌ Missing')
  console.log('Refresh Token (localStorage):', refreshToken ? '✅ Present' : '❌ Missing')
  console.log('User Data (localStorage):', user ? '✅ Present' : '❌ Missing')
  console.log('Token Cookie:', tokenCookie ? '✅ Present' : '❌ Missing')

  if (user) {
    try {
      const userData = JSON.parse(user)
      console.log('User:', userData)
    } catch (e) {
      console.log('User data invalid')
    }
  }

  if (token) {
    const expInfo = checkTokenExpiration()
    if (expInfo && !expInfo.error) {
      console.log('Token expires at:', expInfo.expiresAt)
      console.log('Time until expiry:', expInfo.timeUntilExpiryMinutes, 'minutes')
      console.log('Is expired:', expInfo.isExpired ? '❌ Yes' : '✅ No')
    }
  }

  console.log('=================')

  return {
    hasToken: !!token,
    hasRefreshToken: !!refreshToken,
    hasUser: !!user,
    hasCookie: !!tokenCookie,
    cookieMatchesToken: token === tokenCookie,
  }
}

/**
 * Test 4: Force logout
 * Clears all auth data
 */
export function forceLogout() {
  if (typeof window === 'undefined') return

  localStorage.removeItem('evdms_auth_token')
  localStorage.removeItem('evdms_refresh_token')
  localStorage.removeItem('evdms_user')
  document.cookie = 'evdms_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

  console.log('✅ Logged out - all auth data cleared')
  console.log('Reload page to see redirect to login')
}

/**
 * Test 5: Simulate 401 error
 * Creates a test API call that will return 401
 */
export async function test401Handling() {
  console.log('Testing 401 handling...')
  
  // Temporarily corrupt the token
  const originalToken = localStorage.getItem('evdms_auth_token')
  if (!originalToken) {
    console.error('No token to test with')
    return
  }

  localStorage.setItem('evdms_auth_token', 'invalid_token_to_trigger_401')
  
  try {
    // Import apiClient dynamically
    const { apiClient } = await import('@/lib/api/client')
    
    // Try to make a request that requires auth
    await apiClient.get('/api/cms/users')
    console.log('Request succeeded (should not happen)')
  } catch (error) {
    console.log('Request failed as expected:', error)
  } finally {
    // Restore original token
    localStorage.setItem('evdms_auth_token', originalToken)
    console.log('Original token restored')
  }
}

// Make functions available in browser console
if (typeof window !== 'undefined') {
  (window as any).authTest = {
    simulateExpiredToken,
    checkTokenExpiration,
    verifyAuthState,
    forceLogout,
    test401Handling,
  }
  
  console.log('🧪 Auth test utilities loaded!')
  console.log('Available commands:')
  console.log('  authTest.verifyAuthState() - Check current auth state')
  console.log('  authTest.checkTokenExpiration() - Check when token expires')
  console.log('  authTest.simulateExpiredToken() - Test auto-refresh')
  console.log('  authTest.test401Handling() - Test 401 error handling')
  console.log('  authTest.forceLogout() - Clear all auth data')
}
