const ServicioAdicional = require("../models/ServicioAdicional");
const Categoria = require("../models/Categoria");

// Obtener todos los servicios adicionales
const getServiciosAdicionales = async (req, res) => {
    try {
        const servicios = await ServicioAdicional.findAll({
            include: [{ model: Categoria }]
        });
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los servicios adicionales", error: error.message });
    }
};

// Obtener un servicio adicional por ID
const getServicioAdicionalById = async (req, res) => {
    try {
        const servicio = await ServicioAdicional.findByPk(req.params.id, {
            include: [{ model: Categoria }]
        });
        if (!servicio) {
            return res.status(404).json({ message: "Servicio adicional no encontrado" });
        }
        res.json(servicio);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el servicio adicional", error: error.message });
    }
};

// Crear un servicio adicional
const createServicioAdicional = async (req, res) => {
    try {
        const servicio = await ServicioAdicional.create(req.body);
        res.status(201).json(servicio);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el servicio adicional", error: error.message });
    }
};

const patchServicioAdicional = async (req, res) => {
    try {
        const servicio = await ServicioAdicional.findByPk(req.params.id);
        if (!servicio) {
            return res.status(404).json({ message: "Servicio adicional no encontrado" });
        }
        await servicio.update(req.body);
        res.json(servicio);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar parcialmente el servicio adicional", error: error.message });
    }
};

// Actualizar un servicio adicional
const updateServicioAdicional = async (req, res) => {
    try {
        const servicio = await ServicioAdicional.findByPk(req.params.id);
        if (!servicio) {
            return res.status(404).json({ message: "Servicio adicional no encontrado" });
        }
        await servicio.update(req.body);
        res.json(servicio);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el servicio adicional", error: error.message });
    }
};

// Eliminar un servicio adicional
const deleteServicioAdicional = async (req, res) => {
    try {
        const servicio = await ServicioAdicional.findByPk(req.params.id);
        if (!servicio) {
            return res.status(404).json({ message: "Servicio adicional no encontrado" });
        }
        await servicio.destroy();
        res.json({ message: "Servicio adicional eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el servicio adicional", error: error.message });
    }
};

module.exports = { getServiciosAdicionales, getServicioAdicionalById, createServicioAdicional, updateServicioAdicional, deleteServicioAdicional, patchServicioAdicional };
