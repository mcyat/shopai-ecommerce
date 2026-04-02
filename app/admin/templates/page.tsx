'use client'
import { useState } from 'react'
import { Check, Eye, Palette, Globe, Type, Sun } from 'lucide-react'
import type { StoreSettings, Language } from '@/types'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n'

const TEMPLATES = [
  {
    id: 'minimal',
    name: '極簡白',
    description: '清新現代設計，白色為主，適合各類商品',
    preview: 'bg-white',
    accent: '#0ea5e9',
    features: ['簡潔排版', '高轉換率', '通用風格'],
    style: { bg: '#ffffff', surface: '#f9fafb', text: '#111827', accent: '#0ea5e9' },
  },
  {
    id: 'fashion',
    name: '時尚黑',
    description: '高端時尚風格，深色背景，品牌感強烈',
    preview: 'bg-gray-900',
    accent: '#c9a96e',
    features: ['奢華質感', '時尚設計', '品牌彰顯'],
    style: { bg: '#0a0a0a', surface: '#1a1a1a', text: '#f5f0e8', accent: '#c9a96e' },
  },
  {
    id: 'tech',
    name: '科技藍',
    description: '現代科技感，深藍配色，適合電子商品',
    preview: 'bg-slate-900',
    accent: '#58a6ff',
    features: ['科技感強', '霓虹特效', '電子商品'],
    style: { bg: '#0d1117', surface: '#161b22', text: '#e6edf3', accent: '#58a6ff' },
  },
]

const DEFAULT_SETTINGS: StoreSettings = {
  id: '1', store_name: 'ShopAI', template: 'minimal', primary_color: '#0ea5e9',
  secondary_color: '#f8fafc', font_family: 'Inter', currency: 'USD', language: 'zh-TW',
  announcement: '', social_links: {}, tax_rate: 0, updated_at: new Date().toISOString(),
}

