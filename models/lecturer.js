const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Lecturer = sequelize.define('Lecturer', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
}, {
        tableName: 'lecturers',
        timestamps: false
    });

module.exports = Lecturer;
