const Categoria = require("../models/Categoria");

// Obtener todas las categorías
const getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las categorías", error: error.message });
    }
};

// Obtener una categoría por ID
const getCategoriaById = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la categoría", error: error.message });
    }
};

// Crear una categoría
const createCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.create(req.body);
        res.status(201).json(categoria);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la categoría", error: error.message });
    }
};

const patchCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        await categoria.update(req.body);
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar parcialmente la categoría", error: error.message });
    }
};

// Actualizar una categoría
const updateCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        await categoria.update(req.body);
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la categoría", error: error.message });
    }
};

// Eliminar una categoría
const deleteCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        await categoria.destroy();
        res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la categoría", error: error.message });
    }
};

module.exports = { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria, patchCategoria };
