const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MenuADomicilio = sequelize.define("Menu_A_Domicilio", {
    idMenu_A_Domicilio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_Menu_A_Domicilio: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    desc_Menu_A_Dom: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'menu_a_domicilio',
    timestamps: false
});

module.exports = MenuADomicilio;
