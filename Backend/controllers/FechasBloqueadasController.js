const FechaBloqueada = require("../models/FechaBloqueada");

const getFechasBloqueadas = async (req, res) => {
    try {
        const fechas = await FechaBloqueada.findAll();
        res.json(fechas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las fechas bloqueadas", error: error.message });
    }
};

const bloquearFecha = async (req, res) => {
    try {
        const { fecha } = req.body;
        if (!fecha) return res.status(400).json({ message: "La fecha es requerida" });
        const nuevaFecha = await FechaBloqueada.create({ fecha });
        res.status(201).json(nuevaFecha);
    } catch (error) {
        res.status(500).json({ message: "Error al bloquear la fecha", error: error.message });
    }
};

const desbloquearFecha = async (req, res) => {
    try {
        const { fecha } = req.params;
        const result = await FechaBloqueada.destroy({ where: { fecha } });
        if (result === 0) return res.status(404).json({ message: "Fecha no encontrada" });
        res.json({ message: "Fecha desbloqueada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al desbloquear la fecha", error: error.message });
    }
};

module.exports = { getFechasBloqueadas, bloquearFecha, desbloquearFecha };
