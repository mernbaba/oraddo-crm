const { Op } = require("sequelize");
const Projects = require("../models/projects");
const Emp_onboarding = require("../models/Emp_onboarding");
const Emp_Department = require("../models/Department");
const LeadCreation = require("../models/leadCreation");
// const DataPoints = require('../models/Datapoints');
const ProjectDataPoints = require("../models/projectDatapoints");
const Datapoints = require("../models/Datapoints");


// const createProject = async (data, employeeIds) => {
//   try {
//     console.log('hsajkhskjhS',data,employeeIds);

//     // const getdata = getAllFuncs(data);
//     const project = await Projects.create(data);
//     console.log("djfhdufda", project);
//     try {
//       await project.addEmp_onboardings(employeeIds);
//     } catch (error) {
//       console.log("sfdfuhd", error);
//     }
//     return project;
//   } catch (error) {
//     throw error;
//   }
// };

const createProject = async (data, employeeIds) => {
  try {
    console.log("hsajkhskjhS", data, employeeIds);
    const { datapoints, datapointsorder, isRequired, ...projectData } = data;
    const project = await Projects.create(projectData);
    // console.log(project,"djfhdufda", project.id,"dataapoo",datapoints,"orderrr",datapointsorder,"requireddd",isRequired);

    const datapointsWithDetails = datapoints.map((datapointId, index) => ({
      id: datapointId,
      order: datapointsorder[index],
      required: isRequired[index],
    }));

    // console.log(datapoints,"Mapped Datapoints with Details:", datapointsWithDetails);

    for (const datapoint of datapointsWithDetails) {
      await ProjectDataPoints.upsert({
        ProjectId: project.id,
        DatapointId: datapoint.id,
        datapointsorder: datapoint.order,
        isRequired: datapoint.required,
      });
    }

    try {
      await project.addEmp_onboardings(employeeIds);
    } catch (error) {
      console.log("sfdfuhd", error);
    }
    return project;
  } catch (error) {
    throw error;
  }
};

const updateProjectDatapoints = async (updateDataPoints) => {
  try {
    let { datapoints, datapointsorder, isRequired } = updateDataPoints;

    console.log(
      updateDataPoints,
      "datapoints:",
      datapoints,
      "datapointsorder:",
      datapointsorder,
      "isRequired:",
      isRequired
    );

    if (!datapoints || !datapointsorder || !isRequired) {
      throw new Error("Please provide datapoints, order, and required fields");
    }

    // Determine the length of the datapoints array
    let datapointsLength;
    Object.keys(datapoints).forEach((key) => {
      datapointsLength = datapoints[key];
      if (datapointsLength && Array.isArray(datapointsLength)) {
        console.log(`key:${key}, Length:${datapointsLength.length}`);
      } else {
        console.log(`Key: ${key}, No valid array`);
      }
    });

    // Check if the lengths match
    if (
      datapointsorder.length !== datapointsLength.length ||
      isRequired.length !== datapointsLength.length
    ) {
      throw new Error(
        "Order and required arrays must have the same length as datapoints"
      );
    }

    // Get the project ID
    const projectId = Object.keys(datapoints)[0];
    console.log("Project ID:", projectId);

    // Fetch the project
    const project = await Projects.findByPk(projectId);

    if (!project) {
      console.log(`Project with ID ${projectId} not found`);
      throw new Error(`Project with ID ${projectId} not found`);
    }

    await ProjectDataPoints.destroy({
      where: { ProjectId: projectId },
    });
    console.log(`Deleted existing datapoints for project ${projectId}`);

    // Prepare datapoints with order and required fields
    const datapointsWithDetails = datapoints[projectId].map(
      (datapointId, index) => ({
        id: datapointId, // Datapoint ID
        order: datapointsorder[index], // Order for this datapoint
        required: isRequired[index], // Required flag for this datapoint
      })
    );
    console.log("Mapped Datapoints with Details:", datapointsWithDetails);

    // Update or create the ProjectDatapoints entries in the database
    for (const datapoint of datapointsWithDetails) {
      await ProjectDataPoints.upsert({
        ProjectId: projectId,
        DatapointId: datapoint.id,
        datapointsorder: datapoint.order,
        isRequired: datapoint.required,
      });
    }

    console.log(`Successfully updated datapoints for project ${projectId}`);
    return {
      success: true,
      message: `Project ${projectId} datapoints updated successfully`,
    };
  } catch (error) {
    console.error("Failed to update datapoints:", error);
    throw new Error(`Failed to update datapoints: ${error.message}`);
  }
};

