/* eslint-disable no-unused-vars */
'use strict';
/**
 * Migration: Drop all tables (if they exist) and recreate them using the new column names.
 * The database is empty, so this migration will effectively create the schema.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ---- Create tables in order without foreign keys first ----
    await queryInterface.createTable('Rol', {
      idRol: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre_Rol: { type: Sequelize.STRING(45), allowNull: false }
    });
    await queryInterface.createTable('Usuario', {
      idUsuario: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre_Usuario: { type: Sequelize.STRING(15), allowNull: false },
      contrasenia: { type: Sequelize.STRING(450), allowNull: false },
      Rol_idRol: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Rol', key: 'idRol' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' }
    });
    await queryInterface.createTable('Categoria', {
      idCategoria: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre_Cat: { type: Sequelize.STRING(45), allowNull: false }
    });
    await queryInterface.createTable('Decoracion_Tematica', {
      idDeco_Tem: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre_Deco: { type: Sequelize.STRING(45), allowNull: false },
      desc_Deco: { type: Sequelize.TEXT, allowNull: true }
    });
    await queryInterface.createTable('Menu', {
      idMenu: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre_Menu: { type: Sequelize.STRING(45), allowNull: false },
      descripcion_Menu: { type: Sequelize.TEXT, allowNull: true }
    });
    await queryInterface.createTable('Menu_A_Domicilio', {
      idMenu_A_Domicilio: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre_Menu_A_Domicilio: { type: Sequelize.STRING(45), allowNull: false },
      desc_Menu_A_Dom: { type: Sequelize.TEXT, allowNull: true }
    });
    await queryInterface.createTable('ServicioAdicional', {
      idservicio_Adicional: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING(250), allowNull: false },
      descripcion: { type: Sequelize.STRING(45), allowNull: true },
      categoriaId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Categoria', key: 'idCategoria' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' }
    });
    await queryInterface.createTable('Reserva', {
      idReserva: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tipoEvento: { type: Sequelize.ENUM('Cumpleaños','Boda','Reunión','Corporativo','Otro'), allowNull: false },
      numPersonas: { type: Sequelize.INTEGER, allowNull: false },
      especificaciones: { type: Sequelize.TEXT, allowNull: true },
      Menu_idMenu: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Menu', key: 'idMenu' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      servicios_Adicionales: { type: Sequelize.TINYINT, allowNull: true },
      fecha: { type: Sequelize.DATEONLY, allowNull: false },
      horaInicio: { type: Sequelize.STRING(45), allowNull: false },
      horaFinal: { type: Sequelize.STRING(45), allowNull: false },
      nombreClienteReserva: { type: Sequelize.STRING(200), allowNull: false },
      correoClienteReserva: { type: Sequelize.STRING(200), allowNull: true },
      telClienteReserva: { type: Sequelize.STRING(15), allowNull: true },
      decoracionTematicaId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Decoracion_Tematica', key: 'idDeco_Tem' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' }
    });
    await queryInterface.createTable('Reserva_A_Domicilio', {
      icReserva_A_Domicilio: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      fecha_Evento: { type: Sequelize.DATEONLY, allowNull: false },
      tipoEvento: { type: Sequelize.ENUM('Cumpleaños','Boda','Reunión','Corporativo','Otro'), allowNull: false },
      numPersonas: { type: Sequelize.INTEGER, allowNull: false },
      hora_Servicio: { type: Sequelize.STRING(45), allowNull: false },
      Menu_A_Domicilio_idMenu_A_Domicilio: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Menu_A_Domicilio', key: 'idMenu_A_Domicilio' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      ubicacion_Gps_Opcional: { type: Sequelize.STRING(250), allowNull: true },
      Foto_Area_De_Trabajo: { type: Sequelize.STRING(250), allowNull: true },
      direccion_Exacta: { type: Sequelize.STRING(250), allowNull: true },
      especificaciones_adicionales: { type: Sequelize.TEXT, allowNull: true },
      nombre_Cliente_Domicilio: { type: Sequelize.STRING(200), allowNull: false },
      correo_Cliente_Domicilio: { type: Sequelize.STRING(200), allowNull: true },
      tel_Cliente_Dom: { type: Sequelize.STRING(15), allowNull: true }
    });
    // Junction table for many‑to‑many ServicioAdicional ↔ Reserva
    await queryInterface.createTable('servicio_Adicional_Reserva', {
      servicio_Adicional_idservicio_Adicional: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'ServicioAdicional', key: 'idservicio_Adicional' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      Reserva_idReserva: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Reserva', key: 'idReserva' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop in reverse order to avoid FK issues
    await queryInterface.dropTable('servicio_Adicional_Reserva');
    await queryInterface.dropTable('Reserva_A_Domicilio');
    await queryInterface.dropTable('Reserva');
    await queryInterface.dropTable('ServicioAdicional');
    await queryInterface.dropTable('Menu_A_Domicilio');
    await queryInterface.dropTable('Menu');
    await queryInterface.dropTable('Decoracion_Tematica');
    await queryInterface.dropTable('Categoria');
    await queryInterface.dropTable('Usuario');
    await queryInterface.dropTable('Rol');
  }
};
