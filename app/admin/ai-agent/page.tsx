'use client'
import { useState } from 'react'
import { Bot, CheckCircle, XCircle, Clock, Zap, Play, RefreshCw, Plus, Eye, AlertTriangle, TrendingUp, Package, MessageSquare, DollarSign, BarChart3, Settings } from 'lucide-react'
import { AI_TASK_STATUS_COLORS, PRIORITY_COLORS, formatDate } from '@/lib/utils'
import { TASK_CONFIG } from '@/lib/ai-agent'
import type { AITask, AITaskType } from '@/types'

const DEMO_TASKS: AITask[] = [
  { id: '1', type: 'INVENTORY_RESTOCK', title: '補充庫存：Wireless Earbuds Pro', description: '商品「Wireless Earbuds Pro」庫存剩餘 3 件（低於安全庫存 20 件），建議緊急補充至 150 件。AI 評估後建議：聯繫供應商補單 200 件，預計到貨 5-7 天。', priority: 'urgent', status: 'awaiting_approval', requires_approval: true, created_by: 'ai', data: { product_id: '1', current_stock: 3, suggested_restock: 150 }, created_at: '2024-04-02T08:00:00Z', updated_at: '2024-04-02T08:00:00Z' },
  { id: '2', type: 'PRICE_UPDATE', title: '調整價格：Smart Watch Series 5', description: 'AI 分析近 30 天市場數據，競爭對手均價 $149，建議將售價從 $129.99 調整至 $139.99，預計提升利潤率 8%。', priority: 'medium', status: 'awaiting_approval', requires_approval: true, created_by: 'ai', data: { product_id: '3', current_price: 129.99, suggested_price: 139.99 }, created_at: '2024-04-02T09:00:00Z', updated_at: '2024-04-02T09:00:00Z' },
  { id: '3', type: 'ORDER_FULFILL', title: '處理訂單 ORD-20240402-0003', description: '訂單已付款確認，需要安排出貨。客戶地址：香港九龍灣。AI 推薦使用香港郵政，預計 3-5 天送達。', priority: 'high', status: 'executing', requires_approval: false, created_by: 'ai', data: { order_id: '3', carrier: 'HK Post' }, created_at: '2024-04-02T10:00:00Z', updated_at: '2024-04-02T10:30:00Z' },
  { id: '4', type: 'PRODUCT_DESCRIPTION', title: '優化商品描述：Premium Leather Wallet', description: 'AI 分析商品轉換率偏低（1.2%），建議優化商品描述和關鍵字，重點強調 RFID 防盜功能和材質品質。', priority: 'low', status: 'completed', requires_approval: false, created_by: 'ai', result: { action: '已更新商品描述，新增多語言版本', impact: '預計轉換率提升 15%' }, created_at: '2024-04-01T16:00:00Z', updated_at: '2024-04-02T09:00:00Z' },
  { id: '5', type: 'ANALYTICS_REPORT', title: '每週銷售分析報告 (Week 14)', description: '本週（3/25-4/1）銷售總結：營收 $12,450（+23.4%），訂單 186 個，新客戶 45 人，最熱銷商品 Wireless Earbuds Pro。', priority: 'low', status: 'completed', requires_approval: false, created_by: 'ai', result: { total_revenue: 12450, total_orders: 186, new_customers: 45 }, created_at: '2024-04-01T07:00:00Z', updated_at: '2024-04-01T07:05:00Z' },
  { id: '6', type: 'CUSTOMER_REPLY', title: '回覆客服詢問 #C-2047', description: '客戶詢問訂單 ORD-20240401-0008 的配送狀態。AI 已生成回覆，需要確認後發送。', priority: 'medium', status: 'awaiting_approval', requires_approval: true, created_by: 'ai', data: { session_id: 'C-2047', suggested_reply: '您好！您的訂單 ORD-20240401-0008 已於今日出貨，追蹤號碼為 DHL1234567890，預計 3-5 天送達。' }, created_at: '2024-04-02T11:00:00Z', updated_at: '2024-04-02T11:00:00Z' },
  { id: '7', type: 'PROMOTION_CREATE', title: '建立春季大促銷活動', description: 'AI 建議在 4/5-4/7 舉辦春季促銷，全館 8 折，預計可提升本週銷售額 35%，需要人工審核並確認預算。', priority: 'high', status: 'awaiting_approval', requires_approval: true, created_by: 'ai', data: { start: '2024-04-05', end: '2024-04-07', discount: 0.2 }, created_at: '2024-04-02T12:00:00Z', updated_at: '2024-04-02T12:00:00Z' },
  { id: '8', type: 'DROPSHIP_IMPORT', title: 'Dropshipping 商品導入：iPhone 配件包', description: 'AI 發現 AliExpress 熱銷商品「iPhone 15 保護殼套裝」，評分 4.7，月銷 5000+，成本 $3.5，建議以 $12.99 上架。', priority: 'medium', status: 'pending', requires_approval: true, created_by: 'ai', data: { source: 'aliexpress', source_id: 'AE-88765432', cost: 3.5, suggested_price: 12.99 }, created_at: '2024-04-02T13:00:00Z', updated_at: '2024-04-02T13:00:00Z' },
]

