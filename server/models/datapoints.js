'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class datapoints extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  datapoints.init({
    datapoints: DataTypes.STRING,
    text_type: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'datapoints',
  });
  return datapoints;
};