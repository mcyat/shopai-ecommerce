'use client'
import { useState, useEffect } from 'react'
import { Package, Truck, CheckCircle, Clock, MapPin, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

const MOCK_TRACKING_EVENTS = [
  { timestamp: new Date(Date.now() - 1 * 3600000).toISOString(), location: 'Hong Kong, HK', description: 'Package in transit to destination', status: 'InTransit' },
  { timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), location: 'HK International Airport', description: 'Departed from sorting facility', status: 'InTransit' },
  { timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), location: 'Hong Kong, HK', description: 'Package received at DHL facility', status: 'Processing' },
  { timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), location: 'Seller Location', description: 'Picked up by carrier', status: 'PickedUp' },
]

const STEPS = [
  { status: 'pending', label: '訂單確認', icon: Clock },
  { status: 'processing', label: '備貨中', icon: Package },
  { status: 'shipped', label: '已出貨', icon: Truck },
  { status: 'delivered', label: '已送達', icon: CheckCircle },
]

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState(2) // shipped
  const currentStatus = STEPS[currentStep]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/store" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 w-fit">
          <ArrowLeft size={18} /> 返回商店
        </Link>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8">
            <p className="text-xs text-gray-400 mb-1">訂單號碼</p>
            <h1 className="text-xl font-mono font-bold mb-4">{params.id}</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">{currentStatus.label}</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {STEPS.map((step, idx) => {
                const Icon = step.icon
                const isCompleted = idx < currentStep
                const isCurrent = idx === currentStep
                return (
                  <div key={step.status} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                        ${isCompleted || isCurrent ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <Icon size={18} />
                      </div>
                      <p className={`text-xs mt-2 text-center max-w-[60px] ${isCurrent ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-5 ${idx < currentStep ? 'bg-gray-900' : 'bg-gray-100'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tracking Info */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">物流追蹤</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">追蹤號：</span>
                <span className="font-mono font-semibold">DHL1234567890</span>
                <a href="https://www.dhl.com" target="_blank" rel="noopener">
                  <ExternalLink size={14} className="text-sky-500" />
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gray-100" />
              <div className="space-y-5">
                {MOCK_TRACKING_EVENTS.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10
                      ${idx === 0 ? 'bg-blue-100 text-blue-600' : 'bg-white border border-gray-200 text-gray-300'}`}>
                      <Truck size={15} />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`text-sm font-medium ${idx === 0 ? 'text-gray-900' : 'text-gray-500'}`}>{event.description}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin size={10} />{event.location}</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{new Date(event.timestamp).toLocaleString('zh-TW')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="p-8">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">預計送達時間</p>
                  <p className="text-xs text-gray-500">DHL 標準快遞</p>
                </div>
              </div>
              <p className="text-lg font-bold text-green-700">
                {new Date(Date.now() + 3 * 24 * 3600000).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/store" className="text-sm text-gray-500 hover:text-gray-900 underline">繼續購物</Link>
        </div>
      </div>
    </div>
  )
}
