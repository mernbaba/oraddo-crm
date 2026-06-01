const InboundLeadsService = require("../services/InboundLeadsService");

const createInboundlead = async (req, res) => {
  try {
    let payload = req.body;
    console.log(payload, "njkbjb");

    const InboundLead = await InboundLeadsService.CreateInboundLead(payload);
    res.status(201).json(InboundLead);
  } catch (error) {
    console.log(error, "jbhbhjb");

    res.status(500).json({ error: error.message });
  }
};

const getAllInboundLeads = async (req, res) => {
  try {
    const InboundLeads = await InboundLeadsService.getAllInboundLeads();
    res.status(200).json({ InboundLeads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllInboundLeadsbyOrganization = async (req, res) => {
  try {

    const InboundLeads =
      await InboundLeadsService.getAllInboundLeadsbyOrganization(req.params.id);
    res.status(200).json({ InboundLeads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllInboundLeadsfromOrganization = async (req, res) => {
  try {
    const id = req.params.id;
    const { page = 0, pageSize = 10} = req.query;
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const InboundLeads =
      await InboundLeadsService.getAllInboundLeadsfromOrganization(id, pageInt, pageSizeInt);
    res.status(200).json(InboundLeads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getInboundLeadById = async (req, res) => {
  try {
    const InboundLead = await InboundLeadsService.getInboundLeadsById(
      req.params.id
    );
    if (InboundLead) {
      res.status(200).json(InboundLead);
    } else {
      res.status(404).json({ message: "Inbound Lead Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const UpdatedInboundLead = async (req, res) => {
  try {
    const InboundLeads = await InboundLeadsService.updateInboundLead(
      req.params.id,
      req.body
    );
    if (InboundLeads) {
      res.status(200).json(InboundLeads);
    } else {
      res.status(404).json({ message: "Inbound Lead Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const DeleteInbounLead = async (req, res) => {
  try {
    const Deleted = await InboundLeadsService.deleteInboundLead(req.params.id);
    if (Deleted) {
      res.status(200).json({ message: "Inbound Lead deleted successfully" });
    } else {
      res.status(404).json({ message: "Inbound Lead Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createInboundlead,
  getAllInboundLeads,
  getInboundLeadById,
  UpdatedInboundLead,
  DeleteInbounLead,
  getAllInboundLeadsbyOrganization,
  getAllInboundLeadsfromOrganization
};
