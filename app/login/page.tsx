"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cmsAuthService } from "@/lib/api/auth/cms-auth.service"
import { getDefaultRouteByRole } from "@/lib/config/role-config"
import type { Role } from "@/lib/types"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('[Login] Attempting login...')

      // Call CMS auth service
      const response = await cmsAuthService.login({
        username: email,
        password: password,
      })

      console.log('[Login] Success:', response)
      console.log('[Login] User role:', response.user.role)

      // Validate role is one of the 4 authorized roles
      const userRole = response.user.role as Role
      const roleUpper = userRole.toUpperCase().replace(/\s+/g, '') // Remove spaces

      console.log('[Login] Role uppercase:', roleUpper)

      // Only allow: Admin, EVM Staff, Dealer Manager, Dealer Staff
      if (roleUpper !== 'ADMIN' && roleUpper !== 'EVMSTAFF' && roleUpper !== 'DEALERMANAGER' && roleUpper !== 'DEALERSTAFF') {
        throw new Error(`Access denied. Role "${userRole}" is not authorized.`)
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
      console.error('[Login] Error:', error)
      
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
      <Card className="w-full max-w-md shadow-lg border-2">
        <CardHeader className="space-y-6 text-center pb-8">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-black shadow-lg">
              <Zap className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">EV Dealer System</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-8">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email / Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
          </CardContent>
          <CardFooter className="px-8 pt-6 pb-8">
            <Button className="w-full h-11 text-base font-medium bg-black hover:bg-gray-800" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
