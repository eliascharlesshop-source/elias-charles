"use client"

import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { User, LogOut, Settings, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useAuth } from "./auth-provider"

export function ProfileDropdown() {
  const { user, logout } = useAuth() || { logout: () => {} }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full p-2 text-primary hover:text-gray-500">
          <User className="h-6 w-6" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="px-4 py-3">
              <p className="text-sm">Signed in as</p>
              <p className="text-sm font-medium text-primary truncate">
                {user?.email || user?.walletAddress || "User"}
              </p>
            </div>

            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/profile"
                  className={`${active ? "bg-gray-100 text-primary" : "text-gray-700"} block px-4 py-2 text-sm`}
                >
                  <div className="flex items-center">
                    <User className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>Your Profile</span>
                  </div>
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/orders"
                  className={`${active ? "bg-gray-100 text-primary" : "text-gray-700"} block px-4 py-2 text-sm`}
                >
                  <div className="flex items-center">
                    <ShoppingBag className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>Orders</span>
                  </div>
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/settings"
                  className={`${active ? "bg-gray-100 text-primary" : "text-gray-700"} block px-4 py-2 text-sm`}
                >
                  <div className="flex items-center">
                    <Settings className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>Settings</span>
                  </div>
                </Link>
              )}
            </Menu.Item>

            <div className="border-t border-gray-100"></div>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`${
                    active ? "bg-gray-100 text-primary" : "text-gray-700"
                  } block w-full text-left px-4 py-2 text-sm`}
                >
                  <div className="flex items-center">
                    <LogOut className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>Sign out</span>
                  </div>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
