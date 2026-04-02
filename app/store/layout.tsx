import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ShopAI Store',
  description: 'AI-Powered E-Commerce Store',
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
