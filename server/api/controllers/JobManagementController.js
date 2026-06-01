const jobService = require('../services/JobManagementServices');
const parseRequestFiles = require("../../fileUpload/requestedfile");

const createJob = async (req, res) => {
  try {
    const payload = await parseRequestFiles(req)
    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0]; // Assuming single value per key
    }
    req.files = payload.files;
    const {body, files} = req;
    const job = await jobService.createJob(body,files);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await jobService.getJobs();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobsByOrganizationId=async(req, res)=>{
  const id=req.params.id
  try{
    const jobs = await jobService.getJobsByOrganizationId(id);
    res.status(200).json(jobs);
  } catch (error) {
    console.log(error,"errorrr")
    res.status(500).json({ error: error.message });
  }
}
const getJobById = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateJob = async (req, res) => {
  console.log(req.params.id,'idididididiididididi');
  console.log(req.body,'bososososososo');
  
  
  try {
    // const payload = await parseRequestFiles(req)
    // req.body = {};
    // for (const [key, value] of Object.entries(payload.fields)) {
    //   req.body[key] = value[0]; // Assuming single value per key
    // }
    // req.files = payload.files;
    // const {body, files} = req;
    const job = await jobService.updateJob(req.params.id, req.body);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    await jobService.deleteJob(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobsByOrganizationId,
  getJobById,
  updateJob,
  deleteJob
};


