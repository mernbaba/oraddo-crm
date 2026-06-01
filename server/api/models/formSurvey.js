const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

    const Survey = sequelize.define('Survey', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false, // 'survey' or 'quiz'
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }, 
      date:{
        type: DataTypes.DATE,
        allowNull:true,
      }
    });

module.exports = Survey;

  