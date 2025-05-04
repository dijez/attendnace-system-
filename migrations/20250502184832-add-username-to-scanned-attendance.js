'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ScannedAttendances', 'username', {
      type: Sequelize.STRING,
      allowNull: true, // Or set to false if you require this field
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ScannedAttendances', 'username');
  }
};
