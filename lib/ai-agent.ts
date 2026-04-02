import type { AITask, AITaskType, Product, Order } from '@/types'

// ==================== AI Agent Task Engine ====================

export const TASK_CONFIG: Record<AITaskType, {
  label: string
  requiresApproval: boolean
  autoExecuteThreshold?: number // Risk score below this = auto execute
  icon: string
}> = {
  PRICE_UPDATE: { label: '價格調整', requiresApproval: true, icon: '💰' },
  PRODUCT_LISTING: { label: '商品上架', requiresApproval: true, icon: '📦' },
  INVENTORY_RESTOCK: { label: '庫存補充', requiresApproval: true, icon: '🏭' },
  ORDER_FULFILL: { label: '訂單處理', requiresApproval: false, autoExecuteThreshold: 30, icon: '📬' },
  CUSTOMER_REPLY: { label: '客服回覆', requiresApproval: false, autoExecuteThreshold: 20, icon: '💬' },
  PRODUCT_DESCRIPTION: { label: '商品描述優化', requiresApproval: false, autoExecuteThreshold: 10, icon: '✍️' },
  PROMOTION_CREATE: { label: '促銷活動', requiresApproval: true, icon: '🎁' },
  DROPSHIP_IMPORT: { label: '導入商品', requiresApproval: true, icon: '🔗' },
  ANALYTICS_REPORT: { label: '分析報告', requiresApproval: false, autoExecuteThreshold: 5, icon: '📊' },
}

// Generate AI tasks based on store data
export function generateAITasks(data: {
  lowStockProducts?: Product[]
  pendingOrders?: Order[]
  recentSales?: number
}): Partial<AITask>[] {
  const tasks: Partial<AITask>[] = []

  // Low stock alerts
  if (data.lowStockProducts?.length) {
    data.lowStockProducts.forEach(product => {
      tasks.push({
        type: 'INVENTORY_RESTOCK',
        title: `補充庫存：${product.name}`,
        description: `商品「${product.name}」庫存剩餘 ${product.stock} 件，建議補充至 100 件。`,
        priority: product.stock === 0 ? 'urgent' : product.stock < 5 ? 'high' : 'medium',
        requires_approval: true,
        created_by: 'ai',
        data: { product_id: product.id, current_stock: product.stock, suggested_restock: 100 },
      })
    })
  }

  // Pending orders fulfillment
  if (data.pendingOrders?.length) {
    data.pendingOrders.slice(0, 5).forEach(order => {
      tasks.push({
        type: 'ORDER_FULFILL',
        title: `處理訂單 ${order.order_number}`,
        description: `訂單 ${order.order_number} 已付款，需要進行出貨處理。客戶：${order.customer_name}`,
        priority: 'high',
        requires_approval: false,
        created_by: 'ai',
        data: { order_id: order.id, order_number: order.order_number },
      })
    })
  }

  // Analytics report (weekly)
  tasks.push({
    type: 'ANALYTICS_REPORT',
    title: '每週銷售分析報告',
    description: '生成本週銷售數據分析，包含熱銷商品、收入趨勢、客戶行為分析。',
    priority: 'low',
    requires_approval: false,
    created_by: 'ai',
    data: { period: 'weekly' },
  })

  return tasks
}

