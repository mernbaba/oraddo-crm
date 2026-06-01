const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const TestQuestions = sequelize.define("QuestionsTable", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  question_type:{
    type: DataTypes.ENUM("Technical", "NonTechnical"),
    allowNull: true,
  },
  option1: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  option2: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  option3: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  option4: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = TestQuestions;
