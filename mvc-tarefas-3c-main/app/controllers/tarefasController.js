const { tarefasModel } = require("../models/tarefasModel");
const { body, validationResult } = require("express-validator");
const moment = require("moment");

moment.locale("pt-br");

const REGISTROS_POR_PAGINA = 5;

// Objeto auxiliar para criar o objeto 'tarefa' padrão das views
const criarObjetoTarefa = (id = 0, nome = "", prazo = "", situacao = 1) => ({
    id_tarefa: id,
    nome_tarefa: nome,
    prazo_tarefa: prazo,
    situacao_tarefa: situacao
});

const tarefasController = {

    validarFormCad: [
        body("tarefa")
            .isLength({ min: 5, max: 45 })
            .withMessage("O nome da tarefa deve conter entre 5 e 45 caracteres."),

        body("situacao")
            .isInt({ min: 0, max: 4 })
            .withMessage("A situação deve ser um valor inteiro entre 0 e 4."),

        body("prazo")
            .isISO8601()
            .withMessage("Informe uma data válida."),

        body("prazo").custom((valor) => {
            const hoje = moment();
            const dataPrazo = moment(valor);

            if (dataPrazo.isSameOrAfter(hoje, "day")) {
                return true;
            }
            throw new Error("O prazo deve ser hoje ou uma data futura.");
        })
    ],

    listarTarefas: async (req, res) => {
        res.locals.moment = moment;

        const paginaAtual = parseInt(req.query.pagina) || 1;
        const offset = (paginaAtual - 1) * REGISTROS_POR_PAGINA;

        try {
            const totalRegistros = await tarefasModel.totRegistros();
            const totalPaginas = Math.ceil(totalRegistros / REGISTROS_POR_PAGINA);
            
            const paginador = totalPaginas > 1 
                ? { paginaAtual, totalPaginas } 
                : null;

            const tarefas = await tarefasModel.findAll(offset, REGISTROS_POR_PAGINA);

            res.render("pages/index", {
                linhasTabela: tarefas,
                notificador: paginador
            });
        } catch (err) {
            console.error(err);
        }
    },

    exibirCadastro: (req, res) => {
        res.locals.moment = moment;

        res.render("pages/cadastro", {
            listaErros: null,
            tituloAba: "Cadastro de tarefa",
            tituloPagina: "Nova Tarefa",
            tarefa: criarObjetoTarefa()
        });
    },

    alterarCadastro: async (req, res) => {
        res.locals.moment = moment;
        const { id } = req.query;

        try {
            const resultado = await tarefasModel.findById(id);

            res.render("pages/cadastro", {
                listaErros: null,
                tituloAba: "Edição de tarefa",
                tituloPagina: "Alterar Tarefa",
                tarefa: resultado[0]
            });
        } catch (err) {
            console.error(err);
        }
    },

    fazerCadastro: async (req, res) => {
        res.locals.moment = moment;
        const erros = validationResult(req);

        // Se houver erros na validação
        if (!erros.isEmpty()) {
            const { id, tarefa, prazo, situacao } = req.body;
            const ehNova = id == 0;

            return res.render("pages/cadastro", {
                listaErros: erros,
                tituloAba: ehNova ? "Cadastro de tarefa" : "Edição de tarefa",
                tituloPagina: ehNova ? "Nova Tarefa" : "Alterar Tarefa",
                tarefa: criarObjetoTarefa(id, tarefa, prazo, situacao)
            });
        }

        // Se passar na validação
        const dados = {
            id: req.body.id,
            nome: req.body.tarefa,
            prazo: req.body.prazo,
            situacao: req.body.situacao
        };

        try {
            if (dados.id == 0) {
                await tarefasModel.create(dados);
            } else {
                await tarefasModel.update(dados);
            }
            res.redirect("/");
        } catch (err) {
            console.error(err);
        }
    },

    excluirTarefa: async (req, res) => {
        const { id } = req.query;

        if (!id) {
            return res.redirect("/?msg=ID+invalido");
        }

        try {
            await tarefasModel.deleteLogico(id);
            res.redirect("/?msg=Tarefa+removida+com+sucesso");
        } catch (err) {
            console.error(err);
            res.redirect("/?msg=Nao+foi+possivel+excluir+a+tarefa");
        }
    }
};


module.exports = { tarefasController };