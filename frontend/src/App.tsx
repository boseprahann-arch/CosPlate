import { useState, useEffect } from 'react'
import './App.css'
import Editor from './components/Editor'
import FileExplorer from './components/FileExplorer'
import Terminal from './components/Terminal'
import AIChat from './components/AIChat'
import DebugConsole from './components/DebugConsole'
import ProfileDashboard from './components/ProfileDashboard'
import Settings from './components/Settings'
import AuthModal from './components/AuthModal'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [activePanel, setActivePanel] = useState<'editor' | 'explorer' | 'terminal' | 'chat' | 'debug' | 'profile' | 'settings'>('editor')
  const [showAuthModal, setShowAuthModal] = useState(!token)
  const [toolsEnabled, setToolsEnabled] = useState({
    ai: true,
    terminal: true,
    git: true,
    explorer: true,
  })

  useEffect(() => {
    if (token) {
      setShowAuthModal(false)
    }
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setShowAuthModal(true)
  }

  if (showAuthModal) {
    return <AuthModal onAuthSuccess={(newToken) => {
      setToken(newToken)
      localStorage.setItem('token', newToken)
    }} />
  }

  return (
    <div className="flex h-screen bg-dark-bg text-white">
      {/* Sidebar */}
      <div className="w-12 bg-dark-panel border-r border-dark-border flex flex-col items-center py-4 gap-4">
        <button
          onClick={() => setActivePanel('editor')}
          className={`p-2 rounded ${activePanel === 'editor' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
          title="Editor"
        >
          📝
        </button>
        {toolsEnabled.explorer && (
          <button
            onClick={() => setActivePanel('explorer')}
            className={`p-2 rounded ${activePanel === 'explorer' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
            title="File Explorer"
          >
            📁
          </button>
        )}
        {toolsEnabled.terminal && (
          <button
            onClick={() => setActivePanel('terminal')}
            className={`p-2 rounded ${activePanel === 'terminal' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
            title="Terminal"
          >
            ⌨️
          </button>
        )}
        {toolsEnabled.ai && (
          <button
            onClick={() => setActivePanel('chat')}
            className={`p-2 rounded ${activePanel === 'chat' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
            title="AI Chat"
          >
            🤖
          </button>
        )}
        <button
          onClick={() => setActivePanel('debug')}
          className={`p-2 rounded ${activePanel === 'debug' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
          title="Debug Console"
        >
          🐛
        </button>
        <button
          onClick={() => setActivePanel('profile')}
          className={`p-2 rounded ${activePanel === 'profile' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
          title="Profile"
        >
          👤
        </button>
        <button
          onClick={() => setActivePanel('settings')}
          className={`p-2 rounded ${activePanel === 'settings' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
          title="Settings"
        >
          ⚙️
        </button>
        <button
          onClick={handleLogout}
          className="p-2 rounded text-gray-400 hover:text-red-500 mt-auto"
          title="Logout"
        >
          🚪
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-12 bg-dark-panel border-b border-dark-border flex items-center px-4">
          <h1 className="text-lg font-bold">CosPlate - AI-Powered Vibe Coding IDE</h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activePanel === 'editor' && <Editor token={token} />}
          {activePanel === 'explorer' && <FileExplorer token={token} />}
          {activePanel === 'terminal' && <Terminal token={token} />}
          {activePanel === 'chat' && <AIChat token={token} />}
          {activePanel === 'debug' && <DebugConsole token={token} />}
          {activePanel === 'profile' && <ProfileDashboard token={token} />}
          {activePanel === 'settings' && <Settings toolsEnabled={toolsEnabled} setToolsEnabled={setToolsEnabled} />}
        </div>
      </div>
    </div>
  )
}

export default App
