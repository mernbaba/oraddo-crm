const projectService = require("../services/projectService");
const ExcelJS = require("exceljs");
const createProject = async (req, res) => {
  try {
    console.log(req.body, "reeeeee");
    const projectData = req.body;

    const { employeeIds } = req.body;
    console.log("hbhdfwd", projectData, employeeIds);
    const newProject = await projectService.createProject(
      projectData,
      employeeIds
    );
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProjectDatapoints = async (req, res) => {
  try {
    const updatedatapoints = req.body;
    const updateData = await projectService.updateProjectDatapoints(
      updatedatapoints
    );
    res.status(201).json(updateData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectsByOrganization = async (req, res) => {
  try {
    const projects = await projectService.getProjectsByOrganization(req.params.id);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await projectService.getProjectById(id);
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getExportProjects = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await projectService.getExportProjects(id);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Project Data");

    worksheet.columns = [
      { header: "Date", key: "createdAt", width: 20 },
      { header: "Created By", key: "createdBy", width: 20 },
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
    worksheet.addRows(
      project.projectLeads.map(lead => ({
        createdAt: lead.createdAt || "",
        createdBy: lead.createdBy || "",
        company_name: lead.company_name || "",
        contact_number: lead.contact_number || "",
        company_website: lead.company_website || "",
        email: lead.email || "",
        company_linkedIn_url: lead.company_linkedIn_url || "",
        industry: lead.industry || "",
        no_ofEmployees: lead.no_ofEmployees || "",
        first_name: lead.first_name || "",
        last_name: lead.last_name || "",
        phone_number: lead.phone_number || "",
        person_linkedin: lead.person_linkedin || "",
        department: lead.department || "",
        experience: lead.experience || "",
        size: lead.size || "",
        location: lead.location || "",
        title: lead.title || "",
        address_line: lead.address_line || "",
        country: lead.country || "",
        state: lead.state || "",
        area_name: lead.area_name || "",
        zip_code: lead.zip_code || "",
        sub_industry: lead.sub_industry || "",
        SIC_code: lead.SIC_code || "",
        NAIC_code: lead.NAIC_code || "",
        revenue: lead.revenue || "",
        employee_count: lead.employee_count || "",
        youtube_url: lead.youtube_url || "",
        facebook_url: lead.facebook_url || "",
        twitter_url: lead.twitter_url || "",
        instagram_url: lead.instagram_url || "",
        level: lead.level || "",
      }))
    );

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
    // res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getprojectDetailsById = async (req, res) => {
  try {
    const id = req.params.id;
    const { page = 0, pageSize = 10, search = "" } = req.query
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const project = await projectService.getprojectDetailsById(id, pageInt, pageSizeInt, search);
    res.status(200).json(project);
  }
  catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// const updateProject = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const projectData = req.body;
//     const updatedProject = await projectService.updateProject(id, projectData);
//     res.status(200).json(updatedProject);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// const updateProject = async (req, res) => {
//   try {
//     console.log("knhkffyxf",req.body);
//     const id = req.params.id;
//     console.log(id,"iddddd");

//     const {projectData} = req.body;
//     const updatedProject = await projectService.updateProject(id, projectData );
//     res.status(200).json(updatedProject);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const updateProject = async (req, res) => {
  try {
    console.log("knhkffyxf", req.body);
    const id = req.params.id;

    const projectData = req.body;
    console.log(projectData, "prprprprp");

    const updatedProject = await projectService.updateProject(id, projectData);
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const id = req.params.id;
    await projectService.deleteProject(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectDatapoints,
  getProjectsByOrganization,
  getprojectDetailsById,
  getExportProjects
};
