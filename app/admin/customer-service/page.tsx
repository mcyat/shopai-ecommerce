'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, MessageSquare, CheckCircle, Clock, X, Search, Phone, Mail } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { generateCustomerResponse } from '@/lib/ai-agent'

interface Message { id: string; role: 'customer' | 'agent' | 'ai'; content: string; created_at: string }
interface Session { id: string; customer_name: string; customer_email?: string; status: 'open' | 'ai_responded' | 'closed'; messages: Message[]; order_id?: string; created_at: string }

const DEMO_SESSIONS: Session[] = [
  {
    id: '1', customer_name: '王小明', customer_email: 'wang@example.com', status: 'open', order_id: 'ORD-20240402-0001', created_at: '2024-04-02T10:00:00Z',
    messages: [
      { id: '1', role: 'customer', content: '你好，我想查詢我的訂單狀態，訂單號 ORD-20240402-0001', created_at: '2024-04-02T10:00:00Z' },
      { id: '2', role: 'ai', content: '您好！您的訂單 ORD-20240402-0001 目前狀態為「已出貨」。追蹤號碼：DHL1234567890，預計 3-5 天送達台北。如有其他問題歡迎繼續詢問！', created_at: '2024-04-02T10:00:05Z' },
      { id: '3', role: 'customer', content: '謝謝！請問可以退換貨嗎？', created_at: '2024-04-02T10:05:00Z' },
    ]
  },
  {
    id: '2', customer_name: 'Alice Chen', customer_email: 'alice@example.com', status: 'ai_responded', created_at: '2024-04-02T09:30:00Z',
    messages: [
      { id: '4', role: 'customer', content: 'What is your return policy?', created_at: '2024-04-02T09:30:00Z' },
      { id: '5', role: 'ai', content: 'We offer a 30-day return policy. Items must be in original packaging and unused. Please provide your order number to initiate a return.', created_at: '2024-04-02T09:30:05Z' },
    ]
  },
  {
    id: '3', customer_name: '李大華', customer_email: 'li@example.com', status: 'open', created_at: '2024-04-02T11:00:00Z',
    messages: [
      { id: '6', role: 'customer', content: '你好，我的鍵盤還沒到，訂單號是 ORD-20240402-0003，已經下單 3 天了', created_at: '2024-04-02T11:00:00Z' },
    ]
  },
]

