const CHAT_TIMEOUT_MS = 25000
const MAX_RETRIES = 1

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.error || 'Unable to reach the AI medical assistant.')
    error.code = data.code
    error.status = response.status
    throw error
  }

  return data
}

async function requestChat(messages, attempt = 0) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS)

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    })

    return await parseResponse(response)
  } catch (error) {
    console.error('Chat API request failed:', {
      attempt,
      status: error.status,
      code: error.code,
      message: error.message,
    })

    if (error.name === 'AbortError') {
      throw new Error('The AI assistant request timed out. Please try again.')
    }

    if (attempt < MAX_RETRIES && (!error.status || error.status >= 500)) {
      await wait(600)
      return requestChat(messages, attempt + 1)
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export async function sendChatMessage(messages) {
  return requestChat(messages)
}
