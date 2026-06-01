
const express = require("express");
const router = express.Router();

const questionController=require("../controllers/questionController");


router.post("/creationQuestion", questionController.createQuestion);
router.get("/creationQuestion", questionController.getQuestions);
router.get("/creationQuestion/:id", questionController.getQuestionsById);
router.put("/creationQuestion/:id", questionController.updateQuestion);
router.get("/creationQuestion/:id", questionController.deleteQuestion);

module.exports = router;