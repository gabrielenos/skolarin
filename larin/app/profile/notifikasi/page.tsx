"use client"

import { ChevronLeft, Bell } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotifikasiPage() {
  const router = useRouter()

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
          <h1 className="flex-1 text-center text-lg font-semibold text-slate-800 -ml-10">
            Notifikasi
          </h1>
        </div>
      </header>

      <main className="px-4 py-4">
        <div className="mx-auto max-w-2xl">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">Tidak ada notifikasi</p>
          </div>
        </div>
      </main>
    </div>
  )
}
