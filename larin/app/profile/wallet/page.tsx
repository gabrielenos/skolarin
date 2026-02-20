"use client"

import { useState } from "react"
import { ChevronLeft, Coins } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WalletPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"permintaan" | "transaksi">("permintaan")
  const totalCoins = 200
  const redeemableAmount = (totalCoins / 10).toFixed(1)

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F5F7FA] px-4 py-3">
        <div className="mx-auto max-w-2xl flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-slate-800">Dompet</h1>
        </div>
      </header>

      <main className="px-4 py-4">
        <div className="mx-auto max-w-2xl">
          {/* Tab Navigation */}
          <div className="flex bg-slate-200 rounded-full p-1 mb-6">
            <button
              onClick={() => setActiveTab("permintaan")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all ${
                activeTab === "permintaan"
                  ? "bg-[#0B78E3] text-white"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Permintaan
            </button>
            <button
              onClick={() => setActiveTab("transaksi")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all ${
                activeTab === "transaksi"
                  ? "bg-[#0B78E3] text-white"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Transaksi
            </button>
          </div>

          {activeTab === "permintaan" ? (
            <>
              {/* Total Coins Card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
                <p className="text-sm text-slate-600 mb-1">Total Koin</p>
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-slate-800">{totalCoins}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-600 mb-2">Jumlah yang Dapat Ditukarkan</p>
                  <div className="bg-[#F5F7FA] rounded-xl px-4 py-3">
                    <span className="text-lg font-semibold text-slate-700">$ {redeemableAmount}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-2"></span>
                    <p className="text-xs text-slate-500">
                      Minimum Redeemable amount is $ 10.0 (100 Coins).
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-2"></span>
                    <p className="text-xs text-slate-500">
                      Payout will take 3 - 5 working days
                    </p>
                  </div>
                </div>
              </div>

              {/* Redeem Button */}
              <button
                className="w-full py-3.5 bg-[#0B78E3] text-white font-semibold rounded-xl hover:bg-[#0969C8] transition-colors shadow-sm"
              >
                Tukar Sekarang
              </button>
            </>
          ) : (
            /* Transactions Tab */
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Coins className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm">Belum ada transaksi</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
