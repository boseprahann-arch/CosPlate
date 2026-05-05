import { useState } from 'react'

interface DebugConsoleProps {
  token: string | null
}

interface LogEntry {
  id: string
  message: string
  level: 'log' | 'warn' | 'error' | 'info'
  timestamp: Date
}

export default function DebugConsole({ token }: DebugConsoleProps) {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      message: 'Debug console initialized',
      level: 'info',
      timestamp: new Date(),
    },
  ])
  const [filter, setFilter] = useState<'all' | 'log' | 'warn' | 'error' | 'info'>('all')

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.level === filter)

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-400'
      case 'warn':
        return 'text-yellow-400'
      case 'info':
        return 'text-blue-400'
      default:
        return 'text-gray-300'
    }
  }

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-900 bg-opacity-20'
      case 'warn':
        return 'bg-yellow-900 bg-opacity-20'
      case 'info':
        return 'bg-blue-900 bg-opacity-20'
      default:
        return 'bg-transparent'
    }
  }

  return (
    <div className="flex flex-col h-full bg-dark-bg">
      {/* Header */}
      <div className="h-10 bg-dark-panel border-b border-dark-border flex items-center px-4 gap-2">
        <h3 className="text-sm font-medium">Debug Console</h3>
        <div className="ml-auto flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-dark-bg text-white text-xs px-2 py-1 border border-dark-border rounded focus:outline-none"
          >
            <option value="all">All</option>
            <option value="log">Log</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
          <button
            onClick={() => setLogs([])}
            className="text-gray-400 hover:text-white text-xs px-2 py-1"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500">No logs to display</div>
        ) : (
          filteredLogs.map(log => (
            <div
              key={log.id}
              className={`p-2 rounded ${getLevelBg(log.level)}`}
            >
              <span className={getLevelColor(log.level)}>
                [{log.level.toUpperCase()}]
              </span>
              <span className="text-gray-400 ml-2">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span className="text-gray-300 ml-2">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
