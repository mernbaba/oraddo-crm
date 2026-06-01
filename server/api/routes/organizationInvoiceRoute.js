const express = require('express');
const router = express.Router();
const organizationInvoice = require('../controllers/organizationInvoiceController');

router.post('/organizationInvoice', organizationInvoice.createOrganizationInvoice);

module.exports = router;