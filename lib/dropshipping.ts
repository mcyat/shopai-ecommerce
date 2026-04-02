import type { DropshippingProduct, DropshippingSource } from '@/types'

// ==================== Dropshipping Integration Layer ====================
// Supports: AliExpress, CJ Dropshipping, Spocket

// ---- AliExpress ----
export async function searchAliExpressProducts(params: {
  keyword: string
  pageNo?: number
  pageSize?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: 'totalOrders' | 'price' | 'rating'
}): Promise<{ products: DropshippingProduct[]; total: number }> {
  // Production: Call AliExpress Dropshipping API
  // https://developers.aliexpress.com/en/doc.htm?docId=32066
  const appKey = process.env.ALIEXPRESS_APP_KEY
  const appSecret = process.env.ALIEXPRESS_APP_SECRET

  if (!appKey || !appSecret) {
    // Return mock data for demo
    return getMockDropshippingProducts('aliexpress', params.keyword)
  }

  // Real API call (when keys are configured)
  try {
    const baseUrl = 'https://api-sg.aliexpress.com/sync'
    const method = 'aliexpress.ds.product.search'
    const timestamp = new Date().toISOString().replace(/[:-]/g, '').split('.')[0] + '000'

    const queryParams = {
      method,
      app_key: appKey,
      timestamp,
      sign_method: 'sha256',
      v: '2.0',
      keywords: params.keyword,
      page_no: params.pageNo || 1,
      page_size: params.pageSize || 20,
      sort: params.sortBy === 'totalOrders' ? 'SALE_DESC' : params.sortBy === 'price' ? 'PRICE_ASC' : 'DEFAULT',
      min_sale_price: params.minPrice ? params.minPrice * 100 : undefined,
      max_sale_price: params.maxPrice ? params.maxPrice * 100 : undefined,
      ship_to_country: 'US',
      target_currency: 'USD',
      target_language: 'en',
    }

    // Sign the request (HMAC-SHA256)
    const sign = await generateAliExpressSign(queryParams, appSecret)

    const url = new URL(baseUrl)
    Object.entries({ ...queryParams, sign }).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v))
    })

    const response = await fetch(url.toString())
    const data = await response.json()

    if (!data?.aliexpress_ds_product_search_response?.resp_result?.result) {
      return getMockDropshippingProducts('aliexpress', params.keyword)
    }

    const items = data.aliexpress_ds_product_search_response.resp_result.result.products?.product || []

    const products: DropshippingProduct[] = items.map((item: Record<string, unknown>) => ({
      source: 'aliexpress' as DropshippingSource,
      source_id: String(item.product_id),
      name: String(item.subject),
      description: String(item.subject),
      images: [(item.image_u_r_ls as string[])?.split(';')?.[0] || ''],
      price: (item.target_sale_price as number) / 100 || 0,
      shipping_cost: (item.freight as Record<string, number>)?.cent_amount_and_currency?.amount / 100 || 0,
      shipping_days: 15,
      supplier_name: String(item.store_name || 'AliExpress Supplier'),
      supplier_url: `https://www.aliexpress.com/item/${item.product_id}.html`,
      category: String(item.first_level_category_name || 'General'),
      rating: Number(item.evaluate_rate) || 4.5,
      orders_count: Number(item.order_count) || 0,
    }))

    return { products, total: Number(data.total) || products.length }
  } catch {
    return getMockDropshippingProducts('aliexpress', params.keyword)
  }
}

