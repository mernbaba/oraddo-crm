const e = require("express");
const HrPanel = require("../models/HrPanel");
const Organization = require("../models/OrganizationModule");

const createPanelData = async (panelData) => {
  console.log(panelData, "panelDataaaaa");
  try {
    const PanelData = await HrPanel.create(panelData);
    return PanelData;
  } catch (error) {
    console.error("Sequelize Error:", error);
    throw new Error("Error creating panel data");
  }
};

const getAllPanelData = async () => {
  try {
    const PanelData = await HrPanel.findAll({
      include: [
        {
          model: HrPanel,
          as: "panel_data",
        },
      ],
    });
    return PanelData;
  } catch (error) {
    throw new Error("Error retrieving panel data");
  }
};

const getAllPanelDataById = async (id) => {
  console.log(id, "idddddorgid");
  try {
    console.log("enterintotrypanel");
    const PanelData = await HrPanel.findOne({ where: { organizationID: id } });
    console.log(PanelData, "PanelDatattttt");
    return PanelData;
  } catch (error) {
    throw error;
  }
};

const updatePanelData = async (organizationID, panelData) => {
  console.log("Updating panel data for organizationID:", organizationID);
  console.log("Data to update (original):", panelData);

  if (
    panelData.late_punchin === true &&
    (!panelData.gracePeriod ||
      !/^\d{2}:\d{2}:\d{2}$/.test(panelData.gracePeriod))
  ) {
    throw new Error("Invalid or missing gracePeriod for late punch-in");
  }

  const sanitizedPanelData = {
    ...panelData,
    gracePeriod: panelData.late_punchin === true ? panelData.gracePeriod : null,
  };

  console.log("Data to update (sanitized):", sanitizedPanelData);

  try {
    const [updated] = await HrPanel.update(sanitizedPanelData, {
      where: { organizationID: organizationID },
    });
    console.log("Rows updated:", updated);
    if (updated) {
      const PanelData = await HrPanel.findOne({
        where: { organizationID: organizationID },
      });
      return PanelData;
    }
    return null;
  } catch (error) {
    console.error("Error in updatePanelData:", error);
    throw new Error("Error updating panel data");
  }
};
const deletePanelData = async (id) => {
  try {
    const deleted = await HrPanel.destroy({ where: { organizationID: id } });
    return deleted;
  } catch (error) {
    throw new Error("Error deleting Panel Data");
  }
};

module.exports = {
  createPanelData,
  getAllPanelData,
  getAllPanelDataById,
  updatePanelData,
  deletePanelData,
};
