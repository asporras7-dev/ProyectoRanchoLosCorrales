const ServicioAdicionalReserva = require("../models/ServicioAdicionalReserva");

// Obtener todas las relaciones
const getServicioAdicionalReservas = async (req, res) => {
    try {
        const relaciones = await ServicioAdicionalReserva.findAll();
        res.json(relaciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las relaciones", error: error.message });
    }
};

const getServicioAdicionalReservaById = async (req, res) => {
    try {
        const { servicio_Adicional_idservicio_Adicional, Reserva_idReserva } = req.params;
        const relacion = await ServicioAdicionalReserva.findOne({
            where: {
                servicio_Adicional_idservicio_Adicional,
                Reserva_idReserva
            }
        });

        if (!relacion) {
            return res.status(404).json({ message: "Relación no encontrada" });
        }

        res.json(relacion);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la relación", error: error.message });
    }
};

const patchServicioAdicionalReserva = async (req, res) => {
    try {
        const { servicio_Adicional_idservicio_Adicional, Reserva_idReserva } = req.params;
        const relacion = await ServicioAdicionalReserva.findOne({
            where: {
                servicio_Adicional_idservicio_Adicional,
                Reserva_idReserva
            }
        });

        if (!relacion) {
            return res.status(404).json({ message: "Relación no encontrada" });
        }

        await relacion.update(req.body);
        res.json(relacion);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar parcialmente la relación", error: error.message });
    }
};

// Crear una relación
const createServicioAdicionalReserva = async (req, res) => {
    try {
        const relacion = await ServicioAdicionalReserva.create(req.body);
        res.status(201).json(relacion);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la relación", error: error.message });
    }
};


const updateServicioAdicionalReserva = async (req, res) => {
    try {
        const { servicio_Adicional_idservicio_Adicional, Reserva_idReserva } = req.params;
        const relacion = await ServicioAdicionalReserva.findOne({
            where: {
                servicio_Adicional_idservicio_Adicional,
                Reserva_idReserva
            }
        });

        if (!relacion) {
            return res.status(404).json({ message: "Relación no encontrada" });
        }

        await relacion.update(req.body);
        res.json(relacion);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la relación", error: error.message });
    }
};

// Eliminar una relación
const deleteServicioAdicionalReserva = async (req, res) => {
    try {
        const { servicio_Adicional_idservicio_Adicional, Reserva_idReserva } = req.params;
        const relacion = await ServicioAdicionalReserva.findOne({
            where: {
                servicio_Adicional_idservicio_Adicional,
                Reserva_idReserva
            }
        });
        
        if (!relacion) {
            return res.status(404).json({ message: "Relación no encontrada" });
        }
        
        await relacion.destroy();
        res.json({ message: "Relación eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la relación", error: error.message });
    }
};

module.exports = { getServicioAdicionalReservas, createServicioAdicionalReserva, deleteServicioAdicionalReserva, patchServicioAdicionalReserva, updateServicioAdicionalReserva, getServicioAdicionalReservaById };
