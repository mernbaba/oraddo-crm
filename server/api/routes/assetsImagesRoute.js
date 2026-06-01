const express = require("express");
const assetsImageCreationController = require("../controllers/assetsImageController");

const router = express.Router();

router.post("/imageAssetsCreation", assetsImageCreationController.createAssetsImage);
router.get("/imageAssetsCreation", assetsImageCreationController.getAssetsImages);
router.get("/imageAssetsCreation/:id", assetsImageCreationController.getAssetsImagesById);
router.put("/imageAssetsCreation/:id", assetsImageCreationController.updateAssetsImage);
router.delete("/imageAssetsCreation/:id", assetsImageCreationController.deleteAssetsImage);

module.exports=router;
