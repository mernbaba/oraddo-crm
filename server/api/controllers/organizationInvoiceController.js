const OrganizationInvoice= require('../services/organizationInvoiceService');

const createOrganizationInvoice = async (req, res) => {
  try {
    const invoice = await OrganizationInvoice.createOrganizationInvoice(req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.invoice });
  }
};

module.exports = {
    createOrganizationInvoice
  };