"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/layout/auth-provider"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth() || { isAuthenticated: false, logout: () => {} }

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-light tracking-wider text-primary uppercase mb-8">My Profile</h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-primary">Account Information</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and preferences.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-primary sm:mt-0 sm:col-span-2">{user?.email || "Not provided"}</dd>
                </div>
                {user?.walletAddress && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Wallet Address</dt>
                    <dd className="mt-1 text-sm text-primary sm:mt-0 sm:col-span-2">{user.walletAddress}</dd>
                  </div>
                )}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                  <dd className="mt-1 text-sm text-primary sm:mt-0 sm:col-span-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-light tracking-wider text-primary uppercase">Order History</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center text-gray-500">You haven't placed any orders yet.</div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-light tracking-wider text-primary uppercase">Saved Addresses</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center text-gray-500">You haven't saved any addresses yet.</div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-primary bg-white hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-dark"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
