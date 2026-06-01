const praposalService = require("../services/proposalQuotationService");

const createPraposal = async (req, res) => {
  try {
    console.log("vachindhiii", req.body);
    const praposal = await praposalService.createPraposal(req.body);
    console.log("vachindhiii222222222222", praposal);
    res.status(201).json(praposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const updateService = await praposalService.updateService(
      req.body.serviceData
    );
    res.status(201).json(updateService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPraposal = async (req, res) => {
  try {
    const praposal = await praposalService.getPraposal();
    res.status(200).json(praposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPraposalByOrgId = async (req, res) => {
  const id = req.params.id;
  const { page = 0, pageSize = 10, month, year, search = "" } = req.query; // Capture search query
  const pageInt = parseInt(page, 10);
  const parseYear = year ? parseInt(year, 10) : null;
  // const parseMonth = month ? parseInt(month, 10) : null;
  const pageSizeInt = parseInt(pageSize, 10);

  try {
    // Pass the search query along with page and pageSize to the service
    const praposal = await praposalService.getProposalByOrgId(
      id,
      pageInt,
      pageSizeInt,
      search,
      parseYear,
      month
    );
    res.status(200).json(praposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error, "errorrr");
  }
};

// const getProposalByOrgIdForBilling = async (req, res) => {
//   const id = req.params.id;
//   // const {showPreviousData} = req.query;  // Capture search query

//   try {
//     // Pass the search query along with page and pageSize to the service
//     const praposal = await praposalService.getProposalByOrgIdForBilling(id);
//     res.status(200).json(praposal);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.log(error, "errorrr");
//   }
// };

const getProposalByOrgIdForBilling = async (req, res) => {
  const id = req.params.id;
  const { isPrevious6Months = 'false', isPreviousLeads6Months = 'false' } = req.query;
  // const {showPreviousData} = req.query;  // Capture search query

  try {
    // Pass the search query along with page and pageSize to the service
    const praposal = await praposalService.getProposalByOrgIdForBilling(id, isPrevious6Months === 'true', 
      isPreviousLeads6Months === 'true');
    res.status(200).json(praposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error, "errorrr");
  }
};

const getproposalByOrgIdForTable = async (req, res) => {
  const id = req.params.id;
const {page = 0, pageSize = 10, month, year} = req.query;
const pageInt = parseInt(page, 10);
const parseYear = year ? parseInt(year, 10) : null;
const pageSizeInt = parseInt(pageSize, 10)
  try {
    const propsal = await praposalService.getproposalByOrgIdForTable(id, pageInt,pageSizeInt, parseYear, month );
    res.status(200).json(propsal);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error, "error");
  }
};

const getPraposalById = async (req, res) => {
  try {
    const praposal = await praposalService.getPraposalById(req.params.id);
    if (praposal) {
      res.status(200).json(praposal);
    } else {
      res.status(404).json({ message: "praposal not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePraposal = async (req, res) => {
  try {
    const praposal = await praposalService.updatePraposal(
      req.params.id,
      req.body
    );
    res.status(200).json(praposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePraposal = async (req, res) => {
  try {
    await praposalService.deletePraposal(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPraposal,
  getPraposal,
  getPraposalByOrgId,
  getPraposalById,
  updatePraposal,
  deletePraposal,
  updateService,
  getProposalByOrgIdForBilling,
  getproposalByOrgIdForTable,
};
