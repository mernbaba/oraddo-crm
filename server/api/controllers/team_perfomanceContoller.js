const teamPerformanceService = require("../services/team_perfomanceService");

const createTeamPerformance = async (req, res) => {
  try {
    const performance = await teamPerformanceService.createTeamPerformance(
      req.body
    );
    res.status(201).json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeamPerformances = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.params.limit;
    const performances = await teamPerformanceService.getTeamPerformances();
    res.status(200).json(performances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeamPerformancesByOrganizationId = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 0, pageSize = 10, year, month, search = "" } = req.query;

    // Ensure numeric values
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const yearInt = parseInt(year, 10);
    // const monthInt = parseInt(month, 10);

    const performance = await teamPerformanceService.getTeamPerformancesByOrganizationId(
      id,
      pageInt,
      pageSizeInt,
      yearInt,
      month,
      search
    );
    if (performance) {
      res.status(200).json(performance);
    } else {
      res.status(404).json({ message: "Team performance record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPerformancesByEmployee = async (req, res) => {
  try {
    const performances = await teamPerformanceService.getPerformancesByEmployee(
      req.params.empId
    );
    res.status(200).json(performances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeamPerformanceById = async (req, res) => {
  try {
    const performance = await teamPerformanceService.getTeamPerformanceById(
      req.params.id
    );
    if (performance) {
      res.status(200).json(performance);
    } else {
      res.status(404).json({ message: "Team performance record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTeamPerformance = async (req, res) => {
  try {
    const performance = await teamPerformanceService.updateTeamPerformance(
      req.params.id,
      req.body
    );
    res.status(200).json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTeamPerformance = async (req, res) => {
  try {
    await teamPerformanceService.deleteTeamPerformance(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const getEmployeesWithoutPerformance = async (req, res) => {
  console.log("getEmployeesWithoutSalaries controller called...", req);
  const { id } = req.params;
  const { selectedYear, selectedMonth } = req.query
  console.log(selectedYear, selectedMonth, "selectedYear, selectedMonth");

const month = months.indexOf(selectedMonth) + 1;
console.log(month, "month");
  try {
    console.log("Before calling service");
    const salary = await teamPerformanceService.getEmployeesWithoutPerformance(
      id,
      selectedYear,
      month
    );
    console.log("After calling service");

    if (salary) {
      res.status(200).json(salary);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error in getEmployeesWithoutSalaries:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTeamPerformance,
  getTeamPerformances,
  getPerformancesByEmployee,
  getTeamPerformanceById,
  updateTeamPerformance,
  deleteTeamPerformance,
  getTeamPerformancesByOrganizationId,
  getEmployeesWithoutPerformance
};
