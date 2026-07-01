const express = require("express");
const router = express.Router();
const { getFechasBloqueadasADomicilio, bloquearFechaADomicilio, desbloquearFechaADomicilio } = require("../controllers/FechasBloqueadasADomicilioController");
const { authMiddleware, verifyRole } = require("../middlewares/AuthMiddleware");

router.get("/", getFechasBloqueadasADomicilio);
router.post("/", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), bloquearFechaADomicilio);
router.delete("/fecha/:fecha", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), desbloquearFechaADomicilio);

module.exports = router;
