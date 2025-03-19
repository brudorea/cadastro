/**
 * Módulo de conexão com banco de dados
 * Uso do framework mongoose
 */

// Importação do mongoose
// NÃO ESQUECER DE INSTALAR O MÓDULO (npm i mongoose)
const mongoose = require('mongoose')

// Configuração do banco de dados
// ip/link do servidor, autenticação, nome do banco
// ao final da url definir o nome do banco de dados
// exemplo: /dbclientes
const url = 'mongodb+srv://admin:123Senac@cluster0.i6pgk.mongodb.net/dbnotes'

// Validação (evitar a abertura de várias conexões)
let conectado = false

// Método para conectar com o banco de dados 
const conectar = async () => {
    if (!conectado) {
        // Conectado com o banco de dados
        try {
            await mongoose.connect(url) // Conectar
            conectado = true //setar a variável
            console.log('MongoDB Conectado')            
        } catch (error) {
            console.log(error)    
        }
    }
}

// Método para desconectar do banco de dados
const desconectar = async () => {
    // se estiver conectado
    if (conectado) {
        // desconectar do banco de dados
        try {
            await mongoose.disconnect(url) // Desconectar
            conectado = false //setar a variável
            console.log('MongoDB Desconectado')
            
        } catch (error) {
            console.log(error)    
        }
        
    }
}

// Exportar para o main os métodos conectar e desconectar
module.exports = {conectar, desconectar}