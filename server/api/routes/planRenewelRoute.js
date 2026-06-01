const express = require('express');
const route = express.Router();
const planRenew = require('../controllers/renewPlanController');


route.put('/renewel/:id',planRenew.planRenewel);


module.exports = route;