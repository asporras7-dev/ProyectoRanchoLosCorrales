const express = require("express");
const router = express.Router();
const { getFechasBloqueadas, bloquearFecha, desbloquearFecha } = require("../controllers/FechasBloqueadasController");
const { authMiddleware, verifyRole } = require("../middlewares/AuthMiddleware");

router.get("/", getFechasBloqueadas);
router.post("/", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), bloquearFecha);
router.delete("/fecha/:fecha", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), desbloquearFecha);

module.exports = router;
