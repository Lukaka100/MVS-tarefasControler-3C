var express = require("express");
var router = express.Router();

const moment = require("moment");
moment.locale("pt-br");

const { body, validationResult } = require("express-validator");
const { tarefasController } = require("../controllers/tarefasController");
const { tarefasModel } = require("../models/tarefasModel");

router.get("/", (req, res) => {
    tarefasController.listarTarefas(req, res);
});

router.get("/cadastro", (req, res) => {
    tarefasController.exibirCadastro(req, res);
});

router.get("/alterar", async (req, res) => {
    tarefasController.alterarCadastro(req, res);
});

router.get("/excluir", async (req, res) => {
    tarefasController.excluirTarefa(req, res);
});

router.post("/cadastro", tarefasController.validarFormCad, async (req, res) => {
    tarefasController.fazerCadastro(req, res);
});

router.get("/teste-insert", async (req, res) => {
    const dadosInsert = {
        nome: "instalar o fortnite no Lab 1 Terreo",
        prazo: "2026-03-19"
    };
    try {
        const resultInsert = await tarefasModel.create(dadosInsert);
        res.send(resultInsert);
    } catch (err) {
        console.error(err);
    }
});

router.get("/teste-delete", async (req, res) => {
    let idTarefa = 17;
    try {
        const resultDelete = await tarefasModel.deleteFisico(idTarefa);
        res.send(resultDelete);
    } catch (err) {
        console.error(err);
    }
});

router.get("/teste-soft-delete", async (req, res) => {
    let idTarefa = 15;
    try {
        const resultUpdate = await tarefasModel.deleteLogico(idTarefa);
        res.send(resultUpdate);
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
