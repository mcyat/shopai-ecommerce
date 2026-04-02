import { NextRequest, NextResponse } from 'next/server'
import { searchAliExpressProducts, searchCJProducts, searchSpocketProducts, createDropshippingOrder, prepareProductFromDropshipping } from '@/lib/dropshipping'
import type { DropshippingSource } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const source = searchParams.get('source') as DropshippingSource || 'aliexpress'
  const keyword = searchParams.get('keyword') || 'trending'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    let result

    if (source === 'aliexpress') {
      result = await searchAliExpressProducts({ keyword, pageNo: page, pageSize: limit })
    } else if (source === 'cj') {
      result = await searchCJProducts({ keyword, pageNum: page, pageSize: limit })
    } else if (source === 'spocket') {
      result = await searchSpocketProducts({ keyword, page, perPage: limit })
    } else {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dropshipping products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json()

    if (action === 'import_product') {
      const product = prepareProductFromDropshipping(data.dropshipping_product, data.markup || 2.5)

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (supabaseUrl && supabaseServiceKey) {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const { data: newProduct, error } = await supabase
          .from('products')
          .insert({ ...product, sku: `DS-${data.dropshipping_product.source_id}` })
          .select()
          .single()

        if (error) throw error
        return NextResponse.json({ product: newProduct }, { status: 201 })
      }

      return NextResponse.json({ product: { id: `demo-${Date.now()}`, ...product } }, { status: 201 })
    }

    if (action === 'create_order') {
      const result = await createDropshippingOrder(data)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Dropshipping operation failed' }, { status: 500 })
  }
}
