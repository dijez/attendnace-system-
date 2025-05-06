const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Lecturer extends Model {}

Lecturer.schema = {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    username: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
}

Lecturer.init(Lecturer.schema, {
    sequelize,
    modelName: "Lecturer",
    tableName: 'lecturers',
    timestamps: false
})

module.exports = Lecturer;
