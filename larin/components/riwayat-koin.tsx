"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Logo from "@/components/logo"

interface CoinHistoryItem {
  id: number
  title: string
  date: string
  amount: number
  type: "income" | "expense"
}

interface RiwayatKoinProps {
  isOpen: boolean
  onClose: () => void
}

// Dummy data - nanti bisa diganti dengan data dari API
const dummyHistory: CoinHistoryItem[] = [
  {
    id: 1,
    title: "Bonus Selamat Datang",
    date: "11 Feb, 2026",
    amount: 200,
    type: "credit",
  },
]

export default function RiwayatKoin({ isOpen, onClose }: RiwayatKoinProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [history, setHistory] = useState<CoinHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = window.localStorage.getItem("skolarin_auth_token")
    setIsLoggedIn(!!token)

    if (token) {
      fetch("http://127.0.0.1:8000/auth/coin-history", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch")
          return res.json()
        })
        .then((data) => {
          setHistory(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Failed to fetch coin history:", err)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  if (!isOpen) return null

  // Login prompt for non-logged in users
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[70]">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        {/* Login Prompt Modal */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-8 text-center shadow-xl">
            {/* Mascot */}
            <div className="mb-4 flex justify-center">
              <Logo width={120} height={120} />
            </div>

            <p className="text-slate-700 mb-8 leading-relaxed">
              Oops! Kamu belum bisa mengakses fitur ini.Silakan login terlebih dahulu untuk menikmati semua fitur.
            </p>

            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-full border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Kembali
              </button>

              <button
                onClick={() => {
                  onClose()
                  router.push("/dashboard/login")
                }}
                className="w-full py-3 px-4 rounded-full bg-[#0B74E8] text-white font-semibold hover:bg-[#095FC0] transition-colors"
              >
                Login Sekarang
              </button>
            </div>

            <p className="mt-6 text-slate-500 text-sm">
              Belum punya akun?{" "}
              <button
                onClick={() => {
                  onClose()
                  router.push("/dashboard/signup")
                }}
                className="text-[#0B74E8] font-semibold hover:underline"
              >
                Daftar
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Content - Mobile first, then desktop responsive */}
      <div className="relative h-full w-full bg-[#F0F4F8] md:mx-auto md:mt-4 md:h-auto md:min-h-[600px] md:w-[min(94vw,640px)] md:rounded-3xl md:shadow-xl">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-200 md:rounded-t-3xl">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <ChevronLeft className="h-6 w-6 text-slate-700" />
          </button>
          <h1 className="text-lg font-semibold text-slate-800">Riwayat Koin</h1>
        </div>

        {/* History List */}
        <div className="p-4 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-slate-500">
              Loading...
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Belum ada riwayat koin
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm"
              >
                <div>
                  <h3 className="font-medium text-slate-800">{item.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{item.date}</p>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-lg font-semibold text-sm ${
                    item.type === "income"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {item.type === "income" ? "+" : "-"} {item.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
