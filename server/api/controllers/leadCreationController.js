const leadCreationService = require("../services/leadCreationServices");
const xlsx = require("xlsx");
const ExcelJS = require("exceljs");
const LeadCreation = require("../models/leadCreation");
const { Op } = require("sequelize");

// const bulkUploadFiles = async(req,res)=>{
//   const {id}=req.params;
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }
//     const workbook = xlsx.read(req.file.buffer,{type:'buffer'});
//     const sheetName = workbook.SheetNames[0];
//     const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     const result = await leadCreationService.creationBulkUpload(data,id);
//     res.status(200).json({ message: 'Data uploaded successfully', result });
//   } catch (error) {
//     console.log(error);

//   }
// }

// const xlsx = require('xlsx');
// const fs = require('fs');
// const csv = require('csv-parser');

// const bulkUploadFiles = async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const file = req.file;
//     let data = [];

//     // Check file type and parse accordingly
//     if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel') {
//       // If it's an Excel file
//       const workbook = xlsx.read(file.buffer, { type: 'buffer' });
//       const sheetName = workbook.SheetNames[0];
//       data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
//     } else if (file.mimetype === 'text/csv') {
//       // If it's a CSV file
//       const results = [];
//       const buffer = file.buffer.toString('utf-8');
//       const readableStream = require('streamifier').createReadStream(buffer);

//       readableStream
//         .pipe(csv())
//         .on('data', (row) => results.push(row))
//         .on('end', () => {
//           data = results;

//           // Proceed with bulk upload logic
//           uploadData(data, id, res);
//         });
//       return; // Ensure the function doesn't proceed until CSV parsing is complete
//     } else {
//       return res.status(400).json({ message: 'Invalid file format. Only CSV and Excel files are allowed.' });
//     }

//     // If the file is valid, proceed with uploading the data (for both CSV and Excel)
//     uploadData(data, id, res);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'An error occurred while processing the file.' });
//   }
// };

// Function to handle uploading data after parsing

const bulkUploadFiles = async (req, res) => {
  const { id } = req.params;
  const { organizationId } = req.query
  console.log(req.file, "Uploaded File");
  console.log(req.body, "Request Body");
  console.log(req.query, "Query Params");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const batchSize = 500;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await leadCreationService.creationBulkUpload(batch, id, organizationId);
    }

    res.status(200).json({ message: "Data uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading data" });
  }
};

// const uploadData = async (data, id, res) => {
//   try {
//     const result = await leadCreationService.creationBulkUpload(data, id);
//     res.status(200).json({ message: 'Data uploaded successfully', result });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error while uploading data' });
//   }
// };

const createLeadCreation = async (req, res) => {
  try {
    const leadCreationData = req.body;
    const newLeadCreation = await leadCreationService.createLeadCreation(
      leadCreationData
    );
    res.status(201).json(newLeadCreation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeadCreations = async (req, res) => {
  try {
    const leadCreations = await leadCreationService.getLeadCreations();
    res.status(200).json(leadCreations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getLeadCreationsByOrganization = async (req, res) => {
//   try {
//     const leadCreations =
//       await leadCreationService.getLeadCreationsByOrganization(req.params.id);
//     res.status(200).json(leadCreations);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const getLeadCreationsByOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, limit, search, export: exportFlag } = req.query; // Fix: Use req.query for limit

    if (exportFlag === "true") {
      const leadCreations =
        await leadCreationService.getLeadCreationsByOrganization(id, {
          all: true,
          search,
        });

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook(); // Corrected to Workbook
      const worksheet = workbook.addWorksheet("Lead Creations");

      // Define columns for Excel
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Company Name", key: "company_name", width: 20 },
        { header: "Contact Number", key: "contact_number", width: 15 },
        { header: "Company Website", key: "company_website", width: 15 },
        { header: "Email", key: "email", width: 25 },
        { header: "LinkedIn URL", key: "company_linkedIn_url", width: 25 },
        { header: "Industry", key: "industry", width: 15 },
        { header: "Number of Employees", key: "no_ofEmployees", width: 15 },
        { header: "First Name", key: "first_name", width: 15 },
        { header: "Last Name", key: "last_name", width: 15 },
        { key: "phone_number", header: "Phone Number", width: 15 },
        { key: "person_linkedin", header: "Person LinkedIn", width: 15 },
        { key: "department", header: "Department", width: 15 },
        { key: "experience", header: "Experience", width: 15 },
        { key: "size", header: "Size", width: 15 },
        { key: "location", header: "Location", width: 15 },
        { key: "title", header: "Title", width: 15 },
        { key: "address_line", header: "Address Line", width: 15 },
        { key: "country", header: "Country", width: 15 },
        { key: "state", header: "State", width: 15 },
        { key: "area_name", header: "Area Name", width: 15 },
        { key: "zip_code", header: "Zip Code", width: 15 },
        { key: "sub_industry", header: "Sub Industry", width: 15 },
        { key: "SIC_code", header: "SIC Code", width: 15 },
        { key: "NAIC_code", header: "NAIC Code", width: 15 },
        { key: "revenue", header: "Revenue", width: 15 },
        { key: "employee_count", header: "Employee Count", width: 15 },
        { key: "youtube_url", header: "YouTube URL", width: 15 },
        { key: "facebook_url", header: "Facebook URL", width: 15 },
        { key: "twitter_url", header: "Twitter URL", width: 15 },
        { key: "instagram_url", header: "Instagram URL", width: 15 },
        { key: "level", header: "Level", width: 15 },
      ];

      // Add data
      worksheet.addRows(leadCreations);

      // Set response headers for Excel download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="lead_creations_${id}.xlsx"`
      );

      // Write to response
      await workbook.xlsx.write(res);
      return res.end();
    }

    const pageNum = parseInt(page, 10) || 0;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = pageNum * limitNum;

    const { rows, count } =
      await leadCreationService.getLeadCreationsByOrganization(id, {
        limit: limitNum,
        offset,
        search,
      });

    // Calculate total unique leads (based on unique email addresses)
    const uniqueEmailsCount = await LeadCreation.count({
      distinct: true,
      col: "email",
      where: {
        organizationID: id,
        email: { [Op.ne]: null }, // Ensure email is not null
        ...(search && { createdBy: { [Op.iLike]: `%${search}%` } }), // Apply search filter if present
      },
    });

    res.status(200).json({
      data: rows,
      totalRows: count,
      totalLeads: uniqueEmailsCount,
      currentPage: pageNum,
      totalPages: Math.ceil(count / limitNum),
    });
  } catch (error) {
    console.error("Error in getLeadCreationsByOrganization:", error);
    res.status(500).json({ error: error.message });
  }
};
const getLeadCreationById = async (req, res) => {
  try {
    const id = req.params.id;
    const leadCreation = await leadCreationService.getLeadCreationById(id);
    res.status(200).json(leadCreation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLeadCreation = async (req, res) => {
  try {
    const id = req.params.id;
    const leadCreationData = req.body;
    const updatedLeadCreation = await leadCreationService.updateLeadCreation(
      id,
      leadCreationData
    );
    res.status(200).json(updatedLeadCreation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLeadCreation = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id, "helllll");
    await leadCreationService.deleteLeadCreation(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLeadCreation,
  getLeadCreations,
  getLeadCreationById,
  updateLeadCreation,
  deleteLeadCreation,
  bulkUploadFiles,
  getLeadCreationsByOrganization,
};
