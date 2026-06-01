const questionModel = require("../models/questionsModel");

const createQuestion = async (data) => {
  try {
    const createQuestion = await questionModel.create(data);
    return createQuestion;
  } catch (error) {
    throw new Error("Error creating. Please try again.");
  }
};

const getQuestions = async () => {
    try {
      const questions = await questionModel.findAll();
      return questions;
    } catch (error) {
      console.log(error, "errorrrrr");
      throw new Error("Error fetching. Please try again.");
    }
  };

  const getQuestionsById = async (id) => {
    try {
      const question = await questionModel.findByPk(id);
      return question;
    } catch (error) {
      console.log(error, "errrorrrr");
      throw new Error("error getting");
    }
  };

  const updateQuestion = async (id, data) => {
    try {
      const updateQuestion = await questionModel.update(data, {
        where: { id: id },
      });
      return updateQuestion;
    } catch (error) {
      throw error;
    }
  };

  const deleteQuestions = async (id) => {
    try {
      await questionModel.destroy({
        where: { id: id },
      });
    } catch (error) {
      throw error;
    }
  };

  module.exports={
    createQuestion,
    getQuestions,
    getQuestionsById,
    updateQuestion,
    deleteQuestions
  }

