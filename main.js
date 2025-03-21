console.log("Electron - Processo")
 
// Importação dos recursos do framework
// App (aplicação)
// BrowserWindow (criação da janela)
// nativeTheme (definir tema claro ou escuro)
// Menu (definir o menu personalizado)
// shell (acessar links externos no navegador padrão)
// ipcRenderer permite estabalecer uma comunicação entre processos (IPC) main.js <=> renderer.js
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main')
 
// Ativação do preload.js (importação do path)
const path = require('node:path')
 
// Importação dos métodos conectar e desconectar (modulo de conexão)
 
const {conectar, desconectar} = require('./database.js')
 
// Janela principal
let win
const createWindow = () => {
  // definindo tema da janela claro ou escuro
  nativeTheme.themeSource = 'light'
  win = new BrowserWindow({
    width: 1010, // largura
    height: 900, // altura
    //frame: false
    //resizable: false,
    //minimizable: false,
    //closable: false,
    //autoHideMenuBar: true,
 
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
  }
  })
 
  // Carregar o menu personalizado
  // Atenção! Antes importar o recurso Menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
 
  // Carregar o documento HTML na janela
  win.loadFile('./src/views/index.html')
}
 
// Janela SOBRE
function aboutWindow() {
  nativeTheme.themeSource='light'
  // Obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow()
  // Validação (se existir a janela principal)
  if (mainWindow) {
    about = new BrowserWindow({
      width: 700,
      height: 350,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      // Estabelecer uma relação hierárquica entre janelas
      parent: mainWindow,
      // Criar uma janela modal (só retorna a principal quando encerrada)
      modal: true
  })
}
 
  about.loadFile('./src/views/sobre.html')
}
 
 
// Inicialização da aplicação (assincronismo, ou seja, ".them" indica o assincronismo)
app.whenReady().then(() => {
  createWindow()
 
// Melhor local para etabelecer a conexão com o banco de dados
//No mongodb é mais eficiente manter uma única conexão aberta durante todo o tempo de vida do aplicativo e encerrar a conexão quando o aplicativo for finalizado
// ipcMain.on (receber mensagem)
// db-connect (rótulo da mensagem)
ipcMain.on('db-connect', async (event) => {
  // a linha abaixo, estabelece a comunicação com o banco de dados
  await conectar()
  // enviar ao renderizador uma mensagem para trocar a imagem do ícone do status do banco de dados (criar um dlay de 0.5 ou 1s para sincronização com a nuvem)
  setTimeout(() => {
    event.reply('db-status', "conectado")
  }, 500) //500ms = 0.5s
})
  
 
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
 
// Se o sistema não for MAC encerrar a aplicação quando a janela for fechada
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IMPORTANTE!!!!!!!
// Desconectar do banco de dados quando a aplicação for finalizada
app.on('before-quit', async () => {
  await desconectar()
})
 
// Reduzir a verbozidade de logs não criticos (devtools)
app.commandLine.appendSwitch('log-level','3')
 
// Template do menu
const template = [
  {
    label: 'Notas',
    submenu: [
      {
        label: 'Criar nota',
        accelerator: 'Ctrl+N'  
      },
      {
        type: 'separator'      
      },
      {
        label: 'Sair',
        accelerator: 'Alt+F4',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Ferramentas',
    submenu: [
      {
        label: 'Aplicar zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Recarregar',
        role: "reload"
      },
      {
        label: 'DevTools',
        role: 'toggleDevTools'
      },
     
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Repositório',
        click: () => shell.openExternal('https://github.com/brudorea/stickynotes')
      },
      {
        label: 'Sobre',
        click: () => aboutWindow()
      }
    ]
  }
]