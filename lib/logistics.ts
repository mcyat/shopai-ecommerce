import type { TrackingInfo, LogisticsTemplate } from '@/types'

// ==================== Logistics & Tracking ====================

// Track shipment via AfterShip API (supports 900+ carriers)
export async function trackShipment(
  trackingNumber: string,
  carrier?: string
): Promise<TrackingInfo | null> {
  const apiKey = process.env.AFTERSHIP_API_KEY

  if (!apiKey) {
    // Return mock tracking data for demo
    return getMockTracking(trackingNumber)
  }

  try {
    const slug = carrier ? getCarrierSlug(carrier) : 'auto'
    const url = slug === 'auto'
      ? `https://api.aftership.com/v4/trackings/${trackingNumber}`
      : `https://api.aftership.com/v4/trackings/${slug}/${trackingNumber}`

    const response = await fetch(url, {
      headers: {
        'aftership-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) return getMockTracking(trackingNumber)

    const data = await response.json()
    const tracking = data?.data?.tracking

    if (!tracking) return getMockTracking(trackingNumber)

    return {
      tracking_number: trackingNumber,
      carrier: tracking.slug || carrier || 'Unknown',
      status: tracking.tag || 'InTransit',
      estimated_delivery: tracking.expected_delivery,
      last_updated: tracking.updated_at || new Date().toISOString(),
      events: (tracking.checkpoints || []).map((cp: Record<string, string>) => ({
        timestamp: cp.checkpoint_time || cp.created_at,
        location: [cp.city, cp.state, cp.country_name].filter(Boolean).join(', '),
        description: cp.message || cp.tag,
        status: cp.tag,
      })),
    }
  } catch {
    return getMockTracking(trackingNumber)
  }
}

function getCarrierSlug(carrier: string): string {
  const slugMap: Record<string, string> = {
    'DHL': 'dhl',
    'FedEx': 'fedex',
    'UPS': 'ups',
    'USPS': 'usps',
    'SF Express': 'sfexpress',
    'HK Post': 'hong-kong-post',
    'China Post': 'china-post',
    'EMS': 'china-ems',
    '順豐': 'sfexpress',
    '香港郵政': 'hong-kong-post',
    '中國郵政': 'china-post',
  }
  return slugMap[carrier] || carrier.toLowerCase().replace(/\s/g, '-')
}

function getMockTracking(trackingNumber: string): TrackingInfo {
  const now = new Date()
  return {
    tracking_number: trackingNumber,
    carrier: 'DHL',
    status: 'InTransit',
    estimated_delivery: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    last_updated: now.toISOString(),
    events: [
      {
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        location: 'Hong Kong, HK',
        description: 'Package in transit to destination',
        status: 'InTransit',
      },
      {
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        location: 'Hong Kong International Airport, HK',
        description: 'Departed from sorting facility',
        status: 'InTransit',
      },
      {
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        location: 'Hong Kong, HK',
        description: 'Package received at DHL facility',
        status: 'InfoReceived',
      },
      {
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        location: 'Seller Location',
        description: 'Shipped - Package picked up by carrier',
        status: 'PickedUp',
      },
    ],
  }
}

export const CARRIER_TRACKING_URLS: Record<string, string> = {
  dhl: 'https://www.dhl.com/track?tracking-id={tracking_number}',
  fedex: 'https://www.fedex.com/fedextrack/?trknbr={tracking_number}',
  ups: 'https://www.ups.com/track?tracknum={tracking_number}',
  usps: 'https://tools.usps.com/go/TrackConfirmAction?tLabels={tracking_number}',
  sfexpress: 'https://www.sf-express.com/cn/sc/dynamic_function/waybill/#search/bill-number/{tracking_number}',
  'hong-kong-post': 'https://www.hongkongpost.hk/en/mail_services/track/index.html?trackno={tracking_number}',
  'china-post': 'https://track.aftership.com/china-post/{tracking_number}',
}

export function buildTrackingUrl(template: LogisticsTemplate, trackingNumber: string): string {
  return template.tracking_url_template.replace('{tracking_number}', trackingNumber)
}

// Calculate shipping cost based on weight and destination
export function calculateShippingCost(params: {
  weight: number // kg
  country: string
  template: LogisticsTemplate
}): number {
  let cost = params.template.cost
  // Weight-based surcharge
  if (params.weight > 1) {
    cost += (params.weight - 1) * 2.5
  }
  // Region adjustments
  if (!['US', 'CA', 'GB', 'AU', 'HK', 'TW', 'SG'].includes(params.country)) {
    cost *= 1.2 // 20% surcharge for non-priority regions
  }
  return Math.round(cost * 100) / 100
}

// Generate shipping label (stub - in production use carrier APIs)
export function generateShippingLabelData(order: import('@/types').Order): Record<string, string> {
  return {
    recipient_name: order.shipping_address.name,
    address_line1: order.shipping_address.line1,
    address_line2: order.shipping_address.line2 || '',
    city: order.shipping_address.city,
    state: order.shipping_address.state,
    postal_code: order.shipping_address.postal_code,
    country: order.shipping_address.country,
    order_number: order.order_number,
    weight: '0.5 kg',
    service_type: 'Standard',
    label_format: 'PDF',
  }
}
