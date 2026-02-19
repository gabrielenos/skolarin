"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, ArrowUp, Check, Circle } from "lucide-react"
import { useNavigationGuard, markNavigationAsValid } from "@/lib/navigation-guard"

interface Question {
  id: number
  question: string
  options: string[]
}

interface QuizState {
  questions: Question[]
  currentIndex: number
  answers: Record<number, number>
  timeRemaining: number
  durationMinutes: number
}

export default function SelfChallengeQuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isValidAccess = useNavigationGuard()
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    answers: {},
    timeRemaining: 180,
    durationMinutes: 3
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const API_URL = "http://127.0.0.1:8000"

  // Get settings from query params
  const category = searchParams.get("category") || "Pilihan Ganda"
  const subcategory = searchParams.get("subcategory") || "Bahasa Indonesia"
  const questionCount = parseInt(searchParams.get("count") || "10")
  const durationMinutes = parseInt(searchParams.get("duration") || "3")

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Fetch questions from backend
  useEffect(() => {
    const token = localStorage.getItem("skolarin_auth_token")
    if (!token) {
      router.push("/dashboard/login")
      return
    }

    fetch(`${API_URL}/quiz/self-challenge/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        category,
        subcategory,
        question_count: questionCount,
        duration_minutes: durationMinutes
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Gagal memuat soal")
        return res.json()
      })
      .then(data => {
        setQuizState(prev => ({
          ...prev,
          questions: data.questions,
          timeRemaining: data.duration_minutes * 60,
          durationMinutes: data.duration_minutes
        }))
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [router, category, subcategory, questionCount, durationMinutes])

  // Timer countdown
  useEffect(() => {
    if (quizState.timeRemaining <= 0 || loading) return
    const timer = setInterval(() => {
      setQuizState(prev => ({
        ...prev,
        timeRemaining: prev.timeRemaining - 1
      }))
    }, 1000)
    return () => clearInterval(timer)
  }, [quizState.timeRemaining, loading])

  const handleSelectAnswer = (optionIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [prev.currentIndex]: optionIndex }
    }))
  }

  const handleNext = () => {
    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      }))
    }
  }

  const handlePrev = () => {
    if (quizState.currentIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1
      }))
    }
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem("skolarin_auth_token")
    if (!token) return

    const answers: Record<string, number> = {}
    quizState.questions.forEach((q, idx) => {
      if (quizState.answers[idx] !== undefined) {
        answers[q.id] = quizState.answers[idx]
      }
    })

    try {
      const res = await fetch(`${API_URL}/quiz/self-challenge/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers, subcategory })
      })

      if (!res.ok) throw new Error("Gagal submit jawaban")

      const result = await res.json()
      markNavigationAsValid()
      router.push(`/self_challenge/result?score=${result.score}&total=${result.total}&coins=${result.reward_coins}`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleOpenConfirm = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false)
    handleSubmit()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  if (!isValidAccess) {
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

  if (quizState.questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-slate-500">Tidak ada soal tersedia</div>
      </div>
    )
  }

  const currentQuestion = quizState.questions[quizState.currentIndex]
  const selectedAnswer = quizState.answers[quizState.currentIndex]

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F5F7FA] px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          
          {/* Timer */}
          <div className="px-4 py-1.5 border-2 border-slate-300 rounded-full">
            <span className="text-sm font-semibold text-slate-700">
              {formatTime(quizState.timeRemaining)}
            </span>
          </div>
          
          <div className="w-10" />
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 px-4 py-4">
        <h1 className="text-base font-semibold text-slate-800 leading-relaxed mb-6">
          {currentQuestion.question}
        </h1>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full text-left p-4 rounded-xl bg-white border transition-all duration-200 ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <span className="text-sm text-slate-700 leading-relaxed">{option}</span>
              </button>
            )
          })}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 bg-[#F5F7FA] px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            disabled={quizState.currentIndex === 0}
            className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-slate-200 ${
              quizState.currentIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-slate-50"
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>

          {/* Center Button - Submit or navigate */}
          <button
            onClick={handleOpenConfirm}
            className="w-16 h-16 rounded-2xl bg-[#1E293B] flex items-center justify-center shadow-lg"
          >
            <ArrowUp className="w-6 h-6 text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={quizState.currentIndex === quizState.questions.length - 1}
            className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-slate-200 ${
              quizState.currentIndex === quizState.questions.length - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-slate-50"
            }`}
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </footer>
      {/* Confirm Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 text-center mb-6">
              Pertanyaan yang Dicoba
            </h2>

            {/* Question Numbers */}
            <div className="flex justify-center gap-2 mb-6">
              {quizState.questions.map((_, idx) => {
                const isAnswered = quizState.answers[idx] !== undefined
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuizState(prev => ({ ...prev, currentIndex: idx }))
                      setShowConfirmModal(false)
                    }}
                    className={`w-12 h-12 rounded-xl border-2 font-semibold text-sm transition-all ${
                      isAnswered
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-slate-300 bg-white text-slate-600"
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex justify-between items-center mb-6 px-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-slate-600">Dicoba</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                  <Circle className="w-3 h-3 text-slate-400" />
                </div>
                <span className="text-sm text-slate-600">Tidak Dicoba</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleConfirmSubmit}
              className="w-full h-12 rounded-xl bg-[#0B78E3] text-white font-semibold hover:bg-[#0969C8] transition-colors"
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
