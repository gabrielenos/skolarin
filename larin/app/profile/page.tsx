"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Bookmark,
  Coins,
  Gift,
  Globe,
  HelpCircle,
  LogOut,
  Pencil,
  Share2,
  Star,
  Trash2,
  UserPlus,
  Wallet,
} from "lucide-react"

interface User {
  id: number
  email: string
  username: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = window.localStorage.getItem("skolarin_auth_token")
      
      try {
        const res = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token || ''}`,
          },
        })

        if (!res.ok) {
          if (res.status === 401) {
            window.localStorage.removeItem("skolarin_auth_token")
            document.cookie = "skolarin_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            router.push("/dashboard/login")
            return
          }
          throw new Error("Failed to fetch user data")
        }

        const data = await res.json()
        setUser(data)
        
        // Redirect ke select_avatar jika belum pilih avatar
        if (!data.avatar_url) {
          router.push("/select_avatar")
          return
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const menuItems = [
    { label: "Bookmark", icon: Bookmark },
    { label: "Invite Friends", icon: UserPlus },
    { label: "Badges", icon: Star },
    { label: "Rewards", icon: Gift },
    { label: "Language", icon: Globe },
    { label: "How to Play", icon: HelpCircle },
    { label: "App Settings", icon: Share2 },
    { label: "Rate Us", icon: Star },
  ] as const

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-red-500">{error || "User not found"}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-[#1F7AE0]">
        <div className="mx-auto w-full max-w-5xl px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="text-sm font-bold tracking-wide text-white">PROFILE</div>
            <button
              type="button"
              aria-label="Back"
              onClick={() => router.back()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1F7AE0]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-8">
        <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-200">
              <img
                src={user.avatar_url || "/images/user.png"}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-slate-900">{user.username || "user"}</div>
              <div className="truncate text-xs text-slate-500">{user.email}</div>
            </div>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1F7AE0] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#1968C0]"
            >
              <Pencil className="h-4 w-4" />
              EDIT PROFILE
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <button type="button" onClick={() => router.push("/profile/wallet")} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
              <Wallet className="h-7 w-7 text-[#1F7AE0]" />
            </div>
            <div className="mt-4 text-center text-sm font-semibold text-slate-800">Wallet</div>
          </button>

          <button type="button" onClick={() => router.push("/profile/history")} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
              <Coins className="h-7 w-7 text-[#1F7AE0]" />
            </div>
            <div className="mt-4 text-center text-sm font-semibold text-slate-800">History</div>
          </button>

          <button type="button" onClick={() => router.push("/profile/notifikasi")} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
              <Bell className="h-7 w-7 text-[#1F7AE0]" />
            </div>
            <div className="mt-4 text-center text-sm font-semibold text-slate-800">Notifications</div>
          </button>

          <button type="button" className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
              <BarChart3 className="h-7 w-7 text-[#1F7AE0]" />
            </div>
            <div className="mt-4 text-center text-sm font-semibold text-slate-800">Stats</div>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-sm"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                  <Icon className="h-5 w-5 text-slate-900" />
                </span>
                <span className="text-sm font-semibold text-slate-900">{item.label}</span>
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => {
              window.localStorage.removeItem("skolarin_auth_token")
              document.cookie = "skolarin_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
              router.push("/dashboard/login")
            }}
            className="md:col-span-3 flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-sm"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
              <LogOut className="h-5 w-5 text-slate-900" />
            </span>
            <span className="text-sm font-semibold text-slate-900">Log out</span>
          </button>

          <button type="button" className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
              <Trash2 className="h-5 w-5 text-slate-900" />
            </span>
            <span className="text-sm font-semibold text-slate-900">Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}