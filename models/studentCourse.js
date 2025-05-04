const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection


const StudentCourse = sequelize.define('StudentCourse', {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'course_id' 
    }
}, {
        tableName: 'StudentCourse',
        timestamps: false,
  });
 
module.exports = StudentCourse;
