"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, SearchX } from "lucide-react"

export default function QuizAudioPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#29579F] px-4 py-3 flex items-center">
        <button
          onClick={() => router.back()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-white font-semibold text-lg ml-4">Audio Quiz</h1>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchX className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Data Tidak Ditemukan
          </h2>
          <p className="text-slate-500 mb-8">
            Maaf, soal audio untuk kategori ini belum tersedia saat ini.
          </p>
          <button
            onClick={() => router.push("/audio_questions")}
            className="w-full py-4 bg-[#1F7AE0] text-white rounded-xl font-semibold hover:bg-[#1968C0] transition-colors"
          >
            Kembali
          </button>
        </div>
      </main>
    </div>
  )
}
