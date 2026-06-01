const express = require('express');
const router = express.Router();
const premiumPlanController = require('../controllers/premiumPlansController');

router.get('/plans', premiumPlanController.getAllPremiums);
router.post('/addplans', premiumPlanController.updatePremiumModule);
router.get('/plans/:id', premiumPlanController.getPlanByIdPremium);
router.post('/plans', premiumPlanController.createPremiumPlan);
router.put('/plans/:id', premiumPlanController.updatePremiumPlan);
router.delete('/plans/:id', premiumPlanController.deletePremiumPlan);

module.exports = router;
