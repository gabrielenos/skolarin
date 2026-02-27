"use client"

import { ChevronLeft } from "lucide-react"

interface CoinHistoryItem {
  id: number
  title: string
  date: string
  amount: number
  type: "credit" | "debit"
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
  if (!isOpen) return null

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
          {dummyHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Belum ada riwayat koin
            </div>
          ) : (
            dummyHistory.map((item) => (
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
                    item.type === "credit"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {item.type === "credit" ? "+" : "-"} {item.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
