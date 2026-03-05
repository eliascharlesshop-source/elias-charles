"use client"

import { useAuth } from "@/components/layout/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Mail, Wallet, User, Settings, LogOut, Shield } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Redirect if not logged in
  if (!user) {
    return null
  }

  const getAuthMethod = () => {
    if (user.walletAddress) return "Web3 Wallet"
    if (user.email?.includes("gmail.com") || user.provider === "google") return "Google OAuth"
    if (user.email) return "Email & Password"
    return "Unknown"
  }

  const getProfileImage = () => {
    if (user.image) return user.image
    if (user.walletAddress) return `https://api.dicebear.com/7.x/identicon/svg?seed=${user.walletAddress}`
    return `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || user.email}`
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <img
                className="h-20 w-20 rounded-full object-cover border-2 border-primary"
                src={getProfileImage()}
                alt="Profile"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-light text-primary uppercase tracking-wider">
                {user.name || user.firstName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Your Profile'}
              </h1>
              <p className="text-gray-600">{user.email || user.walletAddress}</p>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  {user.walletAddress ? (
                    <Wallet className="h-4 w-4 mr-1" />
                  ) : user.provider === "google" ? (
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.798-1.677-4.198-2.701-6.735-2.701-5.539 0-10.032 4.493-10.032 10.032s4.493 10.032 10.032 10.032c8.445 0 10.283-7.919 9.509-11.73h-9.509z" />
                    </svg>
                  ) : (
                    <Mail className="h-4 w-4 mr-1" />
                  )}
                  Signed in with {getAuthMethod()}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-4">
                {user.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="mt-1 text-sm text-gray-900">{user.email}</div>
                  </div>
                )}
                
                {(user.firstName || user.lastName) && (
                  <div className="grid grid-cols-2 gap-4">
                    {user.firstName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <div className="mt-1 text-sm text-gray-900">{user.firstName}</div>
                      </div>
                    )}
                    {user.lastName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <div className="mt-1 text-sm text-gray-900">{user.lastName}</div>
                      </div>
                    )}
                  </div>
                )}

                {user.walletAddress && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
                    <div className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {user.walletAddress}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Authentication Method</label>
                  <div className="mt-1 text-sm text-gray-900">{getAuthMethod()}</div>
                </div>

                {user.provider && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <div className="mt-1 text-sm text-gray-900 capitalize">{user.provider}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/cart"
                  className="flex items-center w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  View Cart
                </Link>
                <Link
                  href="/collections"
                  className="flex items-center w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  <User className="h-4 w-4 mr-3" />
                  Browse Collections
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Admin Portal
                </Link>
              </div>
            </div>

            {/* Authentication Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Login</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${user.email ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.email ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Google OAuth</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${user.provider === 'google' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.provider === 'google' ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Web3 Wallet</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${user.walletAddress ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.walletAddress ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
