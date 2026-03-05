"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Coins } from "lucide-react"
import Logo from "@/components/logo"

interface TukarKoinProps {
  isOpen: boolean
  onClose: () => void
  totalCoins?: number
}

// Conversion rate: 10 coins = $1.0
const COIN_TO_DOLLAR_RATE = 0.1
const MINIMUM_REDEEMABLE_COINS = 100
const MINIMUM_REDEEMABLE_DOLLARS = 10.0

export default function TukarKoin({ isOpen, onClose, totalCoins = 200 }: TukarKoinProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"permintaan" | "transaksi">("permintaan")
  const [redeemAmount, setRedeemAmount] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = window.localStorage.getItem("skolarin_auth_token")
    setIsLoggedIn(!!token)
  }, [])

  const redeemableDollars = (totalCoins * COIN_TO_DOLLAR_RATE).toFixed(1)

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
      <div className="relative h-full w-full bg-[#F0F4F8] md:mx-auto md:mt-4 md:h-auto md:min-h-[600px] md:w-[min(94vw,640px)] md:rounded-3xl md:shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-200 md:rounded-t-3xl">
          <button 
            onClick={onClose}
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
        <div className="p-4 space-y-4">
          {activeTab === "permintaan" ? (
            <>
              {/* Total Koin Card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="text-sm text-slate-600 mb-2">Total Koin</div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-yellow-700" />
                  </div>
                  <span className="text-3xl font-bold text-slate-800">{totalCoins}</span>
                </div>
              </div>

              {/* Redeemable Amount Card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                <div>
                  <div className="text-sm text-slate-600 mb-2">Jumlah yang Dapat Ditukarkan</div>
                  <div className="bg-slate-100 rounded-lg px-4 py-3">
                    <span className="text-xl font-semibold text-slate-700">${redeemableDollars}</span>
                  </div>
                </div>

                {/* Info Text */}
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 mt-1">•</span>
                    <span>Minimum Redeemable amount is ${MINIMUM_REDEEMABLE_DOLLARS.toFixed(1)} ({MINIMUM_REDEEMABLE_COINS} Coins).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 mt-1">•</span>
                    <span>Payout will take 3 - 5 working days</span>
                  </div>
                </div>
              </div>

              {/* Redeem Button */}
              <button
                onClick={() => {
                  // Handle redeem logic here
                  alert(`Request to redeem ${redeemableDollars} submitted!`)
                }}
                disabled={totalCoins < MINIMUM_REDEEMABLE_COINS}
                className="w-full bg-[#0B74E8] text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-blue-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Tukar Sekarang
              </button>
            </>
          ) : (
            /* Transaksi Tab - Transaction History */
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-center py-8 text-slate-500">
                Belum ada transaksi penukaran koin
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
