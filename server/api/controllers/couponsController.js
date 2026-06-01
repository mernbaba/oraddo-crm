const Coupon = require("../models/Coupons");

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ message: "Coupon created successfully", data: coupon });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Coupon code already exists." });
    }
    res.status(500).json({ error: "Failed to create coupon", details: error.message });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    // Return newest coupons first
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coupons", details: error.message });
  }
};

exports.getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.status(200).json({ data: coupon });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coupon", details: error.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    await coupon.update(req.body);
    res.status(200).json({ message: "Coupon updated successfully", data: coupon });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Coupon code already exists." });
    }
    res.status(500).json({ error: "Failed to update coupon", details: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    await coupon.destroy();
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete coupon", details: error.message });
  }
};
