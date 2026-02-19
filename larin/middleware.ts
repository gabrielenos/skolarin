import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/dashboard', '/dashboard/login', '/dashboard/signup', '/dashboard/contact', '/profile']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. Dapatkan token dari cookie
    const tokenCookie = request.cookies.get('skolarin_auth_token')?.value
    const hasValidToken = (tokenCookie && tokenCookie !== 'undefined' && tokenCookie !== 'null')

    // 2. Cek apakah rute saat ini adalah rute publik
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

    // 3. ABAIKAN rute internal Next.js, statis, dan API
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/images') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next()
    }

    // 4. Kasus khusus: root (/) -> redirect ke /dashboard
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // 5. PROTEKSI UTAMA: Jika tidak ada token dan bukan rute publik -> TOLAK KE /dashboard/login
    if (!hasValidToken && !isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard/login', request.url))
    }

    // 6. Jika sudah login tapi mencoba ke Login/Signup -> Buang ke /dashboard
    if (hasValidToken && (pathname === '/dashboard/login' || pathname === '/dashboard/signup')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

// Cocokkan SEMUA rute agar middleware selalu berjalan
export const config = {
    matcher: ['/:path*'],
}
