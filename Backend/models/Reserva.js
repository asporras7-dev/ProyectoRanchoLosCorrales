const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Reserva = sequelize.define("Reserva", {
    idReserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipoEvento: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    numPersonas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    especificaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Menu_idMenu: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    horaEvento: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    servicios_Adicionales: {
        type: DataTypes.TINYINT,
        allowNull: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    nombreClienteReserva: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    correoClienteReserva: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    telClienteReserva: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    decoracionTematicaId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Pendiente'
    }
}, {
    tableName: 'reserva',
    timestamps: false
});


module.exports = Reserva;
