const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const modules = sequelize.define('modules', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = modules;
