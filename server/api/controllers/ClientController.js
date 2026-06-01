const clientService = require("../services/ClientsServices");
const parseRequestFiles = require("../../fileUpload/requestedfile");

const CreateClient = async (req, res) => {
  console.log(req, "jhbbhjbjb");

  try {
    const payload = await parseRequestFiles(req);
    console.log(payload, "nbjbhb");

    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0];
    }
    req.files = payload.files;
    const { body, files } = req;
    console.log(body, files, "hvhgh");

    const client = await clientService.CreateClient(body, files);
    res.status(201).json(client);
  } catch (error) {
    console.log(error, "bbhdg");

    res.status(500).json({ error: error.message });
  }
};

const getClients = async (req, res) => {
  try {
    const Clients = await clientService.getAllClients();
    console.log(Clients,"clientsassssss")
    res.status(200).json({ Clients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllClientsbyorganizationId = async (req, res) => {
  try {
    const clients = await clientService.getAllClientsbyorganizationId(req.params.id);
    if (clients) {
      res.status(200).json(clients);
    } else {
      res.status(404).json({ message: "Client Not Found" });
    }
  } catch (error) {
    console.log(error, "getClientssss");
    res.status(500).json({ error: error.message });
  }
};

const getClientsById = async (req, res) => {
  console.log(req.params.id, "jjhbv");

  try {
    const clients = await clientService.getClientsById(req.params.id);
    if (clients) {
      res.status(200).json(clients);
    } else {
      res.status(404).json({ message: "Client Not Found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateClient = async (req, res) => {
  console.log(req, "bjhbb");

  try {
    const payload = await parseRequestFiles(req);
    console.log(payload, "nbjbhb");

    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0];
    }
    req.files = payload.files;
    const { body, files } = req;
    console.log(body, files, "hvhgh");

    const client = await clientService.updateClients(
      req.params.id,
      body,
      files
    );
    res.status(200).json(client);
  } catch (err) {
    console.log(err, "hvgv");

    res.status(500).json({ error: err.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    await clientService.deleteClient(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  CreateClient,
  getClients,
  getClientsById,
  updateClient,
  deleteClient,
  getAllClientsbyorganizationId
};
