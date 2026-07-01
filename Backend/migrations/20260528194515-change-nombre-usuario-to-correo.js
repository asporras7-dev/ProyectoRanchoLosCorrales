'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Usuario', 'nombre_Usuario', 'correo');
    await queryInterface.changeColumn('Usuario', 'correo', {
      type: Sequelize.STRING(200),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Usuario', 'correo', {
      type: Sequelize.STRING(15),
      allowNull: false
    });
    await queryInterface.renameColumn('Usuario', 'correo', 'nombre_Usuario');
  }
};
