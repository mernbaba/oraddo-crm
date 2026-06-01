const { createModuleWithLessons, updateLessonStatus} = require('../services/trainingModuleServices');

async function createModule(req, res) {
    try {
        const data = req.body;
        const result = await createModuleWithLessons(data);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateLessonStatusController(req, res) {
    try {
      const { traineeId, lessonId, status } = req.body;
      const updatedStatus = await updateLessonStatus(traineeId, lessonId, status);
      res.status(200).json(updatedStatus);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}




module.exports = { createModule, updateLessonStatusController };