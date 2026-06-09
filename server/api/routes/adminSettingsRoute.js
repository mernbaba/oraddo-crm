const express = require("express");
const router = express.Router();
const adminSettingsController = require("../controllers/adminSettingsController");

router.get("/admin-settings", adminSettingsController.getSettings);
router.put("/admin-settings", adminSettingsController.updateSettings);

module.exports = router;
