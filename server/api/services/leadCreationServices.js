const { Op } = require("sequelize");
const LeadCreation = require("../models/leadCreation");

// const createLeadCreation = async (data) => {
//   console.log(data, "datatata");
//   const existingLeadMail = await LeadCreation.findOne({where:{email:data.email}});
//   console.log("ijixx",existingLeadMail);

//   if (existingLeadMail) {
//     throw new Error(`Lead Already created with this ${existingLeadMail.email} mail ID`);
//     }
//   try {
//     const leadCreation = await LeadCreation.create(data);
//     return leadCreation;
//   } catch (error) {
//     throw error;
//   }
// };

const createLeadCreation = async (data) => {
  console.log(data, "data");

  // Check if email exists in data and perform duplicate check only if it does
  if (data?.email) {
    const existingLeadMail = await LeadCreation.findOne({
      where: { email: data.email },
    });
    console.log("Duplicate email check result:", existingLeadMail);

    if (existingLeadMail) {
      throw new Error(
        `Lead already created with this ${existingLeadMail.email} email ID`
      );
    }
  }

  try {
    const leadCreation = await LeadCreation.create(data);
    return leadCreation;
  } catch (error) {
    throw error;
  }
};

const creationBulkUpload = async (data, id, organizationId) => {
  console.log(data, "hello");

  try {
    const xlSheetData = data.map((item) => ({
      company_name: item?.company_name || "",
      company_website: item?.company_website || "",
      company_linkedIn_url: item?.company_linkedIn_url || "",
      person_linkedin: item?.person_linkedin || "",
      industry: item?.industry || "",
      sub_industry: item?.sub_industry || "",
      phone_number: item?.phone_number || "",
      contact_number: item?.contact_number || "",
      first_name: item?.first_name || "",
      last_name: item?.last_name || "",
      title: item?.title || "",
      email: item?.email || "",
      NAIC_code: item?.NAIC_code || "",
      SIC_code: item?.SIC_code || "",
      address_line: item?.address_line || "",
      area_name: item?.area_name || "",
      location: item?.location || "",
      state: item?.state || "",
      country: item?.country || "",
      zip_code: item?.zip_code || "",
      department: item?.department || "",
      employee_count: item.employee_count,
      no_ofEmployees: item?.no_ofEmployees || "",
      revenue: item?.revenue || "",
      experience: item?.experience || "",
      level: item?.level || "",
      facebook_url: item?.facebook_url || "",
      twitter_url: item?.twitter_url || "",
      instagram_url: item?.instagram_url || "",
      youtube_url: item?.youtube_url || "",
      createdBy: item?.createdBy || "",
      City: item?.City || "",
      Request: item?.Request || "",
      Intro: item?.Intro || "",
      Remainder: item?.Remainder || "",
      Follow_Up: item?.Follow_Up || "",
      Comments: item?.Comments || "",
      Job_Title: item?.Job_Title || "",
      Job_Link: item?.Job_Link || "",
      size: item?.size || "",
      projectId: id,
      organizationID: organizationId
    }));
    console.log(xlSheetData, "sheet");

    const result = await LeadCreation.bulkCreate(xlSheetData);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getLeadCreations = async () => {
  try {
    const leadCreations = await LeadCreation.findAll();
    return leadCreations;
  } catch (error) {
    throw error;
  }
};

// const getLeadCreationsByOrganization = async (id) => {
//   try {
//     const leadCreations = await LeadCreation.findAll({
//       where: { organizationID: id },
//     });
//     return leadCreations;
//   } catch (error) {
//     throw error;
//   }
// };

const getLeadCreationsByOrganization = async (id, options = {}) => {
  console.log(id, "id");
  try {
    const { limit, offset, search } = options;
    let whereCondition = { organizationID: id };
    console.log(search, "searchhhhhsss");
    if (search) {
      whereCondition.createdBy = {
        [Op.iLike]: `%${search}%`,
      };
    }
    if (options.all) {
      const leadCreations = await LeadCreation.findAll({
        where: whereCondition,
      });
      return leadCreations;
    }

    const result = await LeadCreation.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
    });
    console.log(result, "resulttttttttttttttt");
    return { rows: result.rows, count: result.count };
  } catch (error) {
    throw new Error(`Failed to fetch leads by organization: ${error.message}`);
  }
};

const getLeadCreationById = async (id) => {
  try {
    const leadCreation = await LeadCreation.findByPk(id);
    if (!leadCreation) {
      throw new Error("Lead creation not found");
    }
    return leadCreation;
  } catch (error) {
    throw error;
  }
};

const updateLeadCreation = async (id, data) => {
  try {
    const [updated] = await LeadCreation.update(data, {
      where: { id: id },
    });
    if (!updated) {
      throw new Error("Lead creation not found");
    }
    const updatedLeadCreation = await LeadCreation.findByPk(id);
    return updatedLeadCreation;
  } catch (error) {
    throw error;
  }
};

const deleteLeadCreation = async (id) => {
  try {
    const deleted = await LeadCreation.destroy({
      where: { id: id },
    });
    if (!deleted) {
      throw new Error("Lead creation not found");
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createLeadCreation,
  getLeadCreations,
  getLeadCreationById,
  updateLeadCreation,
  deleteLeadCreation,
  creationBulkUpload,
  getLeadCreationsByOrganization,
};
