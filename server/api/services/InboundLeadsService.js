const { where } = require("sequelize");
const Inbound_Leads = require("../models/InboundLeads");

const CreateInboundLead = async (data) => {
  console.log(data, "leadData");
  try {
    const InboundLead = await Inbound_Leads.create(data);
    console.log(InboundLead, "jhdhghg");
    return InboundLead;
  } catch (err) {
    throw new Error("Inbound Lead Not Created");
  }
};

const getAllInboundLeads = async () => {
  try {
    const InboundLeads = await Inbound_Leads.findAll();
    return InboundLeads;
  } catch (error) {
    throw new Error("Error Getting InboundLeads");
  }
};

const getAllInboundLeadsbyOrganization = async (id) => {
  console.log(id, "iddsasss")
  try {
    const InboundLeads = await Inbound_Leads.findAll({
      where: { organizationID: id },
    });
    console.log(Inbound_Leads, "Inbound_Leadssss")
    return InboundLeads;
  } catch (error) {
    console.log(error, "Error Getting InboundLeads");
    throw new Error("Inbound_Leadssss");
  }
};


const getAllInboundLeadsfromOrganization = async (id, page, pageSize) => {
  console.log(id, "iddsasss")
  try {
    const offset = page * pageSize

    const totalLeads = await Inbound_Leads.count({ where: { organizationID: id } });

    const InboundLeads = await Inbound_Leads.findAll({
      where: { organizationID: id },
      offset: offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']],
    });
    console.log(Inbound_Leads, "Inbound_Leadssss")
    return { InboundLeads, totalLeads };
  } catch (error) {
    console.log(error, "Error Getting InboundLeads");
    throw new Error("Inbound_Leadssss");
  }
};

const getInboundLeadsById = async (id) => {
  console.log(id, "ifff");

  try {
    const InboundLead = await Inbound_Leads.findAll({ where: { id: id } });
    return InboundLead;
  } catch (error) {
    throw new Error("Error Getting InboundLead");
  }
};

const updateInboundLead = async (id, data) => {
  console.log(id, data, "dattttt");

  try {
    const [UpdatedInboundLead] = await Inbound_Leads.update(data, {
      where: { id },
    });
    if (UpdatedInboundLead) {
      const updateInboundLead = await Inbound_Leads.findByPk(id);
      return updateInboundLead;
    }
    throw new Error("Lead not Found");
  } catch (error) {
    throw new Error("Error Updating InboundLead");
  }
};

const deleteInboundLead = async (id) => {
  try {
    const Delete = await Inbound_Leads.destroy({ where: { id } });
    return Delete;
  } catch (error) {
    throw new Error("Error deleting Inbound Leads");
  }
};

module.exports = {
  CreateInboundLead,
  getAllInboundLeads,
  getInboundLeadsById,
  updateInboundLead,
  deleteInboundLead,
  getAllInboundLeadsbyOrganization,
  getAllInboundLeadsfromOrganization
};
