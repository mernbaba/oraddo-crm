const { Op } = require("sequelize");
const InvoiceManagement = require("../models/InvoiceManagement");
const invoiceModuleServices = require("../models/invoiceModuleServices");
const invoiceService = require("./InvoiceService");
// const generateInvoiceId = require('./InvoiceService')
const moment = require("moment");
// const createService = async (data) => {
//   try {
//     const services = await invoiceModuleServices.create(data);
//     return services;
//   } catch (error) {
//     throw error;
//   }
// };
const createService = async (data) => {
  try {
    if (Array.isArray(data)) {
      const services = await invoiceModuleServices.bulkCreate(data);
      return services;
    } else {
      const service = await invoiceModuleServices.create(data);
      return service;
    }
  } catch (error) {
    console.error("Error in createService:", error);
    throw error;
  }
};

const getServices = async () => {
  try {
    const services = await invoiceModuleServices.findAll({
      include: [
        {
          model: InvoiceManagement,
          as: "invoiceCreation",
        },
      ],
    });
    return services;
  } catch (error) {
    throw error;
  }
};

const getServicesByOrgId = async (id) => {
  try {
    const services = await invoiceModuleServices.findAll({
      where: { organizationID: id },
      include: [
        {
          model: InvoiceManagement,
          as: "invoiceCreation",
        },
      ],
    });
    return services;
  } catch (error) {
    throw error;
  }
};

const getServiceById = async (id) => {
  try {
    const services = await invoiceModuleServices.findByPk(id, {
      include: [
        {
          model: InvoiceManagement,
          as: "invoiceCreation",
        },
      ],
    });
    return services;
  } catch (error) {
    throw error;
  }
};

const bulkUpdateServices = async (data) => {
  try {
    const updatedServices = await Promise.all(
      data.map(async (service) => {
        const { id, ...updateData } = service;
        return await invoiceModuleServices.update(updateData, {
          where: { id },
        });
      })
    );
    return updatedServices;
  } catch (error) {
    console.error("Error in bulkUpdateServices:", error);
    throw error;
  }
};

const updateServices = async (id, data) => {
  try {
    const services = await invoiceModuleServices.update(data, {
      where: { id: id },
      include: [
        {
          model: InvoiceManagement,
          as: "invoiceCreation",
        },
      ],
    });
    return services;
  } catch (error) {
    throw error;
  }
};

const deleteService = async (id) => {
  try {
    const services = await invoiceModuleServices.destroy({
      where: { id: id },
    });
    return services;
  } catch (error) {
    throw error;
  }
};

// const startInvoiceAutomation = async () => {
//   try {
//     const moment = require("moment");
//     const today = moment();

//     const organizationID = 1;

//     const invoiceManagements = await InvoiceManagement.findAll({
//       where: { organizationID, invoiceType: "Original" },
//       include: [
//         {
//           model: invoiceModuleServices,
//           as: "serviceInvoiceData",
//         },
//       ],
//     });

//     if (!invoiceManagements || invoiceManagements.length === 0) {
//       console.log("No original invoices found");
//       return;
//     }

//     for (const invoice of invoiceManagements) {
//       const invoiceDate = moment(invoice.Date);
//       const services = invoice.serviceInvoiceData || [];

//       for (const service of services) {
//         const base = service.base;
//         const monthsDiff = today.diff(invoiceDate, "months");

//         let shouldGenerate = false;
//         if (base === "Monthly" && monthsDiff >= 1) shouldGenerate = true;
//         else if (base === "Quarterly" && monthsDiff >= 3) shouldGenerate = true;
//         else if (base === "Half Yearly" && monthsDiff >= 6)
//           shouldGenerate = true;
//         else if (base === "Yearly" && monthsDiff >= 12) shouldGenerate = true;

//         if (shouldGenerate) {
//           const newInvoiceId = await invoiceService.generateInvoiceId(
//             organizationID
//           );
//           console.log(newInvoiceId, "newInvoiceIddd");
//           const newInvoice = await InvoiceManagement.create({
//             billTo: invoice.billTo,
//             Date: new Date(),
//             invoiceId: newInvoiceId,
//             base: [service.base],
//             amount: [service.amount],
//             currency: invoice.currency,
//             comments: invoice.comments,
//             status: "Pending",
//             GST: invoice.GST,
//             Total: invoice.Total,
//             totalPrize: invoice.totalPrize,
//             companyName: invoice.companyName,
//             clientName: invoice.clientName,
//             organizationID: invoice.organizationID,
//             services: [invoice.services],
//             invoiceType: "Duplicate",
//           });
//           console.log(service, "serviceeeeee");

//           const newServices = await invoiceModuleServices.create({
//             InvoiceId: newInvoice.id,
//             invoiceType: "Duplicate",
//             services: service.services,
//             base: service.base,
//             amount: service.amount,
//             organizationID: service.organizationID,
//           });

