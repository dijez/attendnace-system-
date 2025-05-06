const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const ActiveSession = require('./ActiveSession')
const AttendanceSession = require('./AttendanceSession')

class Course extends Model {}

Course.schema = {
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
}

Course.init(Course.schema, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: false, // Enables createdAt and updatedAt
})
 
   
//   };
 
module.exports = Course;
