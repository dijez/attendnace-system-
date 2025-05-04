const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const AttendanceSession = require('./AttendanceSession')

const ActiveSession = sequelize.define('ActiveSession', {
          isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'course_id' ,
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
    
}, {
    tableName: 'ActiveSession',
    timestamps: false, 
    freezeTableName: true,
  });

  ActiveSession.associate = (models) => {
    ActiveSession.belongsTo(AttendanceSession, {
      foreignKey: 'attendanceSessionId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
    ActiveSession.belongsTo(models.Course, {
      foreignKey: 'course_id',
      as:'courses'
    });
  };
  

module.exports = ActiveSession;
