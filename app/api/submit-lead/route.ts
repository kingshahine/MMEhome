import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward to Bonzo webhook
    const bonzoRes = await fetch(process.env.BONZO_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: body.first_name || '',
        last_name: body.last_name || '',
        email: body.email || '',
        phone: (body.phone || '').replace(/\D/g, '').slice(0, 10),
        address: body.address || '',
        city: body.city || '',
        state: body.state || '',
        zip: body.zip || '',
        property_use: body.property_use || '',
        property_address: body.property_address || '',
        property_city: body.property_city || '',
        property_state: body.property_state || '',
        application_date: new Date().toISOString().split('T')[0],
        lead_source: 'MME Home Website',
        field_1: body.ownership_type || '',
        field_2: body.income_source || '',
        field_3: body.pre_tax_income || '',
        foreclosure: body.mortgage_lates === 'yes' ? 'yes' : 'no',
      }),
    })

    if (!bonzoRes.ok) {
      const errorText = await bonzoRes.text()
      console.error('Bonzo error:', bonzoRes.status, errorText)
      return NextResponse.json(
        { success: false, error: `Bonzo returned ${bonzoRes.status}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('submit-lead error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
