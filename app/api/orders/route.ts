import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      let query = supabase
        .from('orders')
        .select('*, order_items(*)', { count: 'exact' })

      if (status) query = query.eq('status', status)
      query = query.range((page - 1) * limit, page * limit - 1).order('created_at', { ascending: false })

      const { data, error, count } = await query
      if (error) throw error

      return NextResponse.json({ orders: data, total: count, page, limit })
    }

    return NextResponse.json({ orders: [], total: 0 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      // Demo mode: return mock order
      return NextResponse.json({
        order: {
          id: `demo-${Date.now()}`,
          order_number: `ORD-${Date.now().toString().slice(-8)}`,
          ...body,
          status: 'pending',
          payment_status: 'pending',
          created_at: new Date().toISOString(),
        }
      }, { status: 201 })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { items, ...orderData } = body

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    if (items && items.length > 0) {
      const orderItems = items.map((item: Record<string, unknown>) => ({
        ...item,
        order_id: order.id,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
