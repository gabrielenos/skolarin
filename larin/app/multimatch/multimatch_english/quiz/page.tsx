"use client"

import { useLayoutEffect, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Settings, Trophy } from "lucide-react"
import Logo from "@/components/logo"
import ProfileBar from "@/components/profile-bar"
import SettingsMenu from "@/components/settings-menu"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
}

export default function MultimatchEnglishQuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const level = searchParams.get("level") || "1"

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem("skolarin-theme") === "dark"
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  // Sample questions for multimatch English
  const questions: Question[] = [
    {
      id: 1,
      question: "What is the synonym of 'happy'?",
      options: ["sad", "joyful", "angry", "tired"],
      correctAnswer: "joyful",
    },
    {
      id: 2,
      question: "Which word is a verb?",
      options: ["quickly", "beautiful", "run", "happiness"],
      correctAnswer: "run",
    },
    {
      id: 3,
      question: "What is the past tense of 'go'?",
      options: ["goed", "went", "gone", "going"],
      correctAnswer: "went",
    },
    {
      id: 4,
      question: "Which is a preposition?",
      options: ["and", "the", "under", "quickly"],
      correctAnswer: "under",
    },
    {
      id: 5,
      question: "What is the plural of 'child'?",
      options: ["childs", "children", "childes", "childen"],
      correctAnswer: "children",
    },
  ]

  const pageBgClass = isDarkMode ? "bg-slate-100" : "bg-[#F0F4F8]"
  const navBgClass = "bg-[#29579F]"

  useLayoutEffect(() => {
    const syncTheme = () => {
      const storedTheme = window.localStorage.getItem("skolarin-theme")
      setIsDarkMode(storedTheme === "dark")
      if (storedTheme !== "dark" && storedTheme !== "light") {
        window.localStorage.setItem("skolarin-theme", "light")
      }
    }

    syncTheme()

    const onThemeChange = () => syncTheme()
    const onStorage = (e: StorageEvent) => {
      if (e.key === "skolarin-theme") syncTheme()
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") syncTheme()
    }

    window.addEventListener("skolarin-theme-change", onThemeChange)
    window.addEventListener("focus", onThemeChange)
    window.addEventListener("storage", onStorage)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      window.removeEventListener("skolarin-theme-change", onThemeChange)
      window.removeEventListener("focus", onThemeChange)
      window.removeEventListener("storage", onStorage)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div suppressHydrationWarning className={`min-h-screen flex flex-col ${pageBgClass}`}>
      <nav className={`relative z-50 w-full ${navBgClass} text-white shadow-md`}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl px-3 py-1.5">
              <Logo width={32} height={36} />
            </div>
            <span className="text-xl font-semibold tracking-wide">Skolarin</span>
          </div>

          <div className="relative z-50">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Trophy"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B74E8] text-white shadow-sm hover:bg-[#095FC0] transition-colors"
              >
                <Trophy className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label="Settings"
                onClick={() => setIsSettingsOpen((prev) => !prev)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B74E8] text-white shadow-sm hover:bg-[#095FC0] transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>

            {isSettingsOpen && <SettingsMenu onClose={() => setIsSettingsOpen(false)} />}
          </div>
        </div>
      </nav>

      <ProfileBar isDarkMode={isDarkMode} />

      <main className="flex-1 mx-auto w-full max-w-[800px] px-4 pt-6 pb-16 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            English Level {level}
          </h1>
        </div>

        {!showResult ? (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Pertanyaan {currentQuestionIndex + 1} dari {questions.length}</span>
                <span>Skor: {score}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-[#1F7AE0] h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 rounded-xl text-left transition-colors ${
                    selectedAnswer === option
                      ? "bg-[#1F7AE0] text-white"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}. {option}</span>
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className={`mt-6 w-full py-4 rounded-xl font-semibold transition-colors ${
                selectedAnswer
                  ? "bg-[#1F7AE0] text-white hover:bg-[#1968C0]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {currentQuestionIndex === questions.length - 1 ? "Selesai" : "Selanjutnya"}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-[#E8F4FD] rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-10 w-10 text-[#1F7AE0]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz Selesai!</h2>
            <p className="text-slate-500 mb-6">
              Anda menjawab {score} dari {questions.length} pertanyaan dengan benar
            </p>
            <div className="text-4xl font-bold text-[#1F7AE0] mb-8">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 py-4 bg-[#1F7AE0] text-white rounded-xl font-semibold hover:bg-[#1968C0] transition-colors"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => router.push("/multimatch/multimatch_english")}
                className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
