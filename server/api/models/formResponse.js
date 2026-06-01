const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Response = sequelize.define("Response", {
  QuestionSurvey_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Surveys",
      key: "id",
    },
  },
  question_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Questions",
      key: "id",
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Emp_onboardings",
      key: "id",
    },
    // allowNull: false,
  },
  response_text: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Submitted"),
    allowNull: true,
  },
});

module.exports = Response;
