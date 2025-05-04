const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const AttendanceSession = require('./AttendanceSession')
const Course = require('./courses')
const Student = require('./student')
const ActiveSession = require('./ActiveSession')



    const ScannedAttendance = sequelize.define('ScannedAttendance', {
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
        field: 'courseId' ,
        references: {
            model: 'courses',
            key: 'id'
          }
      },
      course_code: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'course_code' ,
        references: {
            model: 'courses',
          }
    },
      attendanceSessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'AttendanceSession',
          key: 'id',
        },
      },
    }, {
        tableName: 'ScannedAttendances',
        timestamps: false, 
        freezeTableName: true,
      });
  
    // Associations
    ScannedAttendance.associate = (models) => {
      ScannedAttendance.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: "Student",
      });
      ScannedAttendance.belongsTo(models.AttendanceSession, {
        foreignKey: 'attendanceSessionId',
      });
    };
    AttendanceSession.belongsTo(Course, { foreignKey: 'courseId' });
    module.exports = ScannedAttendance;



    
    