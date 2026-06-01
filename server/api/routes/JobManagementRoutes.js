const express = require('express');
const jobController = require('../controllers/JobManagementController');

const router = express.Router();

router.post('/jobs', jobController.createJob);
router.get('/jobs', jobController.getJobs);
router.get('/jobsByOrganizationId/:id',jobController.getJobsByOrganizationId);
router.get('/jobs/:id', jobController.getJobById);
router.put('/jobs/:id', jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);

module.exports = router;
