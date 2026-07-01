const MenuADomicilio = require("../models/MenuADomicilio");

// Obtener todos los menús a domicilio
const getMenusADomicilio = async (req, res) => {
    try {
        const menus = await MenuADomicilio.findAll();
        res.json(menus);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los menús a domicilio", error: error.message });
    }
};

// Obtener un menú a domicilio por ID
const getMenuADomicilioById = async (req, res) => {
    try {
        const menu = await MenuADomicilio.findByPk(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: "Menú a domicilio no encontrado" });
        }
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el menú a domicilio", error: error.message });
    }
};

// Crear un menú a domicilio
const createMenuADomicilio = async (req, res) => {
    try {
        const menu = await MenuADomicilio.create(req.body);
        res.status(201).json(menu);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el menú a domicilio", error: error.message });
    }
};

const patchMenuADomicilio = async (req, res) => {
    try {
        const menuADomicilio = await MenuADomicilio.findByPk(req.params.id);
        if (!menuADomicilio) {
            return res.status(404).json({ message: "Menu a domicilio no encontrado" });
        }
        await menuADomicilio.update(req.body);
        res.json(menuADomicilio);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar parcialmente el menu a domicilio", error: error.message });
    }
};

// Actualizar un menú a domicilio
const updateMenuADomicilio = async (req, res) => {
    try {
        const menu = await MenuADomicilio.findByPk(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: "Menú a domicilio no encontrado" });
        }
        await menu.update(req.body);
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el menú a domicilio", error: error.message });
    }
};

// Eliminar un menú a domicilio
const deleteMenuADomicilio = async (req, res) => {
    try {
        const menu = await MenuADomicilio.findByPk(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: "Menú a domicilio no encontrado" });
        }
        await menu.destroy();
        res.json({ message: "Menú a domicilio eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el menú a domicilio", error: error.message });
    }
};

module.exports = { getMenusADomicilio, getMenuADomicilioById, createMenuADomicilio, updateMenuADomicilio, deleteMenuADomicilio, patchMenuADomicilio };
