"use client"

import { useEffect, useRef, useState } from "react"
import { Moon, Type, Volume2 } from "lucide-react"

export default function SettingsMenu({ onClose }: { onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem("skolarin-theme") === "dark"
  })

  const [isSoundOn, setIsSoundOn] = useState(() => {
    if (typeof window === "undefined") return true
    const storedSound = window.localStorage.getItem("skolarin-setting-sound")
    if (storedSound === "on") return true
    if (storedSound === "off") return false
    return true
  })

  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(() => {
    if (typeof window === "undefined") return "medium"
    const storedFontSize = window.localStorage.getItem("skolarin-setting-font-size")
    if (storedFontSize === "small" || storedFontSize === "medium" || storedFontSize === "large") {
      return storedFontSize
    }
    return "medium"
  })

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (e.target instanceof Node && !menuRef.current.contains(e.target)) onClose()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("mousedown", onMouseDown)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [onClose])

  const toggleSound = () => {
    setIsSoundOn((prev) => {
      const next = !prev
      window.localStorage.setItem("skolarin-setting-sound", next ? "on" : "off")
      return next
    })
  }

  const cycleFontSize = () => {
    setFontSize((prev) => {
      const next = prev === "small" ? "medium" : prev === "medium" ? "large" : "small"
      window.localStorage.setItem("skolarin-setting-font-size", next)
      return next
    })
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev
      window.localStorage.setItem("skolarin-theme", next ? "dark" : "light")
      window.dispatchEvent(new Event("skolarin-theme-change"))
      return next
    })
  }

  return (
    <div ref={menuRef} className="absolute right-0 z-50 mt-2 w-[260px] space-y-2">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-2xl bg-white px-3 py-3 text-left shadow-lg"
        onClick={() => {
          toggleDarkMode()
        }}
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-[#0B74E8]">
            <Moon className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-slate-900">Mode dark</span>
        </span>

        <span
          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
            isDarkMode ? "bg-[#0B74E8]" : "bg-slate-300"
          }`}
          aria-hidden="true"
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              isDarkMode ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </span>
      </button>

      <button
        type="button"
        className="flex w-full items-center justify-between rounded-2xl bg-white px-3 py-3 text-left shadow-lg"
        onClick={() => {
          toggleSound()
        }}
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-[#0B74E8]">
            <Volume2 className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-slate-900">Suara</span>
        </span>

        <span
          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
            isSoundOn ? "bg-[#0B74E8]" : "bg-slate-300"
          }`}
          aria-hidden="true"
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              isSoundOn ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </span>
      </button>

      <button
        type="button"
        className="flex w-full items-center justify-between rounded-2xl bg-white px-3 py-3 text-left shadow-lg"
        onClick={() => {
          cycleFontSize()
        }}
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-[#0B74E8]">
            <Type className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-slate-900">Ukuran Font Area Bermain</span>
        </span>

        <span className="text-xs font-semibold text-slate-600">{fontSize}</span>
      </button>
    </div>
  )
}
