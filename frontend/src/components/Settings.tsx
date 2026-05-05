interface SettingsProps {
  toolsEnabled: {
    ai: boolean
    terminal: boolean
    git: boolean
    explorer: boolean
  }
  setToolsEnabled: (tools: any) => void
}

export default function Settings({ toolsEnabled, setToolsEnabled }: SettingsProps) {
  const handleToggle = (tool: keyof typeof toolsEnabled) => {
    setToolsEnabled({
      ...toolsEnabled,
      [tool]: !toolsEnabled[tool],
    })
  }

  return (
    <div className="flex flex-col h-full bg-dark-bg p-6 overflow-y-auto">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-8">Settings</h2>

      {/* Tool Controls */}
      <div className="bg-dark-panel border border-dark-border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-6">Tool Controls</h3>
        <div className="space-y-4">
          {/* AI */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">AI Chat</label>
              <p className="text-gray-400 text-sm">Enable/disable AI assistance</p>
            </div>
            <button
              onClick={() => handleToggle('ai')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                toolsEnabled.ai ? 'bg-accent' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  toolsEnabled.ai ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Terminal */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Terminal</label>
              <p className="text-gray-400 text-sm">Enable/disable embedded terminal</p>
            </div>
            <button
              onClick={() => handleToggle('terminal')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                toolsEnabled.terminal ? 'bg-accent' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  toolsEnabled.terminal ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* File Explorer */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">File Explorer</label>
              <p className="text-gray-400 text-sm">Enable/disable file explorer</p>
            </div>
            <button
              onClick={() => handleToggle('explorer')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                toolsEnabled.explorer ? 'bg-accent' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  toolsEnabled.explorer ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Git Integration */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Git Integration</label>
              <p className="text-gray-400 text-sm">Enable/disable git features</p>
            </div>
            <button
              onClick={() => handleToggle('git')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                toolsEnabled.git ? 'bg-accent' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  toolsEnabled.git ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-dark-panel border border-dark-border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-6">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="text-white font-medium block mb-2">Theme</label>
            <select className="w-full bg-dark-bg text-white px-3 py-2 border border-dark-border rounded focus:outline-none focus:border-accent">
              <option>Dark (Default)</option>
              <option>Light</option>
              <option>Auto</option>
            </select>
          </div>
          <div>
            <label className="text-white font-medium block mb-2">Font Size</label>
            <select className="w-full bg-dark-bg text-white px-3 py-2 border border-dark-border rounded focus:outline-none focus:border-accent">
              <option>Small</option>
              <option>Medium (Default)</option>
              <option>Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-dark-panel border border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">About</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Application</span>
            <span className="text-white font-medium">CosPlate v1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Build</span>
            <span className="text-white font-medium">Production</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">License</span>
            <span className="text-white font-medium">MIT</span>
          </div>
        </div>
      </div>
    </div>
  )
}
