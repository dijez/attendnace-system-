'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ActiveSession', 'attendanceSessionId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'attendancesession',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ActiveSession', 'attendanceSessionId');
  }
};
