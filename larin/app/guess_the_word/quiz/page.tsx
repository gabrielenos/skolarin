"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import GuessTheWordGame from "@/components/guess-the-word-game"

interface Question {
  id: number
  type: string
  sentence: string
  scrambledLetters: string[]
  hint: string
}

export default function GuessTheWordQuizPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const level = parseInt(searchParams.get("level") || "1")
  const category = searchParams.get("category") || "English"
  const [userCoins, setUserCoins] = useState<number>(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get API endpoint based on category
  const getApiEndpoint = () => {
    if (category === "Indonesia Language" || category === "indonesia") {
      return `http://127.0.0.1:8000/quiz/indonesia/questions?level=${level}`
    }
    if (category === "Mathematics" || category === "mathematics") {
      return `http://127.0.0.1:8000/quiz/mathematics/scramble?level=${level}`
    }
    return `http://127.0.0.1:8000/quiz/english/questions?level=${level}`
  }

  // Fetch questions and user coins from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = window.localStorage.getItem("skolarin_auth_token")
        
        // Fetch questions from backend
        const questionsResponse = await fetch(getApiEndpoint(), {
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
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError(err instanceof Error ? err.message : "Failed to load quiz data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [level, category])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#29579F]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#29579F] text-white rounded-lg"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  return (
    <GuessTheWordGame
      category={category}
      level={level}
      questions={questions}
      initialCoins={userCoins}
      onBack={() => router.back()}
      onComplete={(score, coins) => {
        console.log("Quiz completed! Score:", score, "Coins:", coins)
        // Handle completion - save to backend, etc.
      }}
    />
  )
}
