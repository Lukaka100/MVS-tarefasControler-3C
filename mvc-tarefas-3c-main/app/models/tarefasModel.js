const pool = require("../../config/pool_conexoes");

const tarefasModel = {

    findAll: async (inicio = null, limite = null) => {
        try {
            let rows;
            if (inicio !== null && limite !== null) {
                [rows] = await pool.query(
                    "SELECT * FROM tarefas WHERE status_tarefa = 1 LIMIT ?, ?",
                    [inicio, limite]
                );
            } else {
                [rows] = await pool.query(
                    "SELECT * FROM tarefas WHERE status_tarefa = 1"
                );
            }
            return rows;
        } catch (err) {
            return err;
        }
    },

    findById: async (id) => {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM tarefas WHERE status_tarefa = 1 AND id_tarefa = ?",
                [id]
            );
            return rows;
        } catch (err) {
            return err;
        }
    },

    create: async (dados) => {
        try {
            const [resultado] = await pool.query(
                "INSERT INTO tarefas (nome_tarefa, prazo_tarefa, situacao_tarefa) VALUES (?, ?, ?)",
                [dados.nome, dados.prazo, dados.situacao]
            );
            return resultado;
        } catch (err) {
            return err;
        }
    },

    update: async (dados) => {
        try {
            const [resultado] = await pool.query(
                "UPDATE tarefas SET nome_tarefa = ?, prazo_tarefa = ?, situacao_tarefa = ? WHERE id_tarefa = ?",
                [dados.nome, dados.prazo, dados.situacao, dados.id]
            );
            return resultado;
        } catch (err) {
            return err;
        }
    },

    deleteLogico: async (id) => {
        try {
            const [resultado] = await pool.query(
                "UPDATE tarefas SET status_tarefa = 0 WHERE id_tarefa = ?",
                [id]
            );
            return resultado;
        } catch (err) {
            return err;
        }
    },

    deleteFisico: async (id) => {
        try {
            const [resultado] = await pool.query(
                "DELETE FROM tarefas WHERE id_tarefa = ?",
                [id]
            );
            return resultado;
        } catch (err) {
            return err;
        }
    },

    totRegistros: async () => {
        try {
            const [rows] = await pool.query(
                "SELECT COUNT(*) AS total FROM tarefas WHERE status_tarefa = 1"
            );
            return rows[0].total;
        } catch (err) {
            return err;
        }
    }
};

module.exports = { tarefasModel };
