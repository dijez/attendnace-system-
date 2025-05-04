const {Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'khadijah0001',{
    host:"localhost",
    dialect: "postgres",
    logging: false
});

sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Error connecting to DB:', err));


    module.exports = sequelize;