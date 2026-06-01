const express = require('express');
const leadCreationController = require('../controllers/leadCreationController');
const { Middleware } = require('../middleware/authMiddleware');
const multer = require("multer");

const router = express.Router();

// const upload = multer({storage:multer.memoryStorage()})
const storage = multer.memoryStorage(); // Store files in memory as Buffer

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

router.post("/fileUpload/:id", upload.single('file'), leadCreationController.bulkUploadFiles);

router.post('/leadCreations', leadCreationController.createLeadCreation);
router.get('/leadCreations', leadCreationController.getLeadCreations);
router.get('/leadCreationByOrganization/:id', leadCreationController.getLeadCreationsByOrganization)
router.get('/leadCreations/:id', leadCreationController.getLeadCreationById);
router.put('/leadCreations/:id', leadCreationController.updateLeadCreation);
router.delete('/leadCreations/:id', leadCreationController.deleteLeadCreation);

module.exports = router;
