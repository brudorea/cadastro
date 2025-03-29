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

// processo de cadastro do cliente //

const foco = document.getElementById('buscarCliente')

document.addEventListener('DOMContentLoaded', () => {
    foco.focus()// iniciar documento com foca na caixa de texto
    btnUpdate.disabled = true
    btnDelete.disabled = true
})


// ============== Captura de dados ============== //
let frmCli = document.getElementById('frmCli')
let nome = document.getElementById('nome')
let tel = document.getElementById('tel')
let email = document.getElementById('email')
let cep = document.getElementById('cep')
let cidade = document.getElementById('cidade')
let uf = document.getElementById('uf')
let logradouro = document.getElementById('logradouro')
let numero = document.getElementById('numero')
let bairro = document.getElementById('bairro')
let cpf = document.getElementById('cpf')
let complemento = document.getElementById('complemento')

//= CRUD CREATE ===============================================//

frmCli.addEventListener('submit', async (event) => {
    // evitar comportamento padrão de recarregar a página
    event.preventDefault()

    console.log(
        nome.value, 
        tel.value,
        email.value,
        cep.value,
        cidade.value,
        uf.value,
        logradouro.value,
        numero.value,
        bairro.value,
        cpf.value,
        complemento.value
        
    )

    const cadastroCliente = {
        nomeCli: nome.value,
        telCli: tel.value,
        emailCli: email.value,
        cepCli: cep.value,
        cidadeCli: cidade.value,
        ufCli: uf.value,
        logradouroCli: logradouro.value,
        bairroCli: bairro.value,
        numeroCli: numero.value,
        cpfCli: cpf.value,
        complementoCli: complemento.value
    }

    console.log("Enviando para o banco: ", cadastroCliente) //Teste 
    api.createCliente(cadastroCliente)

})
  // ================= FIM CRUD Create ====================

  // ================== Resetar o formulário ===================  
  function resetForm() {
    // recarregar a página
    location.reload()
  }

  // Uso da API resetForm quando salvar, editor ou excluir um cliente
  api.resetForm((args) => { 
    resetForm()
  })

  // =============== FIM - Resetar o formulário ================

