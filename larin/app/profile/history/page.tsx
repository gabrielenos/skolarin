"use client"

import { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface CoinHistory {
  id: number
  title: string
  date: string
  amount: number
  type: "income" | "expense"
}

export default function HistoryPage() {
  const router = useRouter()
  const [histories, setHistories] = useState<CoinHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = "http://127.0.0.1:8000"

  useEffect(() => {
    const token = localStorage.getItem("skolarin_auth_token")
    if (!token) {
      router.push("/dashboard/login")
      return
    }

    fetch(`${API_URL}/auth/coin-history`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Gagal memuat riwayat")
        return res.json()
      })
      .then(data => {
        setHistories(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      <header className="sticky top-0 z-10 bg-[#F5F7FA] px-4 py-3">
        <div className="mx-auto max-w-2xl flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-slate-800 -ml-10">
            Riwayat Koin
          </h1>
        </div>
      </header>

      <main className="px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-3">
          {histories.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <p className="text-slate-500 text-sm">Belum ada riwayat koin</p>
            </div>
          ) : (
            histories.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{item.date}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    item.type === "income"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {item.type === "income" ? "+" : "-"} {item.amount}
                </span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
