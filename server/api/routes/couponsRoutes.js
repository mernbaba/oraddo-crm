const express = require("express");
const router = express.Router();
const couponsController = require("../controllers/couponsController");

router.post("/coupons", couponsController.createCoupon);
router.get("/coupons", couponsController.getAllCoupons);
router.get("/coupons/:id", couponsController.getCouponById);
router.put("/coupons/:id", couponsController.updateCoupon);
router.delete("/coupons/:id", couponsController.deleteCoupon);

module.exports = router;
