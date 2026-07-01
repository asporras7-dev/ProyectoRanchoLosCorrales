const Menu = require("../models/Menu");

// Obtener todos los menús
const getMenus = async (req, res) => {
    try {
        const menus = await Menu.findAll();
        res.json(menus);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los menús", error: error.message });
    }
};

// Obtener un menú por ID
const getMenuById = async (req, res) => {
    try {
        const menu = await Menu.findByPk(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: "Menú no encontrado" });
        }
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el menú", error: error.message });
    }
};

// Crear un menú
const createMenu = async (req, res) => {
    try {
        const menu = await Menu.create(req.body);
        res.status(201).json(menu);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el menú", error: error.message });
    }
};

// Actualizar un menú
const updateMenu = async (req, res) => {
    try {
        const menu = await Menu.findByPk(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: "Menú no encontrado" });
        }
        await menu.update(req.body);
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el menú", error: error.message });
    }
};

// PATCH - Actualizar parcialmente un menú
const patchMenu = async (req, res) => {
    try {
        const menu = await Menu.findByPk(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: "Menú no encontrado" });
        }
        await menu.update(req.body);
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar parcialmente el menú", error: error.message });
    }
};

// Eliminar un menú
const deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findByPk(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: "Menú no encontrado" });
        }
        await menu.destroy();
        res.json({ message: "Menú eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el menú", error: error.message });
    }
};

module.exports = { getMenus, getMenuById, createMenu, updateMenu, deleteMenu, patchMenu};
