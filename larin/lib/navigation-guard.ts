"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// List of protected routes that require proper navigation
const PROTECTED_ROUTES = [
  "/daily_quiz",
  "/self_challenge",
  "/self_challenge/quiz",
  "/self_challenge/result",
  "/true_false",
  "/true_false/multiple_choice",
  "/true_false/true-false_statement",
  "/true_false/self_challenge",
  "/quiz_play",
  "/profile",
  "/select_avatar",
  "/dashboard/login/select_avatar",
]

// Check if current path is protected
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )
}

// Hook to protect page from direct URL access
export function useNavigationGuard() {
  const router = useRouter()
  const [isValidAccess, setIsValidAccess] = useState(false)

  useEffect(() => {
    // Check if user came from proper navigation
    const navigationFlag = sessionStorage.getItem("skolarin_navigated")
    const currentPath = window.location.pathname

    if (navigationFlag === "true") {
      // Valid navigation - allow access and clear flag
      sessionStorage.removeItem("skolarin_navigated")
      setIsValidAccess(true)
    } else {
      // Direct URL access - redirect to dashboard
      if (isProtectedRoute(currentPath)) {
        router.replace("/dashboard")
      } else {
        setIsValidAccess(true)
      }
    }
  }, [router])

  return isValidAccess
}

// Function to call when navigating properly
export function markNavigationAsValid() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("skolarin_navigated", "true")
  }
}
