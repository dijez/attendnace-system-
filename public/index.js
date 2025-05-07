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
ScannedAttendance.belongsTo(AttendanceSession, {
  foreignKey: 'attendanceSessionId'
});

ScannedAttendance.belongsTo(Student, {
  foreignKey: 'studentId',
  // as:'students'
  
});

ScannedAttendance.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
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
Lecturer.hasOne(LecturerCourse, {
  foreignKey: 'lecturerId',
  onDelete: 'CASCADE'
});
Course.hasMany(ScannedAttendance, {
  foreignKey: 'courseId',
  as: 'scannedAttendances',
});
// ----------------------------------------------------------
Student.hasMany(ScannedAttendance, {
  foreignKey: 'studentId',
  as: 'scannedAttendances',
});

// ----------------------------------------------------------
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













// const Sequelize = require('sequelize');
// const sequelize = require('../config/db');

// const AttendanceRecord = require('./AttendanceRecord');
// const ActiveSession = require('./ActiveSession');
// const Course = require('./courses');
// const Student = require('./student');
// const AttendanceSession = require('./AttendanceSession');
// const ScannedAttendance = require('./ScannedAttendance');
// const StudentCourse = require('./studentCourse');

// // Set up associations here
// AttendanceSession.hasOne(ActiveSession, {
//   foreignKey: 'attendanceSessionId',
//   onDelete: 'CASCADE'
// });
// ActiveSession.belongsTo(AttendanceSession, {
//   foreignKey: 'attendanceSessionId'
// });
// ActiveSession.belongsTo(Course, {
//   foreignKey: 'course_id'
// });

// const models = {
//   Student: Student(sequelize, Sequelize.DataTypes),
//   Course: Course(sequelize, Sequelize.DataTypes),
//   // AttendanceSession: AttendanceSession(sequelize, Sequelize.DataTypes),
//   ScannedAttendance: ScannedAttendance(sequelize, Sequelize.DataTypes),
//   StudentCourse: StudentCourse(sequelize, Sequelize.DataTypes),
// };

// Object.keys(models).forEach((modelName) => {
//   if (models[modelName].associate) {
//     models[modelName].associate(models);
//   }
// });
// module.exports = {
//   sequelize,
//   Sequelize,
//   models,
//   AttendanceSession: models.AttendanceSession,
//   ActiveSession,
//   Course: models.Course,
//   Student: models.Student,
//   ScannedAttendance: models.ScannedAttendance,
//   StudentCourse: models.StudentCourse
// };
