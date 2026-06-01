const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

    const Question = sequelize.define('Question', {
      survey_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Surveys',
          key: 'id',
        },
      },
      question_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      question_type: {
        type: DataTypes.STRING,
        allowNull: false, // 'multiple-choice', 'text', etc.
      },
      options: {
        type: DataTypes.JSONB,
      }
    });
  

    module.exports = Question;