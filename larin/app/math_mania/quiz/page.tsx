"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Coins, CheckCircle, XCircle, Star } from "lucide-react"
import Image from "next/image"

interface Question {
  id: number
  type: "multiple_choice" | "true_false"
  question: string
  options: string[]
  correctAnswer: string
}

export default function MathQuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const level = searchParams.get("level") || "1"

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userCoins, setUserCoins] = useState<number>(0)
  const [coinsSaved, setCoinsSaved] = useState(false)

  // Fetch questions and user data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = window.localStorage.getItem("skolarin_auth_token")
        
        // Fetch questions
        const questionsResponse = await fetch(`http://127.0.0.1:8000/quiz/mathematics/questions?level=${level}`, {
          headers: {
            "Authorization": `Bearer ${token || ''}`,
          },
        })

        if (!questionsResponse.ok) {
          throw new Error("Failed to fetch questions")
        }

        const questionsData = await questionsResponse.json()
        setQuestions(questionsData.questions || [])

        // Fetch user profile for coins
        const userResponse = await fetch(`http://127.0.0.1:8000/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token || ''}`,
          },
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserCoins(userData.coins || 0)
        }

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load questions")
        setLoading(false)
      }
    }

    fetchData()
  }, [level])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !loading && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult && !loading && questions.length > 0) {
      // Time's up - move to next question
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setTimeLeft(30)
      } else {
        setShowResult(true)
      }
    }
  }, [timeLeft, showResult, loading, questions.length, currentQuestion])

  // Save earned coins when quiz ends
  useEffect(() => {
    if (showResult && !coinsSaved && score > 0) {
      const saveCoins = async () => {
        const token = window.localStorage.getItem("skolarin_auth_token")
        const coinsEarned = score * 2
        
        try {
          await fetch(`http://127.0.0.1:8000/auth/update-coins?amount=${coinsEarned}&title=Math Mania Level ${level}`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token || ''}`,
            },
          })
          setCoinsSaved(true)
        } catch (err) {
          console.error("Failed to save coins:", err)
        }
      }
      
      saveCoins()
    }
  }, [showResult, coinsSaved, score, level])

  const handleAnswer = (answer: string) => {
    if (!questions[currentQuestion]) return

    setSelectedAnswer(answer)
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setTimeLeft(30) // Reset timer for next question
      } else {
        setShowResult(true)
      }
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1F7AE0] flex items-center justify-center">
        <div className="text-white text-lg font-semibold">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1F7AE0] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="w-full py-3 bg-[#1F7AE0] text-white rounded-xl font-semibold hover:bg-[#1968C0] transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  if (showResult) {
    const correctAnswers = score
    const wrongAnswers = questions.length - score
    const percentage = Math.round((score / questions.length) * 100)
    const coinsEarned = score * 2 // 2 coins per correct answer
    const stars = percentage >= 80 ? 3 : percentage >= 50 ? 2 : percentage >= 30 ? 1 : 0

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="bg-[#1F7AE0] px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/math_mania/mathematics")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-white font-semibold text-lg">Hasil Matematika Mania</h1>
          <div className="w-10" />
        </header>

        {/* Result Card */}
        <main className="flex-1 px-4 py-6">
          <div className="bg-[#1F7AE0] rounded-3xl p-6 text-white">
            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-1">
                {percentage >= 80 ? "Sempurna!" : percentage >= 50 ? "Bagus sekali!" : "Terus berlatih!"}
              </h2>
              <p className="text-white/90 text-sm">
                {percentage >= 50 ? "Anda membuat kemajuan, teruslah!" : "Jangan menyerah, coba lagi!"}
              </p>
            </div>

            {/* Mascot */}
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 relative">
                <Image
                  src="/images/fun.png"
                  alt="Mascot"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between mb-6">
              {/* Correct */}
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">{correctAnswers}/{questions.length}</span>
              </div>

              {/* Progress Circle */}
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(percentage / 100) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{percentage}%</span>
                </div>
              </div>

              {/* Wrong */}
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">{wrongAnswers}/{questions.length}</span>
              </div>
            </div>

            {/* Coins & Stars */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Coins className="h-5 w-5" />
                <span className="font-semibold">+{coinsEarned}</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-white/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push(`/math_mania/quiz/review?level=${level}`)}
              className="w-full py-4 bg-white border-2 border-[#1F7AE0] text-[#1F7AE0] rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Tinjau Jawaban
            </button>
            <button
              onClick={() => {
                // Share functionality
                if (navigator.share) {
                  navigator.share({
                    title: "Skor Math Mania Saya!",
                    text: `Saya mendapatkan ${score}/${questions.length} (${percentage}%) di Math Mania Level ${level}!`,
                  })
                }
              }}
              className="w-full py-4 bg-white border-2 border-[#1F7AE0] text-[#1F7AE0] rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Bagikan Skor Anda
            </button>
            <button
              onClick={() => router.push("/math_mania/mathematics")}
              className="w-full py-4 bg-white border-2 border-[#1F7AE0] text-[#1F7AE0] rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Beranda
            </button>
          </div>
        </main>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-[#1F7AE0] flex items-center justify-center">
        <div className="text-white text-lg font-semibold">No questions available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1F7AE0] flex flex-col">
      {/* Header */}
      <header className="bg-[#1F7AE0] px-4 py-4 flex items-center justify-between relative">
        <button
          onClick={() => router.back()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-white font-semibold text-lg">Quiz</h1>
          <div className="text-white/80 text-sm font-medium">Matematika {level}</div>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Timer Circle */}
      <div className="flex justify-center -mt-2 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#4A9CF0] flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {timeLeft}
        </div>
      </div>

      {/* Quiz Card */}
      <main className="flex-1 px-4 pb-6">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Badges Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#1F7AE0] text-white text-sm font-semibold rounded-full">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full">
              <Coins className="h-4 w-4" />
              <span>{userCoins}</span>
            </div>
          </div>

          {/* Question */}
          <div className="px-6 py-6">
            <p className="text-slate-800 text-lg leading-relaxed font-medium">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="px-6 pb-6 space-y-3">
            {currentQ.type === "true_false" ? (
              <div className="grid grid-cols-2 gap-4">
                {currentQ.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`py-4 px-6 rounded-xl border-2 font-semibold text-lg transition-all ${
                      selectedAnswer !== null
                        ? option === currentQ.correctAnswer
                          ? "bg-green-100 border-green-500 text-green-700"
                          : option === selectedAnswer
                            ? "bg-red-100 border-red-500 text-red-700"
                            : "bg-white border-slate-200 text-slate-500"
                        : "bg-white border-slate-200 text-slate-700 hover:border-[#1F7AE0] hover:text-[#1F7AE0]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`w-full py-4 px-6 rounded-xl border-2 font-medium text-left transition-all ${
                      selectedAnswer !== null
                        ? option === currentQ.correctAnswer
                          ? "bg-green-100 border-green-500 text-green-700"
                          : option === selectedAnswer
                            ? "bg-red-100 border-red-500 text-red-700"
                            : "bg-white border-slate-200 text-slate-500"
                        : "bg-white border-slate-200 text-slate-700 hover:border-[#1F7AE0] hover:text-[#1F7AE0]"
                    }`}
                  >
                    <span className={`inline-block text-sm font-semibold mr-3 ${
                      selectedAnswer !== null
                        ? option === currentQ.correctAnswer
                          ? "text-green-700"
                          : option === selectedAnswer
                            ? "text-red-700"
                            : "text-slate-500"
                        : "text-slate-600"
                    }`}>
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
