const pool = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaJwt = require("../senhaJwt");



async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;
    try {
      const senhaCriptografada = await bcrypt.hash(senha, 10);
      console.log(nome, email, senha, senha);
  
      
      const usuario = await pool.query(
        "insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *",
        [nome, email, senhaCriptografada]
      );
  
      return res.status(201).json(usuario.rows);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }


  async function loginDoUsuario(req, res) {
    const { email, senha } = req.body;
  
    try {
      const usuario = await pool.query(
        "select * from usuarios where email = $1",
        [email]
      );
  
      if (usuario.rowCount < 1) {
        return res.status(404).json({ mensagem: "Email ou senha invalida" });
      }
  
      const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);
  
      if (!senhaValida) {
        return res.status(400).json({ mensagem: "Email ou senha invalida" });
      }
  
      const token = jwt.sign({ id: usuario.rows[0].id }, senhaJwt, {
        expiresIn: "8h"
      });
  
      const { senha: _, ...usuarioLogado } = usuario.rows[0];
  
      return res.json({ usuario: usuarioLogado, token });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }
  

  async function detalharPerfil(req, res){
    const usuarioAtual = req.usuario;

    try {
        return res.status(201).json(usuarioAtual);
      } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
      }
  }

  async function atualizarUsuario(req, res){
    const usuarioAtual = req.usuario;
    const { nome, email, senha } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    try {
      const usuario = await pool.query(
        "update usuarios set nome = $1, email = $2, senha = $3 where id = $4 returning *",
        [nome, email, senhaCriptografada, usuarioAtual.id]
      );
  
      return res.status(201).json(usuario.rows[0]);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }


  module.exports = {
    cadastrarUsuario,
    loginDoUsuario,
    atualizarUsuario,
    detalharPerfil
  };
