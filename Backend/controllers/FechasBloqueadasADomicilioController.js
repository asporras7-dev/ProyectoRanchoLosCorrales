const FechaBloqueadaADomicilio = require("../models/FechaBloqueadaADomicilio");

const getFechasBloqueadasADomicilio = async (req, res) => {
    try {
        const fechas = await FechaBloqueadaADomicilio.findAll();
        res.json(fechas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las fechas bloqueadas a domicilio", error: error.message });
    }
};

const bloquearFechaADomicilio = async (req, res) => {
    try {
        const { fecha_Bloqueada } = req.body;
        if (!fecha_Bloqueada) return res.status(400).json({ message: "La fecha es requerida" });
        const nuevaFecha = await FechaBloqueadaADomicilio.create({ fecha_Bloqueada });
        res.status(201).json(nuevaFecha);
    } catch (error) {
        res.status(500).json({ message: "Error al bloquear la fecha", error: error.message });
    }
};

const desbloquearFechaADomicilio = async (req, res) => {
    try {
        const { fecha } = req.params;
        const result = await FechaBloqueadaADomicilio.destroy({ where: { fecha_Bloqueada: fecha } });
        if (result === 0) return res.status(404).json({ message: "Fecha no encontrada" });
        res.json({ message: "Fecha desbloqueada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al desbloquear la fecha", error: error.message });
    }
};

module.exports = { getFechasBloqueadasADomicilio, bloquearFechaADomicilio, desbloquearFechaADomicilio };
