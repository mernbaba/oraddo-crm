const InvoiceManagement = require("../models/InvoiceManagement");
const invoiveModulePoints = require("../models/invoiceModule");
const invoiveModuleService = require("../models/invoiceModuleServices");
const HttpException = require("../utils/utils");
const organization = require("../models/OrganizationModule");
const { where, Op, Sequelize } = require("sequelize");
const aiService = require("./aiService");

// JSON Schema describing the invoice fields the model should fill in. Mirrors
// the frontend InvoiceForm so the generated object can pre-fill the form 1:1.
const INVOICE_SCHEMA = {
  type: "object",
  properties: {
    clientName: {
      type: "string",
      description:
        "Person the invoice is billed to (the contact name, e.g. 'K Raghavendra').",
    },
    billTo: {
      type: "string",
      description:
        "Multi-line 'Bill To' block for the client — company name, phone, email and website, each on its own line.",
    },
    items: {
      type: "array",
      description:
        "Invoice line items. One entry per module/service being billed.",
      items: {
        type: "object",
        properties: {
          module: {
            type: "string",
            description: "Module/service name, e.g. 'Website Redesigning'.",
          },
          base: {
            type: "string",
            description:
              "Payment basis for this line, e.g. 'Advance Payment', 'Full Payment', 'Milestone 1'.",
          },
          amount: {
            type: "number",
            description:
              "Amount billed for this line item, number only (no currency symbol or commas).",
          },
        },
      },
    },
    totalPrize: {
      type: "number",
      description:
        "Total full project price as a number only (no currency symbol or commas).",
    },
    gst: {
      type: "string",
      description: "GST as a percentage like '18%', or '0' when not applicable.",
    },
    currency: {
      type: "string",
      enum: ["INR", "USD", "AUD", "CAD"],
      description: "Currency for the amounts. Default to INR if unspecified.",
    },
    invoiceType: {
      type: "string",
      description: "Short invoice type/category, e.g. 'Professional Services'.",
    },
    comments: {
      type: "string",
      description: "Optional notes/description shown on the invoice.",
    },
  },
};

const INVOICE_SYSTEM_PROMPT = [
  "You are a CRM assistant that prepares professional billing invoices for a software agency.",
  "Given a short brief, produce a complete invoice that fills every field.",
  "Derive the line items (module, basis, amount), the full project price, GST and currency from the brief.",
  "When only an advance is being billed, set the line item 'base' to 'Advance Payment' and 'amount' to the advance, while 'totalPrize' is the full project price.",
  "Never invent a different client than the one named in the brief. Default the currency to INR.",
].join(" ");

/**
 * Generate a structured invoice draft from a free-form prompt using the shared
 * AI service. Returns a plain object matching the invoice form shape (already
 * typed/parsed — no JSON parsing needed by the caller).
 */
const generateInvoice = async (prompt) => {
  if (!prompt || !String(prompt).trim()) {
    const error = new Error("A prompt describing the work/invoice is required.");
    error.status = 400;
    throw error;
  }

  const draft = await aiService.generateStructured({
    name: "InvoiceDraft",
    schema: INVOICE_SCHEMA,
    system: INVOICE_SYSTEM_PROMPT,
    prompt: `Prepare a billing invoice for the following brief:\n\n${prompt}`,
    maxTokens: 4000,
    // We don't need provider-side reasoning here; it just burns the token budget.
    extra: { reasoning: { enabled: false } },
  });

  return draft;
};
const createModulesId = async (invoice) => {
  try {
    console.log("jnjucnd", invoice);

    for (let serviceId in invoice) {
      if (Object.hasOwnProperty.call(invoice, serviceId)) {
        const servicePiontId = invoice[serviceId];
        console.log(servicePiontId, "modulePoint");

        // Find the invoice by its ID
        const invoices = await InvoiceManagement.findByPk(serviceId);
        console.log(invoices, "many");

        if (!invoices) {
          console.log(`Invoice with id ${serviceId} not found`);
          continue;
        }

        // Set the related invoiceModules for this InvoiceManagement
        const invoiceCreate = await invoices.setInvoiceModules(servicePiontId);
        console.log(invoiceCreate, "setInvoice");

        console.log(`Services ${serviceId}: ${servicePiontId}`);
      }
    }

    return { success: true, message: "Modules set for invoice" };
  } catch (error) {
    console.error("Error setting services:", error.message);
    throw error;
  }
};

// const generateInvoiceId = async (orgId) => {
//   const company = await organization.findByPk(orgId);
//   if (!company) {
//     throw new HttpException(404, "Organization not found");
//   }

//   const { companyName } = company;
//   const words = companyName.split(" ");  // Split by space
//   const invoiceName = words.map(word => word.charAt(0).toUpperCase()).join("");  // Take first letter of each word and join them
//   console.log(invoiceName);

