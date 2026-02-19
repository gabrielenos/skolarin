"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BarChart3, DollarSign, Star } from "lucide-react"

interface User {
  id: number
  email: string
  username: string | null
  avatar_url: string | null
  coins: number
}

export default function ProfileBar({ isDarkMode }: { isDarkMode: boolean }) {
  const router = useRouter()
  const [isProfileCollapsed, setIsProfileCollapsed] = useState(false)
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = window.localStorage.getItem("skolarin_auth_token")
      if (!token) return

      try {
        const res = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } catch (err) {
        console.error("Failed to fetch user:", err)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    let rafId: number | null = null

    const update = () => {
      rafId = null
      setIsProfileCollapsed(window.scrollY > 0)
    }

    const onScroll = () => {
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    if (!isProfileCardOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsProfileCardOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isProfileCardOpen])

  return (
    <>
      <div
        className={`sticky ${isProfileCollapsed ? "top-0" : "top-14"} w-full ${
          isProfileCollapsed
            ? "bg-transparent"
            : isDarkMode
              ? "bg-slate-900 text-white"
              : "bg-slate-50 text-slate-900"
        } ${isProfileCollapsed ? "z-50" : "z-40"}`}
      >
        <div className="mx-auto w-full max-w-6xl px-4 pt-1 pb-1 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setIsProfileCardOpen(true)}
            className={`items-center text-left transition-all ${
              isProfileCollapsed
                ? `inline-flex w-fit gap-1 rounded-md px-2 py-1 ${
                    isDarkMode
                      ? "bg-slate-900 text-white shadow-lg ring-1 ring-white/10"
                      : "bg-white text-slate-900 shadow-lg ring-1 ring-black/5"
                  }`
                : "flex w-full gap-2 bg-transparent py-1"
            }`}
          >
            <div
              className={`relative overflow-hidden rounded-full bg-slate-200 transition-all ${
                isProfileCollapsed ? "h-5 w-5" : "h-8 w-8"
              }`}
            >
              <Image 
                src={user?.avatar_url || "/images/user.png"} 
                alt="Avatar" 
                fill 
                className="object-cover" 
              />
            </div>

            {!isProfileCollapsed && (
              <div className="flex flex-col">
                <div className="text-xs font-semibold leading-tight">
                  Halo {user?.username || user?.email?.split('@')[0] || 'user'}
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {isProfileCardOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsProfileCardOpen(false)}
          />

          <div className="relative mx-auto w-[min(94vw,640px)] pt-4">
            <div
              className={`rounded-3xl p-4 shadow-xl ring-1 ${
                isDarkMode
                  ? "bg-slate-900 text-white ring-white/10"
                  : "bg-white text-slate-900 ring-black/5"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileCardOpen(false)
                    router.push("/profile")
                  }}
                  className="flex items-center gap-3 text-left"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                    <Image 
                      src={user?.avatar_url || "/images/user.png"} 
                      alt="Avatar" 
                      fill 
                      className="object-cover" 
                    />
                  </div>

                  <div className="leading-tight">
                    <div className="text-lg font-semibold">
                      Halo {user?.username || user?.email?.split('@')[0] || 'user'}
                    </div>
                    <div className={`text-sm ${isDarkMode ? "text-white/70" : "text-slate-500"}`}>
                      {user?.email || 'Ayo main kuis'}
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-4 rounded-3xl bg-[#0B74E8] px-5 py-4 text-white">
                <div className="grid grid-cols-3 items-center text-center">
                  <div className="text-left">
                    <div className="text-xs tracking-wider text-white/80">SKOR</div>
                    <div className="mt-1 flex items-center gap-2">
                      <Star className="h-6 w-6" />
                      <div className="text-2xl font-semibold leading-tight">0</div>
                    </div>
                  </div>

                  <div className="border-x border-white/30 px-4 text-left">
                    <div className="text-xs tracking-wider text-white/80">RANK</div>
                    <div className="mt-1 flex items-center gap-2">
                      <BarChart3 className="h-6 w-6" />
                      <div className="text-2xl font-semibold leading-tight">0</div>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="text-xs tracking-wider text-white/80">KOIN</div>
                    <div className="mt-1 flex items-center gap-2">
                      <DollarSign className="h-6 w-6" />
                      <div className="text-2xl font-semibold leading-tight">{user?.coins ?? 200}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
