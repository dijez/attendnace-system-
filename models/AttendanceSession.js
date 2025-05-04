const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const Course = require('./courses')
const AttendanceSession = sequelize.define('AttendanceSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'course_id',
    references: {
      model: 'courses', // match your actual table name
      key: 'id'
    }
  },
  course_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    course_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    expected_students: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true
      }
      
  }, {
    tableName: "attendanceSession",
    timestamps: true,
    createdAt: 'createdAt', // Optional: Customize the field name for createdAt (default is 'createdAt')
    updatedAt: 'updatedAt',
    freezeTableName: true,
  });

  // AttendanceSession.hasMany(ScannedAttendance, {
  //   foreignKey: 'attendanceSessionId'
  // });
  AttendanceSession.belongsTo(Course, {
    foreignKey: 'course_id', // This matches the column in your table
    as: 'course',
    references: {
      model: 'courses', // match your actual table name
      key: 'id'
    }
  });
  

  module.exports = AttendanceSession;

