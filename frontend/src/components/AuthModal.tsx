import { useState } from 'react'
import axios from 'axios'

interface AuthModalProps {
  onAuthSuccess: (token: string) => void
}

export default function AuthModal({ onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register'
      const response = await axios.post(`http://localhost:3001${endpoint}`, {
        email,
        password,
      })

      if (response.data.token) {
        onAuthSuccess(response.data.token)
      } else {
        setError('Authentication failed')
      }
    } catch (err: any) {
      setError(err.response?.data || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-dark-bg">
      <div className="w-full max-w-md p-8 bg-dark-panel border border-dark-border rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">CosPlate</h1>
        <p className="text-center text-gray-400 mb-8">AI-Powered Vibe Coding IDE</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-white focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-white focus:outline-none focus:border-accent"
              required
            />
          </div>

          {error && <div className="p-3 bg-red-900 text-red-200 rounded text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-accent text-white rounded font-medium hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
            className="text-accent hover:underline text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
