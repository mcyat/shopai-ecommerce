'use client'
import { useState } from 'react'
import { Search, Download, Star, ShoppingCart, ExternalLink, ChevronDown, Filter, RefreshCw, Link2 } from 'lucide-react'
import Image from 'next/image'
import type { DropshippingProduct, DropshippingSource } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { prepareProductFromDropshipping } from '@/lib/dropshipping'

const MOCK_PRODUCTS: DropshippingProduct[] = [
  { source: 'aliexpress', source_id: 'AE-001', name: 'Wireless Bluetooth Earbuds 5.0', description: 'Hi-Fi sound quality earbuds with 40-hour battery life', images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300'], price: 8.50, shipping_cost: 1.99, shipping_days: 18, supplier_name: 'AudioPro Factory', supplier_url: '#', category: 'Electronics', rating: 4.7, orders_count: 5230 },
  { source: 'aliexpress', source_id: 'AE-002', name: 'Smart LED Desk Lamp USB', description: 'Adjustable color temperature, eye protection lamp', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300'], price: 6.20, shipping_cost: 2.50, shipping_days: 20, supplier_name: 'LightMaster Co', supplier_url: '#', category: 'Home', rating: 4.5, orders_count: 3100 },
  { source: 'cj', source_id: 'CJ-001', name: 'Portable Magnetic Phone Mount', description: 'Strong magnet, universal car phone holder', images: ['https://images.unsplash.com/photo-1586495777744-4e6232bf2d89?w=300'], price: 3.80, shipping_cost: 1.50, shipping_days: 10, supplier_name: 'CJ Warehouse HK', supplier_url: '#', category: 'Accessories', rating: 4.3, orders_count: 8900 },
  { source: 'cj', source_id: 'CJ-002', name: 'Silicone Watch Band 42mm', description: 'Compatible with Apple Watch, Samsung Galaxy Watch', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'], price: 2.50, shipping_cost: 0.99, shipping_days: 8, supplier_name: 'CJ Premium', supplier_url: '#', category: 'Accessories', rating: 4.6, orders_count: 12450 },
  { source: 'spocket', source_id: 'SP-001', name: 'Minimalist Canvas Tote Bag', description: 'Eco-friendly, reusable shopping bag, multiple colors', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300'], price: 12.00, shipping_cost: 3.99, shipping_days: 5, supplier_name: 'EcoStyle US', supplier_url: '#', category: 'Fashion', rating: 4.8, orders_count: 2300 },
  { source: 'spocket', source_id: 'SP-002', name: 'Organic Cotton T-Shirt', description: 'GOTS certified organic cotton, unisex design', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300'], price: 14.50, shipping_cost: 4.99, shipping_days: 4, supplier_name: 'GreenThread USA', supplier_url: '#', category: 'Fashion', rating: 4.9, orders_count: 1800 },
]

const SOURCE_INFO = {
  aliexpress: { label: 'AliExpress', color: 'bg-orange-100 text-orange-700', flag: '🇨🇳' },
  cj: { label: 'CJ Dropshipping', color: 'bg-blue-100 text-blue-700', flag: '🏭' },
  spocket: { label: 'Spocket', color: 'bg-purple-100 text-purple-700', flag: '🇺🇸' },
}

export default function DropshippingPage() {
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState<DropshippingSource | 'all'>('all')
  const [markup, setMarkup] = useState(2.5)
  const [imported, setImported] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const filtered = MOCK_PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    const matchSource = sourceFilter === 'all' || p.source === sourceFilter
    return matchSearch && matchSource
  })

  const importProduct = async (product: DropshippingProduct) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setImported(prev => [...prev, product.source_id])
    setLoading(false)
  }

  const getSellingPrice = (cost: number) => Math.round(cost * markup * 100) / 100
  const getMargin = (cost: number) => Math.round((1 - cost / getSellingPrice(cost)) * 100)

  return (
    <div className="p-5 lg:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dropshipping 商品庫</h1>
          <p className="text-slate-500 text-sm">從 AliExpress、CJ、Spocket 一鍵導入商品</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-xl hover:border-slate-400 transition-colors">
            <Link2 size={15} /> 管理供應商
          </button>
          <button onClick={() => setLoading(true)} className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-xl hover:border-slate-400 transition-colors">
            <RefreshCw size={15} /> 同步商品
          </button>
        </div>
      </div>

      {/* Supplier Tabs */}
      <div className="grid grid-cols-3 gap-3">
        {(Object.entries(SOURCE_INFO) as [DropshippingSource, typeof SOURCE_INFO[DropshippingSource]][]).map(([source, info]) => (
          <button key={source} onClick={() => setSourceFilter(sourceFilter === source ? 'all' : source)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${sourceFilter === source ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-300 bg-white'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{info.flag}</span>
              <span className={`badge ${info.color}`}>{info.label}</span>
            </div>
            <p className="text-xs text-slate-500">{MOCK_PRODUCTS.filter(p => p.source === source).length} 件商品</p>
          </button>
        ))}
      </div>

      {/* Markup Calculator */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">利潤倍率設定</p>
          <p className="text-xs text-slate-500">售價 = 成本 × {markup}x（目前利潤率約 {Math.round((1 - 1/markup) * 100)}%）</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="range" min={1.5} max={5} step={0.1} value={markup}
            onChange={e => setMarkup(parseFloat(e.target.value))}
            className="w-32 accent-sky-600" />
          <span className="text-lg font-bold text-sky-700 min-w-[3rem]">{markup}x</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋商品名稱或分類..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-slate-400 bg-white" />
        </div>
        <select className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 bg-white">
          <option>全部分類</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Accessories</option>
          <option>Home</option>
        </select>
        <select className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 bg-white">
          <option>排序：熱銷</option>
          <option>排序：價格由低</option>
          <option>排序：評分</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(product => {
          const isImported = imported.includes(product.source_id)
          const sellingPrice = getSellingPrice(product.price)
          const margin = getMargin(product.price)
          const sourceInfo = SOURCE_INFO[product.source]

          return (
            <div key={product.source_id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative h-48 bg-slate-100">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="33vw" />
                <div className="absolute top-3 left-3">
                  <span className={`badge ${sourceInfo.color}`}>{sourceInfo.flag} {sourceInfo.label}</span>
                </div>
                {isImported && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ 已導入</div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-slate-400 mb-1">{product.category}</p>
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2">{product.name}</h3>

                {/* Rating & Orders */}
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" /> {product.rating}
                  </span>
                  <span>{product.orders_count?.toLocaleString()} 訂單</span>
                  <span>📦 {product.shipping_days}天</span>
                </div>

                {/* Pricing */}
                <div className="bg-slate-50 rounded-xl p-3 mb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">採購成本</span>
                    <span className="font-medium">{formatCurrency(product.price)} + {formatCurrency(product.shipping_cost)} 運費</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">建議售價 ({markup}x)</span>
                    <span className="font-bold text-slate-900">{formatCurrency(sellingPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">利潤率</span>
                    <span className={`font-semibold ${margin >= 60 ? 'text-green-600' : margin >= 40 ? 'text-amber-600' : 'text-red-500'}`}>{margin}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a href={product.supplier_url} target="_blank" rel="noopener"
                    className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:border-slate-400 transition-colors">
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => !isImported && importProduct(product)}
                    disabled={isImported || loading}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-colors
                      ${isImported ? 'bg-green-100 text-green-700 cursor-default' : 'bg-slate-900 text-white hover:bg-slate-700'}`}>
                    {isImported ? (
                      <><CheckCircleIcon /> 已導入</>
                    ) : (
                      <><Download size={13} /> 導入商品</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Imported Summary */}
      {imported.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3">
          <ShoppingCart size={18} />
          <span className="text-sm font-medium">已導入 {imported.length} 件商品</span>
          <a href="/admin/products" className="text-xs text-sky-400 underline">查看商品</a>
        </div>
      )}
    </div>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
