const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FechaBloqueadaADomicilio = sequelize.define("FechaBloqueadaADomicilio", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_Bloqueada: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'fecha_bloqueada_a_domicilio',
    timestamps: false
});

module.exports = FechaBloqueadaADomicilio;
