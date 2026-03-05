"use client"

import { useState } from "react"
import { ChevronLeft, Coins } from "lucide-react"

interface TukarKoinPageProps {
  onBack: () => void
  totalCoins?: number
}

// Conversion rate: 10 coins = $1.0
const COIN_TO_DOLLAR_RATE = 0.1
const MINIMUM_REDEEMABLE_COINS = 100
const MINIMUM_REDEEMABLE_DOLLARS = 10.0

export default function TukarKoinPage({ onBack, totalCoins = 200 }: TukarKoinPageProps) {
  const [activeTab, setActiveTab] = useState<"permintaan" | "transaksi">("permintaan")
  const [redeemAmount, setRedeemAmount] = useState("")

  const redeemableDollars = (totalCoins * COIN_TO_DOLLAR_RATE).toFixed(1)

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-200">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full"
        >
          <ChevronLeft className="h-6 w-6 text-slate-700" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">Tukar Koin</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 py-3">
        <div className="flex bg-slate-100 rounded-full p-1">
          <button
            onClick={() => setActiveTab("permintaan")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
              activeTab === "permintaan"
                ? "bg-[#0B74E8] text-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Permintaan
          </button>
          <button
            onClick={() => setActiveTab("transaksi")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
              activeTab === "transaksi"
                ? "bg-[#0B74E8] text-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Transaksi
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "permintaan" ? (
          <div className="space-y-4">
            {/* Total Coins Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-sm text-slate-500 mb-1">Total Koin</div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-yellow-600" />
                </div>
                <span className="text-2xl font-bold text-slate-800">{totalCoins}</span>
              </div>
            </div>

            {/* Redeemable Amount */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-sm text-slate-500 mb-3">Jumlah yang Dapat Ditukarkan</div>
              <div className="bg-slate-100 rounded-xl px-4 py-3">
                <span className="text-lg font-semibold text-slate-800">${redeemableDollars}</span>
              </div>
              
              <div className="mt-4 space-y-2 text-xs text-slate-500">
                <div className="flex items-start gap-2">
                  <span className="text-[#0B74E8]">•</span>
                  <span>Minimum Redeemable amount is ${MINIMUM_REDEEMABLE_DOLLARS} ({MINIMUM_REDEEMABLE_COINS} Coins).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#0B74E8]">•</span>
                  <span>Payout will take 3 - 5 working days</span>
                </div>
              </div>
            </div>

            {/* Redeem Button */}
            <button
              type="button"
              disabled={totalCoins < MINIMUM_REDEEMABLE_COINS}
              className="w-full bg-[#0B74E8] text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tukar Sekarang
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="text-slate-400 mb-2">
              <Coins className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <p className="text-slate-500 text-sm">Belum ada transaksi</p>
          </div>
        )}
      </div>
    </div>
  )
}
