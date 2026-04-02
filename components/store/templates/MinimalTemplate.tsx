'use client'
import { ShoppingCart, Search, Menu, X, Star, ChevronRight, Heart, ArrowRight, Package, Shield, RefreshCw, Headphones } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Product, StoreSettings } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { t } from '@/lib/i18n'

interface MinimalTemplateProps {
  settings: StoreSettings
  products: Product[]
  cartCount: number
  onAddToCart: (product: Product) => void
}

export default function MinimalTemplate({ settings, products, cartCount, onAddToCart }: MinimalTemplateProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const lang = settings.language
  const featured = products.filter(p => p.status === 'active').slice(0, 6)
  const newArrivals = products.slice(0, 4)

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Announcement Bar */}
      {settings.announcement && (
        <div className="bg-gray-900 text-white text-center py-2 text-xs font-medium tracking-wider">
          {settings.announcement}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/store" className="flex items-center gap-2">
              {settings.logo_url ? (
                <Image src={settings.logo_url} alt={settings.store_name} width={120} height={40} className="h-8 w-auto" />
              ) : (
                <span className="text-xl font-bold tracking-tight text-gray-900">{settings.store_name}</span>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/store" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                {t('store.home', lang)}
              </Link>
              <Link href="/store/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                {t('store.products', lang)}
              </Link>
              {['Fashion', 'Electronics', 'Accessories'].map(cat => (
                <Link key={cat} href={`/store/products?category=${cat}`} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  {cat}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="hidden md:flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <Search size={18} />
              </button>
              <Link href="/store/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white py-4 px-4">
            {[t('store.home', lang), t('store.products', lang), t('store.cart', lang)].map(item => (
              <Link key={item} href={`/store${item === t('store.home', lang) ? '' : '/' + item.toLowerCase()}`}
                className="block py-2.5 text-sm font-medium text-gray-700"
                onClick={() => setMenuOpen(false)}>
                {item}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
              ✨ AI-Powered Shopping
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t('store.new_arrivals', lang)}<br />
              <span className="text-sky-600">{settings.store_name}</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Discover curated products with AI-powered recommendations and seamless shopping experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/store/products"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors">
                {t('store.products', lang)} <ArrowRight size={16} />
              </Link>
              <Link href="/store/products?sale=true"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-3.5 rounded-full text-sm font-semibold hover:border-gray-500 transition-colors">
                {t('store.on_sale', lang)}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
          <div className="w-96 h-96 bg-sky-400 rounded-full blur-3xl absolute -top-20 right-20" />
          <div className="w-64 h-64 bg-indigo-400 rounded-full blur-3xl absolute top-40 right-40" />
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Package, text: '全球免費配送' },
              { icon: Shield, text: '安全加密支付' },
              { icon: RefreshCw, text: '30天退換保障' },
              { icon: Headphones, text: 'AI 24/7 客服' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Icon size={18} className="text-sky-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('store.best_sellers', lang)}</h2>
            <p className="text-gray-500 text-sm mt-1">精選熱銷商品</p>
          </div>
          <Link href="/store/products" className="flex items-center gap-1 text-sm text-sky-600 font-medium hover:text-sky-700">
            查看全部 <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 lg:gap-6">
          {featured.map(product => (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/400`}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={14} className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </button>
                {product.compare_price && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    -{Math.round((1 - product.price / product.compare_price) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{product.category}</p>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-amber-400 text-amber-400" />)}
                  <span className="text-xs text-gray-400 ml-1">(4.8)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-gray-900">{formatCurrency(product.price, settings.currency)}</span>
                    {product.compare_price && (
                      <span className="text-xs text-gray-400 line-through ml-2">{formatCurrency(product.compare_price, settings.currency)}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock === 0}
                  className="mt-3 w-full bg-gray-900 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {product.stock === 0 ? t('store.out_of_stock', lang) : t('store.add_to_cart', lang)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals Banner */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-3">{t('store.new_arrivals', lang)}</h2>
              <p className="text-gray-400">每週更新最新商品，AI 智能推薦最適合您的選擇</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {newArrivals.slice(0, 2).map(product => (
                <Link key={product.id} href={`/store/products/${product.id}`}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/100`} alt={product.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                    <p className="text-sky-400 text-sm font-bold">{formatCurrency(product.price, settings.currency)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <span className="text-xl font-bold text-gray-900">{settings.store_name}</span>
              <p className="text-gray-400 text-sm mt-3">AI 驅動的智慧電商平台，為您提供最佳購物體驗。</p>
            </div>
            {[
              { title: '快速連結', links: ['首頁', '商品', '關於我們'] },
              { title: '客戶服務', links: ['訂單查詢', '退換貨政策', '聯繫客服'] },
              { title: '商業合作', links: ['供應商合作', 'Dropshipping', 'API 對接'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.map(link => (
                    <li key={link}><a href="#" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-8 pt-6 flex items-center justify-between">
            <p className="text-xs text-gray-400">© 2025 {settings.store_name}. Powered by ShopAI</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
