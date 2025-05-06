const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection

class AttendanceRecord extends Model {}

AttendanceRecord.schema = {
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
}

AttendanceRecord.init(AttendanceRecord.schema, {
  sequelize,
  modelName: "AttendanceRecord",
  tableName: 'attendance_records',
  timestamps: false
})

module.exports = AttendanceRecord;