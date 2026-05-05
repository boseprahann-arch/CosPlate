import { useState } from 'react'
import axios from 'axios'

interface AIChatProps {
  token: string | null
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function AIChat({ token }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI coding assistant. Ask me anything about your code!',
      sender: 'ai',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [customApiKey, setCustomApiKey] = useState('')
  const [useCustomApi, setUseCustomApi] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:3001/api/chat',
        {
          message: input,
          customApiKey: useCustomApi ? customApiKey : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.text,
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: error.response?.data || 'Error communicating with AI',
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-dark-bg">
      {/* Header */}
      <div className="h-10 bg-dark-panel border-b border-dark-border flex items-center px-4 gap-2">
        <h3 className="text-sm font-medium">AI Chat</h3>
        <label className="ml-auto flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={useCustomApi}
            onChange={(e) => setUseCustomApi(e.target.checked)}
            className="w-4 h-4"
          />
          Custom API
        </label>
      </div>

      {/* Custom API Input */}
      {useCustomApi && (
        <div className="h-10 bg-dark-panel border-b border-dark-border px-4 flex items-center gap-2">
          <input
            type="password"
            placeholder="Enter custom API key..."
            value={customApiKey}
            onChange={(e) => setCustomApiKey(e.target.value)}
            className="flex-1 bg-dark-bg text-white text-xs px-2 py-1 border border-dark-border rounded focus:outline-none focus:border-accent"
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-accent text-white'
                  : 'bg-dark-panel text-gray-300 border border-dark-border'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-50 mt-1 block">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-dark-panel text-gray-300 border border-dark-border px-4 py-2 rounded-lg">
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="h-16 bg-dark-panel border-t border-dark-border p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 bg-dark-bg text-white px-3 py-2 border border-dark-border rounded focus:outline-none focus:border-accent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-accent text-white rounded hover:bg-indigo-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
