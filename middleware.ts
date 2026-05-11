import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// TEMP: remove before launch — preview gate block
const PREVIEW_PATHS = ['/preview-login', '/api/preview-login']

export async function middleware(request: NextRequest) {
  // ── Preview password gate ──────────────────────────────────────────────────
  const PREVIEW_ENABLED = process.env.PREVIEW_PASSWORD !== undefined
  const isStaticAsset =
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon')

  if (PREVIEW_ENABLED && !isStaticAsset) {
    const previewCookie = request.cookies.get('ns-preview')
    const isValidPreview = previewCookie?.value === process.env.PREVIEW_PASSWORD
    const isPreviewPath = PREVIEW_PATHS.some((p) =>
      request.nextUrl.pathname.startsWith(p)
    )

    if (!isValidPreview && !isPreviewPath) {
      return NextResponse.redirect(new URL('/preview-login', request.url))
    }
  }

  // ── Supabase auth ──────────────────────────────────────────────────────────
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase unreachable (e.g. placeholder env vars) — allow request through
  }

  const isOperatorRoute =
    request.nextUrl.pathname.startsWith('/operator/dashboard') ||
    request.nextUrl.pathname.startsWith('/operator/listings')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if ((isOperatorRoute || isAdminRoute) && !user) {
    const redirectUrl = new URL('/operator/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
