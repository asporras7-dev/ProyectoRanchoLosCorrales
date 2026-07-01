const express = require("express");
const router = express.Router();
const { getServicioAdicionalReservas, createServicioAdicionalReserva, deleteServicioAdicionalReserva } = require("../controllers/ServicioAdicionalReservaController");

router.get("/", getServicioAdicionalReservas);
router.post("/", createServicioAdicionalReserva);
router.delete("/:servicio_Adicional_idservicio_Adicional/:Reserva_idReserva", deleteServicioAdicionalReserva);

module.exports = router;
