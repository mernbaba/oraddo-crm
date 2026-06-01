// routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const Organization = require('../services/OrganizationService');
const parseRequestFiles = require('../../fileUpload/requestedfile')
// Create a company
router.post('/companies', async (req, res) => {

  try {
    const payload = await parseRequestFiles(req);
    console.log(payload,'payload', Object.keys(payload.files).length);
    if (payload.files && Object.keys(payload.files).length > 0) {
      req.body = {};
      console.log(payload.fields,'fields');
      for (const [key, value] of Object.entries(payload.fields)) {
        req.body[key] = value[0]; // Assuming single value per key
      }

      req.files = payload.files;
0      // const employee = await employeeService.createEmployee(body, files);
      console.log(req.body,'bodndondodnod');
      console.log(req.files,'flflflflfl');
      const company = await Organization.createCompany(req.body, req.files);
      res.status(201).json(company);
    }
  
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await Organization.getAllCompanies();
    res.json(companies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a company by ID
router.get('/companies/:id', async (req, res) => {
  try {
    const company = await Organization.getCompanyById(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a company
router.put('/companies/:id', async (req, res) => {
  console.log(req.params.id,'paramsssss');
  console.log(req.body,'bodyyyyyy');
  try {

    const payload = await parseRequestFiles(req);
    console.log(payload, "payloadddddd")
    if (payload.files && Object.keys(payload.files).length > 0) {
      req.body = {};
      for (const [key, value] of Object.entries(payload.fields)) {
        req.body[key] = value[0]; // Assuming single value per key
      }
      req.files = payload.files;
      const { body, files } = req;
      
    const company = await Organization.updateCompany(req.params.id,files,body);
    console.log(company, "companyyyyyy")
    res.json(company);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// router.put('/companies/:id', async (req, res) => {
//   console.log(req.params.id, 'paramsssss');
//   console.log(req.body, 'bodyyyyyy');
//   try {
//     const payload = await parseRequestFiles(req);

//     let files = null;
//     let body = req.body;

//     // If files are provided, handle file parsing
//     if (payload.files && Object.keys(payload.files).length > 0) {
//       body = {};
//       for (const [key, value] of Object.entries(payload.fields)) {
//         body[key] = value[0]; // Assuming single value per key
//       }
//       files = payload.files;
//     } else {
//       // Handle regular content update without files
//       body = { ...req.body };
//     }

//     const company = await Organization.updateCompany(req.params.id, files, body);
//     res.json(company);
//   } catch (error) {
//     console.error('Error updating company:', error);
//     res.status(400).json({ error: error.message });
//   }
// });


// Delete a company
router.delete('/companies/:id', async (req, res) => {
  try {
    await Organization.deleteCompany(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
