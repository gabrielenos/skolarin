"use client"

import { useLayoutEffect, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Users, Timer, Play } from "lucide-react"
import { API_BASE_URL } from "@/lib/api"

interface Question {
  id: number
  question: string
  options: string[]
}

export default function QuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const level = searchParams.get("level") || "1"
  const category = searchParams.get("category") || "indonesia"

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [coins, setCoins] = useState(0)

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totalQuestions = questions.length
  const currentQuestion = questions[currentQuestionIndex]

  // Fetch user data (coins) from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("skolarin_auth_token")
        if (!token) return

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setCoins(data.coins || 0)
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err)
      }
    }
    fetchUserData()
  }, [])

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${API_BASE_URL}/quiz-zone/questions?category=${category}&level=${level}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch questions")
        }
        const data = await response.json()
        setQuestions(data.questions)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [category, level])

  const pageBgClass = "bg-[#1F7AE0]"

  // Timer countdown
  useLayoutEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(String.fromCharCode(65 + index))
  }

  return (
    <div suppressHydrationWarning className={`min-h-screen flex flex-col ${pageBgClass}`}>
      {/* Main Quiz Content */}
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 pt-4 pb-16 sm:px-6 lg:px-8">
        {/* Header with back button and Quiz title */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-white">Quiz</h1>
          <div className="w-10" />
        </div>

        {/* Timer Circle */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#0B5FC0] flex items-center justify-center border-4 border-[#3A9CFF]">
            <span className="text-3xl font-bold text-white">{timeLeft}</span>
          </div>
        </div>

        {/* Quiz Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Progress and Coins Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-full bg-[#1F7AE0] text-white font-semibold text-sm">
                {currentQuestionIndex + 1} / {totalQuestions}
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC727] text-white font-semibold text-sm">
              <span className="text-yellow-900">🪙</span>
              <span className="text-yellow-900">{coins}</span>
            </div>
          </div>

          {/* Question */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F7AE0]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">Error: {error}</div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-slate-800 mb-6">
                  {currentQuestion?.question}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion?.options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index)
                    const isSelected = selectedAnswer === letter

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 rounded-2xl text-left border-2 transition-all ${
                          isSelected
                            ? "border-[#1F7AE0] bg-[#E8F4FD]"
                            : "border-slate-200 hover:border-[#1F7AE0] hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex gap-3">
                          <span className={`font-bold ${isSelected ? "text-[#1F7AE0]" : "text-slate-500"}`}>
                            {letter}.
                          </span>
                          <span className={`${isSelected ? "text-[#1F7AE0]" : "text-slate-700"}`}>
                            {option}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3">
              {/* 50:50 Button */}
              <button className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 border-[#1F7AE0] bg-white hover:bg-[#E8F4FD] transition-colors">
                <span className="text-sm font-bold text-[#1F7AE0]">50</span>
                <span className="text-xs text-[#1F7AE0]">50</span>
              </button>

              {/* Audience Button */}
              <button className="flex items-center justify-center w-16 h-16 rounded-2xl border-2 border-[#1F7AE0] bg-white hover:bg-[#E8F4FD] transition-colors">
                <Users className="h-6 w-6 text-[#1F7AE0]" />
              </button>

              {/* Timer/Skip Button */}
              <button className="flex items-center justify-center w-16 h-16 rounded-2xl border-2 border-[#1F7AE0] bg-white hover:bg-[#E8F4FD] transition-colors">
                <Timer className="h-6 w-6 text-[#1F7AE0]" />
              </button>
            </div>

            {/* Next Button */}
            <button
              disabled={!selectedAnswer}
              className={`flex items-center justify-center w-16 h-16 rounded-2xl transition-colors ${
                selectedAnswer
                  ? "bg-[#1F7AE0] hover:bg-[#1968C0]"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              <Play className="h-6 w-6 text-white fill-white" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
