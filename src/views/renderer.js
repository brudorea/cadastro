/**
 * Processo de renderização do documento index.html
 */

console.log("Processo de renderização")

// inserção da data no rodapé
function obterData() {
    const data = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return data.toLocaleDateString('pt-BR', options)
}

document.getElementById('dataAtual').innerHTML = obterData()

api.dbStatus((event, message) => {
    console.log(message)
    if (message === "conectado") {
        document.getElementById('iconeDB').src = "../public/img/dbon.png"
    } else {
        document.getElementById('iconeDB').src = "../public/img/dboff.png"    
    }
})

// ============================================================================================================
// ==================== CRUD Create =====================

//Recebe o objeto com os dados
ipcMain.on('create-cliente', async (event, cadastroCliente) => {
    console.log(newCliente)
  
    const newClientes = clienteModel({ // nomeCampo: newCliente.caompoRenderer,
      nomeCliente: newCliente.nomeCli,
      telCliente: newCliente.telCli,
      email: newCliente.emailCli,
      senha: newCliente.senhaCli,
      cep: newCliente.cepCli,
      cidade: newCliente.cidadeCli,
      uf: newCliente.ufCli,
      logradouro: newCliente.logradouroCli,
      bairro: newCliente.bairroCli,
      cpf: newCliente.cpfCli,
      complemento: newCliente.complementoCli,
    })
  
    // Salvar no MongoDB
    cadastroCliente.save()
  })
  
  
  // ================= FIM CRUD Create ====================

// processo de cadastro do cliente //

console.log("teste")

const foco = document.getElementById('inputNome')

document.addEventListener('DOMContentLoaded', () => {
    foco.focus()// iniciar documento com foca na caixa de texto
})


// ============== Captura de dados ============== //
let formCli = document.getElementById('formCli')
let nome = document.getElementById('inputNome')
let tel = document.getElementById('inputTel')
let email = document.getElementById('inputEmail4')
let senha = document.getElementById('inputPassword4')
let cep = document.getElementById('cep')
let cidade = document.getElementById('cidade')
let uf = document.getElementById('uf')
let logradouro = document.getElementById('logradouro')
let bairro = document.getElementById('bairro')
let cpf = document.getElementById('cpf')
let complemento = document.getElementById('inputCompl')

//= CRUD CREATE ===============================================//

formCli.addEventListener('submit', async (event) => {
    // evitar comportamento padrão de recarregar a página
    event.preventDefault()

    console.log(
        nome.value, 
        tel.value,
        email.value,
        senha.value,
        cep.value,
        cidade.value,
        uf.value,
        logradouro.value,
        bairro.value,
        cpf.value
    )

    const newCliente = {
        nomeCli: nome.value,
        telCli: tel.value,
        emailCli: email.value,
        senhaCli: senha.value,
        cepCli: cep.value,
        cidadeCli: cidade.value,
        ufCli: uf.value,
        logradouroCli: logradouro.value,
        bairroCli: bairro.value,
        cpfCli: cpf.value,
        complementoCli: complemento.value
    }

    api.addCliente(newCliente)

})
  // ================= FIM CRUD Create ====================