//           console.log("Invoice created:", newInvoice.id);
//           console.log("Service created:", newServices);
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error in startInvoiceAutomation:", error);
//   }
// };



const calculateInvoiceDate = (originalDate, base) => {
  try {
    const original = moment(originalDate);
    let targetDate;

    // Determine the number of months to add based on the billing cycle
    let monthsToAdd;
    switch (base) {
      case "Monthly":
        monthsToAdd = 1;
        break;
      case "Quarterly":
        monthsToAdd = 3;
        break;
      case "Half Yearly":
        monthsToAdd = 6;
        break;
      case "Yearly":
        monthsToAdd = 12;
        break;
      default:
        throw new Error(`Invalid base: ${base}`);
    }

    // Calculate the target date by adding the months
    targetDate = original.clone().add(monthsToAdd, "months");

    // Check if the day of the target date matches the original
    // If not (e.g., 31st in Feb), set to the last day of the month
    if (targetDate.date() !== original.date()) {
      targetDate = targetDate.endOf("month");
    }

    // Set the time to 11:58 PM to match the cron schedule
    targetDate = targetDate.set({ hour: 23, minute: 58, second: 0, millisecond: 0 });

    return targetDate.toDate(); // Return JavaScript Date object
  } catch (error) {
    console.error("Error calculating invoice date:", error);
    // Fallback to today’s date at 11:58 PM if there’s an error
    return moment().set({ hour: 23, minute: 58, second: 0, millisecond: 0 }).toDate();
  }
};

const startInvoiceAutomation = async () => {
  try {
    const moment = require("moment");
    const today = moment();

    const organizationID = 1;

    const invoiceManagements = await InvoiceManagement.findAll({
      where: { organizationID, invoiceType: "Original" },
      include: [
        {
          model: invoiceModuleServices,
          as: "serviceInvoiceData",
        },
      ],
    });

    if (!invoiceManagements || invoiceManagements.length === 0) {
      console.log("No original invoices found");
      return;
    }

    // Group services by invoice to handle them together
    for (const invoice of invoiceManagements) {
      const invoiceDate = moment(invoice.Date);
      const services = invoice.serviceInvoiceData || [];

      // Object to collect services eligible for new invoice
      const newInvoiceData = {
        bases: [],
        services: [],
        amounts: [],
        shouldGenerate: false,
      };

      for (const service of services) {
        const base = service.base;
        const monthsDiff = today.diff(invoiceDate, "months");

        // Check if the service qualifies for a new invoice
        if (
          (base === "Monthly" && monthsDiff >= 1) ||
          (base === "Quarterly" && monthsDiff >= 3) ||
          (base === "Half Yearly" && monthsDiff >= 6) ||
          (base === "Yearly" && monthsDiff >= 12)
        ) {
          newInvoiceData.shouldGenerate = true;
          newInvoiceData.bases.push(service.base);
          newInvoiceData.services.push(service.services);
          newInvoiceData.amounts.push(service.amount);
        }
      }

      // Create a single new invoice if any services qualify
      if (newInvoiceData.shouldGenerate) {
        const newInvoiceId = await invoiceService.generateInvoiceId(organizationID);
        console.log(newInvoiceId, "newInvoiceId");
        const adjustedDate = calculateInvoiceDate(invoice.Date, newInvoiceData.bases[0]);

        const newInvoice = await InvoiceManagement.create({
          billTo: invoice.billTo,
          Date: adjustedDate,
          invoiceId: newInvoiceId,
          base: newInvoiceData.bases, // Array of bases
          amount: newInvoiceData.amounts, // Array of amounts
          currency: invoice.currency,
          comments: invoice.comments,
          status: "Pending",
          GST: invoice.GST,
          Total: invoice.Total, // Consider recalculating if amounts differ
          totalPrize: invoice.totalPrize, // Consider recalculating if needed
          companyName: invoice.companyName,
          clientName: invoice.clientName,
          organizationID: invoice.organizationID,
          services: newInvoiceData.services, // Array of services
          invoiceType: "Duplicate",
        });

        console.log("Invoice created:", newInvoice.id);

        // Create service records for the new invoice
        for (let i = 0; i < newInvoiceData.services.length; i++) {
          await invoiceModuleServices.create({
            InvoiceId: newInvoice.id,
            invoiceType: "Duplicate",
            services: newInvoiceData.services[i],
            base: newInvoiceData.bases[i],
            amount: newInvoiceData.amounts[i],
            organizationID: invoice.organizationID,
          });
        }

        console.log("Services created for invoice:", newInvoice.id);
      }
    }
  } catch (error) {
    console.error("Error in startInvoiceAutomation:", error);
  }
};

module.exports = {
  createService,
  getServices,
  getServicesByOrgId,
  getServiceById,
  bulkUpdateServices,
  updateServices,
  deleteService,
  startInvoiceAutomation,
};
