const express = require("express");
const imageCreationController = require("../controllers/imageController");

const router = express.Router();

router.post("/imageCreation", imageCreationController.createImage);
router.get("/imageCreation", imageCreationController.getImages);
router.get("/imageGetByMainId/:id",imageCreationController.getImagesByMainId);
router.get("/imageCreation/:id", imageCreationController.getImagesById);
router.put("/imageCreation/:id", imageCreationController.updateImage);
router.delete("/imageCreation/:id", imageCreationController.deleteImage);

module.exports=router;
