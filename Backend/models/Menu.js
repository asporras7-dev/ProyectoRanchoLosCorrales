const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Menu = sequelize.define("Menu", {
    idMenu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_Menu: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion_Menu: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'menu',
    timestamps: false
});

module.exports = Menu;
