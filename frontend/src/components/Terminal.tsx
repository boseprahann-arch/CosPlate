import { useState, useRef, useEffect } from 'react'

interface TerminalProps {
  token: string | null
}

interface TerminalLine {
  id: string
  text: string
  type: 'input' | 'output' | 'error'
}

export default function Terminal({ token }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', text: '$ Welcome to CosPlate Terminal', type: 'output' },
    { id: '2', text: '$ Type commands here...', type: 'output' },
  ])
  const [input, setInput] = useState('')
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newLine: TerminalLine = {
        id: Date.now().toString(),
        text: `$ ${input}`,
        type: 'input',
      }
      setLines([...lines, newLine])

      // Simulate command execution
      setTimeout(() => {
        let output = ''
        if (input.includes('help')) {
          output = 'Available commands: help, clear, echo, ls, pwd'
        } else if (input.includes('clear')) {
          setLines([])
          setInput('')
          return
        } else if (input.includes('echo')) {
          output = input.replace('echo ', '')
        } else if (input.includes('ls')) {
          output = 'src/  public/  package.json  README.md'
        } else if (input.includes('pwd')) {
          output = '/workspace'
        } else {
          output = `Command not found: ${input}`
        }

        setLines(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: output,
          type: 'output',
        }])
      }, 100)

      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-full bg-dark-bg">
      {/* Terminal Header */}
      <div className="h-10 bg-dark-panel border-b border-dark-border flex items-center px-4">
        <h3 className="text-sm font-medium">Terminal</h3>
      </div>

      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1"
      >
        {lines.map(line => (
          <div
            key={line.id}
            className={line.type === 'error' ? 'text-red-400' : 'text-gray-300'}
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* Terminal Input */}
      <div className="h-10 bg-dark-panel border-t border-dark-border flex items-center px-4">
        <span className="text-gray-400 mr-2">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 bg-transparent text-white font-mono text-sm focus:outline-none"
          autoFocus
        />
      </div>
    </div>
  )
}
