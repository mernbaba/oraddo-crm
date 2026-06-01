const {newPayment, checkStatus} = require('../../api/controllers/phonepaycontroller');
const express = require('express');
const router = express();

router.post('/payment', newPayment);
router.post('/status/:transactionId', checkStatus);

module.exports = router;
