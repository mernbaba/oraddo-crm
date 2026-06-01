const parseRequestFiles = require("../../fileUpload/requestedfile");
const assetsImageService=require("../services/assetsImageService");


const createAssetsImage= async (req, res) => {
    try {
      const payload = await parseRequestFiles(req)
      if(payload.files && Object.keys(payload.files).length>0){
        req.body = {};
        for (const [key, value] of Object.entries(payload.fields)) {
          req.body[key] = value[0]; // Assuming single value per key
        }
        req.files = payload.files;
      }
    else{
      req.body={};
      for(const[key, value] of Object.entries(payload.fields)){
        req.body[key]=value[0];
      }
    }
      const {body, files} = req;
  
      const image = await assetsImageService.createAssestsImage(body,files);
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getAssetsImages = async (req, res) => {
    try {
      const assetsimages = await assetsImageService.getAssestsImages();
      res.status(200).json(assetsimages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getAssetsImagesById = async (req, res) => {
    try {
      const image = await assetsImageService.getAssetsImageById(req.params.id);
      if (image) {
        res.status(200).json(image);
      } else {
        res.status(404).json({ message: 'image not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const updateAssetsImage = async (req, res) => {
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
  
      const image = await assetsImageService.updateAssetsImage(id, data, files);
      res.status(200).json(image);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteAssetsImage = async (req, res) => {
    try {
      await assetsImageService.deleteAssetsImage(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports={
    createAssetsImage,
    getAssetsImages,
    getAssetsImagesById,
    updateAssetsImage,
    deleteAssetsImage
  }