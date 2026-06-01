const Allowed_type = require('../../fileUpload/alowedtypes');
const uploadFile = require('../../fileUpload/fileupload');
const figmaAssetsImages = require('../models/assetsImageModel');
const AssetsImagesModel=require("../models/assetsImageModel");
const figmaImages = require('../models/imagesModel');

const uploadFiles = async (files) => {
    const uploadPromises = files?.map((file) => uploadFile(file, Allowed_type));
    try {
      const results = await Promise.all(uploadPromises);
      console.log(results,"resultttsss");
      const uploadedData = {
        image_URL: results[0].success ? results[0].url : null,
        // other_documents : results[1].success ? results[1].url : null
      };
      return uploadedData;
    } catch (error) {
      console.log("errorrr", error);
      throw error;
    }
  };


  const createAssestsImage = async (data,files) => {
    try {
    console.log("enter into service page")
      if(files?.image_URL?.length > 0){
      const uploadData = await uploadFiles(

      Array.isArray(files.image_URL) ? [files.image_URL[0]] : []
    );
      console.log("image",uploadData)
      data.image_URL = uploadData.image_URL;
    }
    console.log(data,"dataaaaaaaaa");
      const image = await AssetsImagesModel.create(data);
      console.log(image,"imageData");
      return image;
  
    } catch (error) {
      console.error('Error while creating image:', error.message);
      throw new Error('Error creating image. Please try again later.');
    }
  };


const getAssestsImages = async () => {
  try {
    const images = await AssetsImagesModel.findAll(
      {
      include:[
        {
          model:figmaImages,
          as:"assetsImage"
        }
      ]
    }
  );
    return images;
  } catch (error) {
    throw error;
  }
};

const getAssetsImageById = async (id) => {
  try {
    const image = await AssetsImagesModel.findByPk(id,    {
      include:[
        {
          model:figmaImages,
          as:"assetsImage"
        }
      ]
    });
    if (!image) {
      throw new Error('Employee document not found');
    }
    return image;
  } catch (error) {
    throw error;
  }
};

const updateAssetsImage = async (id, data, files) => {
    try {
      console.log("Updating with ID:", id);

      if (files?.image_URL?.length > 0) {
        console.log("Uploading image...");
        const uploadData = await uploadFiles(
          Array.isArray(files.image_URL) ? [files.image_URL[0]] : []
        );
        console.log("Image upload result:", uploadData);
        data.image_URL = uploadData.image_URL;
      }
      
      console.log("Final image data to be updated:", data);
      const imageUpdate = await AssetsImagesModel.update(data, {
        where: { id: id },
        // returning: true,
      });

      console.log(imageUpdate,"Job Updated:");
      return imageUpdate;
    } catch (error) {
      console.error(`Error while updating with ID ${id}:`, error.message);
      throw new Error(`Error updating with ID ${id}. Please try again later.`);
    }
  };


const deleteAssetsImage = async (id) => {
  try {
    const deleted = await AssetsImagesModel.destroy({
      where: { id: id }
    });
    if (!deleted) {
      throw new Error('Employee document not found');
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAssestsImage,
  getAssestsImages,
  getAssetsImageById,
  updateAssetsImage,
  deleteAssetsImage
};