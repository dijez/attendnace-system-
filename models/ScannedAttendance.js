const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const AttendanceSession = require('./AttendanceSession')
const Course = require('./courses')
const Student = require('./student')
const ActiveSession = require('./ActiveSession')


class ScannedAttendance extends Model { }

ScannedAttendance.schema = {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    // references: {
    //     model: 'students',
    //   },
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'courseId',
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  course_code: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'course_code',
    references: {
      model: 'courses',
      key: 'courseCode'
    }
  },
  attendanceSessionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'attendanceSession',
      key: 'id',
    },
  },
}

ScannedAttendance.init(ScannedAttendance.schema, {
  sequelize,
  modelName: "ScannedAttendance",
  tableName: 'ScannedAttendances',
  timestamps: true,
  freezeTableName: true,
})


module.exports = ScannedAttendance;




