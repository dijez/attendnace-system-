const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Admin extends Model { }

Admin.schema = {
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

Admin.init(Admin.schema, {
    sequelize,
    modelName: "Admin",
    tableName: 'admin',
    timestamps: false
})

module.exports = Admin;
