"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/layout/auth-provider"
import { Mail, Shield } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, isLoading } = useAuth()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login('email', { email, password })
      router.push("/profile")
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.")
    }
  }

  const handleGoogleLogin = async () => {
    setError("")

    try {
      await login('google')
      router.push("/profile")
    } catch (err: any) {
      setError(err.message || "Google login failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-light tracking-wider text-primary uppercase">Sign in</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
        )}

        {/* Email Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address (try: demo@example.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password (try: password123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in with Email"}
              <span className="absolute right-3 inset-y-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-cream text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.798-1.677-4.198-2.701-6.735-2.701-5.539 0-10.032 4.493-10.032 10.032s4.493 10.032 10.032 10.032c8.445 0 10.283-7.919 9.509-11.73h-9.509z" />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>

        {/* Demo Credentials Helper */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
          <p className="text-xs text-blue-700">
            Email: <code className="bg-blue-100 px-1 rounded">demo@example.com</code><br />
            Password: <code className="bg-blue-100 px-1 rounded">password123</code>
          </p>
        </div>

        {/* Admin Portal Access */}
        <div className="text-center">
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin Portal
          </Link>
          <p className="mt-1 text-xs text-gray-500">For authorized personnel only</p>
        </div>
      </div>
    </div>
  )
}
