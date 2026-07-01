const ReservaADomicilio = require("../models/ReservaADomicilio");
const MenuADomicilio = require("../models/MenuADomicilio");
const transporter = require("../mailer");
const { generarTemplateReservaDomicilio } = require("../utils/emailTemplates");

// Obtener todas las reservas a domicilio
const getReservasADomicilio = async (req, res) => {
    try {
        const reservas = await ReservaADomicilio.findAll({
            include: [{ model: MenuADomicilio }]
        });
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las reservas a domicilio", error: error.message });
    }
};

// Obtener una reserva a domicilio por ID
const getReservaADomicilioById = async (req, res) => {
    try {
        const reserva = await ReservaADomicilio.findByPk(req.params.id, {
            include: [{ model: MenuADomicilio }]
        });
        if (!reserva) {
            return res.status(404).json({ message: "Reserva a domicilio no encontrada" });
        }
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la reserva a domicilio", error: error.message });
    }
};

// Crear una reserva a domicilio
const createReservaADomicilio = async (req, res) => {
    try {
        const reserva = await ReservaADomicilio.create(req.body);
        
        // Obtener la reserva completa para incluir el menú
        const reservaCompleta = await ReservaADomicilio.findByPk(reserva.icReserva_A_Domicilio, {
            include: [{ model: MenuADomicilio }]
        });

        // Enviar notificación por correo de forma asíncrona
        try {
            const htmlContent = generarTemplateReservaDomicilio(reservaCompleta);
            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: "test@rancholoscorrales.com",
                subject: "Nueva Reserva A Domicilio - Rancho Los Corrales",
                html: htmlContent
            });
        } catch (mailError) {
            console.error("Error enviando correo de notificación a domicilio:", mailError);
        }

        res.status(201).json(reservaCompleta);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reserva a domicilio", error: error.message });
    }
};



// Actualizar una reserva a domicilio
const updateReservaADomicilio = async (req, res) => {
    try {
        const reserva = await ReservaADomicilio.findByPk(req.params.id);
        if (!reserva) {
            return res.status(404).json({ message: "Reserva a domicilio no encontrada" });
        }
        await reserva.update(req.body);
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la reserva a domicilio", error: error.message });
    }
};

// PATCH - Actualizar parcialmente una reserva a domicilio
const patchReservaADomicilio = async (req, res) => {
    try {
        const reserva = await ReservaADomicilio.findByPk(req.params.id);
        if (!reserva) {
            return res.status(404).json({ message: "Reserva a domicilio no encontrada" });
        }
        await reserva.update(req.body);
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar parcialmente la reserva a domicilio", error: error.message });
    }
};

// Eliminar una reserva a domicilio
const deleteReservaADomicilio = async (req, res) => {
    try {
        const reserva = await ReservaADomicilio.findByPk(req.params.id);
        if (!reserva) {
            return res.status(404).json({ message: "Reserva a domicilio no encontrada" });
        }
        await reserva.destroy();
        res.json({ message: "Reserva a domicilio eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la reserva a domicilio", error: error.message });
    }
};

module.exports = { getReservasADomicilio, getReservaADomicilioById, createReservaADomicilio, updateReservaADomicilio, patchReservaADomicilio, deleteReservaADomicilio };
