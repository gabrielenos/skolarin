"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Coins, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface RiwayatKoinPageProps {
  onBack: () => void
}

interface CoinHistoryItem {
  id: number
  title: string
  date: string
  amount: number
  type: "income" | "expense"
}

export default function RiwayatKoinPage({ onBack }: RiwayatKoinPageProps) {
  const [history, setHistory] = useState<CoinHistoryItem[]>([])
  const [totalCoins, setTotalCoins] = useState(200)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = window.localStorage.getItem("skolarin_auth_token")

    if (token) {
      // Fetch coin history
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

      // Fetch user data for total coins
      fetch("http://127.0.0.1:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setTotalCoins(data.coins ?? 200)
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err)
        })
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-200">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full"
        >
          <ChevronLeft className="h-6 w-6 text-slate-700" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">Riwayat Koin</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <div className="text-sm text-slate-500 mb-1">Total Koin Saat Ini</div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Coins className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-slate-800">{totalCoins}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Transaksi Terbaru</h2>
          </div>
          
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="px-4 py-8 text-center text-slate-500">Loading...</div>
            ) : history.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-500">
                Belum ada riwayat transaksi
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      item.type === "income" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {item.type === "income" ? (
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.date}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${
                    item.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {item.type === "income" ? "+" : "-"}{item.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
