"use client"

import { useLayoutEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Logo from "@/components/logo"

export default function SelfChallengePage() {
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

  const categoryOptions = useMemo(() => ["Pilihan Ganda"], [])
  const subCategoryOptions = useMemo(() => ["Bahasa Indonesia"], [])
  const questionOptions = useMemo(() => [5, 10, 15, 20, 25, 30], [])
  const durationOptions = useMemo(() => [3, 6, 9, 12, 15, 18, 21, 24, 27, 30], [])

  const [category, setCategory] = useState(categoryOptions[0] ?? "")
  const [subCategory, setSubCategory] = useState(subCategoryOptions[0] ?? "")
  const [questionCount, setQuestionCount] = useState<number>(questionOptions[0] ?? 10)
  const [durationMinutes, setDurationMinutes] = useState<number>(durationOptions[0] ?? 10)

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

      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="relative mx-auto flex h-14 max-w-2xl items-center justify-center px-4 md:max-w-4xl md:px-6">
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.back()}
            className="absolute left-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
          >
            <span className="text-xl">←</span>
          </button>
          <h1 className="text-base font-semibold text-slate-900">Tantangan Diri</h1>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 pb-10 pt-6 md:max-w-4xl md:px-6 md:pt-10 md:pb-16">
        <div className="space-y-6">
          <FieldLabel text="Pilih Kategori" />
          <SelectCard value={category} onChange={setCategory} options={categoryOptions} />

          <FieldLabel text="Pilih Subkategori" />
          <SelectCard value={subCategory} onChange={setSubCategory} options={subCategoryOptions} />

          <FieldLabel text="Pilih Jumlah Pertanyaan" />
          <div className="flex gap-3 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
            {questionOptions.map((n) => (
              <Chip
                key={n}
                text={String(n)}
                selected={questionCount === n}
                onClick={() => setQuestionCount(n)}
              />
            ))}
          </div>

          <FieldLabel text="Pilih Durasi Waktu dalam Menit" />
          <div className="flex gap-3 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
            {durationOptions.map((n) => (
              <Chip
                key={n}
                text={String(n)}
                selected={durationMinutes === n}
                onClick={() => setDurationMinutes(n)}
              />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <button
            type="button"
            className="h-12 w-full rounded-lg bg-[#0B78E3] text-sm font-semibold text-white shadow-md hover:bg-[#0969C8]"
            onClick={() => {
              void category
              void subCategory
              void questionCount
              void durationMinutes
            }}
          >
            MULAI
          </button>
        </div>
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

function FieldLabel({ text }: { text: string }) {
  return <p className="text-sm font-medium text-slate-700">{text}</p>
}

function SelectCard({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 w-full appearance-none rounded-xl border border-white/60 bg-white px-4 pr-12 text-sm font-medium text-slate-800 shadow-sm outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700">
          <span className="text-xs">˅</span>
        </div>
      </div>
    </div>
  )
}

function Chip({
  text,
  selected,
  onClick,
}: {
  text: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-11 h-11 rounded-lg border px-4 text-sm font-semibold shadow-sm transition-colors ${
        selected
          ? "border-[#0B78E3] bg-[#0B78E3] text-white"
          : "border-white/60 bg-white text-slate-800 hover:bg-slate-50"
      }`}
    >
      {text}
    </button>
  )
}
