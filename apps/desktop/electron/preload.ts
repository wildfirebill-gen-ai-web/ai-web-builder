import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  getDataPath: () => ipcRenderer.invoke('get-data-path'),
  showSaveDialog: (options: any) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options: any) => ipcRenderer.invoke('show-open-dialog', options),
  writeFile: (filePath: string, data: string) => ipcRenderer.invoke('write-file', filePath, data),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
})
