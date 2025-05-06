const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const Lecturer = require('./lecturer');  // Import Lecturer model
const Course = require('./courses'); // Import Course model

class LecturerCourse extends Model {}

LecturerCourse.schema = {
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
}

LecturerCourse.init(LecturerCourse.schema, {
    sequelize,
    modelName: "LecturerCourse",
    tableName: 'LecturerCourse',
    timestamps: false, // Enables createdAt and updatedAt
})

module.exports = LecturerCourse;
