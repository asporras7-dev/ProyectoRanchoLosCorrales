'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Rol', 'nombre_Rol', {
      type: Sequelize.STRING(200),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Rol', 'nombre_Rol', {
      type: Sequelize.STRING(10),
      allowNull: false
    });
  }
};

