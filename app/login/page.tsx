"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Loader2, Building2, Users, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cmsAuthService } from "@/lib/api/auth/cms-auth.service"
import { dealerAuthService } from "@/lib/api/auth/dealer-auth.service"
import { customerAuthService } from "@/lib/api/auth/customer-auth.service"
import { getDefaultRouteByRole } from "@/lib/config/role-config"
import type { Role } from "@/lib/types"

type LoginMode = 'cms' | 'dealer' | 'customer'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginMode, setLoginMode] = useState<LoginMode>('cms')
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Select appropriate auth service based on login mode
      let authService
      switch (loginMode) {
        case 'cms':
          authService = cmsAuthService
          break
        case 'dealer':
          authService = dealerAuthService
          break
        case 'customer':
          authService = customerAuthService
          break
        default:
          authService = cmsAuthService
      }

      console.log(`[${loginMode.toUpperCase()} Login] Attempting login...`)

      // Call the appropriate auth service
      const response = await authService.login({
        username: email,
        password: password,
      })

      console.log(`[${loginMode.toUpperCase()} Login] Success:`, response)

      // Validate role matches login mode
      const userRole = response.user.role as Role
      const roleUpper = userRole.toUpperCase()

      // Validate role matches selected login mode
      if (loginMode === 'cms') {
        if (roleUpper !== 'ADMIN' && roleUpper !== 'EVMSTAFF' && roleUpper !== 'EVMMANAGER') {
          throw new Error('Access denied. This account is not authorized for CMS access. Please select the correct account type.')
        }
      } else if (loginMode === 'dealer') {
        if (roleUpper !== 'DEALERMANAGER' && roleUpper !== 'DEALERSTAFF') {
          throw new Error('Access denied. This account is not authorized for Dealer access. Please select the correct account type.')
        }
      } else if (loginMode === 'customer') {
        if (roleUpper !== 'CUSTOMER') {
          throw new Error('Access denied. This account is not authorized for Customer access. Please select the correct account type.')
        }
      }

      // Login successful
      login(response.token, response.user)

      toast({
        title: "Welcome back!",
        description: `Logged in as ${response.user.name} (${userRole})`,
      })

      // Redirect to appropriate dashboard based on role
      const defaultRoute = getDefaultRouteByRole(userRole)
      setTimeout(() => {
        window.location.href = defaultRoute
      }, 500)
    } catch (error: any) {
      console.error(`[${loginMode.toUpperCase()} Login] Error:`, error)
      
      // Better error handling
      let errorMessage = 'Login failed. Please check your credentials and try again.'
      
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">EV Dealer System</CardTitle>
          <CardDescription>Enter your credentials to access the management portal</CardDescription>
        </CardHeader>
        
        {/* Login Mode Selector */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setLoginMode('cms')}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 py-3 transition-all ${
                loginMode === 'cms'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              <Building2 className="h-5 w-5" />
              <span className="text-xs font-medium">CMS</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMode('dealer')}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 py-3 transition-all ${
                loginMode === 'dealer'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs font-medium">Dealer</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMode('customer')}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 py-3 transition-all ${
                loginMode === 'customer'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Customer</span>
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {loginMode === 'cms' && 'Admin, EVM Staff, EVM Manager'}
            {loginMode === 'dealer' && 'Dealer Manager, Dealer Staff'}
            {loginMode === 'customer' && 'Customer'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email / Username</Label>
              <Input
                id="email"
                type="text"
                placeholder={
                  loginMode === 'cms' 
                    ? "admin@evm.com" 
                    : loginMode === 'dealer'
                    ? "manager@dealer.com"
                    : "customer@example.com"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {loginMode === 'customer' && (
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
        
        <div className="px-8 pb-8 text-center text-xs text-muted-foreground">
          <p className="mb-2 font-medium">Demo Accounts:</p>
          <div className="mt-2 space-y-1">
            <div>
              <span className="font-medium">CMS:</span>
              <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">admin@evm.com</code>
            </div>
            <div>
              <span className="font-medium">Dealer:</span>
              <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">manager@dealer.com</code>
            </div>
            <div>
              <span className="font-medium">Customer:</span>
              <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">customer@example.com</code>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
