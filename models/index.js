const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const AttendanceRecord = require('./AttendanceRecord');
const ActiveSession = require('./ActiveSession');
const Course = require('./courses');
const Student = require('./student');
const AttendanceSession = require('./AttendanceSession');
const ScannedAttendance = require('./ScannedAttendance');
const StudentCourse = require('./studentCourse');

// Set up associations here
AttendanceSession.hasOne(ActiveSession, {
  foreignKey: 'attendanceSessionId',
  onDelete: 'CASCADE'
});
ActiveSession.belongsTo(AttendanceSession, {
  foreignKey: 'attendanceSessionId'
});
ActiveSession.belongsTo(Course, {
  foreignKey: 'course_id'
});

const models = {
  Student: Student(sequelize, Sequelize.DataTypes),
  Course: Course(sequelize, Sequelize.DataTypes),
  // AttendanceSession: AttendanceSession(sequelize, Sequelize.DataTypes),
  ScannedAttendance: ScannedAttendance(sequelize, Sequelize.DataTypes),
  StudentCourse: StudentCourse(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});
module.exports = {
  sequelize,
  Sequelize,
  models,
  AttendanceSession: models.AttendanceSession,
  ActiveSession,
  Course: models.Course,
  Student: models.Student,
  ScannedAttendance: models.ScannedAttendance,
  StudentCourse: models.StudentCourse
};
