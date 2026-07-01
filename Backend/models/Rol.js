const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Rol = sequelize.define("Rol", {
    idRol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_Rol: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
}, {
    tableName: 'rol',
    timestamps: false
});

module.exports = Rol;
