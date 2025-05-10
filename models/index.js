const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const ActiveSession = require('./ActiveSession');
const Admin = require('./admin');
const AttendanceSession = require('./AttendanceSession');
// const createAttendanceLogModel = require('./AttendanceLog');
const AttendanceRecord = require('./AttendanceRecord');
const Course = require('./courses');
const Lecturer = require('./lecturer');
const LecturerCourse = require('./lecturerCourse');
const ScannedAttendance = require('./ScannedAttendance');
const Student = require('./student');
const StudentCourse = require('./studentCourse');
const createAttendanceLogModel = require('./AttendanceLog');

// Initialize models
AttendanceSession.init(AttendanceSession.schema, {sequelize});
ActiveSession.init(ActiveSession.schema, {sequelize});
Admin.init(Admin.schema, {sequelize});
createAttendanceLogModel.init(createAttendanceLogModel.schema, {sequelize});
AttendanceRecord.init(AttendanceRecord.schema, {sequelize});
Course.init(Course.schema, {sequelize});
Lecturer.init(Lecturer.schema, {sequelize});
LecturerCourse.init(LecturerCourse.schema, {sequelize});
ScannedAttendance.init(ScannedAttendance.schema, {sequelize});
Student.init(Student.schema, {sequelize});
StudentCourse.init(StudentCourse.schema, {sequelize});


// Associations
// Set up associations here
ScannedAttendance.belongsTo(Student, {
  foreignKey: 'studentId',
  as: "students",
});
ScannedAttendance.belongsTo(AttendanceSession, {
  foreignKey: 'attendanceSessionId',
});
ScannedAttendance.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'courses',
});
// ----------------------------------------------------------
AttendanceSession.belongsTo(Course, { 
  foreignKey: 'courseId', 
  as:'courses',
  references: {
    model: 'courses', // match your actual table name
    key: 'id'
  }
});
AttendanceSession.hasOne(ActiveSession, {
  foreignKey: 'attendanceSessionId',
  onDelete: 'CASCADE'
});
AttendanceSession.hasOne(ScannedAttendance, {
  foreignKey: 'attendanceSessionId',
  onDelete: 'CASCADE'
});
AttendanceSession.hasOne(createAttendanceLogModel, {
  foreignKey: 'attendanceSessionId',
  onDelete: 'CASCADE'
});
// ----------------------------------------------------------
ActiveSession.belongsTo(AttendanceSession, {
  foreignKey: 'attendanceSessionId',
  targetKey: 'id',
  onDelete: 'CASCADE'
});
ActiveSession.belongsTo(Course, {
  foreignKey: 'course_id',
  as:'courses'
});
// ----------------------------------------------------------
Course.hasOne(LecturerCourse, {
  foreignKey: 'courseId',
  onDelete: 'CASCADE'
});
Course.hasMany(ScannedAttendance, {
  foreignKey: 'courseId',
  as: 'scanned_attendances',
});
//-----------------------------------------------------------

Lecturer.hasMany(LecturerCourse, {
  foreignKey: 'lecturerId',
  onDelete: 'CASCADE'
});
// ----------------------------------------------------------
Student.hasMany(ScannedAttendance, {
  foreignKey: 'studentId',
  as: 'scannedAttendances',
});
// ----------------------------------------------------------
LecturerCourse.belongsTo(Course, {
   foreignKey: 'courseId' });
   
LecturerCourse.belongsTo(Lecturer, {
   foreignKey: 'lecturerId' });
// ----------------------------------------------------------
const models = {
  sequelize,
  AttendanceSession,
  ActiveSession,
  Admin,
  createAttendanceLogModel,
  AttendanceRecord,
  Course,
  Lecturer,
  LecturerCourse,
  ScannedAttendance,
  Student,
  StudentCourse
};







module.exports = models;


