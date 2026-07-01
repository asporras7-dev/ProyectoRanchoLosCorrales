const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ServicioAdicional = sequelize.define("servicio_Adicional", {
    idservicio_Adicional: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    categoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

}, {
    tableName: 'servicio_adicional',
    timestamps: false
});

module.exports = ServicioAdicional;
