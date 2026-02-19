"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

export default function SelectAvatarPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [hasInviteCode, setHasInviteCode] = useState(false)
  const [inviteCode, setInviteCode] = useState("")
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(null)
  const [selectedPhotoName, setSelectedPhotoName] = useState<string | null>(null)

  const avatarPlaceholders = useMemo(() => Array.from({ length: 8 }, (_, i) => i), [])

  return (
    <div className="min-h-screen bg-slate-200">
      <div className="bg-[#1F7AE0]">
        <div className="mx-auto w-full max-w-5xl px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="text-sm font-bold tracking-wide text-white">Pilih Avatar Kamu</div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-8">
        <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white px-6 py-8 shadow-sm">
          <label
            className="flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl border border-slate-500 bg-white text-xs font-bold tracking-wide text-slate-700"
            aria-label="Pilih dari file atau foto"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setSelectedPhotoName(file?.name ?? null)
              }}
            />
            {selectedPhotoName ? selectedPhotoName : "PILIH DARI FILE/FOTO"}
          </label>

          <div className="mt-6 text-center">
            <div className="text-[11px] font-bold tracking-wide text-slate-500">ATAU PILIH AVATAR</div>

            <div className="mt-5 grid grid-cols-4 gap-4">
              {avatarPlaceholders.map((i) => {
                const isSelected = selectedAvatarIndex === i
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Avatar ${i + 1}`}
                    onClick={() => setSelectedAvatarIndex(i)}
                    className={`mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border-2 bg-slate-50 transition-colors ${
                      isSelected ? "border-[#1F7AE0]" : "border-transparent"
                    }`}
                  >
                    <span className="h-full w-full" aria-hidden="true" />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama anda"
              className="h-11 w-full rounded-lg border border-slate-300 bg-slate-100 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-slate-400"
            />

            <button
              type="button"
              className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-slate-100 px-4 text-xs font-semibold text-slate-700"
              onClick={() => {
                setHasInviteCode(!hasInviteCode)
              }}
            >
              <span>Saya punya kode undangan</span>
              <span
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                  hasInviteCode ? "bg-[#1F7AE0]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    hasInviteCode ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </span>
            </button>

            {hasInviteCode && (
              <input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Masukkan code anda"
                className="h-11 w-full rounded-lg border border-slate-300 bg-slate-100 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-slate-400"
              />
            )}

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              disabled={!name.trim() || selectedAvatarIndex === null}
              className={`mt-2 h-11 w-full rounded-lg text-xs font-bold tracking-wide text-white transition-colors ${
                name.trim() && selectedAvatarIndex !== null
                  ? "bg-[#1F7AE0] hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              LANJUTKAN
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
