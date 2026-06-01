const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Datapoints = sequelize.define('Datapoints', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  datapoints: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text_type:{
    type: DataTypes.TEXT,
    allowNull: true
  },
  status:{
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  order:{
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isrequired:{
    type:DataTypes.BOOLEAN,
    allowNull:true
  }
});

module.exports = Datapoints;
