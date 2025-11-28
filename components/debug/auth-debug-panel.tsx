/**
 * Auth Debug Panel
 * Visual interface to test auth features
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/components/auth/auth-provider'
import { 
  checkTokenExpiration, 
  verifyAuthState, 
  forceLogout 
} from '@/lib/utils/auth-test-utils'

export function AuthDebugPanel() {
  const { user, logout } = useAuth()
  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const [authState, setAuthState] = useState<any>(null)

  useEffect(() => {
    updateInfo()
    
    // Update every 30 seconds
    const interval = setInterval(updateInfo, 30000)
    return () => clearInterval(interval)
  }, [user])

  const updateInfo = () => {
    const expInfo = checkTokenExpiration()
    const stateInfo = verifyAuthState()
    setTokenInfo(expInfo)
    setAuthState(stateInfo)
  }

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 shadow-lg z-50 opacity-90 hover:opacity-100 transition-opacity">
      <CardHeader>
        <CardTitle className="text-sm">🔐 Auth Debug Panel</CardTitle>
        <CardDescription className="text-xs">Development only</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        {/* User Info */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            User Status
            {user ? (
              <Badge variant="default" className="text-xs">Authenticated</Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">Not Logged In</Badge>
            )}
          </h4>
          {user && (
            <div className="space-y-1 text-muted-foreground">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Token Info */}
        {tokenInfo && (
          <div>
            <h4 className="font-semibold mb-2">Token Info</h4>
            {tokenInfo.hasToken ? (
              <div className="space-y-1 text-muted-foreground">
                {tokenInfo.isExpired ? (
                  <p className="text-red-500 font-medium">⚠️ Token Expired</p>
                ) : (
                  <>
                    <p>Expires: {tokenInfo.expiresAt?.toLocaleString()}</p>
                    <p>Time left: {tokenInfo.timeUntilExpiryMinutes} min</p>
                  </>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No token</p>
            )}
          </div>
        )}

        <Separator />

        {/* Storage State */}
        {authState && (
          <div>
            <h4 className="font-semibold mb-2">Storage State</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Access Token:</span>
                {authState.hasToken ? '✅' : '❌'}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Refresh Token:</span>
                {authState.hasRefreshToken ? '✅' : '❌'}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cookie:</span>
                {authState.hasCookie ? '✅' : '❌'}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cookie Synced:</span>
                {authState.cookieMatchesToken ? '✅' : '⚠️'}
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <h4 className="font-semibold mb-2">Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={updateInfo}
              className="text-xs"
            >
              Refresh Info
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                verifyAuthState()
                alert('Check console for details')
              }}
              className="text-xs"
            >
              Log State
            </Button>
            {user && (
              <>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={logout}
                  className="text-xs"
                >
                  Logout (API)
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => {
                    forceLogout()
                    window.location.reload()
                  }}
                  className="text-xs"
                >
                  Force Logout
                </Button>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Console Commands */}
        <div>
          <h4 className="font-semibold mb-2">Console Commands</h4>
          <div className="text-muted-foreground space-y-1 font-mono text-[10px]">
            <p>authTest.verifyAuthState()</p>
            <p>authTest.checkTokenExpiration()</p>
            <p>authTest.simulateExpiredToken()</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
