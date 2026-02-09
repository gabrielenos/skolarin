"use client"

import { useLayoutEffect, useState } from "react"
import Logo from "@/components/logo"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function QuizPlayPage() {
  const router = useRouter()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem("skolarin-theme") === "dark"
  })

  const pageBgClass = isDarkMode ? "bg-slate-900" : "bg-white"
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

  return (
    <div suppressHydrationWarning className={`min-h-screen flex flex-col ${pageBgClass}`}>
      {/* Navbar biru sama seperti dashboard */}
      <nav className={`relative z-50 w-full ${navBgClass} text-white shadow-md`}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl px-3 py-1.5">
              <Logo width={32} height={36} />
            </div>
            <span className="text-xl font-semibold tracking-wide">Skolarin</span>
          </div>

          {/* Tombol setting di sisi kanan */}
          <div className="relative z-50">
            <button
              type="button"
              aria-label="Settings"
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-sky-500/30 text-white hover:bg-sky-500/60 transition-colors"
            >
              <span className="text-lg font-semibold">⚙️</span>
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 z-50 mt-2 w-40 rounded-xl border border-sky-100 bg-white py-1 text-sm text-slate-800 shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center px-3 py-2 text-left hover:bg-sky-50"
                  onClick={() => {
                    setIsSettingsOpen(false)
                    router.push("/dashboard/contact")
                  }}
                >
                  Contact
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-sky-50"
                  onClick={() => {
                    setIsDarkMode((prev) => {
                      const next = !prev
                      window.localStorage.setItem("skolarin-theme", next ? "dark" : "light")
                      window.dispatchEvent(new Event("skolarin-theme-change"))
                      return next
                    })
                  }}
                >
                  <span>Mode dark</span>
                  <span
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      isDarkMode ? "bg-sky-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        isDarkMode ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Konten utama Quiz Play */}
      <main className="flex-1 mx-auto w-full max-w-[1363px] px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <header className="text-center space-y-2 mb-10">
          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}>
            Quiz Play
          </h1>
          <p
            className={`text-sm sm:text-base font-semibold ${
              isDarkMode ? "text-slate-100" : "text-slate-700"
            }`}
          >
            Home | Quiz Play
          </p>
        </header>

        {/* Layout MOBILE: card biru tanpa gambar, 2 kolom seperti desain */}
        <section className="md:hidden flex flex-col items-center gap-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Baris 1 */}
            <button type="button" onClick={() => router.push("/quiz_zone")} className="focus:outline-none">
              <QuizPlayTextCard title="Quiz Zone" description="Select your favorite zone to play" />
            </button>
            <QuizPlayTextCard title="Daily Quiz" description="Daily basic new quiz game" />

            {/* Baris 2 */}
            <button type="button" onClick={() => router.push("/true_false")} className="focus:outline-none">
              <QuizPlayTextCard title="True & False" description="Choose your answers" />
            </button>
            <button type="button" onClick={() => router.push("/fun_learn")} className="focus:outline-none">
              <QuizPlayTextCard title="Fun & Learn" description="It's like a comprehension game" />
            </button>

            {/* Baris 3 */}
            <button type="button" onClick={() => router.push("/guess_the_word")} className="focus:outline-none">
              <QuizPlayTextCard title="Guest The Word" description="Fun vocabulary game" />
            </button>
            <button type="button" onClick={() => router.push("/self_challenge")} className="focus:outline-none">
              <QuizPlayTextCard title="Self Challenge" description="Challenge Yourself" />
            </button>

            {/* Baris 4 */}
            <button type="button" onClick={() => router.push("/1vs1_battle")} className="focus:outline-none">
              <QuizPlayTextCard title="1 V/S 1 Battle" description="Battle with one on one" />
            </button>

            {/* Baris 5 */}
            <button type="button" onClick={() => router.push("/group_battle")} className="focus:outline-none">
              <QuizPlayTextCard title="Group Battle" description="It's a group quiz battle" />
            </button>
            <QuizPlayTextCard title="Math Mania" description="Challenge Your Mind" />

            {/* Baris 6 */}
            <QuizPlayTextCard title="Exam" description="Boost your knowledge" />
            <button type="button" onClick={() => router.push("/multimatch")} className="focus:outline-none">
              <QuizPlayTextCard title="Multi Math" description="Multi select question" />
            </button>

            {/* Baris 7 */}
            <button type="button" onClick={() => router.push("/audio_questions")} className="focus:outline-none">
              <QuizPlayTextCard title="Audio Questions" description="Select your favorite zone to play" />
            </button>
            <QuizPlayTextCard title="Advance" description="Currently under renovation" />
          </div>
        </section>

        {/* Layout DESKTOP/TABLET: tetap seperti sekarang dengan gambar */}
        <section className="hidden md:flex md:flex-col md:items-center md:gap-10">
          {/* Baris pertama: Quiz Zone (klik untuk ke /quiz_zone) */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => router.push("/quiz_zone")}
              className="focus:outline-none"
            >
              <QuizPlayCard
                imageSrc="/images/quiz_zone.png" // ganti dengan gambar kamu
                imageAlt="Quiz Zone"
                title="Quiz Zone"
                description="Select your favorite zone to play"
              />
            </button>
          </div>

          {/* Baris kedua: 3 kartu sejajar dengan gambar maskot */}
          <div className="grid gap-8 sm:grid-cols-3">
            <QuizPlayCard
              imageSrc="/images/daily_quiz.png" 
              imageAlt="Daily Quiz"
              title="Daily Quiz"
              description="Daily basic new quiz game"
            />
            <button type="button" onClick={() => router.push("/true_false")} className="focus:outline-none">
              <QuizPlayCard
                imageSrc="/images/true.png" 
                imageAlt="True & False"
                title="True & False"
                description="Choose your answers"
                halfBody
              />
            </button>
            <button type="button" onClick={() => router.push("/fun_learn")} className="focus:outline-none">
              <QuizPlayCard
                imageSrc="/images/fun_learn.png" 
                imageAlt="Fun & Learn"
                title="Fun & Learn"
                description="It's like a comprehension game"
              />
            </button>
          </div>

          {/* Baris ketiga: 5 card teks */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <button type="button" onClick={() => router.push("/guess_the_word")} className="focus:outline-none">
              <QuizPlayTextCard title="Guess The Word" description="Fun vocabulary game" />
            </button>
            <button type="button" onClick={() => router.push("/self_challenge")} className="focus:outline-none">
              <QuizPlayTextCard title="Self Challenge" description="Challenge Yourself" />
            </button>
            <button type="button" onClick={() => router.push("/1vs1_battle")} className="focus:outline-none">
              <QuizPlayTextCard title="1 VS 1 Battle" description="Battle with one on one" />
            </button>
            <button type="button" onClick={() => router.push("/group_battle")} className="focus:outline-none">
              <QuizPlayTextCard title="Group Battle" description="It's a group quiz battle" />
            </button>
          </div>

          {/* Baris keempat: 4 card teks */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <button type="button" onClick={() => router.push("/audio_questions")} className="focus:outline-none">
              <QuizPlayTextCard title="Audio Questions" description="Select your favorite zone to play" />
            </button>
            <QuizPlayTextCard title="Math Mania" description="Challenge Your Mind" />
            <QuizPlayTextCard title="Exam" description="Boost your knowledge" />
            <button type="button" onClick={() => router.push("/multimatch")} className="focus:outline-none">
              <QuizPlayTextCard title="Multi Math" description="Multi select question" />
            </button>
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
    </div>
  )
}

