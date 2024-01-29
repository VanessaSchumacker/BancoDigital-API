const pool = require("../conexao");

async function listarCategorias (req, res){

    try {
        const categoria = await pool.query(
          "select * from categoria"
        );
    
        return res.json(categoria.rows);
      } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
      }

};


module.exports = {
    listarCategorias
};