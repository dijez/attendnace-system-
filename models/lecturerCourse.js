const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const Lecturer = require('./lecturer');  // Import Lecturer model
const Course = require('./courses'); // Import Course model

const LecturerCourse = sequelize.define('LecturerCourse', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lecturerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Lecturer,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Course,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'LecturerCourse',
    timestamps: false, // Enables createdAt and updatedAt
});

module.exports = LecturerCourse;