// AI Customer Service Response Generator
export async function generateCustomerResponse(params: {
  message: string
  orderInfo?: Order
  productInfo?: Product
  language?: string
}): Promise<string> {
  const { message, orderInfo, language = 'zh-TW' } = params

  // In production, this would call OpenAI API
  // For demo, we return intelligent templated responses
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('order') || lowerMessage.includes('訂單') || lowerMessage.includes('注文')) {
    if (orderInfo) {
      const statusMap: Record<string, string> = {
        'zh-TW': `您好！您的訂單 ${orderInfo.order_number} 目前狀態為「${orderInfo.status}」。${orderInfo.tracking_number ? `追蹤號碼：${orderInfo.tracking_number}` : '出貨後將提供追蹤號碼。'}`,
        'en': `Hello! Your order ${orderInfo.order_number} is currently "${orderInfo.status}". ${orderInfo.tracking_number ? `Tracking: ${orderInfo.tracking_number}` : 'Tracking info will be provided after shipment.'}`,
        'ja': `こんにちは！ご注文 ${orderInfo.order_number} の状態は「${orderInfo.status}」です。${orderInfo.tracking_number ? `追跡番号：${orderInfo.tracking_number}` : '発送後に追跡番号をお知らせします。'}`,
      }
      return statusMap[language] || statusMap['zh-TW']
    }
    return language === 'zh-TW'
      ? '您好！請提供您的訂單號碼，我為您查詢訂單狀態。'
      : 'Hello! Please provide your order number so I can check the status for you.'
  }

  if (lowerMessage.includes('return') || lowerMessage.includes('退貨') || lowerMessage.includes('返品')) {
    return language === 'zh-TW'
      ? '我們提供 30 天退換貨保障。商品需保持原包裝且未使用狀態。請回覆您的訂單號碼，我們將安排退貨流程。'
      : 'We offer a 30-day return policy. Items must be in original packaging and unused. Please provide your order number to initiate a return.'
  }

  if (lowerMessage.includes('shipping') || lowerMessage.includes('運費') || lowerMessage.includes('送料')) {
    return language === 'zh-TW'
      ? '我們提供全球配送服務。訂單滿 $50 免運費。一般配送需 5-10 個工作天，快遞服務 2-3 天。'
      : 'We ship worldwide. Free shipping on orders over $50. Standard shipping takes 5-10 business days, express 2-3 days.'
  }

  // Default response
  return language === 'zh-TW'
    ? '您好！感謝您聯繫我們的客服。我會盡快為您解決問題。請稍候片刻，或告訴我更多詳情。'
    : 'Hello! Thank you for contacting us. I\'ll help you resolve your issue as quickly as possible. Please tell me more details.'
}

// Price optimization AI
export function suggestPriceOptimization(product: Product): {
  currentPrice: number
  suggestedPrice: number
  reason: string
  expectedImpact: string
} {
  // Simple pricing algorithm (in production, this would be ML-based)
  const margin = product.cost_price
    ? (product.price - product.cost_price) / product.price
    : 0.5

  let suggestedPrice = product.price
  let reason = ''
  let expectedImpact = ''

  if (margin > 0.7) {
    // High margin - can reduce price to increase volume
    suggestedPrice = Math.round(product.price * 0.9 * 100) / 100
    reason = '利潤率過高（>70%），建議降價以提升銷量'
    expectedImpact = '預計銷量提升 20-30%'
  } else if (margin < 0.3) {
    // Low margin - increase price
    suggestedPrice = Math.round(product.price * 1.1 * 100) / 100
    reason = '利潤率偏低（<30%），建議適度提價'
    expectedImpact = '保持健康利潤率，對銷量影響約 -5%'
  } else if (product.stock > 200) {
    // High inventory - discount to clear
    suggestedPrice = Math.round(product.price * 0.85 * 100) / 100
    reason = '庫存過多，建議促銷清倉'
    expectedImpact = '預計本週清庫 30-50 件'
  } else {
    reason = '價格合理，維持現價'
    expectedImpact = '維持穩定銷量'
  }

  return { currentPrice: product.price, suggestedPrice, reason, expectedImpact }
}

// Bulk product description generator
export function generateProductDescription(product: {
  name: string
  category: string
  price: number
  features?: string[]
}): { zh_tw: string; en: string; ja: string } {
  const features = product.features?.join('、') || '優質材料、精工製作'

  return {
    zh_tw: `✨ ${product.name}\n\n🎯 產品特點：${features}\n\n💎 品質保證：我們對每件商品都進行嚴格的品質控管，確保您收到最高品質的產品。\n\n🚀 快速出貨：下單後 1-2 個工作天內出貨，讓您盡快收到心愛的商品。\n\n💰 超值定價：NT$${Math.round(product.price * 30)} 起，給您最優惠的價格。`,
    en: `✨ ${product.name}\n\n🎯 Key Features: ${features || 'Premium quality, carefully crafted'}\n\n💎 Quality Guarantee: Every item undergoes strict quality control to ensure you receive the best products.\n\n🚀 Fast Shipping: Ships within 1-2 business days after ordering.\n\n💰 Best Value: Starting from $${product.price} with unbeatable quality.`,
    ja: `✨ ${product.name}\n\n🎯 特徴：${features || '高品質、精巧な作り'}\n\n💎 品質保証：全ての商品に厳格な品質管理を実施しています。\n\n🚀 迅速発送：ご注文後1〜2営業日以内に発送します。\n\n💰 お得な価格：¥${Math.round(product.price * 150)}から、最高品質をお届けします。`,
  }
}
