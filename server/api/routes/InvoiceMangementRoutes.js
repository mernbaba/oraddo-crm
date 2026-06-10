const express = require("express");
const invoiceController = require("../controllers/invoiceManagement");
const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/invoices",invoiceController.createInvoice);
router.post("/invoices/ai/generate", invoiceController.generateInvoiceAi);
router.get("/invoices",invoiceController.getInvoices);
router.get("/invoiceByOrganization/:id",invoiceController.getInvoiceByOrgId);
router.get("/invoiceByorgId/:id",invoiceController.getInvoiceByOrgIdInInvoicePage);
router.get("/invoiceByorgIdForFinance/:id",invoiceController.getInvoiceByOrgIdForFinance);
router.get("/invoices/:id", invoiceController.getInvoiceById);
router.put("/invoices/:id", invoiceController.updateInvoice);
router.delete("/invoices/:id", invoiceController.deleteInvoice);

module.exports = router;
