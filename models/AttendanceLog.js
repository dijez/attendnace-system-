const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const Student = require('./student');

class createAttendanceLogModel extends Model {}

createAttendanceLogModel.schema = {
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
}

createAttendanceLogModel.init(createAttendanceLogModel.schema, {
  sequelize,
  modelName: 'createAttendanceLogModel',	
  tableName: 'attendance_logs', // Name of the table in the database
  timestamps: true, // Enable createdAt and updatedAt fields
  freezeTableName: true // Prevent Sequelize from pluralizing the table name
});


module.exports = createAttendanceLogModel;
