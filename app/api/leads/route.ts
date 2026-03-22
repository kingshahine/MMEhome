import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  // Verify admin auth
  const cookieStore = cookies()
  const authCookie = cookieStore.get('admin_auth')
  if (authCookie?.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const perPage = searchParams.get('per_page') || '50'
  const search = searchParams.get('search') || ''

  try {
    // Try Bonzo prospects endpoint
    const params = new URLSearchParams({
      page,
      per_page: perPage,
      ...(search ? { search } : {}),
    })

    const bonzoRes = await fetch(
      `https://app.getbonzo.com/api/prospects?${params}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BONZO_API_TOKEN}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        // Don't cache — always fresh data
        cache: 'no-store',
      }
    )

    if (!bonzoRes.ok) {
      const errorText = await bonzoRes.text()
      console.error('Bonzo leads error:', bonzoRes.status, errorText)
      return NextResponse.json(
        {
          error: `Bonzo API returned ${bonzoRes.status}`,
          detail: errorText,
          // Return empty leads so the UI still renders
          data: [],
          meta: { total: 0, page: 1, per_page: 50 },
        },
        { status: 200 } // Return 200 so frontend handles it gracefully
      )
    }

    const data = await bonzoRes.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('leads API error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch leads', data: [], meta: { total: 0 } },
      { status: 200 }
    )
  }
}