//   console.log("jrirurir");
//   const latestInvoice = await InvoiceManagement.findOne({
//     where: { organizationID: id },
//     order: [["invoiceId", "DESC"]],
//     attributes: ["invoiceId"],
//   });

//   console.log("dgjsfjoeoeiir", latestInvoice);

//   if (latestInvoice && latestInvoice) {
//     console.log("gitoskjhdjr");
//     const latestId = latestInvoice.invoiceId;
//     const numberPart = parseInt(latestId.slice(4), 10);
//     const newId = `${invoiceName}${(numberPart + 1).toString().padStart(3, "0")}`;
//     return newId;
//   } else {
//     return `${invoiceName}001`;
//   }
// };

const generateInvoiceId = async (orgId) => {
  // Fetch the company details using the organization ID
  const company = await organization.findByPk(orgId);
  if (!company) {
    throw new HttpException(404, "Organization not found");
  }

  const { companyName } = company;
  const words = companyName.split(" "); // Split by space
  const invoiceName1 = words
    .map((word) => word.charAt(0).toUpperCase())
    .join(""); // Get the first letter of each word
  const invoiceName = `${invoiceName1}I`; // Form the invoice prefix
  console.log(invoiceName);

  // Find the latest invoice ID for this specific organization
  const latestInvoice = await InvoiceManagement.findOne({
    where: { organizationID: orgId }, // Ensure it is filtered by orgId
    order: [["invoiceId", "DESC"]], // Order by invoiceId in descending order to get the latest
    attributes: ["invoiceId"],
  });

  console.log("Latest Invoice: ", latestInvoice);

  // If the latest invoice exists, extract and increment the sequence number
  if (latestInvoice && latestInvoice.invoiceId) {
    const latestId = latestInvoice.invoiceId;
    const numberPart = parseInt(latestId.slice(invoiceName.length), 10); // Extract the number part (after the prefix)

    // Generate the new invoice ID with incremented sequence number
    const newId = `${invoiceName}${(numberPart + 1)
      .toString()
      .padStart(3, "0")}`;
    return newId;
  } else {
    // If no previous invoice exists, start from "001" for this organization
    return `${invoiceName}001`; // Default to "001" if no previous invoices exist for this organization
  }
};

function getAllFuncs(toCheck) {
  const props = [];
  let obj = toCheck;
  try {
    do {
      props.push(...Object.getOwnPropertyNames(obj));
    } while ((obj = Object.getPrototypeOf(obj)));
    return props.sort().filter((e, i, arr) => {
      if (e != arr[i + 1] && typeof toCheck[e] == "function") return true;
    });
  } catch (error) {
    console.log("errorrrrr", error);
  }
}

const createInvoice = async (data) => {
  try {
    const { ...invoiceData } = data;
    console.log("servicesss", "invoiceeeDattaaaa", invoiceData);

    invoiceData.invoiceId = await generateInvoiceId(invoiceData.organizationID);

    console.log(data, "create invoice");

    const invoice = await InvoiceManagement.create(invoiceData);
    const getMethods = getAllFuncs(invoice);
    console.log("eodkeojefje", getMethods);

    // const saperate = { [invoice.id]: services };
    // console.log("juhuhce",saperate);

    // const modulesData = await createModulesId(saperate);

    return { invoice };
  } catch (error) {
    console.log(error, "errorgetting");

    console.error("Error creating invoice:", error);
    throw error;
  }
};

const getInvoices = async () => {
  try {
    const invoices = await InvoiceManagement.findAll({
      include: [
        {
          model: invoiveModulePoints,
        },
        {
          model: invoiveModuleService,
          as: "serviceInvoiceData",
        },
      ],
    });
    return invoices;
  } catch (error) {
    throw error;
  }
};

// const getInvoiceByOrgId = async (id) => {
//   console.log(id, "iddd");
//   try {
//     const invoices = await InvoiceManagement.findAll({
//       where: { organizationID: id },
//       include: [
//         {
//           model: invoiveModulePoints,
//         },
//       ],
//     });
//     console.log(id, "iddddd");
//     return invoices;
//   } catch (error) {
//     throw error;
//   }
// };

const getInvoiceByOrgId = async (id) => {
  try {
    const invoices = await InvoiceManagement.findAll({
      where: { organizationID: id },
      include: [
        {
          model: invoiveModulePoints, // Ensure this model is correctly defined
        },
        {
          model: invoiveModuleService,
          as: "serviceInvoiceData",
        },
      ],
    });

    console.log(invoices, "Invoices fetched from DB"); // Log for debugging
    return invoices; // Return the fetched invoices
  } catch (error) {
    console.error("Error in service while fetching invoices:", error.message);
    throw error; // Throw error to be caught in the controller
  }
};
const getMonthNumber = (monthName) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.indexOf(monthName) + 1; // Months are 1-based in SQL
};