const getProjects = async () => {
  try {
    const projects = await Projects.findAll({
      include: [
        {
          model: Emp_onboarding,
          // include: [
          //   {
          //     model: Emp_Department,
          //     as: "departentsOfEmp",
          //   },
          // ],
        },

        {
          model: LeadCreation,
          as: "projectLeads",
        },
      ],
    });
    return projects;
  } catch (error) {
    throw error;
  }
};

const getProjectsByOrganization = async (id) => {
  try {
    const projects = await Projects.findAll({
      where: { organizationID: id },
      include: [
        {
          model: Emp_onboarding,
          // include: [
          //   {
          //     model: Emp_Department,
          //     as: "departentsOfEmp",
          //   },
          // ],
        },

        {
          model: LeadCreation,
          as: "projectLeads",
        },
      ],
    });
    return projects
  } catch (error) {
    throw error;
  }
};
// const getProjectById = async (id) => {
//   try {
//     const project = await Projects.findByPk(id, {
//       include: [
//         {
//           model: Emp_onboarding,

//           include:[
//             {
//               model:Emp_Department,
//               as:"departentsOfEmp"
//             }
//           ]
//         },
//         {
//           include:[
//             {
//               model:LeadCreation,
//               as:"FK_projects"
//             }
//           ]
//         }
//       ]
//     });
//     if (!project) {
//       throw new Error('Project not found');
//     }
//     return project;
//   } catch (error) {
//     throw error;
//   }
// };

const getProjectById = async (id) => {
  try {
    const project = await Projects.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
          attributes: ["id", "emp_name"]
          // include: [
          //   {
          //     model: Emp_Department,
          //     as: "departentsOfEmp",
          //   },
          // ],
        },
        {
          model: LeadCreation,
          as: "projectLeads",
        },
        {
          model: Datapoints,
        },
      ],
    });

    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  } catch (error) {
    throw error;
  }
};

const initialOptions = [
  { value: "company_name", label: "Company Name" },
  { value: "contact_number", label: "Contact Number" },
  { value: "company_website", label: "Comapny Website" },
  { value: "email", label: "Email" },
  { value: "company_linkedIn_url", label: "LinkedIn URL" },
  { value: "industry", label: "Industry" },
  { value: "no_ofEmployees", label: "Number of Employees" },
  { value: "first_name", label: "First Name" },
  { value: "last_name", label: "Last Name" },
  { value: "phone_number", label: "Phone Number" },
  { value: "person_linkedin", label: "Person LinkedIn" },
  { value: "department", label: "Departement" },
  { value: "experience", label: "Experience" },
  { value: "size", label: "Size" },
  { value: "location", label: "Location" },
  { value: "title", label: "Title" },
  { value: "address_line", label: "Address Line" },
  { value: "country", label: "Country" },
  { value: "state", label: "State" },
  { value: "area_name", label: "Area Name" },
  { value: "zip_code", label: "Zip Code" },
  { value: "sub_industry", label: "Sub Industry" },
  { value: "SIC_code", label: "SIC Code" },
  { value: "NAIC_code", label: "NAIC Code" },
  { value: "revenue", label: "Revenue" },
  { value: "employee_count", label: "Employee Count" },
  { value: "youtube_url", label: "YouTube URL" },
  { value: "facebook_url", label: "Facebook URL" },
  { value: "twitter_url", label: "Twitter URL" },
  { value: "instagram_url", label: "Instragram URL" },
  { value: "level", label: "Level" },
];

