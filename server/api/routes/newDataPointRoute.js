const express = require("express");
const router = express.Router();
const newDataPoint = require("../controllers/newDataPointControll");
// const { Middleware } = require("../middleware/authMiddleware");


router.post("/createNewPoint",newDataPoint.addNewField);