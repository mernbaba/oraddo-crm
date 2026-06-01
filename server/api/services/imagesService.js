const Allowed_type = require('../../fileUpload/alowedtypes');
const uploadFile = require('../../fileUpload/fileupload');
const ImagesModel=require("../models/imagesModel");
const assetsImages=require("../models/assetsImageModel");
const parseRequestFiles = require('../../fileUpload/requestedfile');


// const uploadFiles = async (files) => {
//     const uploadPromises = files?.map((file) => uploadFile(file, Allowed_type));
//     try {
//       const results = await Promise.all(uploadPromises);
//       console.log(results,"resultttsss");
//       const uploadedData = {
//         image_URL: results[0].success ? results[0].url : null,
//         // other_documents : results[1].success ? results[1].url : null
//       };
//       return uploadedData;
//     } catch (error) {
//       console.log("errorrr", error);
//       throw error;
//     }
//   };


const uploadFiles = async (files) => {
  try {
    if (!files || files.length === 0) {
      return [];
    }

    // Convert files to an array if not already
    const fileArray = Array.isArray(files) ? files : [files];

    // Upload each file
    const uploadPromises = fileArray.map((file) => uploadFile(file, Allowed_type));
    const results = await Promise.all(uploadPromises);

    return results
      .filter((result) => result.success) // Filter out failed uploads
      .map((result) => result.url); // Return only URLs of successful uploads
  } catch (error) {
    console.error("Error uploading files:", error);
    throw new Error("File upload failed");
  }
};

  // const createImage = async (data,files) => {
  //   try {
  //   console.log("enter into service page")
  //     if(files?.image_URL?.length > 0){
  //     const uploadData = await uploadFiles(
  //     Array.isArray(files.image_URL) ? [files.image_URL[0]] : []
  //   );
  //     console.log("image",uploadData)
  //     data.image_URL = uploadData.image_URL;
  //   }
  //   console.log(data,"dataaaaaaaaa");
  //     const image = await ImagesModel.create(data);
  //     console.log(image,"imageData");
  //     return image;
  
  //   } catch (error) {
  //     console.error('Error while creating image:', error.message);
  //     throw new Error('Error creating image. Please try again later.');
  //   }
  // };

  const createImage = async (body, files) => {
    try {
      console.log("Uploading images...");
      const uploadedImages = await uploadFiles(files);
  
      if (uploadedImages.length === 0) {
        throw new Error("No valid images uploaded");
      }
  
      console.log("Saving images to database...");
      // Insert multiple images into the database
      const images = await Promise.all(
        uploadedImages.map(async (url) => {
          return await ImagesModel.create({
            image_URL: url,
            MainImageId: body.MainImageId || null,
          });
        })
      );
  
      console.log("Images saved successfully");
      return images;
    } catch (error) {
      console.error("Error while creating images:", error.message);
      throw new Error("Error creating images. Please try again.");
    }
  }


const getImages = async () => {
  try {
    const images = await ImagesModel.findAll(
      {
        include: [
          {
            model: assetsImages,
            as:"mainImage"
          },
        ],
      }

    );
    return images;
  } catch (error) {
    throw error;
  }
};

const getImageByMainId = async (id) => {
  try {
    const image = await ImagesModel.findAll({where: { MainImageId: id },
      include: [
        {
          model: assetsImages,
          as:"mainImage"
        },
      ],
    });
    if (!image) {
      throw new Error('Employee document not found');
    }
    return image;
  } catch (error) {
    throw error;
  }
};

const getImageById = async (id) => {
  try {
    const image = await ImagesModel.findByPk(id);
    if (!image) {
      throw new Error('Employee document not found');
    }
    return image;
  } catch (error) {
    throw error;
  }
};

const updateImage = async (id, data, files) => {
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
      const imageUpdate = await ImagesModel.update(data, {
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



// const deleteImage = async (id) => {
//   try {
//     const deleted = await ImagesModel.destroy({
//       where: { id: id }
//     });
//     if (!deleted) {
//       throw new Error('Employee document not found');
//     }
//   } catch (error) {
//     throw error;
//   }
// };

const deleteImage=async (id) => {
  try {
    const deleted = await ImagesModel.destroy({
      where: { MainImageId: id }
    });

    if (!deleted) {
      throw new Error('No images found for the given MainImageId');
    }

    return { message: "Images deleted successfully" };
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
};

module.exports = {
  createImage,
  getImages,
  getImageByMainId,
  getImageById,
  updateImage,
  deleteImage
};