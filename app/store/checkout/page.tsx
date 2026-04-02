'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Lock, CheckCircle } from 'lucide-react'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface CartItem extends Product { quantity: number }

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info')
  const [loading, setLoading] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', postal: '', country: 'TW',
    cardNumber: '', expiry: '', cvv: '', cardName: '',
  })

  useEffect(() => {
    const stored = localStorage.getItem('shopai_cart')
    if (stored) setCart(JSON.parse(stored))
  }, [])

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= 50 ? 0 : 9.99
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'info') { setStep('payment'); return }
    setLoading(true)
    // Simulate order placement
    await new Promise(r => setTimeout(r, 2000))
    const num = `ORD-${Date.now().toString().slice(-8)}`
    setOrderNumber(num)
    localStorage.removeItem('shopai_cart')
    setStep('success')
    setLoading(false)
  }

  if (step === 'success') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-sm border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">訂單成立！</h1>
        <p className="text-gray-500 mb-1">訂單號碼</p>
        <p className="text-xl font-mono font-bold text-gray-900 mb-6">{orderNumber}</p>
        <p className="text-sm text-gray-500 mb-8">
          確認郵件已發送至 <strong>{form.email}</strong>，<br />我們將盡快處理您的訂單。
        </p>
        <div className="space-y-3">
          <Link href={`/store/orders/${orderNumber}`}
            className="block w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors">
            追蹤訂單
          </Link>
          <Link href="/store" className="block w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:border-gray-400 transition-colors">
            繼續購物
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/store/cart" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 w-fit">
          <ArrowLeft size={18} /> 返回購物車
        </Link>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[{ id: 'info', label: '聯絡資訊' }, { id: 'payment', label: '付款' }].map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2">
              {idx > 0 && <div className="w-12 h-0.5 bg-gray-200" />}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${step === s.id ? 'bg-gray-900 text-white' : step === 'success' || (s.id === 'info' && step === 'payment') ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {idx + 1}
              </div>
              <span className={`text-sm font-medium ${step === s.id ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {step === 'info' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-5">聯絡資訊</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: '姓名', placeholder: '王小明', col: 'full' },
                    { key: 'email', label: '電子郵件', placeholder: 'email@example.com', type: 'email' },
                    { key: 'phone', label: '電話', placeholder: '+886 912 345 678' },
                    { key: 'address', label: '地址', placeholder: '中正區忠孝東路一段1號', col: 'full' },
                    { key: 'city', label: '城市', placeholder: '台北市' },
                    { key: 'state', label: '縣/市', placeholder: '台灣' },
                    { key: 'postal', label: '郵遞區號', placeholder: '100' },
                    { key: 'country', label: '國家', placeholder: '', type: 'select' },
                  ].map(({ key, label, placeholder, col, type }) => (
                    <div key={key} className={col === 'full' ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
                      {type === 'select' ? (
                        <select value={form[key as keyof typeof form]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gray-400">
                          <option value="TW">台灣 🇹🇼</option>
                          <option value="HK">香港 🇭🇰</option>
                          <option value="CN">中國大陸 🇨🇳</option>
                          <option value="JP">日本 🇯🇵</option>
                          <option value="US">美國 🇺🇸</option>
                        </select>
                      ) : (
                        <input required type={type || 'text'} value={form[key as keyof typeof form]} placeholder={placeholder}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
                <button type="submit" className="mt-6 w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors">
                  繼續至付款
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <h2 className="text-lg font-bold text-gray-900">付款資訊</h2>
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <Lock size={10} /> 安全加密
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">卡號</label>
                    <input required value={form.cardNumber} placeholder="1234 5678 9012 3456"
                      onChange={e => setForm(f => ({ ...f, cardNumber: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">有效期限</label>
                      <input required value={form.expiry} placeholder="MM/YY"
                        onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">CVV</label>
                      <input required value={form.cvv} placeholder="123"
                        onChange={e => setForm(f => ({ ...f, cvv: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">持卡人姓名</label>
                    <input required value={form.cardName} placeholder="WANG XIAO MING"
                      onChange={e => setForm(f => ({ ...f, cardName: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-xl">
                  <CreditCard size={16} className="text-gray-400" />
                  <p className="text-xs text-gray-500">我們接受 Visa、Mastercard、AMEX、JCB</p>
                </div>
                <button type="submit" disabled={loading}
                  className="mt-6 w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 處理中...</>
                  ) : `確認付款 ${formatCurrency(total)}`}
                </button>
              </div>
            )}
          </form>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">訂單摘要</h2>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center z-10">{item.quantity}</div>
                      <img src={item.images?.[0] || ''} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">{formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">小計</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">運費</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? '免費' : formatCurrency(shipping)}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t"><span>總計</span><span>{formatCurrency(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
