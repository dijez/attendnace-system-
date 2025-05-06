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

// Initialize models
AttendanceSession.init(AttendanceSession.schema, {sequelize});
ActiveSession.init(ActiveSession.schema, {sequelize});
Admin.init(Admin.schema, {sequelize});
// createAttendanceLogModel.init(createAttendanceLogModel.schema, {sequelize});
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
  as: "Student",
});
ScannedAttendance.belongsTo(AttendanceSession, {
  foreignKey: 'attendanceSessionId',
});

AttendanceSession.belongsTo(Course, { 
  foreignKey: 'courseId', 
  as:'courses'
});
AttendanceSession.hasOne(ActiveSession, {
  foreignKey: 'attendanceSessionId',
  onDelete: 'CASCADE'
});
AttendanceSession.hasOne(ScannedAttendance, {
  foreignKey: 'attendanceSessionId',
  onDelete: 'CASCADE'
});

ActiveSession.belongsTo(AttendanceSession, {
  foreignKey: 'attendanceSessionId',
  targetKey: 'id',
  onDelete: 'CASCADE'
});
ActiveSession.belongsTo(models.Course, {
  foreignKey: 'course_id',
  as:'courses'
});

const models = {
  sequelize,
  AttendanceSession,
  ActiveSession,
  Admin,
  // createAttendanceLogModel,
  AttendanceRecord,
  Course,
  Lecturer,
  LecturerCourse,
  ScannedAttendance,
  Student,
  StudentCourse
};


module.exports = models;
