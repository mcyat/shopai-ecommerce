'use client'
import { useState } from 'react'
import {
  TrendingUp, ShoppingBag, Package, Users, Bot, ArrowUpRight, ArrowDownRight,
  Eye, DollarSign, Clock, CheckCircle, AlertCircle, Zap, Star
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Link from 'next/link'
import { formatCurrency, ORDER_STATUS_COLORS } from '@/lib/utils'

const salesData = [
  { date: '3/27', revenue: 1240, orders: 18 },
  { date: '3/28', revenue: 1850, orders: 25 },
  { date: '3/29', revenue: 980, orders: 14 },
  { date: '3/30', revenue: 2100, orders: 32 },
  { date: '3/31', revenue: 1650, orders: 22 },
  { date: '4/1', revenue: 2800, orders: 41 },
  { date: '4/2', revenue: 3200, orders: 48 },
]

const categoryData = [
  { name: 'Electronics', value: 45, color: '#0ea5e9' },
  { name: 'Fashion', value: 25, color: '#8b5cf6' },
  { name: 'Accessories', value: 20, color: '#f59e0b' },
  { name: 'Other', value: 10, color: '#10b981' },
]

const recentOrders = [
  { id: 'ORD-20240402-0001', customer: '王小明', total: 89.99, status: 'shipped', time: '10 分鐘前' },
  { id: 'ORD-20240402-0002', customer: 'Alice Chen', total: 234.50, status: 'processing', time: '25 分鐘前' },
  { id: 'ORD-20240402-0003', customer: '李大華', total: 59.99, status: 'pending', time: '1 小時前' },
  { id: 'ORD-20240402-0004', customer: 'Bob Johnson', total: 445.00, status: 'delivered', time: '2 小時前' },
  { id: 'ORD-20240402-0005', customer: '張美玲', total: 129.99, status: 'confirmed', time: '3 小時前' },
]

const aiTasksPreview = [
  { title: '補充庫存：Wireless Earbuds Pro', type: 'INVENTORY_RESTOCK', priority: 'urgent', status: 'awaiting_approval' },
  { title: '每週銷售分析報告', type: 'ANALYTICS_REPORT', priority: 'low', status: 'completed' },
  { title: '處理訂單 ORD-20240402-0003', type: 'ORDER_FULFILL', priority: 'high', status: 'executing' },
  { title: '商品描述優化：Smart Watch', type: 'PRODUCT_DESCRIPTION', priority: 'medium', status: 'pending' },
]

const STATUS_LABELS: Record<string, string> = {
  pending: '待確認', confirmed: '已確認', processing: '處理中',
  shipped: '已出貨', delivered: '已送達', cancelled: '已取消',
  awaiting_approval: '待審核', executing: '執行中', completed: '已完成',
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-blue-100 text-blue-700',
  low: 'bg-gray-100 text-gray-600',
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d')

  const stats = [
    { label: '今日營收', value: '$3,200', change: '+18.2%', up: true, icon: DollarSign, color: 'from-sky-500 to-blue-600' },
    { label: '今日訂單', value: '48', change: '+12.5%', up: true, icon: ShoppingBag, color: 'from-violet-500 to-purple-600' },
    { label: '活躍商品', value: '127', change: '+5', up: true, icon: Package, color: 'from-emerald-500 to-green-600' },
    { label: '新客戶', value: '23', change: '-3.1%', up: false, icon: Users, color: 'from-amber-500 to-orange-500' },
  ]

  return (
    <div className="p-5 lg:p-7 space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">歡迎回來！</h1>
          <p className="text-slate-500 text-sm mt-1">今天是 2025年4月2日 · AI 代理正在監控您的商店</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${period === p ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'}`}>
              {p === '7d' ? '7天' : p === '30d' ? '30天' : '90天'}
            </button>
          ))}
        </div>
      </div>

      {/* AI Alert Banner */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">AI 代理提醒</p>
            <p className="text-xs text-slate-500">有 1 個緊急任務需要您的審核：Wireless Earbuds Pro 庫存告急</p>
          </div>
        </div>
        <Link href="/admin/ai-agent" className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-white border border-sky-200 px-3 py-1.5 rounded-lg">
          查看 <ArrowUpRight size={12} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, up, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon size={18} className="text-white" />
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {change}
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">營收趨勢</h2>
            <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUp size={12} /> +23.4% 本週
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(v) => [`$${v}`, '營收']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fill="url(#revenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-5">商品分類</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '佔比']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {categoryData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-slate-600">{name}</span>
                </div>
                <span className="font-semibold text-slate-900">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <h2 className="text-base font-bold text-slate-900">最新訂單</h2>
            <Link href="/admin/orders" className="text-xs text-sky-600 font-medium hover:text-sky-700 flex items-center gap-1">
              查看全部 <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{order.customer}</p>
                  <p className="text-xs text-slate-400">{order.id} · {order.time}</p>
                </div>
                <span className={`badge ${ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
                <span className="text-sm font-bold text-slate-900">{formatCurrency(order.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tasks */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bot size={16} className="text-sky-500" /> AI 任務佇列
            </h2>
            <Link href="/admin/ai-agent" className="text-xs text-sky-600 font-medium hover:text-sky-700 flex items-center gap-1">
              管理 <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {aiTasksPreview.map((task, idx) => (
              <div key={idx} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  task.status === 'completed' ? 'bg-green-500' :
                  task.status === 'executing' ? 'bg-blue-500 animate-pulse' :
                  task.status === 'awaiting_approval' ? 'bg-amber-500' : 'bg-gray-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                  <p className="text-xs text-slate-400">{task.type}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`badge ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                  {task.status === 'awaiting_approval' && (
                    <span className="text-xs text-amber-600">需審核</span>
                  )}
                  {task.status === 'completed' && (
                    <CheckCircle size={14} className="text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/admin/products', label: '新增商品', icon: Package, color: 'from-sky-500 to-blue-600' },
          { href: '/admin/orders', label: '查看訂單', icon: ShoppingBag, color: 'from-violet-500 to-purple-600' },
          { href: '/admin/dropshipping', label: 'Dropshipping', icon: Zap, color: 'from-amber-500 to-orange-500' },
          { href: '/admin/ai-agent', label: 'AI 管理', icon: Bot, color: 'from-emerald-500 to-green-600' },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-3 p-4 bg-gradient-to-br ${color} text-white rounded-2xl hover:opacity-90 transition-opacity`}>
            <Icon size={20} />
            <span className="text-sm font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
