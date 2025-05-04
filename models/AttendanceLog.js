const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const Student = require('./student');




const createAttendanceLogModel = (courseName) => {
    const modelName = `attendance_log_${courseName.replace(/\s+/g, '_').toLowerCase()}`;  // Replace spaces with underscores
  
    const AttendanceLog = sequelize.define(modelName, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id'
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      attendanceStatus: {
        type: DataTypes.STRING, // 'present', 'absent', etc.
        allowNull: false
      },
      scanTimestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('NOW')
      },
      attendanceSessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'AttendanceSession', // assuming the sessions are stored in AttendanceSession table
          key: 'id'
        }
      }
    }, {
      tableName: modelName,
      timestamps: true, 
      freezeTableName: true
    });
  
    return AttendanceLog;
  };
  
  module.exports = createAttendanceLogModel;
