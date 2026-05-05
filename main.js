
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;
let workspaceRoot = '';

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0f0f0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL('http://localhost:5173');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Workspace Selection
ipcMain.handle('select-workspace', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled) {
    workspaceRoot = result.filePaths[0];
    return workspaceRoot;
  }
  return null;
});

// Sandboxed File Operations
ipcMain.handle('read-file', async (event, filePath) => {
  if (!workspaceRoot) throw new Error('No workspace selected');
  const fullPath = path.resolve(workspaceRoot, filePath);
  
  // Sandbox check: prevent traversal
  if (!fullPath.startsWith(workspaceRoot)) {
    throw new Error('Access denied: Outside workspace');
  }
  
  return fs.readFileSync(fullPath, 'utf8');
});

ipcMain.handle('write-file', async (event, { filePath, content }) => {
  if (!workspaceRoot) throw new Error('No workspace selected');
  const fullPath = path.resolve(workspaceRoot, filePath);
  
  if (!fullPath.startsWith(workspaceRoot)) {
    throw new Error('Access denied: Outside workspace');
  }
  
  fs.writeFileSync(fullPath, content);
  return true;
});

// Terminal Integration
ipcMain.on('terminal-input', (event, command) => {
  if (!workspaceRoot) return;
  
  const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
  const pty = spawn(shell, [], {
    cwd: workspaceRoot,
    env: process.env
  });

  pty.stdout.on('data', (data) => {
    mainWindow.webContents.send('terminal-output', data.toString());
  });

  pty.stderr.on('data', (data) => {
    mainWindow.webContents.send('terminal-output', data.toString());
  });

  pty.stdin.write(command + '\n');
  pty.stdin.end();
});
