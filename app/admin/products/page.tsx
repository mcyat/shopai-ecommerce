'use client'
import { useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, Upload, Download, Package } from 'lucide-react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

const DEMO_PRODUCTS: Product[] = [
  { id: '1', name: 'Wireless Earbuds Pro', sku: 'WEP-001', price: 59.99, compare_price: 89.99, cost_price: 18.00, images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200'], category: 'Electronics', tags: ['audio', 'wireless'], stock: 150, status: 'active', description: '', created_at: '2024-03-01', updated_at: '2024-04-01' },
  { id: '2', name: 'Premium Leather Wallet', sku: 'PLW-002', price: 39.99, compare_price: 59.99, cost_price: 12.00, images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=200'], category: 'Accessories', tags: ['wallet'], stock: 200, status: 'active', description: '', created_at: '2024-03-05', updated_at: '2024-04-01' },
  { id: '3', name: 'Smart Watch Series 5', sku: 'SWS-003', price: 129.99, compare_price: 199.99, cost_price: 45.00, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'], category: 'Electronics', tags: ['wearable'], stock: 75, status: 'active', description: '', created_at: '2024-03-10', updated_at: '2024-04-01' },
  { id: '4', name: 'Portable Phone Stand', sku: 'PPS-004', price: 12.99, images: ['https://images.unsplash.com/photo-1586495777744-4e6232bf2d89?w=200'], category: 'Accessories', tags: ['phone'], stock: 3, status: 'active', description: '', created_at: '2024-03-15', updated_at: '2024-04-01' },
  { id: '5', name: 'Minimalist Backpack', sku: 'MBP-005', price: 79.99, compare_price: 99.99, cost_price: 28.00, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200'], category: 'Fashion', tags: ['bag'], stock: 0, status: 'draft', description: '', created_at: '2024-03-20', updated_at: '2024-04-01' },
  { id: '6', name: 'Mechanical Keyboard', sku: 'MKB-006', price: 89.99, compare_price: 119.99, cost_price: 32.00, images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=200'], category: 'Electronics', tags: ['keyboard'], stock: 80, status: 'active', description: '', created_at: '2024-03-22', updated_at: '2024-04-01' },
]

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
  archived: 'bg-gray-100 text-gray-600',
}
const STATUS_LABELS = { active: '上架中', draft: '草稿', archived: '已下架' }

export default function ProductsPage() {
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all')
  const [selected, setSelected] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null)

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.includes(search)
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id))

  const openEdit = (product?: Product) => {
    setEditProduct(product || { name: '', price: 0, stock: 0, category: '', sku: '', status: 'draft', description: '', images: [], tags: [], created_at: '', updated_at: '' })
    setShowModal(true)
  }

  return (
    <div className="p-5 lg:p-7 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">商品管理</h1>
          <p className="text-slate-500 text-sm">{products.length} 件商品 · {products.filter(p => p.status === 'active').length} 件上架中</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl hover:border-slate-400 transition-colors">
            <Upload size={15} /> 匯入
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl hover:border-slate-400 transition-colors">
            <Download size={15} /> 匯出
          </button>
          <button onClick={() => openEdit()} className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-sm rounded-xl hover:bg-slate-700 transition-colors">
            <Plus size={15} /> 新增商品
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋商品名稱或SKU..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-slate-400 bg-white" />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'active', 'draft', 'archived'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-medium rounded-xl transition-colors ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'}`}>
              {f === 'all' ? '全部' : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-sky-50 border border-sky-200 rounded-xl">
          <span className="text-sm font-medium text-sky-800">已選 {selected.length} 件</span>
          <button className="text-xs text-sky-700 border border-sky-300 px-3 py-1 rounded-lg hover:bg-sky-100">批量上架</button>
          <button className="text-xs text-sky-700 border border-sky-300 px-3 py-1 rounded-lg hover:bg-sky-100">批量下架</button>
          <button className="text-xs text-red-600 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50">刪除</button>
          <button onClick={() => setSelected([])} className="text-xs text-slate-500 ml-auto">取消</button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-left">
                  <input type="checkbox" className="rounded"
                    checked={selected.length === filtered.length}
                    onChange={() => setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id))} />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">商品</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">分類</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">售價</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">成本</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">庫存</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">狀態</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <input type="checkbox" className="rounded" checked={selected.includes(product.id)} onChange={() => toggleSelect(product.id)} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                        ) : (
                          <Package size={16} className="text-slate-400 m-auto absolute inset-0 flex items-center justify-center" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{product.name}</p>
                        <p className="text-xs text-slate-400">{product.dropshipping_source ? `Dropshipping · ${product.dropshipping_source}` : '自管'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{product.sku}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{product.category}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div>
                      <p className="font-semibold text-slate-900">{formatCurrency(product.price)}</p>
                      {product.compare_price && (
                        <p className="text-xs text-slate-400 line-through">{formatCurrency(product.compare_price)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs text-slate-500">
                    {product.cost_price ? formatCurrency(product.cost_price) : '-'}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`font-semibold ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-amber-600' : 'text-slate-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`badge ${STATUS_STYLES[product.status]}`}>{STATUS_LABELS[product.status]}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500" title="查看">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => openEdit(product)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500" title="編輯">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-400" title="刪除">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Package size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">找不到商品</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && editProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold">{editProduct.id ? '編輯商品' : '新增商品'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">商品名稱 *</label>
                  <input value={editProduct.name || ''} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" placeholder="商品名稱" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">售價 *</label>
                  <input type="number" value={editProduct.price || ''} onChange={e => setEditProduct(p => ({ ...p, price: parseFloat(e.target.value) }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">比較價格</label>
                  <input type="number" value={editProduct.compare_price || ''} onChange={e => setEditProduct(p => ({ ...p, compare_price: parseFloat(e.target.value) }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">成本</label>
                  <input type="number" value={editProduct.cost_price || ''} onChange={e => setEditProduct(p => ({ ...p, cost_price: parseFloat(e.target.value) }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">庫存</label>
                  <input type="number" value={editProduct.stock || ''} onChange={e => setEditProduct(p => ({ ...p, stock: parseInt(e.target.value) }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">分類</label>
                  <select value={editProduct.category || ''} onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400">
                    {['Electronics', 'Fashion', 'Accessories', 'Home', 'Sports'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">狀態</label>
                  <select value={editProduct.status || 'draft'} onChange={e => setEditProduct(p => ({ ...p, status: e.target.value as 'active' | 'draft' | 'archived' }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400">
                    <option value="active">上架中</option>
                    <option value="draft">草稿</option>
                    <option value="archived">已下架</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">商品描述</label>
                  <textarea value={editProduct.description || ''} onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))}
                    rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 resize-none" placeholder="商品描述..." />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 py-2.5 rounded-xl text-sm font-medium hover:border-slate-400 transition-colors">取消</button>
                <button onClick={() => {
                  if (editProduct.id) {
                    setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...editProduct } as Product : p))
                  } else {
                    setProducts(prev => [...prev, { ...editProduct, id: Date.now().toString(), sku: `SKU-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Product])
                  }
                  setShowModal(false)
                }} className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors">
                  {editProduct.id ? '儲存變更' : '新增商品'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
