'use client'
import { ShoppingCart, Search, User, ArrowRight, Star, Heart, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Product, StoreSettings } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { t } from '@/lib/i18n'

interface Props { settings: StoreSettings; products: Product[]; cartCount: number; onAddToCart: (p: Product) => void }

export default function FashionTemplate({ settings, products, cartCount, onAddToCart }: Props) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const lang = settings.language
  const featured = products.filter(p => p.status === 'active').slice(0, 6)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#f5f0e8', fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar */}
      <div className="text-center py-2 text-xs tracking-[0.2em] font-medium" style={{ backgroundColor: '#c9a96e', color: '#0a0a0a' }}>
        {settings.announcement || 'FREE WORLDWIDE SHIPPING ON ORDERS OVER $50'}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)', borderColor: '#2a2a2a' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['New Arrivals', 'Collection', 'Sale'].map(item => (
              <Link key={item} href={`/store/products?category=${item.toLowerCase()}`}
                className="text-xs font-semibold tracking-widest uppercase hover:text-amber-400 transition-colors"
                style={{ color: '#f5f0e8' }}>
                {item}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <Link href="/store" className="text-2xl font-thin tracking-[0.4em] uppercase" style={{ fontFamily: "'Playfair Display', serif", color: '#f5f0e8' }}>
            {settings.store_name}
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-5">
            <Search size={18} className="cursor-pointer hover:text-amber-400 transition-colors" />
            <User size={18} className="cursor-pointer hover:text-amber-400 transition-colors" />
            <Link href="/store/cart" className="relative">
              <ShoppingCart size={18} className="hover:text-amber-400 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 text-xs rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: '#c9a96e', color: '#0a0a0a' }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #c9a96e, transparent)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: '#c9a96e' }}>New Collection 2025</p>
            <h1 className="text-6xl lg:text-8xl font-thin leading-none mb-8 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Art of<br />
              <em style={{ color: '#c9a96e' }}>Elegance</em>
            </h1>
            <p className="text-sm tracking-widest text-gray-400 mb-10 uppercase">Curated pieces for the discerning aesthetic</p>
            <Link href="/store/products"
              className="inline-flex items-center gap-3 px-10 py-4 text-xs tracking-widest uppercase font-semibold transition-all hover:gap-5"
              style={{ backgroundColor: '#c9a96e', color: '#0a0a0a' }}>
              Explore Now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={20} style={{ color: '#c9a96e' }} />
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#c9a96e' }}>Featured</p>
          <h2 className="text-4xl font-thin tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('store.best_sellers', lang)}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
          {featured.map((product, idx) => (
            <div key={product.id}
              className={`group relative overflow-hidden cursor-pointer ${idx === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
              style={{ aspectRatio: idx === 0 ? '16/9' : '1/1' }}>
              <div className="relative w-full h-full" style={{ minHeight: idx === 0 ? '500px' : '280px' }}>
                <Image
                  src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/600`}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes={idx === 0 ? '66vw' : '33vw'}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(to top, #0a0a0a, transparent)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#c9a96e' }}>{product.category}</p>
                  <h3 className="font-medium text-white mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold" style={{ color: '#c9a96e' }}>
                      {formatCurrency(product.price, settings.currency)}
                    </span>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="text-xs px-4 py-2 font-semibold tracking-widest uppercase transition-colors"
                      style={{ backgroundColor: '#c9a96e', color: '#0a0a0a' }}>
                      {t('store.add_to_cart', lang)}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setWishlist(prev => prev.includes(product.id) ? prev.filter(x => x !== product.id) : [...prev, product.id])}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={18} className={wishlist.includes(product.id) ? 'fill-amber-400 text-amber-400' : 'text-white'} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-24 text-center" style={{ borderTop: '1px solid #2a2a2a' }}>
        <div className="max-w-3xl mx-auto px-6">
          <blockquote className="text-3xl lg:text-5xl font-thin leading-tight italic"
            style={{ fontFamily: "'Playfair Display', serif", color: '#c9a96e' }}>
            &ldquo;Fashion is the armor to survive the reality of everyday life.&rdquo;
          </blockquote>
          <p className="text-xs tracking-widest uppercase mt-6 text-gray-500">— Bill Cunningham</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: '#2a2a2a' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-2xl font-thin tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
            {settings.store_name}
          </p>
          <div className="flex items-center gap-8 text-xs tracking-widest uppercase text-gray-500">
            {['About', 'Shipping', 'Returns', 'Contact'].map(item => (
              <a key={item} href="#" className="hover:text-amber-400 transition-colors">{item}</a>
            ))}
          </div>
          <p className="text-xs text-gray-600">© 2025 {settings.store_name}</p>
        </div>
      </footer>
    </div>
  )
}
