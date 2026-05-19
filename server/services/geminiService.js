import { GoogleGenerativeAI } from '@google/generative-ai'

const DEFAULT_MODEL = 'gemini-2.0-flash'

export function hasUsableGeminiKey() {
  const apiKey = process.env.GEMINI_API_KEY?.trim()

  return Boolean(
    apiKey &&
      apiKey !== 'your_gemini_api_key_here' &&
      !apiKey.includes('xxxxxxxx'),
  )
}

function buildConversationText(messages) {
  return messages
    .map((message) => {
      const speaker = message.role === 'assistant' ? 'Assistant' : 'Patient'
      return `${speaker}: ${message.content}`
    })
    .join('\n')
}

export async function generateMedicalReply({ messages, systemPrompt }) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim())
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 450,
    },
  })

  const result = await model.generateContent(buildConversationText(messages))
  const reply = result.response.text().trim()

  return {
    reply: reply || 'I am sorry, I could not generate a helpful response right now.',
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
  }
}

export function getGeminiErrorResponse(error) {
  const status = error?.status || error?.response?.status
  const code = error?.code || error?.error?.code
  const message = error?.message || ''
  const lowerMessage = message.toLowerCase()

  if (status === 400 && lowerMessage.includes('api key')) {
    return {
      status: 401,
      body: {
        code: 'GEMINI_AUTH_ERROR',
        error: 'Gemini rejected the API key. Check GEMINI_API_KEY on the server.',
      },
    }
  }

  if (status === 401 || status === 403 || lowerMessage.includes('api key not valid')) {
    return {
      status: status || 401,
      body: {
        code: 'GEMINI_AUTH_ERROR',
        error: 'Gemini rejected the API key. Check GEMINI_API_KEY on the server.',
      },
    }
  }

  if (status === 429 || lowerMessage.includes('quota') || lowerMessage.includes('rate')) {
    return {
      status: 429,
      body: {
        code: 'GEMINI_QUOTA_EXCEEDED',
        error: 'Gemini quota or rate limit was exceeded. Check free tier usage limits.',
      },
    }
  }

  if (status === 404 || lowerMessage.includes('not found') || lowerMessage.includes('model')) {
    return {
      status: 502,
      body: {
        code: 'GEMINI_MODEL_UNAVAILABLE',
        error: 'The configured Gemini model is unavailable. Check GEMINI_MODEL.',
      },
    }
  }

  if (['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'].includes(code)) {
    return {
      status: 503,
      body: {
        code: 'GEMINI_NETWORK_ERROR',
        error: 'The server could not reach Gemini. Check network connectivity.',
      },
    }
  }

  return {
    status: 502,
    body: {
      code: 'GEMINI_REQUEST_FAILED',
      error: 'The AI medical assistant is temporarily unavailable. Please try again shortly.',
    },
  }
}
