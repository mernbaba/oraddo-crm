const express = require('express');
const gratuityController = require('../controllers/GratuitySettlementController');

const router = express.Router();




router.post('/gratuitySettlements', gratuityController.createGratuitySettlement);
router.get('/gratuitySettlements', gratuityController.getGratuitySettlements);
router.get("/gratuityByOrgId/:id",gratuityController.getGratuityOrganizId);
router.get('/gratuitySettlements/:id', gratuityController.getGratuitySettlementById);
router.put('/gratuitySettlements/:id', gratuityController.updateGratuitySettlement);
router.delete('/gratuitySettlements/:id', gratuityController.deleteGratuitySettlement);

module.exports = router;
