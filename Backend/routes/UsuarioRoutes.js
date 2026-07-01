const express = require("express");
const router = express.Router();
const { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } = require("../controllers/UsuarioController");
const { authMiddleware, verifyRole } = require("../middlewares/AuthMiddleware");

// Rutas protegidas para el panel
router.get("/", authMiddleware, verifyRole(['Administrador', 'Admin']), getUsuarios);
router.get("/:id", authMiddleware, verifyRole(['Administrador', 'Admin']), getUsuarioById);
// Permitir registro público o de panel
router.post("/", authMiddleware, verifyRole(['Administrador', 'Admin']), createUsuario);
router.put("/:id", authMiddleware, verifyRole(['Administrador', 'Admin']), updateUsuario);
router.delete("/:id", authMiddleware, verifyRole(['Administrador', 'Admin']), deleteUsuario);

module.exports = router;
