'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { Product, StoreSettings } from '@/types'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

const MinimalTemplate = dynamic(() => import('@/components/store/templates/MinimalTemplate'), { ssr: false })
const FashionTemplate = dynamic(() => import('@/components/store/templates/FashionTemplate'), { ssr: false })
const TechTemplate = dynamic(() => import('@/components/store/templates/TechTemplate'), { ssr: false })

const DEFAULT_SETTINGS: StoreSettings = {
  id: '1',
  store_name: 'ShopAI',
  template: 'minimal',
  primary_color: '#0ea5e9',
  secondary_color: '#f8fafc',
  font_family: 'Inter',
  currency: 'USD',
  language: 'zh-TW',
  announcement: '🎉 全館滿 $50 免運費 | 新品上架 | AI 智慧推薦',
  social_links: {},
  tax_rate: 0,
  updated_at: new Date().toISOString(),
}

const DEMO_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Wireless Earbuds Pro', sku: 'WEP-001', price: 59.99, compare_price: 89.99,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'],
    category: 'Electronics', tags: ['audio', 'wireless'], stock: 150, status: 'active',
    description: 'High-quality wireless earbuds with ANC', created_at: '', updated_at: '',
  },
  {
    id: '2', name: 'Premium Leather Wallet', sku: 'PLW-002', price: 39.99, compare_price: 59.99,
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=600'],
    category: 'Accessories', tags: ['wallet', 'leather'], stock: 200, status: 'active',
    description: 'Genuine leather slim wallet with RFID blocking', created_at: '', updated_at: '',
  },
  {
    id: '3', name: 'Smart Watch Series 5', sku: 'SWS-003', price: 129.99, compare_price: 199.99,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    category: 'Electronics', tags: ['wearable', 'smart'], stock: 75, status: 'active',
    description: 'Advanced smartwatch with health monitoring', created_at: '', updated_at: '',
  },
  {
    id: '4', name: 'Portable Phone Stand', sku: 'PPS-004', price: 12.99,
    images: ['https://images.unsplash.com/photo-1586495777744-4e6232bf2d89?w=600'],
    category: 'Accessories', tags: ['phone', 'desk'], stock: 500, status: 'active',
    description: 'Adjustable aluminum phone stand', created_at: '', updated_at: '',
  },
  {
    id: '5', name: 'Minimalist Backpack', sku: 'MBP-005', price: 79.99, compare_price: 99.99,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
    category: 'Fashion', tags: ['bag', 'travel'], stock: 60, status: 'active',
    description: 'Water-resistant minimalist backpack 20L', created_at: '', updated_at: '',
  },
  {
    id: '6', name: 'Mechanical Keyboard', sku: 'MKB-006', price: 89.99, compare_price: 119.99,
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600'],
    category: 'Electronics', tags: ['keyboard', 'gaming'], stock: 80, status: 'active',
    description: 'Compact mechanical keyboard with RGB backlight', created_at: '', updated_at: '',
  },
]

interface CartItem extends Product { quantity: number }

export default function StorePage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS)
  const [products] = useState<Product[]>(DEMO_PRODUCTS)
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('shopai_settings')
    if (stored) setSettings(JSON.parse(stored))
    const storedCart = localStorage.getItem('shopai_cart')
    if (storedCart) setCart(JSON.parse(storedCart))
  }, [])

  const addToCart = (product: Product) => {
    const newCart = cart.some(c => c.id === product.id)
      ? cart.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c)
      : [...cart, { ...product, quantity: 1 }]
    setCart(newCart)
    localStorage.setItem('shopai_cart', JSON.stringify(newCart))
    toast.success(`已加入購物車：${product.name}`, {
      style: { borderRadius: '12px', background: '#333', color: '#fff' },
    })
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const templateProps = { settings, products, cartCount, onAddToCart: addToCart }

  return (
    <>
      <Toaster position="top-right" />
      {settings.template === 'fashion' && <FashionTemplate {...templateProps} />}
      {settings.template === 'tech' && <TechTemplate {...templateProps} />}
      {settings.template === 'minimal' && <MinimalTemplate {...templateProps} />}
    </>
  )
}