export default function CustomerServicePage() {
  const [sessions, setSessions] = useState<Session[]>(DEMO_SESSIONS)
  const [activeSession, setActiveSession] = useState<Session | null>(DEMO_SESSIONS[0])
  const [input, setInput] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSession?.messages])

  const sendMessage = async (asAI = false) => {
    if (!input.trim() || !activeSession) return

    const msg: Message = {
      id: Date.now().toString(),
      role: asAI ? 'ai' : 'agent',
      content: input.trim(),
      created_at: new Date().toISOString(),
    }

    const updated = { ...activeSession, messages: [...activeSession.messages, msg] }
    setActiveSession(updated)
    setSessions(prev => prev.map(s => s.id === activeSession.id ? updated : s))
    setInput('')
  }

  const generateAIReply = async () => {
    if (!activeSession) return
    setAiGenerating(true)
    const lastCustomerMsg = [...activeSession.messages].reverse().find(m => m.role === 'customer')
    if (!lastCustomerMsg) { setAiGenerating(false); return }

    await new Promise(r => setTimeout(r, 1500))
    const reply = await generateCustomerResponse({ message: lastCustomerMsg.content, language: 'zh-TW' })

    const msg: Message = { id: Date.now().toString(), role: 'ai', content: reply, created_at: new Date().toISOString() }
    const updated = { ...activeSession, messages: [...activeSession.messages, msg], status: 'ai_responded' as const }
    setActiveSession(updated)
    setSessions(prev => prev.map(s => s.id === activeSession.id ? updated : s))
    setInput(reply)
    setAiGenerating(false)
  }

  const filteredSessions = sessions.filter(s =>
    s.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    s.customer_email?.toLowerCase().includes(search.toLowerCase())
  )

  const STATUS_STYLES = {
    open: 'bg-red-100 text-red-700',
    ai_responded: 'bg-amber-100 text-amber-700',
    closed: 'bg-green-100 text-green-700',
  }
  const STATUS_LABELS = { open: '待回覆', ai_responded: 'AI 已回', closed: '已關閉' }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sessions Sidebar */}
      <div className="w-72 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <MessageSquare size={16} className="text-sky-500" />
            AI 客服中心
          </h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋客戶..."
              className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredSessions.map(session => (
            <button key={session.id} onClick={() => setActiveSession(session)}
              className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${activeSession?.id === session.id ? 'bg-sky-50 border-l-2 border-l-sky-500' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{session.customer_name}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{session.messages[session.messages.length - 1]?.content.slice(0, 40)}...</p>
                </div>
                <span className={`badge text-xs flex-shrink-0 ${STATUS_STYLES[session.status]}`}>{STATUS_LABELS[session.status]}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Clock size={10} className="text-slate-300" />
                <span className="text-xs text-slate-400">{formatDate(session.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeSession ? (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
          {/* Chat Header */}
          <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{activeSession.customer_name}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  {activeSession.customer_email && <span className="flex items-center gap-1"><Mail size={10} />{activeSession.customer_email}</span>}
                  {activeSession.order_id && <span className="text-sky-600">{activeSession.order_id}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, status: 'closed' } : s))}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:border-slate-400 transition-colors text-slate-600">
                <CheckCircle size={12} /> 關閉對話
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeSession.messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'customer' ? '' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'customer' ? 'bg-slate-200' : msg.role === 'ai' ? 'bg-gradient-to-br from-sky-400 to-indigo-500' : 'bg-gradient-to-br from-emerald-400 to-green-500'}`}>
                  {msg.role === 'customer' ? <User size={14} className="text-slate-600" /> : <Bot size={14} className="text-white" />}
                </div>
                <div className={`max-w-xs lg:max-w-md ${msg.role === 'customer' ? '' : 'items-end'} flex flex-col`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'customer' ? 'bg-white text-slate-800 rounded-tl-sm shadow-sm border border-slate-100' : 'bg-slate-800 text-white rounded-tr-sm'}`}>
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {msg.role === 'ai' && <span className="text-xs text-sky-500 flex items-center gap-0.5"><Bot size={10} /> AI</span>}
                    {msg.role === 'agent' && <span className="text-xs text-emerald-500">客服</span>}
                    <span className="text-xs text-slate-400">{formatDate(msg.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
            {aiGenerating && (
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tr-sm">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-slate-100 p-4">
            <div className="flex gap-2 mb-3">
              <button onClick={generateAIReply} disabled={aiGenerating}
                className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-medium rounded-xl hover:bg-sky-100 transition-colors disabled:opacity-50">
                <Bot size={13} /> {aiGenerating ? 'AI 生成中...' : 'AI 智慧回覆'}
              </button>
              {['退換貨政策', '訂單查詢', '運費說明'].map(template => (
                <button key={template} onClick={() => setInput(template === '退換貨政策' ? '我們提供 30 天退換貨保障，商品需保持原包裝且未使用。' : template === '運費說明' ? '訂單滿 $50 即享免費運費，一般配送 5-10 天，快遞 2-3 天。' : '請提供您的訂單號碼，我們立即為您查詢狀態。')}
                  className="flex-shrink-0 px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-xl hover:border-slate-400 transition-colors">
                  {template}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder="輸入回覆訊息... (Enter 發送)" rows={2}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 resize-none" />
              <div className="flex flex-col gap-1.5">
                <button onClick={() => sendMessage()} disabled={!input.trim()}
                  className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors disabled:opacity-50">
                  <Send size={15} />
                </button>
                <button onClick={() => sendMessage(true)} disabled={!input.trim()}
                  className="w-10 h-10 bg-sky-600 text-white rounded-xl flex items-center justify-center hover:bg-sky-700 transition-colors disabled:opacity-50" title="以 AI 身份發送">
                  <Bot size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">選擇一個對話</p>
          </div>
        </div>
      )}
    </div>
  )
}
