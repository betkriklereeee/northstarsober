// TEMP: remove before launch
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { password } = await request.json()

  if (!process.env.PREVIEW_PASSWORD || password !== process.env.PREVIEW_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const cookieStore = cookies()
  cookieStore.set('ns-preview', password, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  })

  return NextResponse.json({ success: true })
}
