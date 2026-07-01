'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('usuario', 'reset_token', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('usuario', 'reset_token_expira', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuario', 'reset_token');
    await queryInterface.removeColumn('usuario', 'reset_token_expira');
  }
};
