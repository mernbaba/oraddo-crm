const { Op } = require("sequelize");
const holiday_creation = require("../models/holiday_creation");

const createHoliday = async (data) => {
  try {
    const holiday = await holiday_creation.create(data);
    return holiday;
  } catch (error) {
    throw error;
  }
};

const getHolidays = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const holidays = await holiday_creation.findAll();
    return holidays;
  } catch (error) {
    throw error;
  }
};

const getHolidaysByOrganizationId = async (id,year) => {
  try {
    // const offset = (page - 1) * limit;
    const holidays = await holiday_creation.findAll({
      where: {
        organizationId: id,
        date: {
          [Op.and]: [
            { [Op.gte]: `${year}-01-01` }, // Start of the specified year
            { [Op.lte]: `${year}-12-31` }, // End of the specified year
          ],
        },
      },
      order: [["date", "ASC"]], // Sort by date in ascending order
    });
    console.log(holidays, "holidays....");
    return holidays;
  } catch (error) {
    throw error;
  }
};

const getHolidayById = async (id) => {
  try {
    const holiday = await holiday_creation.findByPk(id);
    return holiday;
  } catch (error) {
    throw error;
  }
};

const updateHoliday = async (id, data) => {
  try {
    const holiday = await holiday_creation.update(data, {
      where: { id: id },
    });
    return holiday;
  } catch (error) {
    throw error;
  }
};

const deleteHoliday = async (id) => {
  try {
    const response = await holiday_creation.destroy({
      where: { id: id },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createHoliday,
  getHolidays,
  getHolidayById,
  updateHoliday,
  deleteHoliday,
  getHolidaysByOrganizationId,
};
