'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag, Bot, Link2, Truck,
  Palette, Settings, MessageSquare, BarChart3, Menu, X,
  Store, ChevronRight, Bell, User, Zap
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: '儀表板', icon: LayoutDashboard },
  { href: '/admin/products', label: '商品管理', icon: Package },
  { href: '/admin/orders', label: '訂單管理', icon: ShoppingBag },
  { href: '/admin/ai-agent', label: 'AI 代理', icon: Bot, badge: '🔥' },
  { href: '/admin/dropshipping', label: 'Dropshipping', icon: Link2 },
  { href: '/admin/logistics', label: '物流管理', icon: Truck },
  { href: '/admin/customer-service', label: 'AI 客服', icon: MessageSquare },
  { href: '/admin/templates', label: '店舖模板', icon: Palette },
  { href: '/admin/settings', label: '設定', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static z-50 flex flex-col w-64 h-full bg-white border-r border-slate-100 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-base">ShopAI</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link key={href} href={href}
                className={`admin-nav-item ${isActive ? 'active' : 'text-slate-600'}`}
                onClick={() => setSidebarOpen(false)}>
                <Icon size={17} />
                <span className="flex-1">{label}</span>
                {badge && <span className="text-xs">{badge}</span>}
                {isActive && <ChevronRight size={14} className="text-sky-400" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <Link href="/store" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
            <Store size={15} />
            <span>查看前台</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-100 sticky top-0 z-30">
          <button className="lg:hidden p-2 hover:bg-slate-100 rounded-xl" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <span>管理後台</span>
            {pathname !== '/admin' && (
              <>
                <ChevronRight size={14} />
                <span className="text-slate-700 font-medium">
                  {NAV.find(n => pathname.startsWith(n.href) && n.href !== '/admin')?.label || ''}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell size={18} className="text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-full flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800">店主</p>
                <p className="text-xs text-slate-400">管理員</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
