const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DecoracionTematica = sequelize.define("Decoracion_Tematica", {
    idDeco_Tem: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_Deco: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    desc_Deco: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    tableName: 'decoracion_tematica',
    timestamps: false
});

module.exports = DecoracionTematica;
