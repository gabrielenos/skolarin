"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Clock, Coins, Lightbulb, Delete, X } from "lucide-react"

interface Question {
  id: number
  sentence: string
  hint: string
  scrambledLetters: string[]
}

interface GuessTheWordGameProps {
  category: string
  level: number
  questions: Question[]
  initialCoins?: number
  onBack?: () => void
  onComplete?: (score: number, coins: number) => void
}

// Get check answer endpoint based on category
const getCheckAnswerEndpoint = (category: string) => {
  if (category === "Indonesia Language" || category === "indonesia") {
    return "http://127.0.0.1:8000/quiz/indonesia/check-answer"
  }
  if (category === "Mathematics" || category === "mathematics") {
    return "http://127.0.0.1:8000/quiz/mathematics/scramble-check"
  }
  return "http://127.0.0.1:8000/quiz/english/check-answer"
}

export default function GuessTheWordGame({
  category,
  level,
  questions,
  initialCoins = 0,
  onBack,
  onComplete,
}: GuessTheWordGameProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(initialCoins)
  const [showHint, setShowHint] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [answers, setAnswers] = useState<{ questionId: number; correct: boolean }[]>([])
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([])

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progress = currentQuestionIndex + 1

  // Shuffle letters using Fisher-Yates algorithm
  const shuffleArray = useCallback((array: string[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [])

  // Shuffle letters when question changes
  useEffect(() => {
    if (currentQuestion) {
      setShuffledLetters(shuffleArray(currentQuestion.scrambledLetters))
    }
  }, [currentQuestion, currentQuestionIndex, shuffleArray])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, isCompleted])

  // Handle letter selection
  const handleLetterClick = useCallback((letter: string) => {
    if (selectedLetters.length < currentQuestion.scrambledLetters.length) {
      setSelectedLetters((prev) => [...prev, letter])
    }
  }, [selectedLetters.length, currentQuestion.scrambledLetters.length])

  // Handle delete
  const handleDelete = useCallback(() => {
    setSelectedLetters((prev) => prev.slice(0, -1))
  }, [])

  // Handle hint
  const handleHint = useCallback(() => {
    if (coins >= 10) {
      setCoins((prev) => prev - 10)
      setShowHint(true)
    }
  }, [coins])

  // Check answer and submit
  const handleSubmit = useCallback(async () => {
    const userAnswer = selectedLetters.join("").toUpperCase()
    
    // Check answer via backend API
    const token = window.localStorage.getItem("skolarin_auth_token")
    let isCorrect = false
    
    try {
      const response = await fetch(getCheckAnswerEndpoint(category), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ''}`,
        },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          answer: userAnswer,
        }),
      })
      
      if (response.ok) {
        const result = await response.json()
        isCorrect = result.correct
      }
    } catch (err) {
      console.error("Failed to check answer:", err)
      // Fallback: assume incorrect if API fails
      isCorrect = false
    }

    setAnswers((prev) => [...prev, { questionId: currentQuestion.id, correct: isCorrect }])

    if (isCorrect) {
      setScore((prev) => prev + 10)
      setCoins((prev) => prev + 5)
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedLetters([])
      setShowHint(false)
      setTimeLeft(60)
    } else {
      setIsCompleted(true)
      const finalScore = score + (isCorrect ? 10 : 0)
      const finalCoins = coins + (isCorrect ? 5 : 0)
      onComplete?.(finalScore, finalCoins)
    }
  }, [selectedLetters, currentQuestion, currentQuestionIndex, totalQuestions, score, coins, onComplete, category])

  // Format sentence with blanks
  const renderSentence = () => {
    const parts = currentQuestion.sentence.split("____")
    return (
      <div className="text-center text-lg sm:text-xl md:text-2xl font-medium text-slate-800 leading-relaxed">
        {parts[0]}
        <span className="inline-flex items-center justify-center mx-1">
          {currentQuestion.scrambledLetters.map((_, index) => (
            <span
              key={index}
              className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 mx-0.5 border-b-2 font-bold text-lg sm:text-xl ${
                selectedLetters[index]
                  ? "border-[#0B74E8] text-[#0B74E8]"
                  : "border-slate-300 text-slate-400"
              }`}
            >
              {selectedLetters[index] || ""}
            </span>
          ))}
        </span>
        {parts[1]}
      </div>
    )
  }

 
  if (isCompleted) {
    const correctAnswers = answers.filter((a) => a.correct).length
    const totalEarnedCoins = correctAnswers * 5

    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
 
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-200">
          <button onClick={onBack || (() => router.back())} className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft className="h-6 w-6 text-slate-700" />
          </button>
          <h1 className="text-lg font-semibold text-slate-800">Hasil Quiz</h1>
          <div className="w-10" />
        </div>

    
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#0B74E8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Quiz Selesai!</h2>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600">Jawaban Benar</span>
                <span className="font-bold text-[#0B74E8]">{correctAnswers}/{totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600">Total Skor</span>
                <span className="font-bold text-[#0B74E8]">{score}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-600">Koin Didapat</span>
                <span className="font-bold text-yellow-600">+{totalEarnedCoins}</span>
              </div>
            </div>

            <button
              onClick={onBack || (() => router.back())}
              className="w-full bg-[#0B74E8] text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200/50 hover:bg-[#095FC0]"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
     
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-200">
        <button onClick={onBack || (() => router.back())} className="p-2 hover:bg-slate-100 rounded-full">
          <ChevronLeft className="h-6 w-6 text-slate-700" />
        </button>

     
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
          <Clock className={`h-4 w-4 ${timeLeft <= 10 ? "text-red-500" : "text-slate-600"}`} />
          <span className={`font-mono font-semibold ${timeLeft <= 10 ? "text-red-500" : "text-slate-700"}`}>
            {timeLeft}
          </span>
        </div>

        <div className="text-sm font-medium text-slate-600">
          {progress}/{totalQuestions}
        </div>
      </div>

      <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-yellow-500" />
          <span className="font-semibold text-slate-700">{coins}</span>
        </div>
        <div className="text-sm text-slate-500">
          {category} - Level {level}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm mb-6">
            <div className="mb-8">
              {renderSentence()}
            </div>

            {showHint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <p className="text-sm text-yellow-800">{currentQuestion.hint}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2 sm:gap-3 mb-6 flex-wrap">
            {shuffledLetters.map((letter, index) => (
              <button
                key={index}
                onClick={() => handleLetterClick(letter)}
                disabled={selectedLetters.includes(letter)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-bold text-lg sm:text-xl transition-all ${
                  selectedLetters.includes(letter)
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-white text-slate-700 shadow-md hover:shadow-lg hover:bg-[#0B74E8] hover:text-white"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={handleHint}
              disabled={coins < 10 || showHint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lightbulb className="h-4 w-4" />
              Petunjuk
              <span className="text-yellow-600">(-10)</span>
            </button>

            <button
              onClick={handleDelete}
              disabled={selectedLetters.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Delete className="h-4 w-4" />
              Hapus
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedLetters.length !== currentQuestion.scrambledLetters.length}
            className="w-full bg-[#0B74E8] text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200/50 hover:bg-[#095FC0] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  )
}
