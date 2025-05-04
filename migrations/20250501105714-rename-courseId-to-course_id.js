'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('ActiveSession', 'courseId', 'course_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('ActiveSession', 'course_id', 'courseId');
  }
};
