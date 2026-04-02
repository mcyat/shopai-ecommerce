import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ShopAI - AI-Powered E-Commerce',
  description: 'Next-generation AI-managed e-commerce platform with dropshipping, multi-template store, and intelligent automation.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  )
}