interface QuizPlayTextCardProps {
  title: string
  description: string
}

function QuizPlayTextCard({ title, description }: QuizPlayTextCardProps) {
  return (
    <div className="flex h-[135px] w-[231px] flex-col items-center justify-center rounded-[43px] border border-black/70 bg-[#1450A3] px-6 text-center text-white shadow-md">
      <h3 className="mb-1 text-base font-semibold">{title}</h3>
      <p className="text-xs leading-snug opacity-95">{description}</p>
    </div>
  )
}

interface QuizPlayCardProps {
  imageSrc: string
  imageAlt: string
  title: string
  description: string
  halfBody?: boolean
}

function QuizPlayCard({ imageSrc, imageAlt, title, description, halfBody = false }: QuizPlayCardProps) {
  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Slot gambar kartu (135 x 135), sebagian masuk ke dalam card */}
      <div className="relative z-10 h-[135px] w-[135px] flex items-center justify-center">
        {halfBody ? (
          // True & False: background dan gambar benar-benar terpisah
          <div className="relative h-[65px] w-[135px] flex items-start justify-center">
            {/* BACKGROUND */}
            {/* Atur ukuran & bentuk background DI SINI saja */}
            <div className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 h-[88.14px] w-[88.14px] rounded-[33px] bg-[#B4D8FB]" />

            {/* IMAGE CROP */}
            {/* Jangan ubah ini kalau hanya mau ngatur background */}
            <div className="relative h-[92px] w-[155px] overflow-hidden flex items-start justify-center">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={300}
                height={100}
                className="object-contain scale-128 mt-[7px]"
              />
            </div>
          </div>
        ) : (
          <div className="relative h-[135px] w-[135px]">
            {/* Ganti src di props dengan path gambar maskotmu, misalnya /images/quiz_zone.png */}
            <Image src={imageSrc} alt={imageAlt} fill className="object-contain" />
          </div>
        )}
      </div>

      {/* Card biru dengan ukuran 231x135 dan radius 43px, border hitam tipis */}
      <div
        className={`flex h-[135px] w-[231px] flex-col items-center justify-center rounded-[43px] border border-black/70 bg-[#1450A3] px-4 text-white shadow-md ${
          halfBody ? "-mt-10" : "-mt-8"
        }`}
      >
        <h3 className="mb-1 text-base font-semibold">{title}</h3>
        <p className="text-xs leading-snug opacity-95">{description}</p>
      </div>
    </div>
  )
}
