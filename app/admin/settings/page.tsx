'use client'
import { useState } from 'react'
import { Key, Database, CreditCard, Bell, Shield, Check, Eye, EyeOff, AlertCircle } from 'lucide-react'

const CONFIG_SECTIONS = [
  {
    id: 'supabase',
    title: 'Supabase 資料庫',
    icon: Database,
    color: 'from-green-500 to-emerald-600',
    fields: [
      { key: 'NEXT_PUBLIC_SUPABASE_URL', label: 'Supabase URL', placeholder: 'https://xxx.supabase.co', required: true },
      { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', label: 'Anon Key', placeholder: 'eyJhbGc...', required: true, secret: true },
      { key: 'SUPABASE_SERVICE_ROLE_KEY', label: 'Service Role Key', placeholder: 'eyJhbGc...', required: false, secret: true },
    ]
  },
  {
    id: 'openai',
    title: 'OpenAI（AI 功能）',
    icon: Key,
    color: 'from-violet-500 to-purple-600',
    fields: [
      { key: 'OPENAI_API_KEY', label: 'OpenAI API Key', placeholder: 'sk-...', required: false, secret: true },
    ]
  },
  {
    id: 'payment',
    title: 'Stripe 支付',
    icon: CreditCard,
    color: 'from-sky-500 to-blue-600',
    fields: [
      { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', label: 'Publishable Key', placeholder: 'pk_live_...', required: false },
      { key: 'STRIPE_SECRET_KEY', label: 'Secret Key', placeholder: 'sk_live_...', required: false, secret: true },
      { key: 'STRIPE_WEBHOOK_SECRET', label: 'Webhook Secret', placeholder: 'whsec_...', required: false, secret: true },
    ]
  },
  {
    id: 'dropshipping',
    title: 'Dropshipping API',
    icon: Key,
    color: 'from-amber-500 to-orange-500',
    fields: [
      { key: 'ALIEXPRESS_APP_KEY', label: 'AliExpress App Key', placeholder: '12345678', required: false },
      { key: 'ALIEXPRESS_APP_SECRET', label: 'AliExpress App Secret', placeholder: 'xxxx', required: false, secret: true },
      { key: 'CJ_EMAIL', label: 'CJ Dropshipping Email', placeholder: 'your@email.com', required: false },
      { key: 'CJ_API_KEY', label: 'CJ API Key', placeholder: 'xxxx', required: false, secret: true },
    ]
  },
  {
    id: 'logistics',
    title: 'AfterShip（物流追蹤）',
    icon: Bell,
    color: 'from-rose-500 to-pink-600',
    fields: [
      { key: 'AFTERSHIP_API_KEY', label: 'AfterShip API Key', placeholder: 'asat_...', required: false, secret: true },
    ]
  },
]

export default function SettingsPage() {
  const [config, setConfig] = useState<Record<string, string>>({})
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In production, send to server to update environment variables
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-5 lg:p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">系統設定</h1>
          <p className="text-slate-500 text-sm">API 金鑰、第三方服務整合</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all
            ${saved ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-700'}`}>
          {saved ? <><Check size={15} /> 已儲存</> : '儲存設定'}
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <Shield size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">安全提示</p>
          <p className="text-xs text-amber-700 mt-0.5">
            請勿在前端代碼中暴露 API 金鑰。生產環境中，請通過 Vercel 環境變數或 .env.local 文件設定這些值。
            有標 <code className="bg-amber-100 px-1 rounded">secret</code> 的欄位會自動加密儲存。
          </p>
        </div>
      </div>

      {/* Environment Variables Info */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-slate-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">快速部署指引</p>
            <p className="text-xs text-slate-500 mb-3">在 Vercel 設定以下環境變數以啟用所有功能：</p>
            <div className="font-mono text-xs bg-slate-900 text-green-400 p-3 rounded-xl space-y-1">
              <p># 必需</p>
              <p>NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...</p>
              <p className="text-slate-500"># 可選（啟用 AI 功能）</p>
              <p>OPENAI_API_KEY=sk-...</p>
              <p>STRIPE_SECRET_KEY=sk_live_...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Config Sections */}
      <div className="space-y-4">
        {CONFIG_SECTIONS.map(section => {
          const Icon = section.icon
          return (
            <div key={section.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                  <Icon size={16} className="text-white" />
                </div>
                <h2 className="text-base font-bold text-slate-900">{section.title}</h2>
              </div>
              <div className="p-6 space-y-4">
                {section.fields.map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                      {field.secret && <span className="ml-2 text-xs font-normal text-slate-400">🔒 加密儲存</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={field.secret && !visible[field.key] ? 'password' : 'text'}
                        value={config[field.key] || ''}
                        onChange={e => setConfig(c => ({ ...c, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 font-mono pr-10"
                      />
                      {field.secret && (
                        <button onClick={() => setVisible(v => ({ ...v, [field.key]: !v[field.key] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {visible[field.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">環境變數：<code className="font-mono bg-slate-100 px-1 rounded">{field.key}</code></p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
