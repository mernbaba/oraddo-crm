const questionService=require("../services/questionService");

const createQuestion = async (req, res) => {
  try {
    const question = await questionService.createQuestion(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await questionService.getQuestions();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuestionsById= async (req, res) => {
  const id=req.params.id
  try {
    const question = await questionService.getQuestionsById(id);
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await questionService.updateQuestion(
      req.params.id,
      req.body
    );
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteQuestion = async (req, res) => {
  try {
    await questionService.deleteQuestions(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports={
    createQuestion,
    getQuestions,
    getQuestionsById,
    updateQuestion,
    deleteQuestion
}