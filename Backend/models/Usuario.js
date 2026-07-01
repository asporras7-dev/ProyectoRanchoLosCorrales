const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Usuario = sequelize.define("Usuario", {
    idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    correo: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    contrasenia: {
        type: DataTypes.STRING(450),
        allowNull: false
    },
    Rol_idRol: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    reset_token_expira: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'usuario',
    timestamps: false
});

module.exports = Usuario;
