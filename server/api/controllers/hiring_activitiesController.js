const hiringActivitiesService = require("../services/hiring_activitiesService");
const parseRequestFiles = require("../../fileUpload/requestedfile");

// const createHiringActivity = async (req, res) => {
//   try {
//     console.log('vachindhi controller',req);
//     const payload = await parseRequestFiles(req);
//     console.log('after pasre',payload);
//     req.body = payload.fields;
//     req.files = payload.files;

//     const { body,files } = req;
//     console.log('in contorllerrrs', body, files);
//     const activity = await hiringActivitiesService.createHiringActivity(body, files);
//     res.status(201).json(activity);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const createHiringActivity = async (req, res) => {
  try {
    const payload = await parseRequestFiles(req);

    // Extract single values from arrays
    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0]; // Assuming single value per key
    }
    req.files = payload.files;
    const { body, files } = req;

    const activity = await hiringActivitiesService.createHiringActivity(
      body,
      files
    );
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHiringActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const activities = await hiringActivitiesService.getHiringActivities();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getHiringActivitiesByOrgId = async (req, res) => {
  const id = req.params.id
  const { page = 0, pageSize = 10, search = "" } = req.query
  const pageInt = parseInt(page, 10)
  const pageSizeInt = parseInt(pageSize, 10)

  try {
    const activities = await hiringActivitiesService.getHiringActivitiesByOrgID(id, pageInt, pageSizeInt, search);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const hiringActivitiesforDashobard = async (req, res) => {

  try {
    const { id } = req.params
    const activities = await hiringActivitiesService.hiringActivitiesforDashobard(id);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getHiringActivityById = async (req, res) => {
  try {
    const activity = await hiringActivitiesService.getHiringActivityById(
      req.params.id
    );
    if (activity) {
      res.status(200).json(activity);
    } else {
      res.status(404).json({ message: "Hiring activity record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateHiringActivity = async (req, res) => {
  try {
    const activity = await hiringActivitiesService.updateHiringActivity(
      req.params.id,
      req.body
    );
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteHiringActivity = async (req, res) => {
  try {
    await hiringActivitiesService.deleteHiringActivity(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createHiringActivity,
  getHiringActivities,
  getHiringActivitiesByOrgId,
  hiringActivitiesforDashobard,
  getHiringActivityById,
  updateHiringActivity,
  deleteHiringActivity,
};
