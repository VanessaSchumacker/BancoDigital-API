const express = require('express');
const rotas = require('./rotas');
const pool = require('./conexao');

const servidor = express();

servidor.use(express.json());
servidor.use(rotas);

servidor.listen(3001, () => {
    
    console.log('Servidor inicializado');
});
