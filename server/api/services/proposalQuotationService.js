const { Op, Sequelize } = require("sequelize");
const praposalService = require("../models/praposalServices");
const Praposal = require("../models/ProposalQuotation");
const Organization = require("../models/OrganizationModule");
const moment = require("moment");
const aiService = require("./aiService");

// JSON Schema describing the proposal fields the model should fill in. Mirrors
// the frontend ProposalForm so the generated object can pre-fill the form 1:1.
const PROPOSAL_SCHEMA = {
  type: "object",
  properties: {
    companyname: {
      type: "string",
      description: "Client's company name. If only a person/client name is given, use that.",
    },
    name: {
      type: "string",
      description: "Client name (person or company the proposal is addressed to).",
    },
    requirements: {
      type: "string",
      description:
        "One-line 'Your Requirements' summary, e.g. 'Website ReDesigning for Saksam Sol'.",
    },
    service: {
      type: "array",
      description:
        "Proposal body sections. Each section's content is Markdown using '-' for bullets and indentation for sub-bullets.",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Section heading, e.g. 'Website Redesigning'." },
          content: {
            type: "string",
            description: "Markdown bullet list describing the scope/deliverables for this section.",
          },
        },
      },
    },
    timeline: {
      type: "string",
      description:
        "'Timeline and Resources' paragraph stating the delivery duration in plain language.",
    },
    pricing: {
      type: "number",
      description: "Total project price as a number only (no currency symbol or commas).",
    },
    currency: {
      type: "string",
      enum: ["INR", "USD", "AUD", "CAD"],
      description: "Currency for the pricing amount. Default to INR if unspecified.",
    },
    pricing_note: {
      type: "string",
      description: "Short pricing note such as '+ GST'.",
    },
    togetstarted: {
      type: "string",
      description: "Closing 'To get started' paragraph about advance payment / next steps.",
    },
  },
};

const PROPOSAL_SYSTEM_PROMPT = [
  "You are a CRM assistant that writes professional software-agency business proposals.",
  "Given a short brief, produce a complete, well-structured proposal that fills every field.",
  "Section content must be Markdown bullet lists (use '-' for bullets, two-space indent for sub-bullets).",
  "Be concrete and client-ready: describe deliverables, tech stack, deployment, maintenance terms.",
  "Infer a sensible price, currency, and timeline from the brief when given; otherwise use reasonable defaults.",
  "Never invent a different client name than the one in the brief.",
].join(" ");

/**
 * Generate a structured proposal draft from a free-form prompt using the shared
 * AI service. Returns a plain object matching the proposal form shape (already
 * typed/parsed — no JSON parsing needed by the caller).
 */
const generateProposal = async (prompt) => {
  if (!prompt || !String(prompt).trim()) {
    const error = new Error("A prompt describing the project is required.");
    error.status = 400;
    throw error;
  }

  const draft = await aiService.generateStructured({
    name: "ProposalDraft",
    schema: PROPOSAL_SCHEMA,
    system: PROPOSAL_SYSTEM_PROMPT,
    prompt: `Write a complete business proposal for the following brief:\n\n${prompt}`,
    // A full proposal (several Markdown sections) can be long, so give the
    // output plenty of headroom to avoid the JSON being truncated mid-stream.
    maxTokens: 8000,
    // Reasoning models otherwise burn most of the token budget on hidden
    // reasoning, leaving the proposal JSON incomplete. We don't need that here.
    extra: { reasoning: { enabled: false } },
  });

  return draft;
};

const setAttendeesForMeetings = async (praposal) => {
  try {
    for (const serviceId in praposal) {
      if (Object.hasOwnProperty.call(praposal, serviceId)) {
        const employeeIds = praposal[serviceId];
        console.log("scducdc", employeeIds);

        // Find the meeting by its ID
        const praposalService = await Praposal.findByPk(serviceId);

        if (!praposalService) {
          console.log(`Praposal with id ${serviceId} not found`);
          continue;
        }

        // Set the attendees for the meeting
        // This will update the many-to-many relationship table
        await praposalService.setPraposalServices(employeeIds);

        console.log(`Services set for Praposal ${serviceId}: ${employeeIds}`);
      }
    }

    return { success: true, message: "Services set for Praposals" };
  } catch (error) {
    console.error("Error setting services:", error.message);
    throw error;
  }
};

