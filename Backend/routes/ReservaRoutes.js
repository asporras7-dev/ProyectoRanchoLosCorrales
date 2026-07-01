const express = require("express");
const router = express.Router();
const { getReservas, getReservaById, createReserva, updateReserva, deleteReserva, patchReserva } = require("../controllers/ReservaController");
const { authMiddleware, verifyRole } = require("../middlewares/AuthMiddleware");

// Rutas protegidas para el panel (solo administradores pueden ver todas, actualizar estado o eliminar)
router.get("/", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), getReservas);
router.get("/:id", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), getReservaById);
// Permitir a usuarios/clientes crear reservas (podría ser público o requerir solo auth)
router.post("/", createReserva);
router.put("/:id", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), updateReserva);
router.patch("/:id", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), patchReserva);
router.delete("/:id", authMiddleware, verifyRole(['Administrador', 'Admin', 'Moderador']), deleteReserva);

module.exports = router;
