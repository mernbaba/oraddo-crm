const testFormService = require("../services/testFormService");

// const createCandidate = async (req, res) => {
//   try {
//     const candidate = await testFormService.createCandidate(req.body);
//     return res
//       .status(201)
//       .json({ message: "created successfully", data: candidate });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const createCandidate = async (req, res) => {
    try {
      const { candidate_name, phone_number, email_address, college_name, job_type } = req.body;
      const result = await testFormService.createCandidate({
        candidate_name,
        phone_number,
        email_address,
        college_name,
        job_type,
      });
  
      return res.status(201).json({
        message: "Candidate created and assigned random questions",
        candidate: result.candidate.id,
        // assignedQuestions: result.assignedQuestions,
        token: result.token,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  const getCandidateWithQuestions = async (req, res) => {
    try {
      const { id } = req.params;
      const candidateData = await testFormService.getCandidateWithQuestions(id);
      return res.status(200).json(candidateData);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

const getCandidate = async (req, res) => {
  try {
    const getdata = await testFormService.getCandidates();
    return res
      .status(200)
      .json({ message: "getdata successfully", data: getdata });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCandidateById = async (req, res) => {
  try {
    const getCandidate = await testFormService.getCandidatesById(req.params.id);
    return res.status(200).json({ data: getCandidate });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateMarks=async(req,res)=>{
  try {
    const candidate = await testFormService.updateMarks(req.params.id,req.body)
    return res.status(200).json({ data: candidate });
  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }
}

const updateTaskLink=async(req,res)=>{
  try {
    const candidate = await testFormService.updateTaskLink(req.params.id,req.body)
    return res.status(200).json({ data: candidate });
  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createCandidate,
  getCandidateWithQuestions,
  getCandidate,
  getCandidateById,
  updateMarks,
  updateTaskLink,
};
