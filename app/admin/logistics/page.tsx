'use client'
import { useState } from 'react'
import { Truck, Package, MapPin, Search, Clock, CheckCircle, AlertCircle, Edit, Plus, ExternalLink, RefreshCw } from 'lucide-react'
import type { LogisticsTemplate, TrackingInfo } from '@/types'

const DEMO_TEMPLATES: LogisticsTemplate[] = [
  { id: '1', name: '標準快遞 DHL', carrier: 'DHL', carrier_code: 'dhl', tracking_url_template: 'https://www.dhl.com/track?tracking-id={tracking_number}', estimated_days_min: 3, estimated_days_max: 7, cost: 9.99, regions: ['worldwide'], is_default: true, created_at: '2024-01-01' },
  { id: '2', name: '標準海運（中國郵政）', carrier: 'China Post', carrier_code: 'china-post', tracking_url_template: 'https://track.aftership.com/china-post/{tracking_number}', estimated_days_min: 15, estimated_days_max: 30, cost: 2.99, regions: ['worldwide'], is_default: false, created_at: '2024-01-01' },
  { id: '3', name: 'FedEx 快遞', carrier: 'FedEx', carrier_code: 'fedex', tracking_url_template: 'https://www.fedex.com/fedextrack/?trknbr={tracking_number}', estimated_days_min: 2, estimated_days_max: 5, cost: 14.99, regions: ['us', 'ca', 'mx'], is_default: false, created_at: '2024-01-01' },
  { id: '4', name: '香港郵政', carrier: 'HK Post', carrier_code: 'hk-post', tracking_url_template: 'https://www.hongkongpost.hk/en/mail_services/track/index.html?trackno={tracking_number}', estimated_days_min: 5, estimated_days_max: 14, cost: 4.99, regions: ['hk', 'cn', 'tw'], is_default: false, created_at: '2024-01-01' },
  { id: '5', name: '順豐速運', carrier: 'SF Express', carrier_code: 'sf-express', tracking_url_template: 'https://www.sf-express.com/cn/sc/dynamic_function/waybill/#search/bill-number/{tracking_number}', estimated_days_min: 2, estimated_days_max: 5, cost: 8.99, regions: ['cn', 'hk', 'tw', 'sg'], is_default: false, created_at: '2024-01-01' },
]

const MOCK_TRACKING: TrackingInfo = {
  tracking_number: 'DHL1234567890',
  carrier: 'DHL',
  status: 'InTransit',
  estimated_delivery: '2024-04-05',
  last_updated: new Date().toISOString(),
  events: [
    { timestamp: new Date(Date.now() - 1 * 3600000).toISOString(), location: 'Hong Kong, HK', description: 'Package in transit to destination facility', status: 'InTransit' },
    { timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), location: 'Hong Kong International Airport', description: 'Departed sorting facility', status: 'InTransit' },
    { timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), location: 'DHL Hong Kong Hub', description: 'Package arrived at sorting facility', status: 'InTransit' },
    { timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), location: 'Seller Warehouse', description: 'Package picked up by DHL', status: 'PickedUp' },
    { timestamp: new Date(Date.now() - 36 * 3600000).toISOString(), location: 'Seller', description: 'Shipping label created', status: 'InfoReceived' },
  ],
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  InTransit: Truck, PickedUp: Package, Delivered: CheckCircle, InfoReceived: AlertCircle,
}
const STATUS_COLORS: Record<string, string> = {
  InTransit: 'text-blue-500 bg-blue-50', PickedUp: 'text-amber-500 bg-amber-50',
  Delivered: 'text-green-500 bg-green-50', InfoReceived: 'text-gray-500 bg-gray-50',
}

