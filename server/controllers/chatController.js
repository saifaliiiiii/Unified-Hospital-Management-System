import {
  generateMedicalReply,
  getGeminiErrorResponse,
  hasUsableGeminiKey,
} from '../services/geminiService.js'

const SYSTEM_PROMPT =
  'You are a safe AI medical support assistant for a healthcare portal. You can explain symptoms, provide general health guidance, suggest consulting doctors, and help patients understand common medical concerns. Never provide final diagnosis. Never prescribe medications or dosages. For emergencies like chest pain, breathing difficulty, stroke symptoms, or suicidal thoughts, immediately advise contacting emergency services or visiting a hospital. Keep answers concise, practical, and clearly informational.'

const emergencyPattern =
  /\b(chest pain|breathing difficulty|shortness of breath|stroke|suicidal|suicide|heart attack|seizure|unconscious|heavy bleeding|severe allergic|anaphylaxis)\b/i

function normalizeMessages(body = {}) {
  if (Array.isArray(body.messages)) {
    return body.messages
  }

  if (typeof body.message === 'string') {
    return [{ role: 'user', content: body.message }]
  }

  return []
}

function sanitizeMessages(messages = []) {
  return messages
    .filter(
      (message) =>
        ['user', 'assistant'].includes(message?.role) &&
        typeof message?.content === 'string' &&
        message.content.trim(),
    )
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 1200),
    }))
}

export async function createChatCompletion(req, res) {
  const messages = sanitizeMessages(normalizeMessages(req.body))
  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user')

  console.log('Incoming chat message:', {
    messageCount: messages.length,
    latestUserMessage: latestUserMessage?.content,
  })

  if (!latestUserMessage) {
    return res.status(400).json({
      code: 'INVALID_REQUEST',
      error: 'A user message is required.',
    })
  }

  if (emergencyPattern.test(latestUserMessage.content)) {
    return res.json({
      reply: 'Please contact emergency medical services immediately.',
      emergency: true,
    })
  }

  if (!hasUsableGeminiKey()) {
    console.error(
      'Gemini API key is missing or still uses a placeholder. Set GEMINI_API_KEY in .env and restart the server.',
    )
    return res.status(500).json({
      code: 'GEMINI_API_KEY_MISSING',
      error: 'Gemini API key missing from server configuration.',
    })
  }

  try {
    const response = await generateMedicalReply({
      messages,
      systemPrompt: SYSTEM_PROMPT,
    })

    console.log('Gemini chat response created:', {
      model: response.model,
    })

    return res.json({ reply: response.reply })
  } catch (error) {
    console.error('Gemini chat error:', error)
    const response = getGeminiErrorResponse(error)
    return res.status(response.status).json(response.body)
  }
}
