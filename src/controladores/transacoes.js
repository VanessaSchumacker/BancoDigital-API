const pool = require("../conexao");


async function listarTransacoes(req, res) {
    try {
        const { rows: transacoes } = await pool.query(
            `select * from transacoes where usuario_id = $1`,
            [req.usuario.id]
        );

        return res.json(transacoes);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}


async function mostrarTransacao(req, res) {
    const { id } = req.params

    try {
        const { rows, rowCount } = await pool.query(
            `select * from transacoes where id = $1 and usuario_id = $2`,
            [id, req.usuario.id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada' })
        }

        const transacoes = rows[0]

        return res.json(transacoes);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}


async function cadastrarTransacao(req, res) {
    const { tipo, descricao, valor, data, categoria_id } = req.body;
    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
    }

    if (tipo !== 'entrada' && tipo !== 'saída') {
        return res.status(400).json({ mensagem: "Tipo inválido." })
    }

    try {
        const categoria = await pool.query(
            `select * from categoria where id = $1 `,
            [categoria_id]);

        if (!categoria) {
            return res.status(404).json({ mensagem: 'Categoria inválida.' })
        }

        const query =
            `insert into transacoes (usuario_id, descricao, valor, data, categoria_id, tipo ) values ($1, $2, $3, $4, $5, $6) returning *`

        const params = [req.usuario.id, descricao, valor, data, categoria_id, tipo]

        const { rows } = await pool.query(query, params)

        return res.status(201).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

async function atualizarTransacao(req, res) {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const { id } = req.params;

    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
    }

    if (tipo !== 'entrada' && tipo !== 'saída') {
        return res.status(400).json({ mensagem: "Tipo inválido." })
    }

    try {
        const categoria = await pool.query(
            `select * from categoria where id = $1 `,
            [categoria_id]);

        if (!categoria) {
            return res.status(404).json({ mensagem: 'Categoria inválida.' })
        }

        const transacao = await pool.query(
            `select * from transacoes where id = $1 and usuario_id = $2`,
            [id, req.usuario.id]);

        if (!transacao) {
            return res.status(404).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' })
        }

        const queryAtualizarTransacao = `update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6`

        await pool.query(queryAtualizarTransacao, [descricao, valor, data, categoria_id, tipo, id])

        return res.status(201).send()
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

async function deletarTransacao(req, res) {
    const { id } = req.params;

    try {
        const { rows, rowCount } = await pool.query(
            `select * from transacoes where id = $1 and usuario_id = $2 `,
            [id, req.usuario.id]
        );

        if (rowCount == 0) {
            return res.status(404).json({ mensagem: 'Transação inexistente.' })
        }

        await pool.query(
            `delete  from transacoes where id = $1 `,
            [id]
        );

        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

async function obterExtrato(req, res) {
    const usuario = req.usuario.id;

    try {
        const { rows: entrada } = await pool.query(
            "select * from transacoes where usuario_id = $1 and tipo = $2",
            [usuario, 'entrada']
        );

        const totalEntrada = entrada.map(transacao => transacao.valor).reduce((acumulador, elementoAtual) => {
            return acumulador + elementoAtual
        }, 0)

        const { rows: saida } = await pool.query(
            "select * from transacoes where usuario_id = $1 and tipo = $2",
            [usuario, 'saída']
        );

        const totalSaida = saida.map(transacao => transacao.valor).reduce((acumulador, elementoAtual) => {
            return acumulador + elementoAtual
        }, 0)


        return res.json({ 'entrada': totalEntrada, 'saída': totalSaida });
    } catch (error) {

        return res.status(500).json({ mensagem: "Erro interno do servidor" });

    }
};

module.exports = {
    listarTransacoes,
    mostrarTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
    obterExtrato
};