'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employee_expenses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  employee_expenses.init({
    notes: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    date: DataTypes.DATE,
    receipt: DataTypes.STRING,
    expenseTitle: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'employee_expenses',
  });
  return employee_expenses;
};