const createPraposal = async (data) => {
  try {
    const praposal = await Praposal.create(data);
    return { praposal };
  } catch (error) {
    throw error;
  }
};
function getAllFuncs(toCheck) {
  const props = [];
  let obj = toCheck;
  do {
    props.push(...Object.getOwnPropertyNames(obj));
  } while ((obj = Object.getPrototypeOf(obj)));
  return props.sort().filter((e, i, arr) => {
    if (e != arr[i + 1] && typeof toCheck[e] == "function") return true;
  });
}

const updateService = async (data) => {
  try {
    console.log("daaataaaa", data);
    let departments = data;
    for (const key in departments) {
      const department = await Praposal.findByPk(key);
      console.log("praposallll", getAllFuncs);
      console.log("jddddd", department);
      await department.setModules(departments[key]);
    }
    return { success: true, Departments_Modules: departments };
  } catch (error) {
    throw error;
  }
};

const getPraposal = async () => {
  try {
    const praposal = await Praposal.findAll({
      include: [
        {
          model: praposalService,
        },
      ],
    });
    return praposal;
  } catch (error) {
    throw error;
  }
};

// const getProposalByOrgId = async (id, page, pageSize) => {

//   try {
//     const offset = page * pageSize;
//     const totalProposal = await Praposal.count({ where: { organizationID: id }})
//     const praposals = await Praposal.findAll({
//       where: { organizationID: id },
//       limit: pageSize,
//       offset: offset,
//       include: [
//         {
//           model: praposalService
//         },
//       ],
//     });
//     return {praposals,totalProposal};
//   } catch (error) {
//     throw error;
//   }
// }
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

const getProposalByOrgId = async (
  id,
  page,
  pageSize,
  search,
  year,
  monthName
) => {
  console.log(id, monthName, year, "consoleeeeeeeeeeeeeeeeeee");
  try {
    const offset = page * pageSize;

    const month = parseInt(getMonthNumber(monthName), 10);
    console.log(month, "monethhhhhhhhhhhhhhh");
    // Include the search condition if there is a search term
    const whereClause = { organizationID: id };

    if (search) {
      whereClause.companyname = { [Op.iLike]: `%${search.toLowerCase()}%` }; // Adjust `title` with the correct field for searching
    }

    if (year && month) {
      whereClause[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("createdAt")),
          year
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("createdAt")),
          month
        ),
      ];
    } else if (year) {
      whereClause.createdAt = Sequelize.where(
        Sequelize.fn("DATE_PART", "year", Sequelize.col("createdAt")),
        year
      );
    } else if (month) {
      whereClause.createdAt = Sequelize.where(
        Sequelize.fn("DATE_PART", "month", Sequelize.col("createdAt")),
        month
      );
    }

    // Get the total count of proposals matching the search and organization ID
    const totalProposal = await Praposal.count({ where: whereClause });

    // Get the proposals with pagination and search
    const praposals = await Praposal.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
      include: [
        {
          model: praposalService,
        },
      ],
      order: [["createdAt", "DESC"]], // Sort by createdAt in descending order
    });

    return { praposals, totalProposal };
  } catch (error) {
    throw error;
  }
};


// // Original method (kept for reference or other uses)
// const getProposalByOrgIdForBilling = async (id) => {
//   try {
//     const praposals = await Praposal.findAll({
//       where: { organizationID: id },
//       include: [{ model: praposalService }],
//       order: [["createdAt", "DESC"]],
//     });
//     return praposals;
//   } catch (error) {
//     throw error;
//   }
// };

