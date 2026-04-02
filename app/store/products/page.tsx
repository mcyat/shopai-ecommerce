'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, SlidersHorizontal, Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'
import toast, { Toaster } from 'react-hot-toast'

const PRODUCTS: Product[] = [
  { id: '1', name: 'Wireless Earbuds Pro', sku: 'WEP-001', price: 59.99, compare_price: 89.99, images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'], category: 'Electronics', tags: [], stock: 150, status: 'active', description: 'High-quality wireless earbuds with ANC', created_at: '', updated_at: '' },
  { id: '2', name: 'Premium Leather Wallet', sku: 'PLW-002', price: 39.99, compare_price: 59.99, images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'], category: 'Accessories', tags: [], stock: 200, status: 'active', description: 'Genuine leather RFID blocking wallet', created_at: '', updated_at: '' },
  { id: '3', name: 'Smart Watch Series 5', sku: 'SWS-003', price: 129.99, compare_price: 199.99, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'], category: 'Electronics', tags: [], stock: 75, status: 'active', description: 'Advanced health monitoring smartwatch', created_at: '', updated_at: '' },
  { id: '4', name: 'Portable Phone Stand', sku: 'PPS-004', price: 12.99, images: ['https://images.unsplash.com/photo-1586495777744-4e6232bf2d89?w=500'], category: 'Accessories', tags: [], stock: 500, status: 'active', description: 'Adjustable aluminum phone stand', created_at: '', updated_at: '' },
  { id: '5', name: 'Minimalist Backpack', sku: 'MBP-005', price: 79.99, compare_price: 99.99, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'], category: 'Fashion', tags: [], stock: 60, status: 'active', description: 'Water-resistant 20L backpack', created_at: '', updated_at: '' },
  { id: '6', name: 'Mechanical Keyboard', sku: 'MKB-006', price: 89.99, compare_price: 119.99, images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500'], category: 'Electronics', tags: [], stock: 80, status: 'active', description: 'RGB mechanical keyboard', created_at: '', updated_at: '' },
  { id: '7', name: 'Yoga Mat Premium', sku: 'YMP-007', price: 34.99, images: ['https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=500'], category: 'Sports', tags: [], stock: 100, status: 'active', description: 'Non-slip premium yoga mat', created_at: '', updated_at: '' },
  { id: '8', name: 'Coffee Mug Thermal', sku: 'CMT-008', price: 24.99, compare_price: 34.99, images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500'], category: 'Home', tags: [], stock: 250, status: 'active', description: '12-hour insulated travel mug', created_at: '', updated_at: '' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: '最新上架' },
  { value: 'price_asc', label: '價格由低至高' },
  { value: 'price_desc', label: '價格由高至低' },
  { value: 'popular', label: '最受歡迎' },
]

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('newest')
  const [priceMax, setPriceMax] = useState(200)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['all', ...Array.from(new Set(PRODUCTS.map(p => p.category)))]

  const filtered = PRODUCTS
    .filter(p => p.status === 'active')
    .filter(p => category === 'all' || p.category === category)
    .filter(p => p.price <= priceMax)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      return 0
    })

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('shopai_cart') || '[]')
    const idx = cart.findIndex((c: Product & { quantity: number }) => c.id === product.id)
    if (idx >= 0) cart[idx].quantity++
    else cart.push({ ...product, quantity: 1 })
    localStorage.setItem('shopai_cart', JSON.stringify(cart))
    toast.success(`已加入購物車：${product.name}`, {
      style: { borderRadius: '12px', background: '#333', color: '#fff' },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/store" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">所有商品</h1>
          <span className="text-gray-400 text-sm">({filtered.length} 件)</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className={`lg:w-60 flex-shrink-0 space-y-5 ${showFilters ? '' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">商品分類</h3>
              <div className="space-y-1.5">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-sm font-medium transition-colors
                      ${category === cat ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {cat === 'all' ? '全部' : cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">價格範圍</h3>
              <input type="range" min={0} max={300} value={priceMax} onChange={e => setPriceMax(parseInt(e.target.value))}
                className="w-full accent-gray-900" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span><span className="font-semibold text-gray-900">${priceMax}</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋商品..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-gray-400 bg-white" />
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gray-400 bg-white">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm">
                <SlidersHorizontal size={15} /> 篩選
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map(product => (
                <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                    {product.compare_price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        -{Math.round((1 - product.price / product.compare_price) * 100)}%
                      </div>
                    )}
                    <button onClick={() => setWishlist(prev => prev.includes(product.id) ? prev.filter(x => x !== product.id) : [...prev, product.id])}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart size={14} className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{product.category}</p>
                    <Link href={`/store/products/${product.id}`} className="block">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-sky-600 transition-colors mb-1">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-amber-400 text-amber-400" />)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900">{formatCurrency(product.price)}</span>
                        {product.compare_price && <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(product.compare_price)}</span>}
                      </div>
                      <button onClick={() => addToCart(product)} className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors">
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center text-gray-400">
                <Search size={48} className="mx-auto mb-3 opacity-40" />
                <p>找不到符合條件的商品</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
