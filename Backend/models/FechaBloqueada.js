const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FechaBloqueada = sequelize.define("FechaBloqueada", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'fecha_bloqueada',
    timestamps: false
});

module.exports = FechaBloqueada;
