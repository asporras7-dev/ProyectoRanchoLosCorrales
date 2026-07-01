const DecoracionTematica = require("../models/DecoracionTematica");

// Obtener todas las decoraciones temáticas
const getDecoracionesTematicas = async (req, res) => {
    try {
        const decoraciones = await DecoracionTematica.findAll();
        res.json(decoraciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las decoraciones temáticas", error: error.message });
    }
};

// Obtener una decoración temática por ID
const getDecoracionTematicaById = async (req, res) => {
    try {
        const decoracion = await DecoracionTematica.findByPk(req.params.id);
        if (!decoracion) {
            return res.status(404).json({ message: "Decoración temática no encontrada" });
        }
        res.json(decoracion);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la decoración temática", error: error.message });
    }
};

// Crear una decoración temática
const createDecoracionTematica = async (req, res) => {
    try {
        const decoracion = await DecoracionTematica.create(req.body);
        res.status(201).json(decoracion);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la decoración temática", error: error.message });
    }
};

const patchDecoracionTematica = async (req, res) => {
    try {
        const decoracionTematica = await DecoracionTematica.findByPk(req.params.id);
        if (!decoracionTematica) {
            return res.status(404).json({ message: "Decoración temática no encontrada" });
        }
        await decoracionTematica.update(req.body);
        res.json(decoracionTematica);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar parcialmente la decoración temática", error: error.message });
    }
};

// Actualizar una decoración temática
const updateDecoracionTematica = async (req, res) => {
    try {
        const decoracion = await DecoracionTematica.findByPk(req.params.id);
        if (!decoracion) {
            return res.status(404).json({ message: "Decoración temática no encontrada" });
        }
        await decoracion.update(req.body);
        res.json(decoracion);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la decoración temática", error: error.message });
    }
};

// Eliminar una decoración temática
const deleteDecoracionTematica = async (req, res) => {
    try {
        const decoracion = await DecoracionTematica.findByPk(req.params.id);
        if (!decoracion) {
            return res.status(404).json({ message: "Decoración temática no encontrada" });
        }
        await decoracion.destroy();
        res.json({ message: "Decoración temática eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la decoración temática", error: error.message });
    }
};

module.exports = { getDecoracionesTematicas, getDecoracionTematicaById, createDecoracionTematica, updateDecoracionTematica, deleteDecoracionTematica, patchDecoracionTematica };
