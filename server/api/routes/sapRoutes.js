const express = require("express");
const router = express.Router();

const SapControler = require("../controllers/sapAuthController")

router.post("/SapSignUp",SapControler.SapsignUp);
router.post("/SapSignIn",SapControler.SapsignIn);
router.post("/SapSignOut",SapControler.SapsignOut);

module.exports = router