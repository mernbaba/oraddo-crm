// const salaryAdvanceService = require("../services/salary_advance");

// const createSalaryAdvance = async (req, res) => {
//   try {
//     const salaryAdvance = await salaryAdvanceService.createSalaryAdvance(
//       req.body
//     );
//     res.status(201).json(salaryAdvance);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getSalaryAdvances = async (req, res) => {
//   try {
//     console.log("incontroller");
//     const page = req.query.page;
//     const limit = req.params.limit;
//     const salaryAdvances = await salaryAdvanceService.getSalaryAdvances();

//     res.status(200).json(salaryAdvances);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getSalaryAdvanceById = async (req, res) => {
//   try {
//     const salaryAdvance = await salaryAdvanceService.getSalaryAdvanceById(
//       req.params.id
//     );
//     if (salaryAdvance) {
//       res.status(200).json(salaryAdvance);
//     } else {
//       res.status(404).json({ message: "Salary advance record not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateSalaryAdvance = async (req, res) => {
//   try {
//     const salaryAdvance = await salaryAdvanceService.updateSalaryAdvance(
//       req.params.id,
//       req.body
//     );
//     res.status(200).json(salaryAdvance);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const deleteSalaryAdvance = async (req, res) => {
//   try {
//     await salaryAdvanceService.deleteSalaryAdvance(req.params.id);
//     res.status(204).end();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   createSalaryAdvance,
//   getSalaryAdvances,
//   getSalaryAdvanceById,
//   updateSalaryAdvance,
//   deleteSalaryAdvance,
// };

const salaryAdvanceService = require("../services/salary_advance");

const createSalaryAdvance = async (req, res) => {
  try {
    const salaryAdvance = await salaryAdvanceService.createSalaryAdvance(
      req.body
    );
    res.status(201).json(salaryAdvance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalaryAdvances = async (req, res) => {
  try {
    console.log("incontroller");
    const page = req.query.page;
    const limit = req.params.limit;
    const salaryAdvances = await salaryAdvanceService.getSalaryAdvances();

    res.status(200).json(salaryAdvances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalaryAdvancesByOrganizationId = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 0, pageSize = 10 } = req.query;
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);

    const salaryAdvance = await salaryAdvanceService.getSalaryAdvancesByOrganizationId(
      id,
      pageInt,
      pageSizeInt,
    );
    if (salaryAdvance) {
      res.status(200).json(salaryAdvance);
    } else {
      res.status(404).json({ message: "Salary advance record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalaryAdvanceById = async (req, res) => {
  try {
    const salaryAdvance = await salaryAdvanceService.getSalaryAdvanceById(
      req.params.id
    );
    if (salaryAdvance) {
      res.status(200).json(salaryAdvance);
    } else {
      res.status(404).json({ message: "Salary advance record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSalaryAdvance = async (req, res) => {
  try {
    const salaryAdvance = await salaryAdvanceService.updateSalaryAdvance(
      req.params.id,
      req.body
    );
    res.status(200).json(salaryAdvance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSalaryAdvance = async (req, res) => {
  try {
    await salaryAdvanceService.deleteSalaryAdvance(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSalaryAdvance,
  getSalaryAdvances,
  getSalaryAdvanceById,
  updateSalaryAdvance,
  deleteSalaryAdvance,
  getSalaryAdvancesByOrganizationId
};
