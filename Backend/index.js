const Rol = require("./models/Rol");
const Usuario = require("./models/Usuario");
const Menu = require("./models/Menu");
const Categoria = require("./models/Categoria");
const ServicioAdicional = require("./models/ServicioAdicional");
const Reserva = require("./models/Reserva");
const MenuADomicilio = require("./models/MenuADomicilio");
const ReservaADomicilio = require("./models/ReservaADomicilio");
const ServicioAdicionalReserva = require("./models/ServicioAdicionalReserva");
const DecoracionTematica = require("./models/DecoracionTematica");
const FechaBloqueada = require("./models/FechaBloqueada");
const FechaBloqueadaADomicilio = require("./models/FechaBloqueadaADomicilio");

// =============================================
// Relaciones entre modelos
// =============================================

// Rol - Usuario (1:N)
Rol.hasMany(Usuario, { foreignKey: "Rol_idRol" });
Usuario.belongsTo(Rol, { foreignKey: "Rol_idRol" });

// Menu - Reserva (1:N)
Menu.hasMany(Reserva, { foreignKey: "Menu_idMenu" });
Reserva.belongsTo(Menu, { foreignKey: "Menu_idMenu" });

// Categoria - ServicioAdicional (1:N)
Categoria.hasMany(ServicioAdicional, { foreignKey: "categoriaId" });
ServicioAdicional.belongsTo(Categoria, { foreignKey: "categoriaId" });

// MenuADomicilio - ReservaADomicilio (1:N)
MenuADomicilio.hasMany(ReservaADomicilio, { foreignKey: "Menu_A_Domicilio_idMenu_A_Domicilio" });
ReservaADomicilio.belongsTo(MenuADomicilio, { foreignKey: "Menu_A_Domicilio_idMenu_A_Domicilio" });

// ServicioAdicional - Reserva (N:M) a través de ServicioAdicionalReserva
Reserva.belongsToMany(ServicioAdicional, { through: ServicioAdicionalReserva, foreignKey: "Reserva_idReserva" });
ServicioAdicional.belongsToMany(Reserva, { through: ServicioAdicionalReserva, foreignKey: "servicio_Adicional_idservicio_Adicional" });

//DecoracionTematica - Reserva(1:N)
DecoracionTematica.hasMany(Reserva, { foreignKey: "decoracionTematicaId" });
Reserva.belongsTo(DecoracionTematica, { foreignKey: "decoracionTematicaId" });

module.exports = {
    Rol,
    Usuario,
    Menu,
    Categoria,
    ServicioAdicional,
    Reserva,
    MenuADomicilio,
    ReservaADomicilio,
    ServicioAdicionalReserva,
    FechaBloqueada,
    FechaBloqueadaADomicilio
}