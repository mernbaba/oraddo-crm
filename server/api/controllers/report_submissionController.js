const reportSubmissionService = require("../services/reportSubmissionService");

const createReport = async (req, res) => {
  try {
    const report = await reportSubmissionService.createReport(req.body);
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await reportSubmissionService.getReports();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReportsByOrgId = async (req, res) => {
  const id = req.params.id
  const { page = 0, pageSize = 10, search = "", year, month } = req.query;
  const pageInt = parseInt(page, 10);
  const pageSizeInt = parseInt(pageSize, 10);
  const yearInt = parseInt(year, 10);
  try {
    const reports = await reportSubmissionService.getReportsByOrgId(id, pageInt, pageSizeInt, search, yearInt, month);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const id = req.params.id;
    const { page = 0, pageSize = 10 } = req.query;
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const report = await reportSubmissionService.getReportById(id, pageInt, pageSizeInt);
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: "Report not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReport = async (req, res) => {
  try {
    const report = await reportSubmissionService.updateReport(
      req.params.id,
      req.body
    );
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    await reportSubmissionService.deleteReport(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportsByOrgId,
  getReportById,
  updateReport,
  deleteReport,
};
