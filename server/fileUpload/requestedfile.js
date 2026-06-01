const formidable = require("formidable");

const parseRequestFiles = async (req) => {
    console.log('parsloniki vachindhi');
    const form = new formidable.IncomingForm({
      multiples: true,
      keepExtensions: true
    }
    );
    console.log(form,"formmmmmm");
    
    return new Promise((resolve, reject) => {
      console.log(resolve,"resolvee",reject,"rejectsssss");
      
        form.parse(req, (err, fields, files) => { 
          console.log(req,"ggggggg");
          console.log(fields,"ggggmmmmggg");
          console.log(files,"ggggnnnnggg");       
          if (err) {
            console.log(err,"hgghghhhh");
          reject(err);   
        } else {
          console.log("filesssssssss",files)
          resolve({ fields, files }); 
        }
      });
    });
  };


  module.exports = parseRequestFiles;