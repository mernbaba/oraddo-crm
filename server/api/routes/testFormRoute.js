const express = require("express");
const router = express.Router();

const testFormController = require("../controllers/testFormController");

router.post("/createCandidate", testFormController.createCandidate); //create candidate along with random questions assegned
router.get("/candidatewithQuestions/:id", testFormController.getCandidateWithQuestions);//get candidateData with assignedQuestionss

router.put("/updateMarks/:id",testFormController.updateMarks);//Marks will assigned and get status
router.put("/updateTaskLink/:id",testFormController.updateTaskLink); //ByStatus randomly assign task


router.get("/createCandidate", testFormController.getCandidate); // get all the candidates with their entire data

router.get("/createCandidate/:id", testFormController.getCandidateById); // get candidate by id with he/her details

module.exports = router;
