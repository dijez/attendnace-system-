const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection


class StudentCourse extends Model {}


StudentCourse.schema = {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'course_id' 
  }
}

StudentCourse.init(StudentCourse.schema, {
  sequelize,
  modelName: 'StudentCourse',
  tableName: 'StudentCourse',
  timestamps: false,
})
 
module.exports = StudentCourse;
