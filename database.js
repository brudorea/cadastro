/**
 * Módulo de conexão com o banco de dados
 * Uso do framework mongoose
 */

// importação do mongoose

const mongoose = require('mongoose')

// configuração do banco de dados 
// ip/linkd do servidor, autenticação, 
// ao final da url o nome do banco de dados
// exemplo: /dbnotes
const url = 'mongodb+srv://admin:123Senac@cluster0.i6pgk.mongodb.net/dbcadastro'

// validação (evitar a abertura de varias  conexões)
let conectado = false

// método o para conectar com o banco de dados
const conectar = async () => {
    if (!conectado) {
        // conectar com o banco de dados
        try {
            await mongoose.connect(url)
            conectado = true // setar a variavel 
            console.log('MongoDB Conectado')
            
        } catch (error) {
            console.error(error)
            
        }

    }

}

// método o para desconectar com o banco de dados
const desconectar = async () => {
    if (conectado) {
        // desconectado
        try {
            await mongoose.disconnect(url)
            conectado = false // setar a variavel 
            console.log('MongoDB Desconectado')
            
        } catch (error) {
            console.error(error)
            
        }


    }
}
// exportar para o main os métodos conectar e desconectar
module.exports = {conectar, desconectar}