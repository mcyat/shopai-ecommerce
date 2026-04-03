'use client'
import React, { useState } from 'react'
import { Search, Eye, Truck, CheckCircle, XCircle, Package, RefreshCw, type LucideIcon } from 'lucide-react'
import { formatCurrency, formatDate, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '@/lib/utils'
import type { Order } from '@/types'

const DEMO_ORDERS: Order[] = [
  { id: '1', order_number: 'ORD-20240402-0001', customer_name: '王小明', customer_email: 'wang@example.com', customer_phone: '+886 912 345 678', shipping_address: { name: '王小明', line1: '中正區忠孝東路一段1號', city: '台北市', state: '台灣', postal_code: '100', country: 'TW' }, items: [{ id: '1', order_id: '1', product_id: '1', product_name: 'Wireless Earbuds Pro', quantity: 1, unit_price: 59.99, total_price: 59.99 }, { id: '2', order_id: '1', product_id: '3', product_name: 'Smart Watch Series 5', quantity: 1, unit_price: 129.99, total_price: 129.99 }], subtotal: 189.98, shipping_cost: 0, tax: 0, total: 189.98, status: 'shipped', payment_status: 'paid', tracking_number: 'DHL1234567890', tracking_carrier: 'DHL', created_at: '2024-04-02T10:15:00Z', updated_at: '2024-04-02T14:30:00Z' },
  { id: '2', order_number: 'ORD-20240402-0002', customer_name: 'Alice Chen', customer_email: 'alice@example.com', shipping_address: { name: 'Alice Chen', line1: '123 Main St', city: 'New York', state: 'NY', postal_code: '10001', country: 'US' }, items: [{ id: '3', order_id: '2', product_id: '2', product_name: 'Premium Leather Wallet', quantity: 2, unit_price: 39.99, total_price: 79.98 }], subtotal: 79.98, shipping_cost: 9.99, tax: 0, total: 89.97, status: 'processing', payment_status: 'paid', created_at: '2024-04-02T09:45:00Z', updated_at: '2024-04-02T09:45:00Z' },
  { id: '3', order_number: 'ORD-20240402-0003', customer_name: '李大華', customer_email: 'li@example.com', shipping_address: { name: '李大華', line1: '九龍灣宏光道1號', city: '九龍', state: '香港', postal_code: '', country: 'HK' }, items: [{ id: '4', order_id: '3', product_id: '6', product_name: 'Mechanical Keyboard', quantity: 1, unit_price: 89.99, total_price: 89.99 }], subtotal: 89.99, shipping_cost: 9.99, tax: 0, total: 99.98, status: 'pending', payment_status: 'pending', created_at: '2024-04-02T08:20:00Z', updated_at: '2024-04-02T08:20:00Z' },
  { id: '4', order_number: 'ORD-20240401-0015', customer_name: 'Bob Johnson', customer_email: 'bob@example.com', shipping_address: { name: 'Bob Johnson', line1: '456 Oak Ave', city: 'Los Angeles', state: 'CA', postal_code: '90001', country: 'US' }, items: [{ id: '5', order_id: '4', product_id: '1', product_name: 'Wireless Earbuds Pro', quantity: 3, unit_price: 59.99, total_price: 179.97 }], subtotal: 179.97, shipping_cost: 0, tax: 0, total: 179.97, status: 'delivered', payment_status: 'paid', tracking_number: 'FEDEX9876543210', tracking_carrier: 'FedEx', created_at: '2024-04-01T14:30:00Z', updated_at: '2024-04-02T10:00:00Z' },
]

const STATUS_LABELS: Record<string, string> = { pending: '待確認', confirmed: '已確認', processing: '處理中', shipped: '已出貨', delivered: '已送達', cancelled: '已取消', refunded: '已退款', paid: '已付款', failed: '付款失敗' }

const ACTIONS: Record<string, { label: string; icon: LucideIcon; nextStatus: string; color: string }> = {
  pending: { label: '確認訂單', icon: CheckCircle, nextStatus: 'confirmed', color: 'text-blue-600' },
  confirmed: { label: '開始處理', icon: Package, nextStatus: 'processing', color: 'text-purple-600' },
  processing: { label: '標記出貨', icon: Truck, nextStatus: 'shipped', color: 'text-indigo-600' },
  shipped: { label: '完成配送', icon: CheckCircle, nextStatus: 'delivered', color: 'text-green-600' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(DEMO_ORDERS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [trackingInput, setTrackingInput] = useState('')

  const filtered = orders.filter(o => {
    const matchSearch = o.order_number.includes(search) || o.customer_name.toLowerCase().includes(search.toLowerCase()) || o.customer_email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  const updateStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as Order['status'] } : o))
    if (selectedOrder?.id === id) setSelectedOrder(prev => prev ? { ...prev, status: status as Order['status'] } : null)
  }

  const updateTracking = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, tracking_number: trackingInput, status: 'shipped' as const } : o))
    setSelectedOrder(prev => prev ? { ...prev, tracking_number: trackingInput, status: 'shipped' } : null)
  }

  return (
    <div className="p-5 lg:p-7 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">訂單管理</h1>
          <p className="text-slate-500 text-sm">{orders.length} 個訂單 · {orders.filter(o => o.status === 'pending').length} 個待處理</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-xl hover:border-slate-400">
          <RefreshCw size={14} /> 同步
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: '待確認', count: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
          { label: '處理中', count: orders.filter(o => ['confirmed', 'processing'].includes(o.status)).length, color: 'bg-blue-50 border-blue-200 text-blue-800' },
          { label: '已出貨', count: orders.filter(o => o.status === 'shipped').length, color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
          { label: '已完成', count: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-50 border-green-200 text-green-800' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`border rounded-xl p-4 ${color}`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-sm font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋訂單號、客戶名稱或 Email..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-slate-400 bg-white" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 bg-white">
          <option value="all">全部狀態</option>
          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">訂單</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">客戶</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">日期</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">狀態</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">付款</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">金額</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-mono font-semibold text-xs text-slate-900">{order.order_number}</p>
                    <p className="text-xs text-slate-400">{order.items.length} 件商品</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-900 text-sm">{order.customer_name}</p>
                    <p className="text-xs text-slate-400">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`badge ${ORDER_STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`badge ${PAYMENT_STATUS_COLORS[order.payment_status]}`}>{STATUS_LABELS[order.payment_status]}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-slate-900">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setSelectedOrder(order)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500" title="查看詳情">
                        <Eye size={14} />
                      </button>
                      {(() => {
                        const action = ACTIONS[order.status]
                        if (!action) return null
                        const ActionIcon = action.icon
                        return (
                          <button onClick={() => updateStatus(order.id, action.nextStatus)}
                            className={`p-1.5 hover:bg-slate-100 rounded-lg transition-colors ${action.color}`} title={action.label}>
                            <ActionIcon size={14} />
                          </button>
                        )
                      })()}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button onClick={() => updateStatus(order.id, 'cancelled')} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-400" title="取消訂單">
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedOrder.order_number}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500">✕</button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status Actions */}
              <div className="flex flex-wrap gap-2">
                <span className={`badge ${ORDER_STATUS_COLORS[selectedOrder.status]} text-sm px-3 py-1`}>{STATUS_LABELS[selectedOrder.status]}</span>
                {(() => {
                  const action = ACTIONS[selectedOrder.status]
                  if (!action) return null
                  const ActionIcon = action.icon
                  return (
                    <button onClick={() => updateStatus(selectedOrder.id, action.nextStatus)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors">
                      <ActionIcon size={12} />
                      {action.label}
                    </button>
                  )
                })()}
              </div>

              {/* Customer */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">客戶資訊</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">姓名：</span><span className="font-medium">{selectedOrder.customer_name}</span></div>
                  <div><span className="text-slate-500">Email：</span><span className="font-medium">{selectedOrder.customer_email}</span></div>
                  <div className="col-span-2"><span className="text-slate-500">地址：</span><span className="font-medium">{selectedOrder.shipping_address.line1}, {selectedOrder.shipping_address.city}</span></div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">訂購商品</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.product_name}</p>
                        <p className="text-xs text-slate-400">{formatCurrency(item.unit_price)} × {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-slate-900">{formatCurrency(item.total_price)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-500"><span>小計</span><span>{formatCurrency(selectedOrder.subtotal)}</span></div>
                  <div className="flex justify-between text-slate-500"><span>運費</span><span>{selectedOrder.shipping_cost === 0 ? '免費' : formatCurrency(selectedOrder.shipping_cost)}</span></div>
                  <div className="flex justify-between font-bold text-base border-t pt-2"><span>總計</span><span>{formatCurrency(selectedOrder.total)}</span></div>
                </div>
              </div>

              {/* Tracking */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">物流追蹤</h3>
                {selectedOrder.tracking_number ? (
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-slate-500" />
                    <span className="font-mono text-sm font-medium">{selectedOrder.tracking_number}</span>
                    <span className="text-xs text-slate-400">{selectedOrder.tracking_carrier}</span>
                    <a href={`https://www.dhl.com/track?tracking-id=${selectedOrder.tracking_number}`} target="_blank" rel="noopener" className="ml-auto">
                      <ExternalLink size={14} className="text-sky-500" />
                    </a>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={trackingInput} onChange={e => setTrackingInput(e.target.value)} placeholder="輸入追蹤號碼"
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" />
                    <button onClick={() => updateTracking(selectedOrder.id)} className="px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                      更新
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
