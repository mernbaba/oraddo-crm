const AdminSettings = require("../models/AdminSettings");

// Singleton: always read/write the single row with id=1
const SETTINGS_ID = 1;

exports.getSettings = async (req, res) => {
  try {
    const [settings] = await AdminSettings.findOrCreate({
      where: { id: SETTINGS_ID },
      defaults: { id: SETTINGS_ID },
    });
    res.status(200).json({ data: settings });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings", details: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const [settings] = await AdminSettings.findOrCreate({
      where: { id: SETTINGS_ID },
      defaults: { id: SETTINGS_ID },
    });
    await settings.update(req.body);
    res.status(200).json({ message: "Settings saved successfully", data: settings });
  } catch (error) {
    res.status(500).json({ error: "Failed to save settings", details: error.message });
  }
};
