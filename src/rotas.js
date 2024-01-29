const express = require('express');
const verificarUsuarioLogado = require("./intermediarios/autenticacao");
const rotas = express();
const usuarios = require('./controladores/usuarios');
const transacoes = require('./controladores/transacoes');
const categorias = require('./controladores/categorias');

/* CATEGORIA */
rotas.get('/categorias', categorias.listarCategorias);
// OBS: Fazer uma rota para filtrar transações por categoria!

/* USUARIOS */
rotas.post('/usuarios/cadastrar', usuarios.cadastrarUsuario);
rotas.post('/login', usuarios.loginDoUsuario);
rotas.use(verificarUsuarioLogado);
rotas.get('/usuario/perfil', usuarios.detalharPerfil);
rotas.put('/usuario/atualizarUsuario', usuarios.atualizarUsuario);

/* TRANSACOES */
rotas.get('/transacao', transacoes.listarTransacoes);
rotas.get('/transacao/extrato', transacoes.obterExtrato);
rotas.get('/transacao/:id', transacoes.mostrarTransacao);
rotas.post('/transacao', transacoes.cadastrarTransacao);
rotas.put('/transacao/:id', transacoes.atualizarTransacao);
rotas.delete('/transacao/:id', transacoes.deletarTransacao);





module.exports = rotas;