const getInvoiceByOrgIdInInvoicePage = async (
  id,
  page,
  pageSize,
  year,
  monthName
) => {

  console.log(id, monthName, year, "consoleeeeeeeeeeeeeeeeeeeinvoice");
  try {
    const offset = page * pageSize;
   let whereClause = { organizationID: id }

    const month = parseInt(getMonthNumber(monthName), 10);
    console.log(month, "monethhhhhhhhhhhhhhhinvoice");

    if (year && month !== undefined) {
      whereClause[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("Date")),
          year
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("Date")),
          month
        ),
      ];
    } else if (year) {
      whereClause.Date = Sequelize.where(
        Sequelize.fn("DATE_PART", "year", Sequelize.col("Date")),
        year
      );
    } else if (month !== undefined) {
      whereClause.Date = Sequelize.where(
        Sequelize.fn("DATE_PART", "month", Sequelize.col("Date")),
        month
      );
    }

    const totalInvoice = await InvoiceManagement.count({
      where: whereClause,
    });



    const invoices = await InvoiceManagement.findAll({
      where: whereClause,
      offset: offset,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: invoiveModulePoints, // Ensure this model is correctly defined
        },
        {
          model: invoiveModuleService,
          as: "serviceInvoiceData",
        },
      ],
    });

 

    console.log(invoices, "Invoices fetched from DB"); // Log for debugging
    return { invoices, totalInvoice }; // Return the fetched invoices
  } catch (error) {
    console.error("Error in service while fetching invoices:", error.message);
    throw error; // Throw error to be caught in the controller
  }
};

const getInvoiceByOrgIdForFinance = async (id, year) => {
  try {
    // Define the start and end dates for the selected year
    const startDate = new Date(year, 0, 1); // January 1st of the selected year
    const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st of the selected year

    // Count total invoices for the organization with "Approved" status
    const totalInvoice = await InvoiceManagement.count({
      where: {
        organizationID: id,
        status: "Approved",
        createdAt: {
          [Op.between]: [startDate, endDate], // Filter invoices within the selected year
        },
      },
    });

    // Fetch invoices with filtering, ordering, and associations
    const invoices = await InvoiceManagement.findAll({
      where: {
        organizationID: id,
        status: "Approved", // Only fetch invoices with "Approved" status
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["createdAt", "DESC"]], // Sort by creation date (latest first)
      include: [
        {
          model: invoiveModulePoints, // Ensure this model is correctly defined
        },
        {
          model: invoiveModuleService,
          as: "serviceInvoiceData",
        },
      ],
    });

    console.log(invoices, "Invoices fetched from DB"); // Debugging log
    return { invoices, totalInvoice }; // Return filtered invoices
  } catch (error) {
    console.error("Error in service while fetching invoices:", error.message);
    throw error; // Throw error to be caught in the controller
  }
};

const getInvoiceById = async (id) => {
  try {
    const invoiceId = await InvoiceManagement.findByPk(id);
    if (!invoiceId) throw new HttpException(404, "InvoiceId not found");
    const invoice = await InvoiceManagement.findByPk(id, {
      include: [
        // {
        //   model: invoiveModulePoints,
        // },
        {
          model: invoiveModuleService,
          as: "serviceInvoiceData",
        },
      ],
    });

    // Attach the issuing organization's branding (logo + company details) so the
    // rendered invoice document can use the org's uploaded logo. Kept as a plain
    // join (no association needed) and tolerant of a missing org.
    const org = await organization.findByPk(invoice.organizationID, {
      attributes: [
        "id",
        "companyName",
        "companyLogo",
        "companyAddress",
        "phoneNumber",
        "email",
        "accountNumber",
        "bankName",
        "IFSC_Code",
        "GSTIN",
        "companyWebsite",
      ],
    });
    const result = invoice.toJSON();
    result.organization = org ? org.toJSON() : null;
    return result;
  } catch (error) {
    throw error;
  }
};

const updateInvoice = async (id, data) => {
  console.log(id, data, "ididididididatatdatd");
  try {
    const invoiceId = await InvoiceManagement.findByPk(id, {
      include: [
        {
          model: invoiveModuleService,
          as: "serviceInvoiceData",
        },
      ],
    });
    console.log(invoiceId, "invoiceIDDDDDD");

    if (!invoiceId) throw new HttpException(404, "InvoiceId not found");
    try {
      console.log(data, "dddddddddddddddd");

      const invoice = await InvoiceManagement.update(data, {
        where: { id: id },
      });
      console.log(invoice, "trycatch");
      return invoice;
    } catch (error) {
      console.log("errrrrrrr", error);
    }
  } catch (error) {
    throw error;
  }
};

const deleteInvoice = async (id) => {
  try {
    const invoiceId = await InvoiceManagement.findByPk(id);
    if (!invoiceId) throw new HttpException(404, "InvoiceId not found");
    await InvoiceManagement.destroy({
      where: { id: id },
    });
    return invoiceId;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceByOrgId,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoiceByOrgIdInInvoicePage,
  getInvoiceByOrgIdForFinance,
  generateInvoiceId,
  generateInvoice,
};
