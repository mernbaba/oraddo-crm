const invoiceService = require("../services/InvoiceService");

const createInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getInvoiceByOrgId = async (req, res) => {
//   const id = req.params.id;
//   console.log(id,"idddddddddd")
//   try {
//     const invoice = await invoiceService.getInvoiceByOrgId(id);
//     console.log(invoice, "invoiceee")
//     return invoice;
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



const getInvoiceByOrgId = async (req, res) => {
  const id = req.params.id; // Get the organization ID from the request
  console.log(id, "Organization ID received");

  try {
    const invoice = await invoiceService.getInvoiceByOrgId(id);
    console.log(invoice, "Fetched Invoice Data"); // Log the invoice data for debugging

    if (!invoice) {
      return res.status(404).json({ message: "No invoices found for this organization ID" });
    }

    // Send the invoice data as a JSON response
    return res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getInvoiceByOrgIdInInvoicePage = async (req, res) => {
  const id = req.params.id; // Get the organization ID from the request
  console.log(id, "Organization ID received");
  const { page = 0, pageSize = 10, month, year} = req.query;  // Capture search query
  const pageInt = parseInt(page, 10);
  const parseYear = year ? parseInt(year, 10): null;
  const pageSizeInt = parseInt(pageSize, 10);
  try {
    const invoice = await invoiceService.getInvoiceByOrgIdInInvoicePage(id, pageInt, pageSizeInt, parseYear, month);
    console.log(invoice, "Fetched Invoice Data"); // Log the invoice data for debugging

    if (!invoice) {
      return res.status(404).json({ message: "No invoices found for this organization ID" });
    }

    // Send the invoice data as a JSON response
    return res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getInvoiceByOrgIdForFinance = async (req, res) => {
  const id = req.params.id; // Get the organization ID from the request
  console.log(id, "Organization ID received");
    const {year}=req.query;
    const yearInt = parseInt(year, 10);
  try {
    const invoice = await invoiceService.getInvoiceByOrgIdForFinance(id,yearInt);
    console.log(invoice, "Fetched Invoice Data"); // Log the invoice data for debugging

    if (!invoice) {
      return res.status(404).json({ message: "No invoices found for this organization ID" });
    }

    // Send the invoice data as a JSON response
    return res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



const getInvoiceById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    if (invoice) {
      res.status(200).json(invoice);
    } else {
      res.status(404).json({ message: "Invoice not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInvoice = async (req, res) => {
  console.log(req.params.id, 'iiiiiiidddd', req.body);

  try {
    const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    await invoiceService.deleteInvoice(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateInvoiceAi = async (req, res) => {
  try {
    const { prompt } = req.body;
    const draft = await invoiceService.generateInvoice(prompt);
    res.status(200).json(draft);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
    console.log(error, "ai invoice generation error");
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceByOrgId,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoiceByOrgIdInInvoicePage,
  getInvoiceByOrgIdForFinance,
  generateInvoiceAi,
};
