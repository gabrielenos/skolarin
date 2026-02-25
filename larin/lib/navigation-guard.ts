"use client"

import { useEffect, useState, useRef } from "react"
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
  const checkedRef = useRef(false)

  useEffect(() => {
    // Prevent double-check on React Strict Mode re-renders
    if (checkedRef.current) return
    checkedRef.current = true

    // Check if user came from proper navigation
    const navigationFlag = sessionStorage.getItem("skolarin_navigated")
    const currentPath = window.location.pathname

    console.log("[NavigationGuard] Current path:", currentPath)
    console.log("[NavigationGuard] Navigation flag:", navigationFlag)
    console.log("[NavigationGuard] Is protected:", isProtectedRoute(currentPath))

    if (navigationFlag === "true" || !isProtectedRoute(currentPath)) {
      // Valid navigation or not protected - allow access
      // Don't remove flag here - let it stay for back navigation
      console.log("[NavigationGuard] Valid navigation - allowing access")
      setIsValidAccess(true)
    } else {
      // Direct URL access - redirect to dashboard
      console.log("[NavigationGuard] Direct access detected - redirecting to dashboard")
      router.replace("/dashboard")
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

// Call this when leaving protected route (optional cleanup)
export function clearNavigationFlag() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("skolarin_navigated")
  }
}
