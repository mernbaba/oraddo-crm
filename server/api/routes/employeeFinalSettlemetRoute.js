const express = require('express')
const employeeFinalSettlemetController = require('../controllers/employeeFinalSettlementController');

const router = express.Router();

// console.log("error..");

router.post('/employeeFinalSettlemet',employeeFinalSettlemetController.CreateFinalSettlements);
router.get('/employeeFinalSettlemet',employeeFinalSettlemetController.getFinalSettlements);
router.get("/empFinalSettlementOrgId/:id",employeeFinalSettlemetController.getFinalSettlOrgId);
router.get('/employeeFinalSettlemet/:id',employeeFinalSettlemetController.getFinalSettlementsById);
router.put('/employeeFinalSettlemet/:id',employeeFinalSettlemetController.updateFinalSettlement);
router.delete('/employeeFinalSettlemet/:id',employeeFinalSettlemetController.deleteFinalSettlement);

module.exports = router;