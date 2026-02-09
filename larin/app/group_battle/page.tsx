"use client"

import { useLayoutEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Logo from "@/components/logo"

export default function GroupBattlePage() {
  const router = useRouter()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem("skolarin-theme") === "dark"
  })

  const pageBgClass = isDarkMode ? "bg-slate-900" : "bg-[#EEF4FA]"
  const navBgClass = "bg-[#29579F]"

  useLayoutEffect(() => {
    const syncTheme = () => {
      const storedTheme = window.localStorage.getItem("skolarin-theme")
      setIsDarkMode(storedTheme === "dark")
      if (storedTheme !== "dark" && storedTheme !== "light") {
        window.localStorage.setItem("skolarin-theme", "light")
      }
    }

    syncTheme()

    const onThemeChange = () => syncTheme()
    const onStorage = (e: StorageEvent) => {
      if (e.key === "skolarin-theme") syncTheme()
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") syncTheme()
    }

    window.addEventListener("skolarin-theme-change", onThemeChange)
    window.addEventListener("focus", onThemeChange)
    window.addEventListener("storage", onStorage)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      window.removeEventListener("skolarin-theme-change", onThemeChange)
      window.removeEventListener("focus", onThemeChange)
      window.removeEventListener("storage", onStorage)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  return (
    <div suppressHydrationWarning className={`min-h-screen flex flex-col ${pageBgClass}`}>
      <nav className={`relative z-50 w-full ${navBgClass} text-white shadow-md`}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl px-3 py-1.5">
              <Logo width={32} height={36} />
            </div>
            <span className="text-xl font-semibold tracking-wide">Skolarin</span>
          </div>

          <div className="relative z-50">
            <button
              type="button"
              aria-label="Settings"
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-sky-500/30 text-white hover:bg-sky-500/60 transition-colors"
            >
              <span className="text-lg font-semibold">⚙️</span>
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 z-50 mt-2 w-40 rounded-xl border border-sky-100 bg-white py-1 text-sm text-slate-800 shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center px-3 py-2 text-left hover:bg-sky-50"
                  onClick={() => {
                    setIsSettingsOpen(false)
                    router.push("/dashboard/contact")
                  }}
                >
                  Contact
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-sky-50"
                  onClick={() => {
                    setIsDarkMode((prev) => {
                      const next = !prev
                      window.localStorage.setItem("skolarin-theme", next ? "dark" : "light")
                      window.dispatchEvent(new Event("skolarin-theme-change"))
                      return next
                    })
                  }}
                >
                  <span>Mode dark</span>
                  <span
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      isDarkMode ? "bg-sky-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        isDarkMode ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#1AA0FF] to-[#0B78E3] text-white">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:conic-gradient(from_180deg_at_50%_0%,rgba(255,255,255,0.35)_0deg,rgba(255,255,255,0)_25deg,rgba(255,255,255,0.35)_50deg,rgba(255,255,255,0)_75deg,rgba(255,255,255,0.35)_100deg)]" />

          <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-8 md:max-w-4xl md:px-6 md:pb-12">
            <div className="relative flex items-center justify-center">
              <button
                type="button"
                aria-label="Back"
                onClick={() => router.back()}
                className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                <span className="text-xl">←</span>
              </button>
              <h1 className="text-lg font-semibold">Kontes Grup</h1>
            </div>

            <div className="flex items-center justify-center gap-7 pt-10 pb-24 md:pt-12 md:pb-28">
              <div className="flex h-44 w-44 items-center justify-center bg-transparent shadow-none border-0 ring-0 ring-offset-0 outline-none md:h-52 md:w-52">
                <img
                  src="/images/player1.png"
                  alt="Group 1"
                  className="h-32 w-32 object-contain border-0 ring-0 ring-offset-0 outline-none focus:outline-none focus:ring-0 md:h-36 md:w-36"
                />
              </div>
              <div className="text-4xl font-extrabold tracking-tight">V/S</div>
              <div className="flex h-44 w-44 items-center justify-center bg-transparent shadow-none border-0 ring-0 ring-offset-0 outline-none md:h-52 md:w-52">
                <img
                  src="/images/player2.png"
                  alt="Group 2"
                  className="h-32 w-32 object-contain border-0 ring-0 ring-offset-0 outline-none focus:outline-none focus:ring-0 md:h-36 md:w-36"
                />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 h-20 w-[125%] -translate-x-1/2 rounded-t-[100%] bg-[#EEF4FA] md:-bottom-8 md:h-24" />
        </section>

        <section className="mx-auto w-full max-w-md px-4 pb-12 pt-5 md:max-w-lg md:px-6">
          <div className="space-y-4">
            <button
              type="button"
              className="h-14 w-full rounded-xl bg-[#0B78E3] text-sm font-semibold text-white shadow-md hover:bg-[#0969C8]"
              onClick={() => {
                void 0
              }}
            >
              Buat Ruangan
            </button>
            <button
              type="button"
              className="h-14 w-full rounded-xl bg-[#0B78E3] text-sm font-semibold text-white shadow-md hover:bg-[#0969C8]"
              onClick={() => {
                void 0
              }}
            >
              Gabung Ruangan
            </button>
          </div>
        </section>
      </main>

      <footer className="mt-auto bg-[#29579F] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 md:flex-row md:items-start md:justify-between md:gap-10 md:py-10">
          <div className="max-w-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <Logo width={32} height={36} />
              </div>
              <span className="text-xl font-semibold tracking-wide">Skolarin</span>
            </div>
            <p className="text-sm text-sky-100/90">
              Elite Quiz made with key principles of a beautiful, effective, simple to use and better code quality with
              use of functional based component.
            </p>
          </div>

          <div className="grid flex-1 gap-10 text-sm md:grid-cols-3">
            <div className="space-y-3">
              <h4 className="font-semibold">Policy</h4>
              <ul className="space-y-1 text-sky-100/90">
                <li>Privacy Policy</li>
                <li>Terms And Conditions</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-1 text-sky-100/90">
                <li>About Us</li>
                <li>Contact Us</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Find Us Here</h4>
              <ul className="space-y-1 text-sky-100/90">
                <li>Social media links</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
