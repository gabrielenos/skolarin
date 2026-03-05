"use client"

import { useLayoutEffect, useState, useEffect } from "react"
import Image from "next/image"
import { DM_Sans } from "next/font/google"
import { useRouter } from "next/navigation"
import { Settings, Trophy } from "lucide-react"
import Logo from "@/components/logo"
import ProfileBar from "@/components/profile-bar"
import SettingsMenu from "@/components/settings-menu"
import LoadingScreen from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import { markNavigationAsValid } from "@/lib/navigation-guard"

const dmSans = DM_Sans({ subsets: ["latin"] })

export default function DashboardPage() {
  const router = useRouter()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem("skolarin-theme") === "dark"
  })

  // Check login status for button visibility or modal trigger
  const handlePlayClick = () => {
    // Check if user is logged in (using new token key to ensure clean state)
    const token = window.localStorage.getItem("skolarin_auth_token");

    if (!token || token === "undefined" || token === "null") {
      setIsLoginModalOpen(true)
    } else {
      // Menyingkronkan cookie lagi sebelum navigasi agar middleware pasti mendeteksi token
      document.cookie = `skolarin_auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      markNavigationAsValid()
      router.push("/quiz_play")
    }
  }

  const pageBgClass = isDarkMode ? "bg-slate-900" : "bg-slate-50"
  const navBgClass = "bg-[#29579F]"
  const mainHeadingClass = isDarkMode ? "text-white" : "text-slate-900"
  const mainTextClass = isDarkMode ? "text-slate-100" : "text-slate-700"

  useLayoutEffect(() => {
    const syncTheme = () => {
      const storedTheme = window.localStorage.getItem("skolarin-theme")
      setIsDarkMode(storedTheme === "dark")
      if (storedTheme !== "dark" && storedTheme !== "light") {
        window.localStorage.setItem("skolarin-theme", "light")
      }
    }

    const syncAuth = () => {
      const token = window.localStorage.getItem("skolarin_auth_token")
      if (token && token !== "undefined" && token !== "null") {
        document.cookie = `skolarin_auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      }
    }

    // Check if should show loading screen (only first visit)
    const hasVisited = window.localStorage.getItem("skolarin_visited")
    if (hasVisited) {
      setShowLoading(false)
    }

    // Mark as ready after hydration
    setIsReady(true)

    syncTheme()
    syncAuth()

    const onThemeChange = () => syncTheme()
    const onStorage = (e: StorageEvent) => {
      if (e.key === "skolarin-theme") syncTheme()
      if (e.key === "skolarin_auth_token") syncAuth()
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncTheme()
        syncAuth()
      }
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

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-50">
        {showLoading && <LoadingScreen onLoadingComplete={() => {
          window.localStorage.setItem("skolarin_visited", "true")
          setShowLoading(false)
        }} />}
      </div>
    )
  }

  return (
    <>
      {showLoading && (
        <LoadingScreen 
          onLoadingComplete={() => {
            window.localStorage.setItem("skolarin_visited", "true")
            setShowLoading(false)
          }} 
        />
      )}
      <div suppressHydrationWarning className={`min-h-screen flex flex-col ${pageBgClass} relative`}>
      {/* Navbar biru */}
      <nav className={`relative z-50 w-full ${navBgClass} text-white shadow-md`}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl px-3 py-1.5">
              <Logo width={32} height={36} />
            </div>
            <span className={`${dmSans.className} text-xl font-semibold tracking-wide`}>Skolarin</span>
          </div>

          {/* Tombol setting di sisi kanan */}
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

      <ProfileBar isDarkMode={isDarkMode} onLoginRequired={() => setIsLoginModalOpen(true)} />

      {/* Konten utama */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 pt-10 pb-24 sm:px-6 lg:px-8">
        {/* Hero section */}
        <section className="grid gap-10 grid-cols-2 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
          <div className="space-y-6">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-xl ${mainHeadingClass}`}
            >
              Winners Train
              <br />
              Losers Complain...
            </h1>

            {/* Mobile: tombol di tengah, Desktop: bisa tetap rata kiri */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Button
                className="rounded-full bg-[#29579F] hover:bg-[#21467E] px-6 text-sm font-semibold text-white"
                onClick={handlePlayClick}
              >
                Let's Play
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-slate-300 bg-white text-slate-800 hover:bg-slate-50 px-6 text-sm font-semibold"
                onClick={() => router.push("/dashboard/contact")}
              >
                Contact Us
              </Button>
            </div>
          </div>

          {/* Slot gambar maskot dashboard */}
          <div className="flex items-center justify-center">
            <div className="relative h-72 w-72 sm:h-80 sm:w-80">
              <Image
                src="/images/gambar.png"
                alt="Dashboard mascot"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mt-30 space-y-10">
          <div className="text-center">
            <h2 className={`text-2xl md:text-3xl font-bold ${mainHeadingClass}`}>Why Choose Us</h2>
            <div className="mt-2 flex justify-center">
              <span className="h-1 w-24 rounded-full bg-[#29579F]" />
            </div>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {/* Card 1 */}
            <div className="relative flex flex-col gap-4 rounded-tl-[5px] rounded-tr-[35px] rounded-br-[5px] rounded-bl-[35px] bg-[#D8E9FF] px-6 pt-20 pb-6">
              {/* Slot gambar 1: besar, keluar setengah dari kotak, agak ke kiri */}
              <div className="absolute left-6 -top-[70px] h-[153px] w-[153px]">
                <Image
                  src="/images/Earth.png"
                  alt="Life Lines icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-2 ">
                <h3 className="text-lg font-semibold text-slate-900">Life Lines</h3>
                <p className="text-sm text-slate-700">
                  These lifelines are your secret weapons to help you secure the correct answers during gameplay.
                  Use them wisely to stay ahead.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative flex flex-col gap-4 rounded-tl-[5px] rounded-tr-[35px] rounded-br-[5px] rounded-bl-[35px] bg-[#D8E9FF] px-6 pt-20 pb-6">
              {/* Slot gambar 2: besar, keluar setengah dari kotak, agak ke kiri */}
              <div className="absolute left-6 -top-[70px] h-[153px] w-[153px]">
                <Image
                  src="/images/time.png"
                  alt="Leaderboard icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">Leaderboard</h3>
                <p className="text-sm text-slate-700">
                  Check out our Leaderboard to discover the top scorers in various quizzes. Join the competition and
                  climb the ranks.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative flex flex-col gap-4 rounded-tl-[5px] rounded-tr-[35px] rounded-br-[5px] rounded-bl-[35px] bg-[#D8E9FF] px-6 pt-20 pb-6">
              <div className="absolute left-6 -top-[70px] h-[153px] w-[153px]">
                <Image
                  src="/images/wallet.png"
                  alt="Money Withdrawal icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">Money Withdrawal</h3>
                <p className="text-sm text-slate-700">
                  Unlock Money Withdrawal and transform quiz victories into tangible cash rewards. Earn while you
                  play and learn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Incredible Quiz Features */}
        <section className="mt-24 space-y-10">
          <div className="text-center">
            <h2 className={`text-2xl md:text-3xl font-bold ${mainHeadingClass}`}>Incredible Quiz Features</h2>
            <div className="mt-2 flex justify-center">
              <span className="h-1 w-32 rounded-full bg-[#29579F]" />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Feature 1 */}
            <div className="flex items-center gap-4 rounded-3xl bg-[#D8E9FF] px-6 py-5">
              <div className="relative h-[140px] w-[140px] flex-shrink-0">
                <Image
                  src="/images/book.png"
                  alt="Quizzes by category icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">Quizzes by category</h3>
                <p className="text-sm text-slate-700">
                  Dive into category-based quizzes for an engaging and informative challenge.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4 rounded-3xl bg-[#D8E9FF] px-6 py-5">
              <div className="relative h-[140px] w-[140px] flex-shrink-0">
                <Image
                  src="/images/book2.png"
                  alt="Quizzes by Language icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">Quizzes by Language</h3>
                <p className="text-sm text-slate-700">
                  Explore quizzes tailored to your language preference for a personalized quiz experience.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4 rounded-3xl bg-[#D8E9FF] px-6 py-5">
              <div className="relative h-[140px] w-[140px] flex-shrink-0">
                <Image
                  src="/images/glass.png"
                  alt="Battle Quiz icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">Battle Quiz</h3>
                <p className="text-sm text-slate-700">
                  Engage in epic quiz battles and prove your knowledge supremacy.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-4 rounded-3xl bg-[#D8E9FF] px-6 py-5">
              <div className="relative h-[140px] w-[140px] flex-shrink-0">
                <Image
                  src="/images/fish.png"
                  alt="Guess The Word icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">Guess The Word</h3>
                <p className="text-sm text-slate-700">
                  Put your vocabulary to the test with our challenging Guess the Word quiz.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Elite QuizBestPart */}
        <section className="mt-24 space-y-12">
          <div className="text-center">
            <h2 className={`text-2xl md:text-3xl font-bold ${mainHeadingClass}`}>
              Elite <span className="text-[#29579F]">QuizBestPart</span>
            </h2>
            <div className="mt-2 flex justify-center">
              <span className="h-1 w-32 rounded-full bg-[#29579F]" />
            </div>
          </div>

          {/* Mobile: 2 kolom x 2 baris, Desktop: 4 kolom sejajar */}
          <div className="grid gap-10 grid-cols-2 md:grid-cols-4">
            {/* Item 1 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative h-[153px] w-[153px]">
                <Image
                  src="/images/reguler.png"
                  alt="Regular Updates icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-1">
                <h3 className={`text-lg font-semibold ${mainHeadingClass}`}>Regular Updates</h3>
                <p className={`text-sm ${mainTextClass}`}>
                  Regularly updated quizzes for a fresh and exciting learning experience.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative h-[153px] w-[153px] mt-35">
                <Image
                  src="/images/fun.png"
                  alt="Global Community icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-1">
                <h3 className={`text-lg font-semibold ${mainHeadingClass}`}>Competitive Fun</h3>
                <p className={`text-sm ${mainTextClass}`}>
                  Test your knowledge and challenge others. Compete, test, and have fun.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative h-[153px] w-[153px]">
                <Image
                  src="/images/community.png"
                  alt="Competitive Fun icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-1">
                <h3 className={`text-lg font-semibold ${mainHeadingClass}`}>Global Community</h3>
                <p className={`text-sm ${mainTextClass}`}>
                  Join the Elite Quiz Global Community and Expand Your Knowledge Together!
                </p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col items-center text-center gap-4">
              {/* Slot gambar 4 */}
              <div className="relative h-[153px] w-[153px] mt-35">
                <Image
                  src="/images/Inclusivity.png"
                  alt="All-age Inclusivity icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-1">
                <h3 className={`text-lg font-semibold ${mainHeadingClass}`}>All-age Inclusivity</h3>
                <p className={`text-sm ${mainTextClass}`}>
                  Elite Quiz for kids, teens, and adults fun learning for everyone.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-[#29579F] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 md:flex-row md:items-start md:justify-between md:gap-10 md:py-10">
          {/* Logo + description */}
          <div className="max-w-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <Logo width={32} height={36} />
              </div>
              <span className="text-xl font-semibold tracking-wide">Skolarin</span>
            </div>
            <p className="text-sm text-sky-100/90">
              Elite Quiz made with key principles of a beautiful, effective, simple to use and better code quality
              with use of functional based component.
            </p>
          </div>

          {/* Links columns */}
          <div className="grid flex-1 gap-10 text-sm md:grid-cols-3">
            <div className="space-y-3">
              <h4 className="font-semibold">Policy</h4>
              <ul className="space-y-1 text-sky-100/90">
                <li>Privacy Policy</li>
                <li>Terms And Conditions</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-1 text-sky-100/90">
                <li>About Us</li>
                <li>Contact Us</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Find Us Here</h4>
              <ul className="space-y-1 text-sky-100/90">
                <li>Social media links</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Required Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 transition-all duration-300">
          <div className="w-full max-w-sm transform overflow-hidden rounded-[40px] bg-white p-8 text-center shadow-2xl transition-all">
            {/* Illustration Placeholder */}
            <div className="mx-auto mb-2 flex h-48 w-48 items-center justify-center">
              <div className="relative h-full w-full">
                <Image
                  src="/images/gambar.png"
                  alt="Login required mascot"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <p className="mb-8 text-base text-slate-800 px-4 leading-relaxed font-medium">
              Oops! Kamu belum bisa mengakses fitur ini.Silakan login terlebih dahulu untuk menikmati semua fitur.
            </p>

            <div className="flex w-full flex-col gap-3">
              <Button
                variant="outline"
                onClick={() => setIsLoginModalOpen(false)}
                className="w-full rounded-full border border-slate-300 py-6 text-base font-bold text-slate-700 hover:bg-slate-50"
              >
                Kembali
              </Button>
              <Button
                onClick={() => router.push('/dashboard/login')}
                className="w-full rounded-full bg-[#0095FF] hover:bg-[#007ACC] py-6 text-base font-bold text-white shadow-lg shadow-blue-200/50"
              >
                Login Sekarang
              </Button>
            </div>

            <div className="mt-6 text-sm text-slate-500">
              Belum punya akun?{" "}
              <button
                onClick={() => router.push('/dashboard/signup')}
                className="font-bold text-[#0095FF] hover:underline"
              >
                Daftar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