export default function LogisticsPage() {
  const [templates, setTemplates] = useState(DEMO_TEMPLATES)
  const [trackingInput, setTrackingInput] = useState('DHL1234567890')
  const [trackingResult, setTrackingResult] = useState<TrackingInfo | null>(null)
  const [tracking, setTracking] = useState(false)
  const [showAddTemplate, setShowAddTemplate] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Partial<LogisticsTemplate>>({})

  const doTrack = async () => {
    if (!trackingInput.trim()) return
    setTracking(true)
    await new Promise(r => setTimeout(r, 1000))
    setTrackingResult(MOCK_TRACKING)
    setTracking(false)
  }

  const setDefault = (id: string) => {
    setTemplates(prev => prev.map(t => ({ ...t, is_default: t.id === id })))
  }

  return (
    <div className="p-5 lg:p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">物流管理</h1>
          <p className="text-slate-500 text-sm">管理物流服務商 · 訂單追蹤 · 運費模板</p>
        </div>
        <button onClick={() => setShowAddTemplate(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-xl hover:bg-slate-700 transition-colors">
          <Plus size={15} /> 新增物流商
        </button>
      </div>

      {/* Tracking Tool */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Search size={16} className="text-sky-500" /> 即時追蹤查詢
        </h2>
        <div className="flex gap-3">
          <input value={trackingInput} onChange={e => setTrackingInput(e.target.value)} placeholder="輸入追蹤號碼（支援 900+ 物流商）"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400"
            onKeyDown={e => e.key === 'Enter' && doTrack()} />
          <select className="border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-slate-400 bg-white">
            <option>自動識別</option>
            {DEMO_TEMPLATES.map(t => <option key={t.id}>{t.carrier}</option>)}
          </select>
          <button onClick={doTrack} disabled={tracking}
            className="px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-70 flex items-center gap-2">
            {tracking ? <><RefreshCw size={14} className="animate-spin" /> 查詢中</> : <><Search size={14} /> 追蹤</>}
          </button>
        </div>

        {/* Tracking Result */}
        {trackingResult && (
          <div className="mt-5 border border-slate-100 rounded-2xl overflow-hidden">
            {/* Status Banner */}
            <div className="bg-blue-50 border-b border-blue-100 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Truck size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{trackingResult.tracking_number}</p>
                  <p className="text-xs text-slate-500">{trackingResult.carrier} · {trackingResult.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">預計送達</p>
                <p className="font-semibold text-slate-900">{trackingResult.estimated_delivery}</p>
              </div>
            </div>

            {/* Events */}
            <div className="p-5">
              <div className="relative">
                <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-slate-100" />
                <div className="space-y-4">
                  {trackingResult.events.map((event, idx) => {
                    const Icon = STATUS_ICONS[event.status] || Package
                    return (
                      <div key={idx} className="flex gap-4 relative">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${idx === 0 ? STATUS_COLORS[event.status] || 'bg-slate-50 text-slate-500' : 'bg-white border border-slate-100 text-slate-300'}`}>
                          <Icon size={15} />
                        </div>
                        <div className="flex-1 pb-4">
                          <p className={`text-sm font-medium ${idx === 0 ? 'text-slate-900' : 'text-slate-500'}`}>{event.description}</p>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><MapPin size={10} />{event.location}</span>
                            <span className="flex items-center gap-1"><Clock size={10} />{new Date(event.timestamp).toLocaleString('zh-TW')}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logistics Templates */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">物流模板管理</h2>
          <p className="text-xs text-slate-400">{templates.length} 個物流商</p>
        </div>
        <div className="divide-y divide-slate-50">
          {templates.map(template => (
            <div key={template.id} className="flex items-center gap-5 px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${template.is_default ? 'bg-green-100' : 'bg-slate-100'}`}>
                <Truck size={18} className={template.is_default ? 'text-green-600' : 'text-slate-500'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                  {template.is_default && <span className="badge bg-green-100 text-green-700">預設</span>}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {template.estimated_days_min}-{template.estimated_days_max} 天 ·
                  適用地區：{template.regions.join(', ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">${template.cost}</p>
                <p className="text-xs text-slate-400">起</p>
              </div>
              <div className="flex items-center gap-1.5">
                <a href={template.tracking_url_template.replace('{tracking_number}', 'test')} target="_blank" rel="noopener"
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                  <ExternalLink size={14} />
                </a>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                  <Edit size={14} />
                </button>
                {!template.is_default && (
                  <button onClick={() => setDefault(template.id)} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-200 rounded-lg hover:border-slate-400 transition-colors">
                    設為預設
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Shipments Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: '今日出貨', value: '12', icon: Package, color: 'from-sky-500 to-blue-600' },
          { label: '運送中', value: '47', icon: Truck, color: 'from-violet-500 to-purple-600' },
          { label: '已送達', value: '183', icon: CheckCircle, color: 'from-emerald-500 to-green-600' },
          { label: '平均送達天數', value: '4.2天', icon: Clock, color: 'from-amber-500 to-orange-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} text-white rounded-2xl p-5`}>
            <Icon size={20} className="mb-3 opacity-80" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs opacity-80 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
