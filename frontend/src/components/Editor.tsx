import { useState } from 'react'

interface EditorProps {
  token: string | null
}

export default function Editor({ token }: EditorProps) {
  const [code, setCode] = useState('// Welcome to CosPlate!\n// Start coding here...\n\nfunction hello() {\n  console.log("Hello, World!");\n}')
  const [fileName, setFileName] = useState('main.js')

  return (
    <div className="flex flex-col h-full bg-dark-bg">
      {/* Editor Header */}
      <div className="h-10 bg-dark-panel border-b border-dark-border flex items-center px-4 gap-2">
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="bg-transparent text-white text-sm focus:outline-none border-b border-transparent hover:border-dark-border focus:border-accent"
        />
        <span className="text-gray-500 text-xs ml-auto">UTF-8</span>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-4 bg-dark-bg text-white font-mono text-sm resize-none focus:outline-none border-none"
          spellCheck="false"
        />
      </div>

      {/* Editor Footer */}
      <div className="h-8 bg-dark-panel border-t border-dark-border flex items-center px-4 text-xs text-gray-500">
        <span>Line 1, Column 1</span>
        <span className="ml-auto">JavaScript</span>
      </div>
    </div>
  )
}
