"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye } from "lucide-react"

const avatars = [
  { id: "avatar1", src: "/images/avatar1.png", alt: "Avatar 1" },
  { id: "avatar2", src: "/images/avatar2.png", alt: "Avatar 2" },
  { id: "avatar3", src: "/images/avatar3.png", alt: "Avatar 3" },
  { id: "avatar4", src: "/images/avatar4.png", alt: "Avatar 4" },
  { id: "avatar5", src: "/images/avatar5.png", alt: "Avatar 5" },
  { id: "avatar6", src: "/images/avatar6.png", alt: "Avatar 6" },
  { id: "avatar7", src: "/images/avatar7.png", alt: "Avatar 7" },
  { id: "avatar8", src: "/images/avatar8.png", alt: "Avatar 8" },
]

export default function SelectAvatarPage() {
  const router = useRouter()
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [hasInviteCode, setHasInviteCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleContinue = async () => {
    if (!selectedAvatar || !username.trim()) return

    setLoading(true)
    setError(null)

    const token = window.localStorage.getItem("skolarin_auth_token")
    if (!token) {
      router.push("/dashboard/login")
      return
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/update-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          avatar_url: selectedAvatar,
          username: username.trim()
        }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          window.localStorage.removeItem("skolarin_auth_token")
          document.cookie = "skolarin_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          router.push("/dashboard/login")
          return
        }
        throw new Error("Failed to update profile")
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E5E5E5]">
      {/* Header */}
      <div className="bg-[#0F7AE8] px-4 py-3 flex items-center justify-center">
        <h1 className="text-white font-semibold text-sm tracking-wide">EDIT PROFILE</h1>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-md p-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {/* Upload Button */}
          <button className="w-full border border-gray-400 rounded-xl py-4 mb-4 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            PILIH DARI FILE/FOTO
          </button>

          {/* Divider Text */}
          <p className="text-center text-xs text-gray-600 mb-4">ATAU PILIH AVATAR</p>

          {/* Avatar Grid */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                onClick={() => setSelectedAvatar(avatar.src)}
                className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                  selectedAvatar === avatar.src
                    ? "ring-2 ring-[#0F7AE8] ring-offset-2"
                    : "hover:opacity-80"
                }`}
              >
                <img
                  src={avatar.src}
                  alt={avatar.alt}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* Username Input */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Masukkan nama anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#E8E8E8] rounded-lg px-4 py-3 text-xs text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#0F7AE8]"
            />
          </div>

          {/* Invite Code Toggle */}
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasInviteCode}
                onChange={(e) => setHasInviteCode(e.target.checked)}
                className="rounded border-gray-300 text-[#0F7AE8] focus:ring-[#0F7AE8]"
              />
              <span className="text-xs text-gray-700">Saya punya kode undangan</span>
            </label>
            <Eye className="h-4 w-4 text-gray-400" />
          </div>

          {/* Invite Code Input */}
          {hasInviteCode && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Masukkan kode undangan"
                className="w-full bg-[#E8E8E8] rounded-lg px-4 py-3 text-xs text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#0F7AE8]"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-3 text-center text-xs text-red-500">{error}</div>
          )}

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedAvatar || !username.trim() || loading}
            className={`w-full rounded-lg py-3 text-xs font-semibold text-white transition-all ${
              selectedAvatar && username.trim() && !loading
                ? "bg-[#0F7AE8] hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Loading..." : "LANJUTKAN"}
          </button>
        </div>
      </div>
    </div>
  )
}
