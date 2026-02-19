"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import { useNavigationGuard } from "@/lib/navigation-guard"

interface Question {
  id: number
  question: string
  options: string[]
}

interface QuizStatus {
  can_play: boolean
  already_played_today: boolean
  message: string
}

interface SubmitResult {
  correct: boolean
  correct_answer: number
  reward_coins: number
}

export default function DailyQuizPage() {
  const router = useRouter()
  const isValidAccess = useNavigationGuard()
  const [question, setQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<QuizStatus | null>(null)
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const API_URL = "http://127.0.0.1:8000"

  useEffect(() => {
    const token = localStorage.getItem("skolarin_auth_token")
    if (!token) {
      router.push("/dashboard/login")
      return
    }

    // Cek status daily quiz
    fetch(`${API_URL}/quiz/daily/status`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((statusData: QuizStatus) => {
        setStatus(statusData)
        
        if (!statusData.can_play) {
          setLoading(false)
          return
        }

        // Ambil soal
        return fetch(`${API_URL}/quiz/daily/question`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          if (!res.ok) throw new Error("Gagal mengambil soal")
          return res.json()
        })
      })
      .then(q => {
        if (q) {
          setQuestion(q)
          setLoading(false)
        }
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [router])

  const handleSelect = (index: number) => {
    if (isSubmitted) return
    setSelectedAnswer(index)
  }

  const handleSubmit = async () => {
    if (selectedAnswer === null || !question) return
    
    const token = localStorage.getItem("skolarin_auth_token")
    if (!token) return

    try {
      const res = await fetch(`${API_URL}/quiz/daily/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          question_id: question.id,
          selected_answer: selectedAnswer
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Gagal submit jawaban")
      }

      const data: SubmitResult = await res.json()
      setResult(data)
      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleNext = () => {
    router.back()
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  // Block if not valid navigation
  if (!isValidAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  // Sudah main hari ini
  if (status?.already_played_today) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-48 h-48 mx-auto mb-6">
            <img
              src="/images/gambar.png"
              alt="Maskot"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-lg text-slate-600 font-medium">Sudah dimainkan :(</p>
          <button
            onClick={() => router.back()}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium hidden sm:inline">Kembali</span>
            </button>
            <div className="text-lg font-bold text-slate-900">
              Kuis Harian
            </div>
            <div className="w-20" /> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="mb-6 sm:mb-8">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              Soal 1
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
              {question?.question}
            </h1>
          </div>

          {/* Options */}
          <div className="space-y-3 sm:space-y-4">
            {question?.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = result && index === result.correct_answer
              const showWrong = isSubmitted && isSelected && !isCorrect

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 ${
                    isCorrect
                      ? "border-green-500 bg-green-50"
                      : showWrong
                      ? "border-red-500 bg-red-50"
                      : isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        isCorrect
                          ? "border-green-500 bg-green-500"
                          : showWrong
                          ? "border-red-500 bg-red-500"
                          : isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-slate-300"
                      }`}
                    >
                      {(isSelected || isCorrect) && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="text-slate-700 leading-relaxed">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Action Button */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  selectedAnswer !== null
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Kirim Jawaban
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
              >
                {result?.correct ? "Lanjutkan" : "Kembali"}
              </button>
            )}
          </div>

          {/* Feedback */}
          {isSubmitted && result && (
            <div
              className={`mt-4 p-4 rounded-xl text-center font-medium ${
                result.correct
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {result.correct
                ? `🎉 Jawaban benar! +${result.reward_coins} koin`
                : `❌ Jawaban salah. Jawaban yang benar adalah ${String.fromCharCode(65 + result.correct_answer)}.`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
