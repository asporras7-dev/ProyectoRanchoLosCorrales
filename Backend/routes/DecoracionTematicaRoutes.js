const express = require("express");
const router = express.Router();
const { getDecoracionesTematicas, getDecoracionTematicaById, createDecoracionTematica, updateDecoracionTematica, deleteDecoracionTematica } = require("../controllers/DecoracionTematicaController");

router.get("/", getDecoracionesTematicas);
router.get("/:id", getDecoracionTematicaById);
router.post("/", createDecoracionTematica);
router.put("/:id", updateDecoracionTematica);
router.delete("/:id", deleteDecoracionTematica);

module.exports = router;
