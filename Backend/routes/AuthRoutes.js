const express = require("express");
const router = express.Router();
const { login, me } = require("../controllers/AuthController");
const { authMiddleware } = require("../middlewares/AuthMiddleware");

router.post("/login", login);
router.get("/me", authMiddleware, me);
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { Op } = require("sequelize");
const transporter = require("../mailer");
require("dotenv").config();

// ─────────────────────────────────────────
// POST /api/auth/forgot-password
// ─────────────────────────────────────────
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Verificar que el correo exista en la BD
    const usuario = await Usuario.findOne({ where: { correo: email } });
    if (!usuario) {
      return res.status(404).json({ msg: "Correo no encontrado" });
    }

    // 2. Generar token único
    const token = crypto.randomBytes(32).toString("hex");
    const expira = new Date(Date.now() + 60 * 60 * 1000); // expira en 1 hora

    // 3. Guardar token en la BD
    await usuario.update({
      reset_token: token,
      reset_token_expira: expira
    });

    // 4. Construir link
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // 5. Enviar correo
    await transporter.sendMail({
      from: `"Rancho Los Corrales" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Restablecer contraseña",
      html: `
        <div style="font-family:sans-serif; max-width:480px; margin:auto;">
          <h2 style="color:#8B4513;">Rancho Los Corrales</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el botón para continuar:</p>
          <a href="${link}"
             style="display:inline-block; padding:12px 24px; background:#8B4513;
                    color:white; border-radius:6px; text-decoration:none; font-weight:bold;">
            Cambiar contraseña
          </a>
          <p style="margin-top:20px; color:#999; font-size:13px;">
            Este enlace expira en <strong>1 hora</strong>.<br/>
            Si no solicitaste esto, ignora este correo.
          </p>
        </div>
      `
    });

    res.json({ msg: "Correo enviado. Revisa tu bandeja de entrada." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al enviar el correo" });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/reset-password
// ─────────────────────────────────────────
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // 1. Buscar token válido y no expirado
    const usuario = await Usuario.findOne({
      where: {
        reset_token: token,
        reset_token_expira: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!usuario) {
      return res.status(400).json({ msg: "Token inválido o expirado" });
    }

    // 2. Hashear nueva contraseña
    const hash = await bcrypt.hash(newPassword, 10);

    // 3. Actualizar contraseña y limpiar token
    await usuario.update({
      contrasenia: hash,
      reset_token: null,
      reset_token_expira: null
    });

    res.json({ msg: "Contraseña actualizada correctamente" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar la contraseña" });
  }
});

module.exports = router;
