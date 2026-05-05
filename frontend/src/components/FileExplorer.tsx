import { useState } from 'react'

interface FileExplorerProps {
  token: string | null
}

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileItem[]
  expanded?: boolean
}

export default function FileExplorer({ token }: FileExplorerProps) {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      expanded: true,
      children: [
        { id: '1-1', name: 'main.js', type: 'file' },
        { id: '1-2', name: 'utils.js', type: 'file' },
      ],
    },
    {
      id: '2',
      name: 'public',
      type: 'folder',
      expanded: false,
      children: [
        { id: '2-1', name: 'index.html', type: 'file' },
      ],
    },
    {
      id: '3',
      name: 'package.json',
      type: 'file',
    },
  ])

  const toggleFolder = (id: string) => {
    const updateFiles = (items: FileItem[]): FileItem[] => {
      return items.map(item => {
        if (item.id === id && item.type === 'folder') {
          return { ...item, expanded: !item.expanded }
        }
        if (item.children) {
          return { ...item, children: updateFiles(item.children) }
        }
        return item
      })
    }
    setFiles(updateFiles(files))
  }

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map(item => (
      <div key={item.id}>
        <div
          className="flex items-center gap-2 px-2 py-1 hover:bg-dark-panel cursor-pointer text-sm"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => item.type === 'folder' && toggleFolder(item.id)}
        >
          {item.type === 'folder' ? (
            <>
              <span className="text-gray-400">{item.expanded ? '▼' : '▶'}</span>
              <span>📁</span>
              <span>{item.name}</span>
            </>
          ) : (
            <>
              <span className="text-gray-400">•</span>
              <span>📄</span>
              <span>{item.name}</span>
            </>
          )}
        </div>
        {item.type === 'folder' && item.expanded && item.children && (
          renderFileTree(item.children, depth + 1)
        )}
      </div>
    ))
  }

  return (
    <div className="flex flex-col h-full bg-dark-bg">
      {/* Header */}
      <div className="h-10 bg-dark-panel border-b border-dark-border flex items-center px-4">
        <h3 className="text-sm font-medium">File Explorer</h3>
        <button className="ml-auto text-gray-400 hover:text-white">➕</button>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        {renderFileTree(files)}
      </div>
    </div>
  )
}
