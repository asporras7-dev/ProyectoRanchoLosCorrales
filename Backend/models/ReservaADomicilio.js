const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ReservaADomicilio = sequelize.define("Reserva_A_Domicilio", {
    icReserva_A_Domicilio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_Evento: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    tipo_Evento: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    num_Personas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hora_Servicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_Evento: {
        type: DataTypes.TIME,
        allowNull: true
    },
    especificaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Menu_A_Domicilio_idMenu_A_Domicilio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ubicacion_Gps_Opcional: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Foto_Area_De_Trabajo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    direccion_Exacta: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    nombre_Cliente_Domicilio: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    correo_Cliente_Domicilio: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    tel_Cliente_Dom: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Pendiente'
    }
}, {
    tableName: 'reserva_a_domicilio',
    timestamps: false
});

module.exports = ReservaADomicilio;
