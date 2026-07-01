const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const Rol = require("../models/Rol");
const config = require("../config/config");

const login = async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;

        if (!correo || !contrasenia) {
            return res.status(400).json({ message: "Por favor, ingrese correo y contraseña." });
        }

        // Buscar al usuario por correo e incluir el rol
        const usuario = await Usuario.findOne({
            where: { correo: correo },
            include: [{ model: Rol }]
        });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Validar contraseña
        const isPasswordValid = bcrypt.compareSync(contrasenia, usuario.contrasenia);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        // Crear payload del JWT
        const payload = {
            idUsuario: usuario.idUsuario,
            correo: usuario.correo,
            rolId: usuario.Rol_idRol,
            rolNombre: usuario.Rol ? usuario.Rol.nombre_Rol : null
        };

        // Firmar JWT
        const token = jwt.sign(payload, config.jwtSecret, {
            expiresIn: process.env.JWT_EXPIRES_IN || "24h"
        });

        // Configurar opciones de cookies
        const cookieOptions = {
            httpOnly: true,
            secure: true, // Requerido para sameSite: 'none'
            sameSite: 'none', 
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        };

        // Enviar el token en una cookie
        res.cookie('token', token, cookieOptions);

        res.json({
            message: "Autenticación exitosa",
            token,
            usuario: payload
        });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor al intentar iniciar sesión.", error: error.message });
    }
};

const me = async (req, res) => {
    try {
        // El usuario ya fue validado en el middleware, por lo que req.usuario está disponible
        res.json({
            message: "Autenticado correctamente",
            usuario: req.usuario
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la información del usuario.", error: error.message });
    }
};

module.exports = { login, me };
