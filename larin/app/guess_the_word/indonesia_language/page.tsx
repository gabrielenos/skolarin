"use client"

import { useLayoutEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Settings, Trophy, ChevronRight } from "lucide-react"
import Logo from "@/components/logo"
import ProfileBar from "@/components/profile-bar"
import SettingsMenu from "@/components/settings-menu"

export default function IndonesiaLanguagePage() {
  const router = useRouter()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem("skolarin-theme") === "dark"
  })

  const pageBgClass = isDarkMode ? "bg-slate-100" : "bg-[#F0F4F8]"
  const navBgClass = "bg-[#29579F]"

  const indonesiaLevels = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Indonesia ${i + 1}`,
    questions: 30,
  }))

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
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Trophy"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B74E8] text-white shadow-sm hover:bg-[#095FC0] transition-colors"
              >
                <Trophy className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label="Settings"
                onClick={() => setIsSettingsOpen((prev) => !prev)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B74E8] text-white shadow-sm hover:bg-[#095FC0] transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>

            {isSettingsOpen && <SettingsMenu onClose={() => setIsSettingsOpen(false)} />}
          </div>
        </div>
      </nav>

      <ProfileBar isDarkMode={isDarkMode} />

      <main className="flex-1 mx-auto w-full max-w-[600px] px-4 pt-6 pb-16 sm:px-6">
        <header className="text-center space-y-2 mb-8">
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Indonesia Language
          </h1>
          <p
            className={`text-sm font-semibold ${
              isDarkMode ? "text-slate-100" : "text-slate-600"
            }`}
          >
            Home | Quiz Play | Guess The Word | Indonesia
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3 max-w-[900px] mx-auto px-4 md:flex md:flex-col md:flex-wrap md:content-center md:max-h-[750px]">
          {indonesiaLevels.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => router.push(`/guess_the_word/quiz?level=${level.id}&category=indonesia`)}
              className="focus:outline-none w-full md:w-[280px] lg:w-[320px] cursor-pointer"
            >
              <IndonesiaCard title={level.title} questions={level.questions} />
            </button>
          ))}
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

function IndonesiaCard({ title, questions }: { title: string; questions: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0F4F8]">
          <Logo width={22} height={26} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">Pertanyaan: {questions}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-slate-400" />
    </div>
  )
}
