"use client"

import { useLayoutEffect, useMemo, useState } from "react"
import NextImage from "next/image"
import { useRouter } from "next/navigation"
import { Settings, Trophy } from "lucide-react"
import Logo from "@/components/logo"
import ProfileBar from "@/components/profile-bar"
import SettingsMenu from "@/components/settings-menu"

export default function QuizZonePage() {
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
      {/* Navbar */}
      <nav className={`relative z-50 w-full ${navBgClass} text-white shadow-md`}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl px-3 py-1.5">
              <Logo width={32} height={36} />
            </div>
            <span className="text-xl font-semibold tracking-wide">Skolarin</span>
          </div>

          {/* Tombol setting */}
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

      {/* Konten utama Quiz Zone */}
      <main className="flex-1 mx-auto w-full max-w-[1363px] px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <header className="text-center space-y-2 mb-10">
          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"
            }`}>
            Quiz Play
          </h1>
          <p
            className={`text-sm sm:text-base font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-700"
              }`}
          >
            Home | Quiz Play | Quiz Zone
          </p>
          <p
            className={`mt-6 text-sm sm:text-base font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-800"
              }`}
          >
            Categories
          </p>
        </header>

        {/* Grid kategori Quiz Zone */}
        <section className="flex flex-col items-center gap-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              onClick={() => router.push("/quiz_zone/multiple_choice")}
              className="focus:outline-none"
            >
              <ZoneCard title="Multiple Choice" subtitle="Sub Kategori: 3" questions="Questions: 234" />
            </button>
            <button
              type="button"
              onClick={() => router.push("/quiz_zone/true-talse_statements")}
              className="focus:outline-none"
            >
              <ZoneCard title="True-False Statements" subtitle="Sub Kategori: 3" questions="Questions: 101" />
            </button>
            <button
              type="button"
              onClick={() => router.push("/quiz_zone/self_challenge")}
              className="focus:outline-none"
            >
              <ZoneCard title="Self Challenge" subtitle="Sub Kategori: 3" questions="Questions: 57" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-[#29579F] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 md:flex-row md:items-start md:justify-between md:gap-10 md:py-10">
          {/* Logo + description */}
          <div className="max-w-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <Logo width={32} height={36} />
              </div>
              <span className="text-xl font-semibold tracking-wide">Skolarin</span>
            </div>
            <p className="text-sm text-sky-100/90">
              Elite Quiz made with key principles of a beautiful, effective, simple to use and better code quality
              with use of functional based component.
            </p>
          </div>

          {/* Links columns */}
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

interface ZoneCardProps {
  title: string
  subtitle: string
  questions: string
}

function ZoneCard({ title, subtitle, questions }: ZoneCardProps) {
  return (
    <div className="flex h-[150px] w-[400px] items-center rounded-[12px] border border-black/70 bg-[#1450A3] px-6 py-4 text-left text-white shadow-md">
    
      <div className="mr-4 flex-shrink-0 flex items-center md:block">
      
        <div className="relative h-[60px] w-[60px] md:h-[81px] md:w-[81px]">
          <NextImage src="/images/book.png" alt="Category icon" fill className="object-contain" />
        </div>

     
        <div className="hidden md:flex mt-1 items-center gap-2">
          <p className="text-xs text-sky-100/90 whitespace-nowrap">{questions}</p>
          <div className="h-[32px] w-[32px] rounded-full bg-[#FFC727] flex items-center justify-center">
            <div className="relative h-[28px] w-[28px]">
              <NextImage src="/images/bell.png" alt="Notification icon" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center flex-1">
        <h3
          className="w-[72px] h-[30px] font-[Poppins] font-bold text-[20px] leading-[20px] tracking-[-0.01em] whitespace-nowrap align-middle"
        >
          {title}
        </h3>
 
        <p className="mt-1 h-[20px] w-[117px] text-xs leading-[20px] text-sky-100/90">{subtitle}</p>
      </div>

  
      <div className="ml-4 flex-shrink-0 md:hidden">
        <div className="flex flex-col items-end gap-1">
          <div className="h-[32px] w-[32px] rounded-full bg-[#FFC727] flex items-center justify-center">
            <div className="relative h-[28px] w-[28px]">
              <NextImage src="/images/bell.png" alt="Notification icon" fill className="object-contain" />
            </div>
          </div>
          <p className="text-xs text-sky-100/90 whitespace-nowrap text-right">{questions}</p>
        </div>
      </div>
    </div>
  )
}
