const express = require("express");
const router = express.Router();
const { getServiciosAdicionales, getServicioAdicionalById, createServicioAdicional, updateServicioAdicional, deleteServicioAdicional } = require("../controllers/ServicioAdicionalController");

router.get("/", getServiciosAdicionales);
router.get("/:id", getServicioAdicionalById);
router.post("/", createServicioAdicional);
router.put("/:id", updateServicioAdicional);
router.delete("/:id", deleteServicioAdicional);

module.exports = router;
