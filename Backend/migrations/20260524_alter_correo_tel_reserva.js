module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Make correoClienteReserva NOT NULL
    await queryInterface.changeColumn('Reserva', 'correoClienteReserva', {
      type: Sequelize.STRING(200),
      allowNull: false,
    });
    // Make telClienteReserva NOT NULL
    await queryInterface.changeColumn('Reserva', 'telClienteReserva', {
      type: Sequelize.STRING(15),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert correoClienteReserva to allow NULL
    await queryInterface.changeColumn('Reserva', 'correoClienteReserva', {
      type: Sequelize.STRING(200),
      allowNull: true,
    });
    // Revert telClienteReserva to allow NULL
    await queryInterface.changeColumn('Reserva', 'telClienteReserva', {
      type: Sequelize.STRING(15),
      allowNull: true,
    });
  },
};
