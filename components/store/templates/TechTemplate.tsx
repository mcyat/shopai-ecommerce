'use client'
import { ShoppingCart, Search, Cpu, Battery, Wifi, Shield, Zap, ArrowRight, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Product, StoreSettings } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { t } from '@/lib/i18n'

interface Props { settings: StoreSettings; products: Product[]; cartCount: number; onAddToCart: (p: Product) => void }

export default function TechTemplate({ settings, products, cartCount, onAddToCart }: Props) {
  const [activeCategory, setActiveCategory] = useState('all')
  const lang = settings.language
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]
  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d1117', color: '#e6edf3', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(10px)', borderColor: '#21262d' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/store" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #58a6ff, #7c3aed)' }}>
              <Cpu size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: '#e6edf3' }}>{settings.store_name}</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 rounded-xl px-4 py-2 flex-1 max-w-md mx-8"
            style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}>
            <Search size={16} style={{ color: '#7d8590' }} />
            <input placeholder={t('store.search', lang)} className="bg-transparent text-sm outline-none flex-1 ml-2 placeholder-gray-500" style={{ color: '#e6edf3' }} />
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-6">
              {['Products', 'Deals', 'New'].map(item => (
                <Link key={item} href={`/store/products?filter=${item.toLowerCase()}`}
                  className="text-sm font-medium transition-colors hover:text-blue-400"
                  style={{ color: '#7d8590' }}>
                  {item}
                </Link>
              ))}
            </nav>
            <Link href="/store/cart" className="relative p-2 rounded-lg transition-colors hover:bg-gray-800">
              <ShoppingCart size={20} style={{ color: '#e6edf3' }} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: '#58a6ff', color: '#0d1117' }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - Cyberpunk style */}
      <section className="relative overflow-hidden" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #0d1117 0%, #0a0e1a 50%, #0d1117 100%)' }}>
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(#21262d 1px, transparent 1px), linear-gradient(90deg, #21262d 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Glow effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #58a6ff, transparent)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ backgroundColor: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.3)', color: '#58a6ff' }}>
              <Zap size={12} /> AI-Powered Technology Store
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
              <span style={{ color: '#e6edf3' }}>Next-Gen</span><br />
              <span style={{ background: 'linear-gradient(90deg, #58a6ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Tech Gear
              </span>
            </h1>
            <p className="text-base mb-8" style={{ color: '#7d8590', lineHeight: '1.7' }}>
              Cutting-edge electronics, smart devices, and premium accessories. AI-curated for the tech enthusiast.
            </p>
            <div className="flex gap-4">
              <Link href="/store/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #58a6ff, #7c3aed)', color: 'white' }}>
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link href="/store/products?sale=true"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
                style={{ backgroundColor: 'rgba(33,38,45,0.8)', border: '1px solid #21262d', color: '#e6edf3' }}>
                View Deals
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10">
              {[['10K+', 'Products'], ['4.9★', 'Rating'], ['24/7', 'AI Support']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-xl font-bold" style={{ color: '#58a6ff' }}>{val}</p>
                  <p className="text-xs" style={{ color: '#7d8590' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Battery, title: 'Long Battery Life', desc: '30+ hours' },
              { icon: Wifi, title: 'Fast Connectivity', desc: 'WiFi 6E' },
              { icon: Shield, title: 'Secure Payments', desc: 'SSL Encrypted' },
              { icon: Zap, title: 'Fast Shipping', desc: '2-3 business days' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-4 rounded-xl" style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'linear-gradient(135deg, rgba(88,166,255,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(88,166,255,0.3)' }}>
                  <Icon size={16} style={{ color: '#58a6ff' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: '#e6edf3' }}>{title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#7d8590' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-y" style={{ borderColor: '#21262d', backgroundColor: '#161b22' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={activeCategory === cat
                ? { backgroundColor: '#58a6ff', color: '#0d1117' }
                : { backgroundColor: '#0d1117', border: '1px solid #21262d', color: '#7d8590' }}>
              {cat === 'all' ? t('store.products', lang) : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold" style={{ color: '#e6edf3' }}>
            {t('store.best_sellers', lang)}
          </h2>
          <Link href="/store/products" className="flex items-center gap-1 text-sm" style={{ color: '#58a6ff' }}>
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.slice(0, 8).map(product => (
            <div key={product.id} className="group rounded-xl overflow-hidden transition-all hover:scale-[1.02] cursor-pointer"
              style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}>
              <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: '#0d1117' }}>
                <Image
                  src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/300`}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                  sizes="25vw"
                />
                {product.compare_price && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #58a6ff, #7c3aed)', color: 'white' }}>
                    SALE
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium mb-1" style={{ color: '#58a6ff' }}>{product.category}</p>
                <h3 className="text-sm font-semibold line-clamp-2 mb-2" style={{ color: '#e6edf3' }}>{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs ml-1" style={{ color: '#7d8590' }}>(4.8)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold" style={{ color: '#58a6ff' }}>{formatCurrency(product.price, settings.currency)}</span>
                    {product.compare_price && (
                      <span className="text-xs line-through ml-1" style={{ color: '#7d8590' }}>
                        {formatCurrency(product.compare_price, settings.currency)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock === 0}
                  className="mt-3 w-full py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #58a6ff, #7c3aed)', color: 'white' }}>
                  {product.stock === 0 ? t('store.out_of_stock', lang) : t('store.add_to_cart', lang)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10" style={{ borderColor: '#21262d', backgroundColor: '#0d1117' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #58a6ff, #7c3aed)' }}>
              <Cpu size={12} className="text-white" />
            </div>
            <span className="font-bold" style={{ color: '#e6edf3' }}>{settings.store_name}</span>
          </div>
          <p className="text-sm" style={{ color: '#7d8590' }}>© 2025 {settings.store_name} · Powered by ShopAI</p>
          <div className="flex gap-6 text-sm" style={{ color: '#7d8590' }}>
            {['Privacy', 'Terms', 'Support'].map(i => <a key={i} href="#" className="hover:text-blue-400 transition-colors">{i}</a>)}
          </div>
        </div>
      </footer>
    </div>
  )
}
