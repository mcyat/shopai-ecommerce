'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag } from 'lucide-react'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface CartItem extends Product { quantity: number }

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('shopai_cart')
    if (stored) setCart(JSON.parse(stored))
  }, [])

  const update = (id: string, qty: number) => {
    const newCart = qty <= 0 ? cart.filter(c => c.id !== id) : cart.map(c => c.id === id ? { ...c, quantity: qty } : c)
    setCart(newCart)
    localStorage.setItem('shopai_cart', JSON.stringify(newCart))
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= 50 ? 0 : 9.99
  const total = subtotal + shipping - discount

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'SHOPAI10') {
      setDiscount(Math.round(subtotal * 0.1 * 100) / 100)
    } else if (coupon.toUpperCase() === 'WELCOME') {
      setDiscount(5)
    }
  }

  if (cart.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <ShoppingBag size={64} className="text-gray-300 mb-6" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">購物車是空的</h2>
      <p className="text-gray-500 mb-8">快去挑選您喜歡的商品吧！</p>
      <Link href="/store" className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-gray-700 transition-colors">
        繼續購物
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/store" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">購物車 ({cart.reduce((s, i) => s + i.quantity, 0)} 件)</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-5 flex gap-5 shadow-sm border border-gray-100">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={item.images?.[0] || `https://picsum.photos/seed/${item.id}/200`} alt={item.name} fill className="object-cover" sizes="96px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{item.category}</p>
                      <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                    </div>
                    <button onClick={() => update(item.id, 0)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-200 rounded-full">
                      <button onClick={() => update(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => update(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400">{formatCurrency(item.price)} 各</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-5">訂單摘要</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">小計</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">運費</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                    {shipping === 0 ? '🎉 免費' : formatCurrency(shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>折扣</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>總計</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              {subtotal < 50 && (
                <p className="mt-3 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                  再消費 {formatCurrency(50 - subtotal)} 即可享免費運費！
                </p>
              )}
              <Link href="/store/checkout"
                className="mt-5 block w-full bg-gray-900 text-white text-center py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors">
                前往結帳
              </Link>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag size={16} /> 優惠券
              </h3>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder="輸入優惠碼"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
                <button onClick={applyCoupon} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
                  套用
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">試試：SHOPAI10 (9折) · WELCOME ($5 折抵)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