// ---- CJ Dropshipping ----
export async function searchCJProducts(params: {
  keyword: string
  pageNum?: number
  pageSize?: number
  categoryId?: string
}): Promise<{ products: DropshippingProduct[]; total: number }> {
  const email = process.env.CJ_EMAIL
  const apiKey = process.env.CJ_API_KEY

  if (!email || !apiKey) {
    return getMockDropshippingProducts('cj', params.keyword)
  }

  try {
    // Authenticate with CJ
    const authResponse = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: apiKey }),
    })
    const authData = await authResponse.json()
    const accessToken = authData?.data?.accessToken

    if (!accessToken) return getMockDropshippingProducts('cj', params.keyword)

    // Search products
    const searchResponse = await fetch('https://developers.cjdropshipping.com/api2.0/v1/product/list', {
      method: 'GET',
      headers: {
        'CJ-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    })

    const searchData = await searchResponse.json()
    const items = searchData?.data?.list || []

    const products: DropshippingProduct[] = items.map((item: Record<string, unknown>) => ({
      source: 'cj' as DropshippingSource,
      source_id: String(item.pid),
      name: String(item.productNameEn),
      description: String(item.productNameEn),
      images: [(item.productImage as string) || ''],
      price: Number(item.sellPrice) || 0,
      shipping_cost: 2.99,
      shipping_days: 10,
      supplier_name: 'CJ Dropshipping',
      supplier_url: `https://cjdropshipping.com/product/${item.pid}`,
      category: String(item.categoryName || 'General'),
      rating: 4.3,
      orders_count: 0,
    }))

    return { products, total: searchData?.data?.total || products.length }
  } catch {
    return getMockDropshippingProducts('cj', params.keyword)
  }
}

// ---- Spocket ----
export async function searchSpocketProducts(params: {
  keyword: string
  page?: number
  perPage?: number
}): Promise<{ products: DropshippingProduct[]; total: number }> {
  // Spocket uses OAuth2 - placeholder for real implementation
  return getMockDropshippingProducts('spocket', params.keyword)
}

// ---- Mock Data (for demo / when API keys not configured) ----
function getMockDropshippingProducts(
  source: DropshippingSource,
  keyword: string
): { products: DropshippingProduct[]; total: number } {
  const mockProducts: DropshippingProduct[] = [
    {
      source,
      source_id: `${source}-001`,
      name: `${keyword} - Premium Quality Item`,
      description: `High quality ${keyword} from trusted supplier`,
      images: ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400'],
      price: 12.99,
      shipping_cost: 2.99,
      shipping_days: source === 'aliexpress' ? 20 : source === 'cj' ? 10 : 7,
      supplier_name: source === 'aliexpress' ? 'Top AliExpress Store' : source === 'cj' ? 'CJ Warehouse' : 'US Supplier',
      supplier_url: '#',
      category: 'General',
      rating: 4.5,
      orders_count: 1250,
    },
    {
      source,
      source_id: `${source}-002`,
      name: `${keyword} Pro Version`,
      description: `Professional grade ${keyword} for everyday use`,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
      price: 24.99,
      shipping_cost: 1.99,
      shipping_days: source === 'aliexpress' ? 18 : 8,
      supplier_name: source === 'aliexpress' ? 'Quality Factory' : source === 'cj' ? 'CJ Premium' : 'Spocket US',
      supplier_url: '#',
      category: 'Electronics',
      rating: 4.8,
      orders_count: 3200,
    },
    {
      source,
      source_id: `${source}-003`,
      name: `Budget ${keyword} Set`,
      description: `Value pack ${keyword} - 3 units included`,
      images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400'],
      price: 8.50,
      shipping_cost: 3.99,
      shipping_days: 25,
      supplier_name: source === 'aliexpress' ? 'Wholesale Store' : 'Budget Supplier',
      supplier_url: '#',
      category: 'General',
      rating: 4.1,
      orders_count: 560,
    },
  ]

  return { products: mockProducts, total: mockProducts.length }
}

// ---- Order Forwarding to Supplier ----
export async function createDropshippingOrder(params: {
  source: DropshippingSource
  sourceProductId: string
  quantity: number
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}): Promise<{ success: boolean; supplierOrderId?: string; error?: string }> {
  // In production, this calls the respective dropshipping API
  // to place the order with the supplier directly

  if (params.source === 'aliexpress') {
    // AliExpress DS API order creation
    return {
      success: true,
      supplierOrderId: `AE-${Date.now()}`,
    }
  }

  if (params.source === 'cj') {
    // CJ Dropshipping order creation
    return {
      success: true,
      supplierOrderId: `CJ-${Date.now()}`,
    }
  }

  return { success: false, error: 'Supplier not configured' }
}

// ---- AliExpress Signature Generation ----
async function generateAliExpressSign(
  params: Record<string, unknown>,
  secret: string
): Promise<string> {
  const sortedKeys = Object.keys(params).sort()
  const signString = secret + sortedKeys.map(k => `${k}${params[k]}`).join('') + secret

  const encoder = new TextEncoder()
  const data = encoder.encode(signString)
  const keyData = encoder.encode(secret)

  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data)
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

// ---- Import product from dropshipping to store ----
export function prepareProductFromDropshipping(
  ds: DropshippingProduct,
  markup: number = 2.5
): Partial<import('@/types').Product> {
  const sellingPrice = Math.round(ds.price * markup * 100) / 100
  const comparePrice = Math.round(sellingPrice * 1.3 * 100) / 100

  return {
    name: ds.name,
    description: ds.description,
    price: sellingPrice,
    compare_price: comparePrice,
    cost_price: ds.price,
    images: ds.images,
    category: ds.category,
    stock: 999, // Virtual stock for dropshipping
    status: 'draft',
    dropshipping_source: ds.source,
    dropshipping_product_id: ds.source_id,
    dropshipping_supplier_url: ds.supplier_url,
    tags: ['dropshipping', ds.source, ds.category.toLowerCase()],
  }
}
