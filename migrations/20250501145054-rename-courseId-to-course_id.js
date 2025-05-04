'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('StudentCourse', 'courseId', 'course_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('StudentCourse', 'course_id', 'courseId');
  }
};
