const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../config/db');

const Admin = sequelize.define('Admin', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
}, {
        tableName: 'admin',
        timestamps: false
    });


module.exports = Admin;
