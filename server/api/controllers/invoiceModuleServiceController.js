const servicesService = require("../services/invoiceModuleSerService");

const createService = async (req, res) => {
  try {
    const services = req.body;
    console.log("services", services);
    const service = await servicesService.createService(services);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await servicesService.getServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getServiceByOrgId = async (req, res) => {
  try {
    const services = await servicesService.getServicesByOrgId(req.params.id);
    if (services) {
      res.status(200).json(services);
    } else {
      res.status(404).json({ message: "Services not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const services = await servicesService.getServiceById(req.params.id);
    if (services) {
      res.status(200).json(services);
    } else {
      res.status(404).json({ message: "service not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bulkUpdateService = async (req, res) => {
  try {
    console.log("Request body received at /Services/bulkUpdate:", req.body);
    const services = req.body;
    const updatedServices = await servicesService.bulkUpdateServices(services);
    res.status(200).json(updatedServices);
  } catch (error) {
    console.error("Error in bulkUpdateService controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const services = await servicesService.updateServices(
      req.params.id,
      req.body
    );
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    await servicesService.deleteService(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const startInvoiceAutomation = async (req, res) => {
//   try {
//     const { organizationID, invoiceType } = req.body;
//     const services = await servicesService.startInvoiceAutomation(
//       organizationID,
//       invoiceType
//     );
//     res.status(200).json(services);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const startInvoiceAutomation = async (req, res) => {
  try {
    const { organizationID } = req.body;
    const services = await servicesService.startInvoiceAutomation(
      organizationID
    );
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createService,
  getServices,
  getServiceByOrgId,
  getServiceById,
  bulkUpdateService,
  updateService,
  deleteService,
  startInvoiceAutomation,
};
