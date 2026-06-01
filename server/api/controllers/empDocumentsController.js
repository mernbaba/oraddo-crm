const parseRequestFiles = require('../../fileUpload/requestedfile');
const employeeDocumentService = require('../services/empDocumnetsServices');

const createEmployeeDocument = async (req, res) => {
  console.log(req.body,'body');
  
  try {
    const payload = await parseRequestFiles(req);
    console.log("ppppppppp",{payload})  // const newEmployeeDocument = await employeeDocumentService.createEmployeeDocument(body, files);
    const newEmployeeDocument = await employeeDocumentService.createEmployeeDocument(payload);
    res.status(201).json(newEmployeeDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  // try {
  //   const payload = await parseRequestFiles(req);
  //   const documentsData = [];
  //   console.log("paaaa",payload);
    
  //   // Assuming fields follow the pattern 'documentsData[index].key'
  //   for (let i = 0; i < Object.keys(payload.fields).length / 2; i++) {
  //     const employeeid = payload.fields[documentsData[${i}].employeeid][0];
  //     const form_type = payload.fields[documentsData[${i}].form_type][0];
  //     const file = payload.files[documentsData[${i}].file];

  //     documentsData.push({
  //       employeeid,
  //       form_type,
  //       file
  //     });
  //   }

  //   console.log("Parsed documents data:", documentsData);

  //   // Assuming createMultipleEmployeeDocuments is ready to handle array of documents
  //   const newEmployeeDocuments = await employeeDocumentService.createEmployeeDocument(documentsData);

  //   res.status(201).json(newEmployeeDocuments);
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
};

const getEmployeeDocuments = async (req, res) => {
  try {
    const employeeDocuments = await employeeDocumentService.getEmployeeDocuments();
    res.status(200).json(employeeDocuments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getEmployeeDocuments = async (req, res) => {
//   try {
//     const employeeDocuments = await employeeDocumentService.getEmployeeDocuments();
    
//     // Assuming each document has a 'url' field in the database
//     const documentUrls = employeeDocuments.map(doc => (
//       console.log("dkkdiododo",doc,"document", doc.dataValues.id),
      
//       {
//       id: doc.dataValues.id, 
//       fileName: doc.dataValues.form_type, // or any other metadata
//       url: doc.dataValues.file_url
//     }));

//     console.log("documentsssurllll", documentUrls);
    
    
//     res.status(200).json(documentUrls);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const getEmployeeDocumentById = async (req, res) => {
  try {
    const id = req.params.id;
    const employeeDocument = await employeeDocumentService.getEmployeeDocumentById(id);
    res.status(200).json(employeeDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployeeDocument = async (req, res) => {
  try {
    const id = req.params.id;
    const employeeDocumentData = req.body;
    const updatedEmployeeDocument = await employeeDocumentService.updateEmployeeDocument(id, employeeDocumentData);
    res.status(200).json(updatedEmployeeDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmployeeDocument = async (req, res) => {
  try {
    const id = req.params.id;
    await employeeDocumentService.deleteEmployeeDocument(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEmployeeDocument,
  getEmployeeDocuments,
  getEmployeeDocumentById,
  updateEmployeeDocument,
  deleteEmployeeDocument
};