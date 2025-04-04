console.log("Electron - Processo")

// Importação dos recursos do framework
// App (aplicação)
// BrowserWindow (criação da janela)
// nativeTheme (definir tema claro ou escuro)
// Menu (definir o menu personalizado)
// shell (acessar links externos no navegador padrão)
// ipcRenderer permite estabalecer uma comunicação entre processos (IPC) main.js <=> renderer.js
// dialog é módulo electron para ativar caixa de mensagens 
// shell acessa links e aplicações externas
const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron/main')

// Ativação do preload.js (importação do path)
const path = require('node:path')

// Importação dos métodos conectar e desconectar (modulo de conexão)

const { conectar, desconectar } = require('./database.js')
const { on } = require('node:events')

// Importação do Schema Clientes da camada model
const clienteModel = require('./src/models/Cliente.js')

// Importação da biblioteca nativa do JS para manipular arquivos
const fs = require('fs')

// Importação do pacote jspdf (arquivos pdf) npm install jspdf
const { jspdf, default: jsPDF } = require('jspdf')

// Janela principal
let win
const createWindow = () => {
  // definindo tema da janela claro ou escuro
  nativeTheme.themeSource = 'light'
  win = new BrowserWindow({
    width: 1010, // largura
    height: 720, // altura
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
let about
function aboutWindow() {
  nativeTheme.themeSource = 'light'
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
      modal: true // Criar uma janela modal (só retorna a principal quando encerrada)
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
app.commandLine.appendSwitch('log-level', '3')

// Template do menu
const template = [
  {
    label: 'Cadastro',
    submenu: [
      {
        label: 'Sair',
        accelerator: 'Alt+F4',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Relatórios',
    submenu: [
      {
        label: 'Clientes',
        click: () => relatorioClientes()
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

// ========================== CRUD CREATE ===========================

// Recebimento do objeto que contem os dados da nota
ipcMain.on('create-cliente', async (event, cadastroCliente) => {
  //IMPORTANTE! Teste do reecebimento do objeto (Passo 2)
  console.log(cadastroCliente)
  //Criar uma nova estrutura de dados para salvar no banco
  //Atenção!! os atributos da estrutura precisam se idênticos ao modelo e os valores são obtidos atraves do objeto sticknotes

  try {
    const newCliente = clienteModel({
      nome: cadastroCliente.nomeCli,
      cpf: cadastroCliente.cpfCli,
      email: cadastroCliente.emailCli,
      fone: cadastroCliente.telCli,
      cep: cadastroCliente.cepCli,
      logradouro: cadastroCliente.logradouroCli,
      numero: cadastroCliente.numeroCli,
      complemento: cadastroCliente.complementoCli,
      bairro: cadastroCliente.bairroCli,
      cidade: cadastroCliente.cidadeCli,
      uf: cadastroCliente.ufCli

    })
    //Salvar a nota no banco de dados (Passo 3:fluxo)
    await newCliente.save()
    // confirmação de cliente adicionado ao banco (uso do dialog)
    dialog.showMessageBox({
      // montagem da caixa de mensagem
      type: 'info',
      title: "Aviso",
      message: "Cliente adicionado com sucesso!",
      buttons: ['OK']
    }).then((result) => {
      // se o botão OK for pressionado
      if (result.response === 0) {
        // enviar um pedido para o renderizador limpar os campos (preload.js)
        event.reply('reset-form')
      }
    })

  } catch (error) {
    if (error.code === 11000) {
      dialog.showMessageBox({
        type: 'error',
        title: "Atenção!",
        message: "CPF já cadastrado! \nVerifique o número digitado.",
        buttons: ['OK']

      }).then((result) => {
        // Se o botão OK for pressionado
        if (result.response === 0) {
          // Limpar o CPF após o preenchimento de CPF duplicado
          event.reply('reset-cpf')
        }
      })
    } else {
      console.log(error)
    }

  }
})
// ========================== FIM - CRUD CREATE ===========================

// ========================== RELATÓRIO DE CLIENTES ===========================
async function relatorioClientes() {
  try {
    // ===================================
    //    Configuração do documento pdf
    // ===================================
    const doc = new jsPDF('p', 'mm', 'a4') // p (portrait) l (landscape)
    // a4 (210 mm x 297 mm)

    // Inserir data atual no documento
    const dataAtual = new Date().toLocaleDateString('pt-BR')
    // doc.setFontSize() altera o tamanho da fonte em ponto(= word)
    doc.setFontSize(10)
    // doc.text() escreve um texto no documento 
    doc.text(`Data: ${dataAtual}`, 170, 15) // (x,y (mm))
    doc.setFontSize(18)
    doc.text("Relatório de clientes", 15, 30)
    doc.setFontSize(12)
    let y = 40
    // CABEÇALHO DA TABELA //
    doc.text("Nome", 14, y)
    doc.text("Telefone", 85, y)
    doc.text("E-mail", 130, y)
    y += 5
    // Desenhar uma linha 
    doc.setLineWidth(0.5)
    doc.line(10, y, 200, y) // (10 (inicio)_______ 200 (fim))
    y += 10


    // ===================================================
    //   Obter a listagem de clientes (ordem alfabética) 
    // ===================================================

    const clientes = await clienteModel.find().sort({ nome: 1 })
    // Teste de recebimento (IMPORTANTE!)
    // console.log(clientes) 
    // popular o documento PDF com os clientes cadastrados
    clientes.forEach((c) => {
      if (y > 280) {
        doc.addPage()
        y = 20 // Margem de 20 mm (é o mesmo que 2cm) para iniciar a nova folha
        // CABEÇALHO DA TABELA //
        doc.text("Nome", 14, y)
        doc.text("Telefone", 85, y)
        doc.text("E-mail", 130, y)
        y += 5
        // Desenhar uma linha 
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y) // (10 (inicio)_______ 200 (fim))
        y += 10
      }
      doc.text(c.nome, 14, y)
      doc.text(c.fone, 85, y)
      doc.text(c.email, 130, y)
      y += 15
    })


    // ================================================
    //   Numeração automática de páginas
    // ================================================

    const pages = doc.internal.getNumberOfPages()
    for (let i=1; i<=pages; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Página ${1}`, 105, 290, {align: 'center'})
    }


    // ================================================
    //   Abrir o arquivo PDF no sistema operacional 
    // ================================================

    // Definir o caminho do arquivo temporário e nome do arquivo com extensão .pdf (IMPORTANTE!)
    const tempDir = app.getPath('temp')
    const filePath = path.join(tempDir, 'clientes.pdf')
    // salvar temporariamente o arquivo
    doc.save(filePath)
    // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
    shell.openPath(filePath)
  } catch (error) {
    console.log(error)
  }
}

