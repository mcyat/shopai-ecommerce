// ==================== Product ====================
export interface Product {
  id: string
  name: string
  name_zh_tw?: string
  name_zh_cn?: string
  name_ja?: string
  description: string
  description_zh_tw?: string
  price: number
  compare_price?: number
  cost_price?: number
  images: string[]
  category: string
  tags: string[]
  stock: number
  sku: string
  weight?: number
  status: 'active' | 'draft' | 'archived'
  dropshipping_source?: 'aliexpress' | 'cj' | 'spocket' | 'manual'
  dropshipping_product_id?: string
  dropshipping_supplier_url?: string
  variants?: ProductVariant[]
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  options: Record<string, string>
  price: number
  stock: number
  sku: string
  image?: string
}

// ==================== Order ====================
export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address: Address
  billing_address?: Address
  items: OrderItem[]
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method?: string
  notes?: string
  tracking_number?: string
  tracking_carrier?: string
  tracking_url?: string
  dropshipping_order_id?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image?: string
  variant_name?: string
  quantity: number
  unit_price: number
  total_price: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

// ==================== AI Agent ====================
export type AITaskType =
  | 'PRICE_UPDATE'
  | 'PRODUCT_LISTING'
  | 'INVENTORY_RESTOCK'
  | 'ORDER_FULFILL'
  | 'CUSTOMER_REPLY'
  | 'PRODUCT_DESCRIPTION'
  | 'PROMOTION_CREATE'
  | 'DROPSHIP_IMPORT'
  | 'ANALYTICS_REPORT'

export type AITaskStatus = 'pending' | 'awaiting_approval' | 'approved' | 'executing' | 'completed' | 'rejected' | 'failed'

export interface AITask {
  id: string
  type: AITaskType
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: AITaskStatus
  requires_approval: boolean
  data: Record<string, unknown>
  result?: Record<string, unknown>
  error?: string
  created_by: 'ai' | 'human'
  reviewed_by?: string
  review_notes?: string
  scheduled_at?: string
  executed_at?: string
  created_at: string
  updated_at: string
}

// ==================== Dropshipping ====================
export type DropshippingSource = 'aliexpress' | 'cj' | 'spocket'

export interface DropshippingProduct {
  source: DropshippingSource
  source_id: string
  name: string
  description: string
  images: string[]
  price: number
  shipping_cost: number
  shipping_days: number
  supplier_name: string
  supplier_url: string
  variants?: DropshippingVariant[]
  category: string
  rating?: number
  orders_count?: number
}

export interface DropshippingVariant {
  id: string
  name: string
  price: number
  stock: number
  image?: string
}

// ==================== Logistics ====================
export interface LogisticsTemplate {
  id: string
  name: string
  carrier: string
  carrier_code: string
  tracking_url_template: string
  estimated_days_min: number
  estimated_days_max: number
  cost: number
  regions: string[]
  is_default: boolean
  created_at: string
}

export interface TrackingInfo {
  tracking_number: string
  carrier: string
  status: string
  estimated_delivery?: string
  events: TrackingEvent[]
  last_updated: string
}

export interface TrackingEvent {
  timestamp: string
  location: string
  description: string
  status: string
}

// ==================== Store Settings ====================
export interface StoreSettings {
  id: string
  store_name: string
  store_description?: string
  logo_url?: string
  favicon_url?: string
  template: 'fashion' | 'tech' | 'minimal'
  primary_color: string
  secondary_color: string
  font_family: string
  currency: string
  language: Language
  announcement?: string
  social_links: Record<string, string>
  seo_title?: string
  seo_description?: string
  contact_email?: string
  support_phone?: string
  address?: string
  free_shipping_threshold?: number
  tax_rate: number
  updated_at: string
}

export type Language = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'la'

// ==================== Customer Service ====================
export interface ChatMessage {
  id: string
  session_id: string
  role: 'customer' | 'agent' | 'ai'
  content: string
  created_at: string
}

export interface ChatSession {
  id: string
  customer_name: string
  customer_email?: string
  status: 'open' | 'pending_ai' | 'ai_responded' | 'closed'
  messages: ChatMessage[]
  order_id?: string
  created_at: string
  updated_at: string
}

// ==================== Analytics ====================
export interface SalesData {
  date: string
  revenue: number
  orders: number
  visitors?: number
}

export interface TopProduct {
  product_id: string
  product_name: string
  total_sold: number
  revenue: number
}
