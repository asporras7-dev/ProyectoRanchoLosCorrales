const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Categoria = sequelize.define("Categoria", {
    idCategoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_Cat: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    tableName: 'categoria',
    timestamps: false
});

module.exports = Categoria;
