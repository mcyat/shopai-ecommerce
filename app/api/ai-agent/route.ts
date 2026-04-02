import { NextRequest, NextResponse } from 'next/server'
import { generateCustomerResponse, generateProductDescription, suggestPriceOptimization } from '@/lib/ai-agent'
import type { Product } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json()

    switch (action) {
      case 'generate_response': {
        const response = await generateCustomerResponse({
          message: data.message,
          language: data.language || 'zh-TW',
        })
        return NextResponse.json({ response })
      }

      case 'generate_description': {
        const descriptions = generateProductDescription({
          name: data.name,
          category: data.category,
          price: data.price,
          features: data.features,
        })
        return NextResponse.json({ descriptions })
      }

      case 'price_suggestion': {
        const suggestion = suggestPriceOptimization(data as Product)
        return NextResponse.json({ suggestion })
      }

      case 'create_task': {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (supabaseUrl && supabaseServiceKey) {
          const { createClient } = await import('@supabase/supabase-js')
          const supabase = createClient(supabaseUrl, supabaseServiceKey)

          const { data: task, error } = await supabase
            .from('ai_tasks')
            .insert(data)
            .select()
            .single()

          if (error) throw error
          return NextResponse.json({ task }, { status: 201 })
        }

        return NextResponse.json({ task: { id: `demo-${Date.now()}`, ...data }, status: 201 })
      }

      case 'approve_task': {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (supabaseUrl && supabaseServiceKey) {
          const { createClient } = await import('@supabase/supabase-js')
          const supabase = createClient(supabaseUrl, supabaseServiceKey)

          const { data: task, error } = await supabase
            .from('ai_tasks')
            .update({
              status: 'approved',
              reviewed_by: data.reviewed_by,
              review_notes: data.review_notes,
            })
            .eq('id', data.task_id)
            .select()
            .single()

          if (error) throw error
          return NextResponse.json({ task })
        }

        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'AI agent operation failed' }, { status: 500 })
  }
}
