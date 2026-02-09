"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Inter } from "next/font/google"
import { Lock, Mail } from "lucide-react"
import Logo from "@/components/logo"

const inter = Inter({ subsets: ["latin"] })

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const message = data?.detail || "Login gagal"
        throw new Error(typeof message === "string" ? message : "Login gagal")
      }

      const token = data?.access_token
      if (!token) throw new Error("Token tidak ditemukan")

      window.localStorage.setItem("skolarin_auth_token", token)
      router.push("/quiz_play")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#29579F] shadow-sm">
                <Logo width={28} height={30} />
              </div>
              <span className={`${inter.className} text-2xl font-semibold tracking-wide text-[#29579F]`}>Skolarin</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="sr-only">Alamat Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Alamat Email*"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0"
                />
              </div>
            </label>

            <label className="block">
              <span className="sr-only">Kata Sandi</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Kata Sandi*"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0"
                />
              </div>
            </label>

            <div className="flex justify-end">
              <span className="text-xs font-medium text-slate-500">Lupa Kata Sandi?</span>
            </div>

            {error && <div className="text-xs font-semibold text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-[#0B74E8] text-base font-semibold text-white grid place-items-center opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? "Memproses..." : "Masuk"}
            </button>

            <div className="pt-2 text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link href="/dashboard/signup" className="font-semibold text-[#0B74E8] hover:underline">
                Daftar
              </Link>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <div className="text-xs font-semibold tracking-wider text-slate-400">ATAU</div>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
            </div>

            <div className="pt-2">
              <div className="text-center text-xs text-slate-500">
                Terhubung dengan salah satu Opsi berikut
              </div>

              <div className="mt-4 flex justify-center">
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                  aria-label="Google"
                >
                  <svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#FFC107"
                      d="M43.611 20.083H42V20H24v8h11.303C33.654 32.658 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.313 6.306 14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.62-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.232-2.231 4.132-4.084 5.57l.002-.001 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="pt-6 text-center text-[11px] leading-relaxed text-slate-500">
              Dengan Mendaftar/Masuk, Anda menyetujui{" "}
              <span className="text-[#0B74E8]">Ketentuan Layanan</span> dan{" "}
              <span className="text-[#0B74E8]">Kebijakan Privasi</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}