const TASK_ICONS: Record<AITaskType, React.ElementType> = {
  PRICE_UPDATE: DollarSign, PRODUCT_LISTING: Package, INVENTORY_RESTOCK: Package,
  ORDER_FULFILL: CheckCircle, CUSTOMER_REPLY: MessageSquare, PRODUCT_DESCRIPTION: Settings,
  PROMOTION_CREATE: Zap, DROPSHIP_IMPORT: RefreshCw, ANALYTICS_REPORT: BarChart3,
}

const STATUS_LABELS: Record<string, string> = {
  pending: '待執行', awaiting_approval: '待審核', approved: '已批准',
  executing: '執行中', completed: '已完成', rejected: '已拒絕', failed: '失敗',
}
const PRIORITY_LABELS: Record<string, string> = { urgent: '緊急', high: '高', medium: '中', low: '低' }

export default function AIAgentPage() {
  const [tasks, setTasks] = useState<AITask[]>(DEMO_TASKS)
  const [filter, setFilter] = useState<'all' | 'awaiting_approval' | 'executing' | 'completed'>('all')
  const [selectedTask, setSelectedTask] = useState<AITask | null>(null)
  const [reviewNote, setReviewNote] = useState('')
  const [agentEnabled, setAgentEnabled] = useState(true)
  const [autoApprove, setAutoApprove] = useState<AITaskType[]>(['ORDER_FULFILL', 'ANALYTICS_REPORT', 'PRODUCT_DESCRIPTION'])

  const filtered = tasks.filter(t => filter === 'all' || t.status === filter)

  const approveTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'executing', reviewed_by: 'Admin', review_notes: reviewNote } : t))
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === id && t.status === 'executing' ? { ...t, status: 'completed' } : t))
    }, 3000)
    setSelectedTask(null)
    setReviewNote('')
  }

  const rejectTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected', reviewed_by: 'Admin', review_notes: reviewNote } : t))
    setSelectedTask(null)
    setReviewNote('')
  }

  const pendingApproval = tasks.filter(t => t.status === 'awaiting_approval').length
  const executing = tasks.filter(t => t.status === 'executing').length
  const completed = tasks.filter(t => t.status === 'completed').length

  return (
    <div className="p-5 lg:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bot size={22} className="text-sky-500" /> AI 代理控制台
          </h1>
          <p className="text-slate-500 text-sm mt-1">自動化任務管理 · 人工智慧監控</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer
            ${agentEnabled ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
            onClick={() => setAgentEnabled(!agentEnabled)}>
            <div className={`w-2 h-2 rounded-full ${agentEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            AI 代理 {agentEnabled ? '運行中' : '已暫停'}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors">
            <Plus size={15} /> 手動新增任務
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: '待審核', count: pendingApproval, color: 'from-amber-500 to-orange-500', icon: AlertTriangle, urgent: true },
          { label: '執行中', count: executing, color: 'from-blue-500 to-indigo-600', icon: Play },
          { label: '今日完成', count: completed, color: 'from-emerald-500 to-green-600', icon: CheckCircle },
          { label: '自動執行率', count: '68%', color: 'from-violet-500 to-purple-600', icon: TrendingUp },
        ].map(({ label, count, color, icon: Icon, urgent }) => (
          <div key={label} className={`bg-gradient-to-br ${color} text-white rounded-2xl p-5 relative overflow-hidden`}>
            {urgent && pendingApproval > 0 && (
              <div className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full animate-ping" />
            )}
            <Icon size={20} className="mb-3 opacity-80" />
            <p className="text-3xl font-bold">{count}</p>
            <p className="text-sm opacity-80 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Auto-approve Settings */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-sky-900 mb-3 flex items-center gap-2">
          <Zap size={16} /> 自動批准設定
        </h3>
        <p className="text-xs text-sky-600 mb-3">選擇允許 AI 自動執行（無需人工審核）的任務類型：</p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(TASK_CONFIG) as [AITaskType, (typeof TASK_CONFIG)[AITaskType]][]).map(([type, config]) => (
            <label key={type} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors
              ${autoApprove.includes(type) ? 'bg-sky-600 text-white' : 'bg-white border border-sky-200 text-sky-700'}`}>
              <input type="checkbox" className="hidden" checked={autoApprove.includes(type)}
                onChange={() => setAutoApprove(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])} />
              {config.icon} {config.label}
            </label>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: `全部 (${tasks.length})` },
          { key: 'awaiting_approval', label: `待審核 (${pendingApproval})` },
          { key: 'executing', label: `執行中 (${executing})` },
          { key: 'completed', label: `已完成 (${completed})` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key as typeof filter)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-colors
              ${filter === key ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filtered.map(task => {
          const TaskIcon = TASK_ICONS[task.type] || Bot
          return (
            <div key={task.id} className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-sm
              ${task.status === 'awaiting_approval' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg
                  ${task.priority === 'urgent' ? 'bg-red-100' : task.priority === 'high' ? 'bg-orange-100' : 'bg-slate-100'}`}>
                  <TaskIcon size={18} className={task.priority === 'urgent' ? 'text-red-600' : task.priority === 'high' ? 'text-orange-600' : 'text-slate-500'} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                        <span className={`badge ${PRIORITY_COLORS[task.priority]}`}>{PRIORITY_LABELS[task.priority]}</span>
                        <span className={`badge ${AI_TASK_STATUS_COLORS[task.status]}`}>{STATUS_LABELS[task.status]}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{TASK_CONFIG[task.type]?.label} · {formatDate(task.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => setSelectedTask(task)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <Eye size={14} className="text-slate-500" />
                      </button>
                      {task.status === 'awaiting_approval' && (
                        <>
                          <button onClick={() => approveTask(task.id)} className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="批准">
                            <CheckCircle size={14} className="text-green-600" />
                          </button>
                          <button onClick={() => rejectTask(task.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="拒絕">
                            <XCircle size={14} className="text-red-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{task.description}</p>

                  {/* Progress for executing */}
                  {task.status === 'executing' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>執行中...</span><span>60%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full w-3/5 animate-pulse" />
                      </div>
                    </div>
                  )}

                  {/* Result */}
                  {task.status === 'completed' && task.result && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-2.5 py-1.5">
                      <CheckCircle size={12} />
                      {typeof task.result.action === 'string' ? task.result.action : JSON.stringify(task.result).slice(0, 80)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">任務詳情</h2>
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-slate-100 rounded-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${PRIORITY_COLORS[selectedTask.priority]}`}>{PRIORITY_LABELS[selectedTask.priority]}</span>
                  <span className={`badge ${AI_TASK_STATUS_COLORS[selectedTask.status]}`}>{STATUS_LABELS[selectedTask.status]}</span>
                  <span className="text-xs text-slate-400">{TASK_CONFIG[selectedTask.type]?.label}</span>
                </div>
                <h3 className="font-semibold text-slate-900">{selectedTask.title}</h3>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-700 leading-relaxed">{selectedTask.description}</p>
              </div>

              {selectedTask.data && Object.keys(selectedTask.data).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">任務數據</p>
                  <pre className="bg-slate-900 text-green-400 p-3 rounded-xl text-xs overflow-auto">
                    {JSON.stringify(selectedTask.data, null, 2)}
                  </pre>
                </div>
              )}

              {selectedTask.status === 'awaiting_approval' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">審核備註（可選）</label>
                    <textarea value={reviewNote} onChange={e => setReviewNote(e.target.value)} rows={2}
                      placeholder="請輸入審核備註..."
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 resize-none" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => rejectTask(selectedTask.id)}
                      className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-3 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors">
                      <XCircle size={16} /> 拒絕任務
                    </button>
                    <button onClick={() => approveTask(selectedTask.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors">
                      <CheckCircle size={16} /> 批准執行
                    </button>
                  </div>
                </>
              )}

              {selectedTask.status === 'completed' && selectedTask.result && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-green-800 uppercase mb-2">執行結果</p>
                  <pre className="text-xs text-green-700">{JSON.stringify(selectedTask.result, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
