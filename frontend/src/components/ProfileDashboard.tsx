import { useState, useEffect } from 'react'
import axios from 'axios'

interface ProfileDashboardProps {
  token: string | null
}

interface UserProfile {
  email: string
  requests_today: number
  tokens_today: number
}

export default function ProfileDashboard({ token }: ProfileDashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setProfile(response.data)
      } catch (error) {
        console.error('Failed to fetch profile', error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchProfile()
    }
  }, [token])

  const requestsPercentage = profile ? (profile.requests_today / 800) * 100 : 0
  const tokensPercentage = profile ? (profile.tokens_today / 230000) * 100 : 0

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex flex-col h-full bg-dark-bg p-6 overflow-y-auto">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-8">Profile & Usage</h2>

      {loading ? (
        <div className="text-gray-400">Loading profile...</div>
      ) : profile ? (
        <div className="space-y-8">
          {/* User Info */}
          <div className="bg-dark-panel border border-dark-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <p className="text-white font-medium">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-dark-panel border border-dark-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-6">Usage Statistics</h3>

            {/* Requests */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-400 text-sm">API Requests</label>
                <span className="text-white font-medium">
                  {profile.requests_today} / 800
                </span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all ${getProgressColor(requestsPercentage)}`}
                  style={{ width: `${Math.min(requestsPercentage, 100)}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-2">
                {requestsPercentage.toFixed(1)}% of daily limit used
              </p>
            </div>

            {/* Tokens */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-400 text-sm">Tokens (Current Minute)</label>
                <span className="text-white font-medium">
                  {profile.tokens_today} / 230,000
                </span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all ${getProgressColor(tokensPercentage)}`}
                  style={{ width: `${Math.min(tokensPercentage, 100)}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-2">
                {tokensPercentage.toFixed(1)}% of minute limit used
              </p>
            </div>
          </div>

          {/* Limits Info */}
          <div className="bg-dark-panel border border-dark-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Rate Limits</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Requests per Minute</span>
                <span className="text-white font-medium">13</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Requests per Day</span>
                <span className="text-white font-medium">800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tokens per Minute</span>
                <span className="text-white font-medium">230,000</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-4">
              💡 Tip: Use a custom API key to bypass these limits and use your own provider's limits.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-gray-400">Failed to load profile</div>
      )}
    </div>
  )
}
