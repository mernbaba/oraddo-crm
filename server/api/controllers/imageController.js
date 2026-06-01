const parseRequestFiles = require("../../fileUpload/requestedfile");
const imageService=require("../services/imagesService");


// const createImage= async (req, res) => {
//     try {
//       const payload = await parseRequestFiles(req)
//       if(payload.files && Object.keys(payload.files).length>0){
//         req.body = {};
//         for (const [key, value] of Object.entries(payload.fields)) {
//           req.body[key] = value[0]; // Assuming single value per key
//         }
//         req.files = payload.files;
//       }
//     else{
//       req.body={};
//       for(const[key, value] of Object.entries(payload.fields)){
//         req.body[key]=value[0];
//       }
//     }
//       const {body, files} = req;
  
//       const image = await imageService.createImage(body,files);
//       res.status(201).json(image);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };


const createImage = async (req, res) => {
  try {
    // Parse request using formidable
    const payload = await parseRequestFiles(req);

    if (!payload.files || Object.keys(payload.files).length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const body = payload.fields;
    const files = Object.values(payload.files.image_URL || []);

    // Call service to process uploaded images
    const image = await imageService.createImage(body, files);
    res.status(201).json(image);
  } catch (error) {
    console.error("Error while creating images:", error.message);
    res.status(500).json({ error: "Error creating images. Please try again." });
  }
};

// module.exports = { createImage };



  const getImages = async (req, res) => {
    try {
      const images = await imageService.getImages();
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getImagesByMainId=async(req,res)=>{
      const id=req.params.id
      try{
          const imagesUnderMain=await imageService.getImageByMainId(id);
          res.status(200).json({imagesUnderMain});
      }catch(error){
          res.status(500).json({error:error.message});
      }
  }

  const getImagesById = async (req, res) => {
    try {
      const image = await imageService.getImageById(req.params.id);
      if (image) {
        res.status(200).json(image);
      } else {
        res.status(404).json({ message: 'image not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const updateImage = async (req, res) => {
    console.log(req.params.id,'idididididiididididi');
    console.log(req.body,'bososososososo');
    const {id}=req.params;
        const payload = await parseRequestFiles(req)
      req.body = {};
      for (const [key, value] of Object.entries(payload.fields)) {
        req.body[key] = value[0]; // Assuming single value per key
      }
      req.files = payload.files;
      const {body, files} = req;
      const data= req.body;
      console.log(data,"dataa");
    try {
  
      const image = await imageService.updateImage(id, data, files);
      res.status(200).json(image);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // const deleteImage = async (req, res) => {
  //   try {
  //     await imageService.deleteImage(req.params.id);
  //     res.status(204).end();
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // };

  const deleteImage = async (req, res) => {
    try {
      const response = await imageService.deleteImage(req.params.id);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports={
    createImage,
    getImages,
    getImagesByMainId,
    getImagesById,
    updateImage,
    deleteImage
  }