const getExportProjects = async (id) => {
  try {
    // Step 1: Fetch Project Details
    const project = await Projects.findByPk(id, {
      include: [
        { model: Emp_onboarding },
        { model: LeadCreation, as: "projectLeads" },
        { model: Datapoints },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return project;
  }
  catch (error) {
    throw error;
  }
}




// const getprojectDetailsById = async (id, page, pageSize, search = "") => {
//   try {
//     const offset = page * pageSize;

//     let whereCondition = {}
//     if (search) {
//       whereCondition.company_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
//     }
//     console.log(search, "from search")
//     const project = await Projects.findByPk(id, {
//       include: [
//         {
//           model: Emp_onboarding,
//           // include: [
//           //   {
//           //     model: Emp_Department,
//           //     as: "departentsOfEmp",
//           //   },
//           // ],
//         },
//         {
//           model: LeadCreation,
//           as: "projectLeads",
//           offset: offset,
//           limit: pageSize,
//           where: whereCondition,
//           order: [["createdAt", "Desc"]]
//         },
//         {
//           model: Datapoints,
//         },
//       ],
//     });

//     if (!project) {
//       throw new Error("Project not found");
//     }

//     return project;
//   } catch (error) {
//     throw error;
//   }
// }

const getprojectDetailsById = async (id, page, pageSize, search = "") => {
  try {
    const offset = page * pageSize;

    let whereCondition = { projectId: id }; // Ensure leads belong to the given project
    if (search) {
      whereCondition.company_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    console.log(search, "from search");

    // Step 1: Get total lead count (ignoring pagination)
    const totalLeadCount = await LeadCreation.count({
      where: whereCondition,
    });

    // Step 2: Fetch project details along with paginated lead data
    const project = await Projects.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
        },
        {
          model: LeadCreation,
          as: "projectLeads",
          where: whereCondition,
          limit: pageSize,
          offset: offset,
          order: [["createdAt", "Desc"]],
        },
        {
          model: Datapoints,
        },
      ],
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Step 3: Return the project details along with total lead count
    return { project, totalLeadCount };
  } catch (error) {
    throw error;
  }
};


const updateProject = async (id, data) => {
  const { projectId, employeeIds, employeeIdsToRemove } = data;

  try {
    console.log(
      "projectId:",
      projectId,
      "Assigned employees:",
      employeeIds,
      "Employees to remove:",
      employeeIdsToRemove
    );

    if (projectId) {
      const project = await Projects.findByPk(projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Assign new employees to the project
      if (employeeIds && employeeIds.length > 0) {
        await project.addEmp_onboardings(employeeIds);
      }

      // Remove specified employees from the project
      if (employeeIdsToRemove && employeeIdsToRemove.length > 0) {
        await project.removeEmp_onboardings(employeeIdsToRemove);
      }

      return {
        message:
          "Project updated successfully with assigned and/or removed employees",
        data: project,
      };
    } else {
      console.log("No project ID provided; updating other project data.");

      // Update project data (without assigning/removing employees)
      const [updated] = await Projects.update(data, { where: { id: id } });
      if (!updated) {
        throw new Error("Project not found");
      }

      const updatedProject = await Projects.findByPk(id);
      return updatedProject;
    }
  } catch (error) {
    throw error;
  }
};

// const getProjects = async () => {
//   try {
//     const projects = await Projects.findAll({
//       include:[
//         {
//           model: Emp_onboarding,
//           as: "empProjects"
//         }
//       ]
//     });
//     return projects;
//   } catch (error) {
//     throw error;
//   }
// };

// const getProjectById = async (id) => {
//   try {
//     const project = await Projects.findByPk(id,{
//       include:[
//         {
//           model: Emp_onboarding,
//           as: "empProjects"
//         }
//       ]
//     });
//     if (!project) {
//       throw new Error('Project not found');
//     }
//     return project;
//   } catch (error) {
//     throw error;
//   }
// };

// const updateProject = async (id, data) => {
//   const {projectId,employeeIds}=data;
//   try {
//     console.log("peojectiddd",projectId, "sdsdsdsd", employeeIds);
//     if(employeeIds && projectId){
//       const project = await Projects.findByPk(projectId);
//       if(!project){
//       throw new Error('Project not found');
//       }
//       const emps = await project.addEmp_onboardings(employeeIds);
//       return {message: "Employee assigned to the project successfully", data: emps}
//     } else {
//       console.log("hsgdsygdysxdk");
//       const [updated] = await Projects.update(data, {
//         where: { id: id }
//       });
//       if (!updated) {
//         throw new Error('Project not found');
//       }
//       const updatedProject = await Projects.findByPk(id);
//       return updatedProject;
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// const updateProject = async (id, data) => {
//   try {
//     console.log("projectiddd", id, "updateData", data);

//       const [updated] = await Projects.update(data, {
//         where: { id: id }
//       });

//       const updatedProject = await Projects.findByPk(id);
//       return updatedProject;

//   } catch (error) {
//     throw error;
//   }
// };

const deleteProject = async (id) => {
  try {
    const deleted = await Projects.destroy({
      where: { id: id },
    });
    if (!deleted) {
      throw new Error("Project not found");
    }
  } catch (error) {
    throw error;
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
