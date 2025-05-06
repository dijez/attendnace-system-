const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const AttendanceSession = require('./AttendanceSession')

class ActiveSession extends Model {}

ActiveSession.schema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'course_id',
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  attendanceSessionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'attendanceSession',
      key: 'id',
    },
  }
}

ActiveSession.init(ActiveSession.schema, {
  sequelize,
  modelName: 'ActiveSession',
  tableName: 'ActiveSession',
  timestamps: false,
  freezeTableName: true,
})



module.exports = ActiveSession;
