import { NextRequest, NextResponse } from 'next/server'
import { generateCustomerResponse } from '@/lib/ai-agent'

export async function POST(req: NextRequest) {
  try {
    const { message, language = 'zh-TW', sessionId, orderInfo } = await req.json()

    // If OpenAI is configured, use it for better responses
    const openaiKey = process.env.OPENAI_API_KEY

    if (openaiKey) {
      const systemPrompt = `You are a helpful customer service agent for an e-commerce store.
      Respond in ${language === 'zh-TW' ? 'Traditional Chinese' : language === 'zh-CN' ? 'Simplified Chinese' : language === 'ja' ? 'Japanese' : 'English'}.
      Be friendly, professional, and helpful. Focus on resolving customer issues quickly.
      If asked about order status, provide the tracking information if available.
      If customer wants to return/exchange, explain the 30-day return policy.`

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        })

        const data = await response.json()
        const aiResponse = data.choices?.[0]?.message?.content

        if (aiResponse) {
          return NextResponse.json({ response: aiResponse, source: 'openai' })
        }
      } catch {
        // Fallback to template-based response
      }
    }

    // Use template-based AI response
    const response = await generateCustomerResponse({ message, language, orderInfo })
    return NextResponse.json({ response, source: 'template' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
