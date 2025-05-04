const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection


const AttendanceRecord = sequelize.define('AttendanceRecord', {
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scanned_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW
    }
  }, {
    tableName: 'attendance_records',
    timestamps: false
  });

module.exports = AttendanceRecord;