const getProposalByOrgIdForBilling = async (id, isPrevious6Months, isPreviousLeads6Months) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let startMonthOffset, endMonthOffset;
    if (isPrevious6Months || isPreviousLeads6Months) {
      startMonthOffset = -9;
      endMonthOffset = -4;
    } else {
      startMonthOffset = -3;
      endMonthOffset = 2;
    }

    // Calculate start and end dates correctly
    const startDate = new Date(currentDate);
    startDate.setMonth(currentMonth + startMonthOffset);
    startDate.setDate(1); // First day of the month (fixed typo)
    startDate.setHours(0, 0, 0, 0); // Start of day

    const endDate = new Date(currentDate);
    endDate.setMonth(currentMonth + endMonthOffset + 1); // Go to next month
    endDate.setDate(0); // Last day of the previous month
    endDate.setHours(23, 59, 59, 999); // End of day

    console.log("Date Range:", { startDate: startDate.toISOString(), endDate: endDate.toISOString() }); // Debug log

    const proposals = await Praposal.findAll({
      where: {
        organizationID: id,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const labels = [];
    const proposalAmounts = [];
    const achievedAmounts = [];
    const proposalCounts = [];
    const achievedCounts = [];

    for (let i = startMonthOffset; i <= endMonthOffset; i++) {
      const monthIndex = (currentMonth + i + 12) % 12;
      const year = currentYear + Math.floor((currentMonth + i) / 12);
      const shortYear = year % 100;
      const label = `${monthNames[monthIndex]} ${shortYear}`;
      labels.push(label);

      const monthStart = new Date(year, monthIndex, 1);
      const monthEnd = new Date(year, monthIndex + 1, 0);
      const monthProposals = proposals.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= monthStart && itemDate <= monthEnd;
      });

      const proposalAmount = monthProposals.reduce((sum, item) => {
        const servicePricing = Array.isArray(item.service)
          ? item.service.reduce((total, s) => total + parseFloat(s.Pricing || 0), 0)
          : 0;
        return sum + servicePricing;
      }, 0);

      const achievedAmount = monthProposals
        .filter((item) => item.status === "Approval")
        .reduce((sum, item) => {
          const servicePricing = Array.isArray(item.service)
            ? item.service.reduce((total, s) => total + parseFloat(s.Pricing || 0), 0)
            : 0;
          return sum + servicePricing;
        }, 0);

      const proposalCount = monthProposals.length;
      const achievedCount = monthProposals.filter(
        (item) => item.status === "Approval"
      ).length;

      proposalAmounts.push(proposalAmount);
      achievedAmounts.push(achievedAmount);
      proposalCounts.push(proposalCount);
      achievedCounts.push(achievedCount);
    }

    return {
      labels,
      proposalAmounts,
      achievedAmounts,
      proposalCounts,
      achievedCounts,
    };
  } catch (error) {
    throw error;
  }
};

const getproposalByOrgIdForTable = async (id, page, pageSize, year, monthName) => {
  console.log(id, monthName, year, "monthName, year,id") 
  try {

    const offset = page * pageSize;

    const month = parseInt(getMonthNumber(monthName), 10);
    console.log(month, "monethhhhhhhhhhhhhhh");

    const whereClause = { organizationID: id };

    if (year && month) {
      whereClause[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("createdAt")),
          year
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("createdAt")),
          month
        ),
      ];
    } else if (year) {
      whereClause.createdAt = Sequelize.where(
        Sequelize.fn("DATE_PART", "year", Sequelize.col("createdAt")),
        year
      );
    } else if (month) {
      whereClause.createdAt = Sequelize.where(
        Sequelize.fn("DATE_PART", "month", Sequelize.col("createdAt")),
        month
      );
    }

    const billingCount = await Praposal.count({ where: whereClause });

    const praposals = await Praposal.findAll({
      where: whereClause,
      limit : pageSize,
      offset: offset,
      include: [{ model: praposalService }],
      order: [["createdAt", "DESC"]],
    });

    return { praposals,billingCount };
  } catch (error) {
    throw error;
  }
};

const getPraposalById = async (id) => {
  try {
    const praposal = await Praposal.findByPk(id);
    if (!praposal) return praposal;

    // Attach the organization's branding (logo + company details) so the
    // rendered proposal document can use the org's uploaded logo.
    const org = await Organization.findByPk(praposal.organizationID, {
      attributes: [
        "id",
        "companyName",
        "companyLogo",
        "companyAddress",
        "phoneNumber",
        "email",
        "companyWebsite",
      ],
    });
    const result = praposal.toJSON();
    result.organization = org ? org.toJSON() : null;
    return result;
  } catch (error) {
    throw error;
  }
};

const updatePraposal = async (id, data) => {
  try {
    const praposal = await Praposal.update(data, {
      where: { id: id },
    });
    return praposal;
  } catch (error) {
    throw error;
  }
};

const deletePraposal = async (id) => {
  try {
    await Praposal.destroy({
      where: { id: id },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPraposal,
  getPraposal,
  getProposalByOrgId,
  getPraposalById,
  updatePraposal,
  deletePraposal,
  updateService,
  getProposalByOrgIdForBilling,
  getproposalByOrgIdForTable,
  generateProposal,
};
