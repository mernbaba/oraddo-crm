const Emp_onboarding = require("../models/Emp_onboarding");
const Faq = require("../models/faq.js");
const { v4: uuidv4 } = require("uuid");
const Organization = require("../models/OrganizationModule.js");
async function generateTicketId() {
  // Find the latest ticket ID from the database
  const latestFaq = await Faq.findOne({
    order: [["ticketId", "DESC"]],
    attributes: ["ticketId"],
  });

  let newNumber = 1; // Default if no tickets exist

  if (latestFaq && latestFaq.ticketId) {
    // Extract the numeric part and increment
    const lastNumber = parseInt(latestFaq.ticketId.replace("ORDS", ""), 10);
    newNumber = lastNumber + 1;
  }

  return `ORDS${String(newNumber).padStart(6, "0")}`; // Format as ORDS000001
}

const createFaq = async (faqData) => {
  faqData.ticketId = await generateTicketId();
  console.log(faqData.ticketId, "from createFAQ");
  return await Faq.create(faqData);
};

const getAllFaqs = async ( page ,pageSize) => {
  const offset = page * pageSize;
  return await Faq.findAll({
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Emp_onboarding,
        as: "FAQ_Employee",
        attributes: [
          "emp_name",
          "personal_email",
          "bussiness_email",
          "contact_number",
        ],
        include: [
          {
            model: Organization,
            as: "organization_Employees",
            attributes: ["companyName", "organizationID"],
          },
        ],
      },
    ],
  });
};

const getFaqById = async (id) => {
  return await Faq.findByPk(id);
};

const updateFaq = async (id, faqData) => {
  const faq = await Faq.findByPk(id);
  if (faq) {
    await faq.update(faqData);
    return faq;
  }
  return null;
};

const deleteFaq = async (id) => {
  const faq = await Faq.findByPk(id);
  if (faq) {
    await faq.destroy();
    return true;
  }
  return false;
};

module.exports = {
  createFaq,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
};
