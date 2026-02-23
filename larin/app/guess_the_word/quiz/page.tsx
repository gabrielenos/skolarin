"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Coins, Clock } from "lucide-react"

interface Question {
  id: number
  type: string
  sentence?: string
  question?: string
  scrambledLetters?: string[]
  options?: string[]
  hint?: string
}

export default function QuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const level = searchParams.get("level") || "1"
  const category = searchParams.get("category") || "english"

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [filledLetters, setFilledLetters] = useState<string[]>([])
  const [selectedLetters, setSelectedLetters] = useState<boolean[]>([])
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userCoins, setUserCoins] = useState<number>(202)
  const [showHint, setShowHint] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [shuffledLetters, setShuffledLetters] = useState<{letter: string, originalIndex: number}[]>([])

  // Shuffle function untuk mengacak huruf
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const getBlankCount = (sentence: string) => {
    const matches = sentence.match(/_{3,}/g)
    return matches ? matches[0].length : 5
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = window.localStorage.getItem("skolarin_auth_token")
        
        const categoryPath = category === "indonesia" ? "indonesia" : category === "mathematics" ? "mathematics" : "english"
        
        const questionsResponse = await fetch(`http://127.0.0.1:8000/quiz/${categoryPath}/questions?level=${level}`, {
          headers: { "Authorization": `Bearer ${token || ''}` },
        })

        if (questionsResponse.ok) {
          const data = await questionsResponse.json()
          setQuestions(data.questions)
          if (data.questions.length > 0) {
            const q = data.questions[0]
            if (q.sentence) {
              const blankCount = getBlankCount(q.sentence)
              setFilledLetters(Array(blankCount).fill(""))
            }
            if (q.scrambledLetters) {
              setSelectedLetters(Array(q.scrambledLetters.length).fill(false))
            }
          }
        }

        const userResponse = await fetch(`http://127.0.0.1:8000/auth/me`, {
          headers: { "Authorization": `Bearer ${token || ''}` },
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserCoins(userData.coins || 202)
        }

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load questions")
        setLoading(false)
      }
    }

    fetchData()
  }, [level])

  useEffect(() => {
    if (questions.length > 0 && currentQuestion < questions.length) {
      const q = questions[currentQuestion]
      if (q.sentence) {
        const blankCount = getBlankCount(q.sentence)
        setFilledLetters(Array(blankCount).fill(""))
      }
      if (q.scrambledLetters) {
        // Acak huruf-huruf
        const shuffled = q.scrambledLetters.map((letter, originalIndex) => ({ letter, originalIndex }))
        const randomized = shuffleArray(shuffled)
        setShuffledLetters(randomized)
        setSelectedLetters(Array(q.scrambledLetters.length).fill(false))
      }
      setShowHint(false)
      setAnswered(false)
      setIsCorrect(null)
      setTimeLeft(60)
    }
  }, [currentQuestion, questions])

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !loading && questions.length > 0 && !answered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult && !loading && questions.length > 0 && !answered) {
      handleSubmit()
    }
  }, [timeLeft, showResult, loading, questions.length, answered])

  const handleLetterClick = (shuffledIndex: number) => {
    if (answered) return
    const emptyIndex = filledLetters.findIndex(l => l === "")
    if (emptyIndex !== -1) {
      const letter = shuffledLetters[shuffledIndex].letter
      const originalIndex = shuffledLetters[shuffledIndex].originalIndex
      const newFilled = [...filledLetters]
      newFilled[emptyIndex] = letter
      setFilledLetters(newFilled)
      const newSelected = [...selectedLetters]
      newSelected[originalIndex] = true
      setSelectedLetters(newSelected)
    }
  }

  const handleBlankClick = (index: number) => {
    if (answered || !filledLetters[index]) return
    const letter = filledLetters[index]
    const newFilled = [...filledLetters]
    newFilled[index] = ""
    setFilledLetters(newFilled)
    // Cari huruf di shuffledLetters untuk mendapatkan originalIndex
    const shuffledItem = shuffledLetters.find((item: {letter: string, originalIndex: number}) => item.letter === letter && selectedLetters[item.originalIndex])
    if (shuffledItem) {
      const newSelected = [...selectedLetters]
      newSelected[shuffledItem.originalIndex] = false
      setSelectedLetters(newSelected)
    }
  }

  const handleClear = () => {
    if (answered) return
    const q = questions[currentQuestion]
    if (q.sentence) {
      const blankCount = getBlankCount(q.sentence)
      setFilledLetters(Array(blankCount).fill(""))
    }
    if (q.scrambledLetters) {
      // Acak ulang huruf
      const shuffled = q.scrambledLetters.map((letter, originalIndex) => ({ letter, originalIndex }))
      const randomized = shuffleArray(shuffled)
      setShuffledLetters(randomized)
      setSelectedLetters(Array(q.scrambledLetters.length).fill(false))
    }
  }

  const handleSubmit = async () => {
    if (answered) return
    const answer = filledLetters.join("")
    if (answer.length !== filledLetters.length) return

    try {
      const token = window.localStorage.getItem("skolarin_auth_token")
      const categoryPath = category === "indonesia" ? "indonesia" : category === "mathematics" ? "mathematics" : "english"
      const response = await fetch(`http://127.0.0.1:8000/quiz/${categoryPath}/check-answer`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token || ''}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_id: questions[currentQuestion].id,
          answer: answer
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setIsCorrect(result.correct)
        if (result.correct) setScore(score + 1)
      }
    } catch (err) {
      console.error("Failed to check answer:", err)
    }

    setAnswered(true)
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setShowResult(true)
      }
    }, 1500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 text-lg font-semibold">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
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
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-[#29579F] px-4 py-3 flex items-center">
          <button
            onClick={() => router.push(`/guess_the_word/${category === "indonesia" ? "indonesia_language" : category === "mathematics" ? "mathematics" : "english"}`)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-white font-semibold text-lg ml-4">Hasil Quiz</h1>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {percentage >= 80 ? "Sempurna!" : percentage >= 50 ? "Bagus!" : "Terus latih!"}
            </h2>
            <p className="text-slate-500 mb-6">{score} dari {questions.length} benar</p>
            <div className="text-5xl font-bold text-[#1F7AE0] mb-6">{percentage}%</div>
            <button
              onClick={() => router.push(`/guess_the_word/${category === "indonesia" ? "indonesia_language" : category === "mathematics" ? "mathematics" : "english"}`)}
              className="w-full py-4 bg-[#1F7AE0] text-white rounded-xl font-semibold hover:bg-[#1968C0] transition-colors"
            >
              Kembali
            </button>
          </div>
        </main>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 text-lg font-semibold">No questions available</div>
      </div>
    )
  }

  // Word Scramble Format (English/Indonesia/Mathematics)
  const sentenceParts = currentQ.sentence ? currentQ.sentence.split(/_{3,}/) : ["", ""]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#29579F] px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center">
          <div className="bg-[#1F7AE0] rounded-full px-4 py-1 flex items-center gap-1">
            <Clock className="h-4 w-4 text-white" />
            <span className="text-white font-bold">{timeLeft}</span>
          </div>
        </div>
        <div className="w-10" />
      </header>

      <div className="bg-[#29579F] px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-white" />
          <span className="text-white font-semibold">{userCoins}</span>
        </div>
        <div className="text-white font-semibold">
          {currentQuestion + 1} / {questions.length}
        </div>
      </div>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <p className="text-slate-800 text-lg leading-relaxed text-center">
              {sentenceParts[0]}
              <span className="inline-flex gap-1 mx-1">
                {filledLetters.map((letter, i) => (
                  <button
                    key={i}
                    onClick={() => handleBlankClick(i)}
                    className={`w-8 h-10 border-b-2 flex items-center justify-center font-semibold text-lg transition-colors ${
                      answered
                        ? isCorrect
                          ? "border-green-500 text-green-600"
                          : "border-red-500 text-red-600"
                        : letter
                          ? "border-[#1F7AE0] text-[#1F7AE0]"
                          : "border-slate-300 text-slate-400"
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </span>
              {sentenceParts[1] || ""}
            </p>
          </div>

          {showHint && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6">
              <p className="text-yellow-800 text-sm text-center">{currentQ.hint}</p>
            </div>
          )}

          {shuffledLetters.length > 0 && (
            <div className="flex justify-center gap-3 mb-8 flex-wrap">
              {shuffledLetters.map((item: {letter: string, originalIndex: number}, index: number) => (
                <button
                  key={index}
                  onClick={() => handleLetterClick(index)}
                  disabled={selectedLetters[item.originalIndex] || answered}
                  className={`w-12 h-12 rounded-lg font-bold text-lg transition-all ${
                    selectedLetters[item.originalIndex] || answered
                      ? "bg-slate-200 text-slate-400"
                      : "bg-white shadow-md text-slate-800 hover:bg-[#1F7AE0] hover:text-white"
                  }`}
                >
                  {item.letter}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-[#1F7AE0] hover:text-[#1F7AE0] transition-colors"
            >
              {showHint ? "Sembunyikan" : "Petunjuk"}
            </button>
            <button
              onClick={handleClear}
              disabled={answered}
              className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              Hapus
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={answered || filledLetters.some(l => l === "")}
            className="w-full py-4 bg-[#1F7AE0] text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-[#1968C0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {answered ? (isCorrect ? "Benar!" : "Salah!") : "Kirim"}
          </button>
        </div>
      </main>
    </div>
  )
}
