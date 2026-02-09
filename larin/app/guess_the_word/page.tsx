"use client"

import { useLayoutEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Logo from "@/components/logo"

export default function GuessTheWordPage() {
  const router = useRouter()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem("skolarin-theme") === "dark"
  })

  const pageBgClass = isDarkMode ? "bg-slate-900" : "bg-white"
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

      <main className="flex-1 mx-auto w-full max-w-[1363px] px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <header className="text-center space-y-2 mb-10">
          <h1
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Guess The Word
          </h1>
          <p
            className={`text-sm sm:text-base font-semibold ${
              isDarkMode ? "text-slate-100" : "text-slate-700"
            }`}
          >
            Home | Quiz Play | Guess The Word
          </p>
          <p
            className={`mt-6 text-sm sm:text-base font-semibold ${
              isDarkMode ? "text-slate-100" : "text-slate-800"
            }`}
          >
            Sub Categories
          </p>
        </header>

        <section className="flex flex-col items-center gap-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <GTWCategoryCard title="English" subtitle="Sub Category: 30" />
            <GTWCategoryCard title="indonesia language" subtitle="Sub Category: 30" />
            <GTWCategoryCard title="mathematics" subtitle="Sub Category: 30" />
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

interface GTWCategoryCardProps {
  title: string
  subtitle: string
}

function GTWCategoryCard({ title, subtitle }: GTWCategoryCardProps) {
  return (
    <div className="flex h-[150px] w-[400px] items-center rounded-[12px] border border-black/70 bg-[#1450A3] px-6 py-4 text-left text-white shadow-md">
      <div className="mr-4 flex flex-col items-center gap-2 flex-shrink-0">
        <div className="relative h-[81px] w-[81px]">
          <img src="/images/book.png" alt="Category icon" className="h-full w-full object-contain" />
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <h3 className="font-[Poppins] font-bold text-[20px] leading-[20px] tracking-[-0.01em] whitespace-nowrap mb-2">
          {title}
        </h3>
        <div className="flex items-center text-xs text-sky-100/90">
          <span>{subtitle}</span>
        </div>
      </div>
    </div>
  )
}
