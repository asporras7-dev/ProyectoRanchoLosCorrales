const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ServicioAdicionalReserva = sequelize.define("servicio_Adicional_Reserva", {
    servicio_Adicional_idservicio_Adicional: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'servicio_Adicional',
            key: 'idservicio_Adicional'
        }
    },
    Reserva_idReserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Reserva',
            key: 'idReserva'
        }
    }
}, {
    tableName: 'servicio_adicional_reserva',
    timestamps: false
});

module.exports = ServicioAdicionalReserva;
