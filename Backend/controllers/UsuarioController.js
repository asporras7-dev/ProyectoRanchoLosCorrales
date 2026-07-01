const Usuario = require("../models/Usuario");
const Rol = require("../models/Rol");
const bcrypt = require("bcryptjs");

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            include: [{ model: Rol }]
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios", error: error.message });
    }
};

// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            include: [{ model: Rol }]
        });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
    }
};

// Crear un usuario
const createUsuario = async (req, res) => {
    try {

        const { correo, contrasenia, Rol_idRol } = req.body;

        if (!correo || !contrasenia || !Rol_idRol) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const existeUsuario = await Usuario.findOne({ where: { correo } });

        if (existeUsuario) {
            return res.status(400).json({ message: "El correo ya existe" });
        }

        if (req.body.contrasenia) {
            req.body.contrasenia = bcrypt.hashSync(req.body.contrasenia, 10);
        }

        const usuario = await Usuario.create(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el usuario", error: error.message });
    }
};

// Actualizar un usuario
const updateUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        if (req.body.contrasenia) {
            req.body.contrasenia = bcrypt.hashSync(req.body.contrasenia, 10);
        }
        await usuario.update(req.body);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
    }
};

const patchUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        if (req.body.contrasenia) {
            req.body.contrasenia = bcrypt.hashSync(req.body.contrasenia, 10);
        }
        await usuario.update(req.body);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar parcialmente el usuario", error: error.message });
    }
};

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        await usuario.destroy();
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
    }
};

module.exports = { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario, patchUsuario };
