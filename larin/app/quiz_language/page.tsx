"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"

export default function QuizLanguagePage() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-[487px] h-[686px] rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-slate-950/60 px-10 py-15 flex flex-col gap-10">
        {/* Header dengan logo Skolarin */}
        <header className="relative flex items-start justify-between">
          <div className="mt-[30px] flex items-center gap-3 w-[269px] h-[67.93px]">
            {/* Logo Skolarin (SVG) */}
            <div className="flex items-center justify-center rounded-xl px-3 py-15">
              <Logo width={61} height={67.93} />
            </div>
            <span
              className="text-[50px] font-extrabold leading-[1] tracking-[-0.01em] text-white text-center align-middle"
              style={{ fontFamily: '"DM Sans"' }}
            >
              Skolarin
            </span>
          </div>

          {/* Panah kanan di pojok atas */}
          <button
            type="button"
            aria-label="Next"
            onClick={() => router.push("/dashboard")}
            className="absolute top-0 right-[15px] inline-flex size-10 items-center justify-center rounded-full text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <span className="text-2xl font-semibold leading-none">&gt;</span>
          </button>
        </header>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-slate-300">Quiz Language :</p>
              <div className="flex items-center gap-2">
                {/* Slot gambar untuk icon notifikasi */}
                <div className="relative h-7 w-7 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/bell.png" // ganti dengan path icon notifikasi kamu
                    alt="Notification icon"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Slot gambar untuk icon tema / palet warna */}
                <div className="relative h-7 w-7 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/palatte.png" // ganti dengan path icon palet warna kamu
                    alt="Theme icon"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-sky-500/70 bg-sky-500/10 px-4 text-[11px] font-medium text-sky-100 hover:bg-sky-500/20 hover:border-sky-400"
            >
              English (US)
            </Button>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <input
              placeholder="Your Name"
              className="h-9 w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70 focus-visible:border-sky-500/80"
            />

            <Button
              variant="outline"
              className="h-10 w-full justify-start rounded-md border-slate-700 bg-slate-900/60 text-slate-100 hover:bg-slate-800/80"
            >
              Home
            </Button>

            <Button
              variant="outline"
              className="h-10 w-full justify-start rounded-md border-slate-700 bg-slate-900/60 text-slate-100 hover:bg-slate-800/80"
            >
              Quiz Play
            </Button>

            <Button
              variant="outline"
              className="h-10 w-full justify-start rounded-md border-slate-700 bg-slate-900/60 text-slate-100 hover:bg-slate-800/80"
            >
              Instructions
            </Button>

            <Button
              variant="outline"
              className="h-10 w-full justify-start rounded-md border-slate-700 bg-slate-900/60 text-slate-100 hover:bg-slate-800/80"
            >
              More
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}