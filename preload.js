const { ipcRenderer } = require('electron');

window.electron = {
  selectWorkspace: () => ipcRenderer.invoke('select-workspace'),
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  writeFile: (path, content) => ipcRenderer.invoke('write-file', { filePath: path, content }),
  sendTerminalCommand: (command) => ipcRenderer.send('terminal-input', command),
  onTerminalOutput: (callback) => ipcRenderer.on('terminal-output', (event, data) => callback(data)),
};
