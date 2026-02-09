"use client"

import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Bell,
  Bookmark,
  Gift,
  Globe,
  HelpCircle,
  LogOut,
  Pencil,
  Share2,
  Star,
  Trash2,
  TrendingUp,
  UserPlus,
  Wallet,
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()

  const menuLeft = [
    { label: "Bookmark", icon: Bookmark },
    { label: "Lencana", icon: Star },
    { label: "Statistik", icon: TrendingUp },
    { label: "Cara Bermain", icon: HelpCircle },
    { label: "Nilai Kami", icon: Star },
    { label: "Hapus Akun", icon: Trash2 },
  ] as const

  const menuRight = [
    { label: "Undang Teman", icon: UserPlus },
    { label: "Hadiah", icon: Gift },
    { label: "Bahasa", icon: Globe },
    { label: "Bagikan Aplikasi", icon: Share2 },
    { label: "Keluar!", icon: LogOut },
  ] as const

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#1F7AE0] pb-24">
        <div className="mx-auto w-full max-w-md px-4 pt-4 md:mx-0 md:max-w-5xl">
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Kembali"
              className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-full text-white/95 hover:bg-white/10"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

          </div>
        </div>
      </div>

      <div className="-mt-12">
        <div className="mx-auto w-full max-w-md px-4 pb-10 md:mx-55 md:max-w-5xl">
          <div className="grid gap-6 md:grid-cols-[360px_1fr]">
            <div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-200">
                    <div className="flex h-full w-full items-center justify-center bg-sky-100 text-sky-700">
                      <span className="text-xl font-semibold">A</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-lg font-semibold text-slate-900">asep</div>
                    <div className="truncate text-sm text-slate-400">asep@gmail.com</div>
                  </div>

                  <button
                    type="button"
                    aria-label="Edit profil"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1F7AE0] text-white shadow-sm hover:bg-[#1968C0]"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white px-3 py-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                    <Wallet className="h-5 w-5 text-[#1F7AE0]" />
                  </div>
                  <div className="text-sm font-semibold text-slate-700">Dompet</div>
                </button>

                <button
                  type="button"
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white px-3 py-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                    <div className="h-5 w-5 rounded bg-slate-200" />
                  </div>
                  <div className="text-center text-sm font-semibold text-slate-700">Riwayat ...</div>
                </button>

                <button
                  type="button"
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white px-3 py-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                    <Bell className="h-5 w-5 text-[#1F7AE0]" />
                  </div>
                  <div className="text-sm font-semibold text-slate-700">Notifikasi</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                {menuLeft.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-4 text-left shadow-sm"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                        <Icon className="h-5 w-5 text-[#1F7AE0]" />
                      </span>
                      <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className="space-y-3">
                {menuRight.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-4 text-left shadow-sm"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                        <Icon className="h-5 w-5 text-[#1F7AE0]" />
                      </span>
                      <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}