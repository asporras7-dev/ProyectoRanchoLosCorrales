const express = require("express");
const router = express.Router();
const { getReservasADomicilio, getReservaADomicilioById, createReservaADomicilio, updateReservaADomicilio, deleteReservaADomicilio, patchReservaADomicilio } = require("../controllers/ReservaADomicilioController");
const { authMiddleware, verifyRole } = require("../middlewares/AuthMiddleware");

router.get("/", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), getReservasADomicilio);
router.get("/:id", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), getReservaADomicilioById);
router.post("/", createReservaADomicilio);
router.put("/:id", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), updateReservaADomicilio);
router.patch("/:id", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), patchReservaADomicilio);
router.delete("/:id", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), deleteReservaADomicilio);

module.exports = router;
