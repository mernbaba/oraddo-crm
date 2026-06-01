const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const testCandidate = require("../models/testFormName");
const questionModel = require("../models/questionsModel");

const CandidateQuestions = sequelize.define("candidate_questions", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CandidateDetailId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: testCandidate, key: "id" },
  },
  QuestionsTableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: questionModel, key: "id" },
  },
});

  // testCandidate.belongsToMany(questionModel, {
  //   through: "candidate_questions",
  // });

  // questionModel.belongsToMany(testCandidate, {
  //   through: "candidate_questions",
  // });


testCandidate.belongsToMany(questionModel, { through: CandidateQuestions });
questionModel.belongsToMany(testCandidate, { through: CandidateQuestions });

module.exports = CandidateQuestions;
