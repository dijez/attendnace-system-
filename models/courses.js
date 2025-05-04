const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const ActiveSession = require('./ActiveSession')
const AttendanceSession = require('./AttendanceSession')
const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    course_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    courseCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Ensures course codes are unique
    }
}, {
    tableName: 'courses',
    timestamps: false, // Enables createdAt and updatedAt
});



Course.associate = (models) => {
      Course.hasMany(ActiveSession, {
          foreignKey: 'courseId',
          as: 'ActiveSession'
        });
        Course.hasMany(AttendanceSession, {
          foreignKey: 'course_id',
          as: 'attendance_sessions'
        });
        
   
  };
 
module.exports = Course;
