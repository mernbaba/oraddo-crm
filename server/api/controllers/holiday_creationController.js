const { response } = require("express");
const holidayCreationService = require("../services/holiday_creationService");

const createHoliday = async (req, res) => {
  try {
    const holiday = await holidayCreationService.createHoliday(req.body);
    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHolidays = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const holidays = await holidayCreationService.getHolidays();
    res.status(200).json(holidays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHolidaysByOrganizationId = async (req, res) => {
  const { id } = req.params;
  const { year } = req.query;
  console.log("yearrrrrrrrrrrr", year);
  try {
    const holiday = await holidayCreationService.getHolidaysByOrganizationId(
      id,
      year
    );
    if (holiday) {
      res.status(200).json(holiday);
    } else {
      res.status(404).json({ message: "Holiday not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHolidayById = async (req, res) => {
  try {
    const holiday = await holidayCreationService.getHolidayById(req.params.id);
    if (holiday) {
      res.status(200).json(holiday);
    } else {
      res.status(404).json({ message: "Holiday not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateHoliday = async (req, res) => {
  try {
    const holiday = await holidayCreationService.updateHoliday(
      req.params.id,
      req.body
    );
    res.status(200).json(holiday);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteHoliday = async (req, res) => {
  try {
    const response = await holidayCreationService.deleteHoliday(req.params.id);
    res.status(204).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
