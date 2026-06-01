const leavesService = require("../services/leavesCreationService");

const createLeave = async (req, res) => {
  try {
    const leaves = req.body;
    console.log("leavessss", leaves);
    const leave = await leavesService.createLeave(leaves);
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeaves = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const leaves = await leavesService.getLeaves();
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeavesByOrganizationId = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 0, pageSize = 10, year, month, search="" } = req.query;
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const yearInt = parseInt(year, 10);



    const leaves = await leavesService.getLeavesByOrganizationId(
      id,
      pageInt,
      pageSizeInt,
      yearInt,
      month,
      search
    );
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getLeavesforLeaveManagement = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 0, pageSize = 10, Emp_id} = req.query;
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    // const yearInt = parseInt(year, 10);


    const leaves = await leavesService.getLeavesforLeaveManagement(
      id,
      pageInt,
      pageSizeInt,
      Emp_id
      // yearInt,
      // month
    );
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// getLeavesbyId

const getLeavebyId = async (req, res) => {
  try {
    const leave = await leavesService.getLeavesbyId(req.params.id);
    if (leave) {
      res.status(200).json(leave);
    } else {
      res.status(404).json({ message: "Leave not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getLeaveById = async (req, res) => {
  try {
    const leave = await leavesService.getLeaveById(req.params.id);
    if (leave) {
      res.status(200).json(leave);
    } else {
      res.status(404).json({ message: "Leave not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLeave = async (req, res) => {
  try {
    const empId = req.params.id;
    const payload = req.body;
    const leave = await leavesService.updateLeave(empId, payload);
    console.log("controllerrrrr", leave);
    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLeave = async (req, res) => {
  try {
    await leavesService.deleteLeave(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLeave,
  getLeaves,
  getLeavebyId,
  getLeaveById,
  updateLeave,
  deleteLeave,
  getLeavesByOrganizationId,
  getLeavesforLeaveManagement
};
