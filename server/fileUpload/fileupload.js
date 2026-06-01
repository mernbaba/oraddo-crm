const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();


AWS_ACCESS_KEY_ID =  'AKIAQEFWAZYR2INXZ427'
AWS_SECRET_ACCESS_KEY = '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'
AWS_BUCKET = 'tridizi-s3-bucket'


const s3 = new AWS.S3({
  region: 'ap-south-1',
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY, 
  s3ForcePathStyle: true, // required for localstack
});


const uploadFile = async (files, Allowed_types) => {
  try {
    // console.log('welcome to file upload',files,files.resume[0].mimetype,Allowed_types);
    // const file = files.resume[0];
    console.log(Allowed_types,'allow');
    
    console.log('fileeeeewwwwwwwww',files.mimetype);
    if (files.mimetype || Allowed_types.includes(files.mimetype)) {
      console.log('afterrr typeeee');
      let data = fs.readFileSync(files.filepath);
      console.log('daataaauploadd', data);

      let uploadParams = {
        Bucket: AWS_BUCKET,
        Key: `${files.originalFilename}`,
        Body: data,
      };

      console.log('after paraaamsss');
      return new Promise((resolve, reject) => {
        // call S3 to retrieve upload file to specified bucket
        s3.upload(uploadParams, function (err, data) {
          console.log("wwwwwwwwwwwwwwwwwwwwwwwwwww", { uploadParams });
          if (err) {
            console.log("////////////", err)
            resolve({ success: false, message: "File upload error" });
          }
          if (data) {
            console.log("success")
            resolve({ success: true, url: data.Location });
          }
        });
      });
    } else {
      return { success: false, message: "Please check file type" };
    }
  } catch (error) {
    console.log('Something went wrong.', error);
  }

}


module.exports = uploadFile;




// const fs = require("fs");
// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadFile = async (file, allowedTypes) => {
//   console.log("File inside uploadFile:", file);
//   console.log("Allowed types:", allowedTypes);

//   try {
//     // ✅ Validate file and mimetype
//     const mimetype = file.mimetype || file.type;
//     if (!mimetype) {
//       throw new Error("Invalid file or missing mimetype");
//     }

//     if (!allowedTypes.includes(mimetype)) {
//       throw new Error(`File type ${mimetype} not allowed`);
//     }

//     if (!file.filepath || !file.originalFilename) {
//       throw new Error("Missing file path or original filename");
//     }

//     // ✅ Determine resource type
//     const resourceType = ["image/jpeg", "image/png", "image/svg+xml"].includes(mimetype)
//       ? "image"
//       : "auto";

//     console.log("Uploading to Cloudinary:", file.filepath, mimetype);

//     // ✅ Upload to Cloudinary
//     const uploadResult = await cloudinary.uploader.upload(file.filepath, {
//       folder: "group_images",
//       resource_type: resourceType,
//       public_id: file.originalFilename.split(".")[0],
//     });

//     console.log("Upload result:", uploadResult);

//     // ✅ Append f_auto for images
//     const url = resourceType === "image"
//       ? `${uploadResult.secure_url}?f_auto`
//       : uploadResult.secure_url;

//     return { success: true, url };
//   } catch (err) {
//     console.error("Error uploading file to Cloudinary:", err);
//     throw new Error(`File upload failed: ${err.message}`);
//   } finally {
//     // ✅ Clean up temporary file
//     if (file?.filepath && fs.existsSync(file.filepath)) {
//       fs.unlinkSync(file.filepath);
//     }
//   }
// };

// module.exports = uploadFile;