export default function TemplatesPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'template' | 'brand' | 'language'>('template')

  const save = () => {
    // In production, save to Supabase
    localStorage.setItem('shopai_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-5 lg:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">店舖模板</h1>
          <p className="text-slate-500 text-sm">自訂店舖外觀、語言與品牌設定</p>
        </div>
        <div className="flex gap-2">
          <a href="/store" target="_blank" rel="noopener"
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-xl hover:border-slate-400 transition-colors">
            <Eye size={15} /> 預覽前台
          </a>
          <button onClick={save}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all font-semibold
              ${saved ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-700'}`}>
            {saved ? <><Check size={15} /> 已儲存</> : '儲存設定'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { key: 'template', label: '視覺模板', icon: Palette },
          { key: 'brand', label: '品牌設定', icon: Sun },
          { key: 'language', label: '語言貨幣', icon: Globe },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${activeTab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Template Selection */}
      {activeTab === 'template' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-5">
            {TEMPLATES.map(tmpl => (
              <div
                key={tmpl.id}
                onClick={() => setSettings(s => ({ ...s, template: tmpl.id as StoreSettings['template'], primary_color: tmpl.accent }))}
                className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all hover:shadow-md
                  ${settings.template === tmpl.id ? 'border-sky-500 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}>
                {/* Preview */}
                <div className="relative h-48 overflow-hidden" style={{ backgroundColor: tmpl.style.bg }}>
                  {/* Mini store mockup */}
                  <div className="absolute top-0 left-0 right-0 h-10 flex items-center px-3 gap-2" style={{ backgroundColor: tmpl.style.surface, borderBottom: `1px solid ${tmpl.style.accent}22` }}>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: tmpl.style.accent }} />
                    <div className="w-16 h-2 rounded-full" style={{ backgroundColor: tmpl.style.text + '40' }} />
                    <div className="ml-auto flex gap-1.5">
                      {[1,2,3].map(i => <div key={i} className="w-8 h-1.5 rounded-full" style={{ backgroundColor: tmpl.style.text + '30' }} />)}
                    </div>
                  </div>
                  <div className="absolute top-14 left-3 right-3 grid grid-cols-3 gap-1.5">
                    {[1,2,3].map(i => (
                      <div key={i} className="rounded-lg overflow-hidden" style={{ backgroundColor: tmpl.style.surface }}>
                        <div className="h-16" style={{ background: `linear-gradient(135deg, ${tmpl.style.accent}30, ${tmpl.style.accent}10)` }} />
                        <div className="p-1.5">
                          <div className="h-1.5 rounded-full mb-1" style={{ backgroundColor: tmpl.style.text + '40', width: '80%' }} />
                          <div className="h-2 rounded-full" style={{ backgroundColor: tmpl.style.accent, width: '50%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {settings.template === tmpl.id && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${tmpl.style.accent}20` }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: tmpl.style.accent }}>
                        <Check size={20} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{tmpl.name}</h3>
                    <div className="w-5 h-5 rounded-full border-2" style={{ backgroundColor: tmpl.accent, borderColor: tmpl.accent }} />
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{tmpl.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {tmpl.features.map(f => (
                      <span key={f} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brand Settings */}
      {activeTab === 'brand' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">店舖名稱</label>
              <input value={settings.store_name} onChange={e => setSettings(s => ({ ...s, store_name: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">主題色</label>
              <div className="flex gap-2">
                <input type="color" value={settings.primary_color} onChange={e => setSettings(s => ({ ...s, primary_color: e.target.value }))}
                  className="w-10 h-10 border border-slate-200 rounded-xl cursor-pointer" />
                <input value={settings.primary_color} onChange={e => setSettings(s => ({ ...s, primary_color: e.target.value }))}
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 font-mono" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">字體</label>
              <select value={settings.font_family} onChange={e => setSettings(s => ({ ...s, font_family: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400">
                <option value="Inter">Inter（現代）</option>
                <option value="Playfair Display">Playfair Display（時尚）</option>
                <option value="JetBrains Mono">JetBrains Mono（科技）</option>
                <option value="system-ui">系統字體</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">聯絡 Email</label>
              <input value={settings.contact_email || ''} onChange={e => setSettings(s => ({ ...s, contact_email: e.target.value }))}
                placeholder="support@mystore.com"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">公告欄（顯示於網站頂部）</label>
              <input value={settings.announcement || ''} onChange={e => setSettings(s => ({ ...s, announcement: e.target.value }))}
                placeholder="例如：全館8折！使用優惠碼 SUMMER"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">免運費門檻 ($)</label>
              <input type="number" value={settings.free_shipping_threshold || ''} onChange={e => setSettings(s => ({ ...s, free_shipping_threshold: parseFloat(e.target.value) }))}
                placeholder="50"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">稅率 (%)</label>
              <input type="number" value={settings.tax_rate * 100} onChange={e => setSettings(s => ({ ...s, tax_rate: parseFloat(e.target.value) / 100 }))}
                placeholder="0"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </div>
          </div>
        </div>
      )}

      {/* Language & Currency */}
      {activeTab === 'language' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">顯示語言</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button key={lang.code} onClick={() => setSettings(s => ({ ...s, language: lang.code as Language }))}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                    ${settings.language === lang.code ? 'border-sky-500 bg-sky-50' : 'border-slate-100 hover:border-slate-300'}`}>
                  <span className="text-xl">{lang.flag}</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">{lang.label}</p>
                    <p className="text-xs text-slate-400">{lang.code}</p>
                  </div>
                  {settings.language === lang.code && <Check size={14} className="ml-auto text-sky-600" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">貨幣</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { code: 'USD', label: '美元', symbol: '$' },
                { code: 'HKD', label: '港元', symbol: 'HK$' },
                { code: 'TWD', label: '新台幣', symbol: 'NT$' },
                { code: 'CNY', label: '人民幣', symbol: '¥' },
                { code: 'JPY', label: '日圓', symbol: '¥' },
                { code: 'EUR', label: '歐元', symbol: '€' },
                { code: 'GBP', label: '英鎊', symbol: '£' },
                { code: 'AUD', label: '澳元', symbol: 'A$' },
                { code: 'SGD', label: '新加坡元', symbol: 'S$' },
                { code: 'KRW', label: '韓元', symbol: '₩' },
              ].map(({ code, label, symbol }) => (
                <button key={code} onClick={() => setSettings(s => ({ ...s, currency: code }))}
                  className={`p-3 rounded-xl border-2 text-center transition-all
                    ${settings.currency === code ? 'border-sky-500 bg-sky-50' : 'border-slate-100 hover:border-slate-300'}`}>
                  <p className="text-lg font-bold text-slate-900">{symbol}</p>
                  <p className="text-xs text-slate-500">{code}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
