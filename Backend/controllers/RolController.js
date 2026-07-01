const Rol = require("../models/Rol");

// Obtener todos los roles
const getRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los roles", error: error.message });
    }
};

// Obtener un rol por ID
const getRolById = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);
        if (!rol) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }
        res.json(rol);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el rol", error: error.message });
    }
};

// Crear un rol
const createRol = async (req, res) => {
    try {
        const rol = await Rol.create(req.body);
        res.status(201).json(rol);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el rol", error: error.message });
    }
};

// Actualizar un rol
const updateRol = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);
        if (!rol) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }
        await rol.update(req.body);
        res.json(rol);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el rol", error: error.message });
    }
};

// PATCH - Actualizar parcialmente un rol
const patchRol = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);
        if (!rol) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }
        await rol.update(req.body);
        res.json(rol);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar parcialmente el rol", error: error.message });
    }
};

// Eliminar un rol
const deleteRol = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);
        if (!rol) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }
        await rol.destroy();
        res.json({ message: "Rol eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el rol", error: error.message });
    }
};

module.exports = { getRoles, getRolById, createRol, updateRol, deleteRol, patchRol };
