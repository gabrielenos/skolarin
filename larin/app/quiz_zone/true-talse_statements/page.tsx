"use client"

import { useLayoutEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Settings, Trophy, ChevronDown, ChevronUp, Lock, ArrowLeft } from "lucide-react"
import Logo from "@/components/logo"
import ProfileBar from "@/components/profile-bar"
import SettingsMenu from "@/components/settings-menu"

interface Category {
  id: string
  title: string
  levelCount: number
  questionCount: number
  levels: number[]
}

const categories: Category[] = [
  {
    id: "english",
    title: "English",
    levelCount: 13,
    questionCount: 250,
    levels: [1, 2, 3, 4, 5, 6],
  },
  {
    id: "indonesia",
    title: "Bahasa Indonesia",
    levelCount: 5,
    questionCount: 250,
    levels: [1, 2, 3, 4, 5],
  },
  {
    id: "matematika",
    title: "Matematika",
    levelCount: 3,
    questionCount: 250,
    levels: [1, 2, 3],
  },
]

export default function TrueFalseStatementsPage() {
  const router = useRouter()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [showAllEnglishLevels, setShowAllEnglishLevels] = useState(false)
  const [showAllIndonesiaLevels, setShowAllIndonesiaLevels] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem("skolarin-theme") === "dark"
  })

  const pageBgClass = isDarkMode ? "bg-slate-100" : "bg-[#F0F4F8]"
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

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const getCategoryLevels = (category: Category) => {
    if (category.id === "english" && showAllEnglishLevels) {
      return Array.from({ length: 13 }, (_, i) => i + 1)
    }
    if (category.id === "indonesia" && showAllIndonesiaLevels) {
      return Array.from({ length: 5 }, (_, i) => i + 1)
    }
    return category.levels
  }

  return (
    <div suppressHydrationWarning className={`min-h-screen flex flex-col ${pageBgClass}`}>
      {/* Navbar biru */}
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

      {/* Konten utama True-False Statements */}
      <main className="flex-1 mx-auto w-full max-w-[800px] px-4 pt-6 pb-16 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
           True-False Statements
          </h1>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F4FD]">
                    <svg
                      className="h-6 w-6 text-[#1F7AE0]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900">{category.title}</h3>
                    <p className="text-sm text-slate-500">
                      {category.levelCount} Level · {category.questionCount} Pertanyaan
                    </p>
                  </div>
                </div>
                {expandedCategories.includes(category.id) ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {/* Expanded Content - Levels */}
              {expandedCategories.includes(category.id) && (
                <div className="px-5 pb-5">
                  <div className="flex flex-wrap gap-3">
                    {getCategoryLevels(category).map((level) => (
                      <button
                        key={level}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <span className="text-sm font-medium">Level {level}</span>
                        <Lock className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                  {/* Lihat Lebih Banyak untuk English */}
                  {category.id === "english" && !showAllEnglishLevels && category.levelCount > category.levels.length && (
                    <button 
                      onClick={() => setShowAllEnglishLevels(true)}
                      className="mt-4 text-sm text-[#1F7AE0] font-medium hover:underline"
                    >
                      Lihat Lebih Banyak
                    </button>
                  )}
                  {/* Lihat Lebih Banyak untuk Indonesia */}
                  {category.id === "indonesia" && !showAllIndonesiaLevels && category.levelCount > category.levels.length && (
                    <button 
                      onClick={() => setShowAllIndonesiaLevels(true)}
                      className="mt-4 text-sm text-[#1F7AE0] font-medium hover:underline"
                    >
                      Lihat Lebih Banyak
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
