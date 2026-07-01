const Reserva = require("../models/Reserva");
const Menu = require("../models/Menu");
const ServicioAdicionalReserva = require("../models/ServicioAdicionalReserva");
const ServicioAdicional = require("../models/ServicioAdicional");
const DecoracionTematica = require("../models/DecoracionTematica");
const transporter = require("../mailer");
const { generarTemplateReserva } = require("../utils/emailTemplates");

// Obtener todas las reservas
const getReservas = async (req, res) => {
    try {
        const reservas = await Reserva.findAll({
            include: [
                { model: Menu },
                { model: ServicioAdicional },
                { model: DecoracionTematica }
            ]
        });
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las reservas", error: error.message });
    }
};

// Obtener una reserva por ID
const getReservaById = async (req, res) => {
    try {
        const reserva = await Reserva.findByPk(req.params.id, {
            include: [
                { model: Menu },
                { model: ServicioAdicional },
                { model: DecoracionTematica }
            ]
        });
        if (!reserva) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la reserva", error: error.message });
    }
};

// Crear una reserva
const createReserva = async (req, res) => {
    try {
        // Separar los IDs de servicios adicionales del resto de datos de la reserva
        const { serviciosAdicionalesIds, ...datosReserva } = req.body;

        // 1. Validar campos obligatorios
        if (!datosReserva.nombreClienteReserva || !datosReserva.correoClienteReserva || !datosReserva.telClienteReserva || !datosReserva.numPersonas || !datosReserva.fecha || !datosReserva.horaEvento) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // 2. Crear la reserva con los datos base
        const reserva = await Reserva.create(datosReserva);

        // 2. Insertar los servicios adicionales en la tabla intermedia
        if (serviciosAdicionalesIds && serviciosAdicionalesIds.length > 0) {
            const inserts = serviciosAdicionalesIds.map(id => ({
                Reserva_idReserva: reserva.idReserva,
                servicio_Adicional_idservicio_Adicional: id
            }));
            await ServicioAdicionalReserva.bulkCreate(inserts);
        }

        // 3. Responder con la reserva creada y sus servicios asociados
        const reservaCompleta = await Reserva.findByPk(reserva.idReserva, {
            include: [
                { model: Menu },
                { model: ServicioAdicional },
                { model: DecoracionTematica }
            ]
        });

        // 4. Enviar notificación por correo de forma asíncrona
        try {
            const htmlContent = generarTemplateReserva("rancho", reservaCompleta);
            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: "test@rancholoscorrales.com",
                subject: "Nueva Reserva - Rancho Los Corrales",
                html: htmlContent
            });
        } catch (mailError) {
            console.error("Error enviando correo de notificación:", mailError);
        }

        res.status(201).json(reservaCompleta);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reserva", error: error.message });
    }
};

const patchReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findByPk(req.params.id);
        if (!reserva) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }
        await reserva.update(req.body);
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar parcialmente la reserva", error: error.message });
    }
};

// Actualizar una reserva
const updateReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findByPk(req.params.id);
        if (!reserva) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }
        await reserva.update(req.body);
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la reserva", error: error.message });
    }
};

// Eliminar una reserva
const deleteReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findByPk(req.params.id);
        if (!reserva) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }
        await reserva.destroy();
        res.json({ message: "Reserva eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la reserva", error: error.message });
    }
};

module.exports = { getReservas, getReservaById, createReserva, updateReserva, deleteReserva, patchReserva };
