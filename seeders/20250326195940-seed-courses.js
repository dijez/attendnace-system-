'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('courses', [
        { course_name: 'Introduction to Programming', courseCode: 'CS101', createdat: new Date(), updatedat: new Date() },
        { course_name: 'Database Systems', courseCode: 'CS201', createdat: new Date(), updatedat: new Date() },
        { course_name: 'Software Engineering', courseCode: 'CS301', createdat: new Date(), updatedat: new Date() },
        { course_name: 'Computer Networks', courseCode: 'CS401', createdat: new Date(), updatedat: new Date() },
        { course_name: 'Artificial Intelligence', courseCode: 'CS501', createdat: new Date(), updatedat: new Date() },
      ]);
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('courses', null, {});
    }
};

