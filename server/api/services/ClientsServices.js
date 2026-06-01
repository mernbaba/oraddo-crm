const Clients = require("../models/Clients");
const Allowed_type = require("../../fileUpload/alowedtypes");
const uploadFile = require("../../fileUpload/fileupload");

const uploadfiles = async (files) => {
  const uploadpromises = files.map((file) => uploadFile(file, Allowed_type));
  try {
    const result = await Promise.all(uploadpromises);
    const uploadedData = {
      image_url: result[0].success ? result[0].url : null,
    };
    return uploadedData;
  } catch (err) {
    console.log(err, "ghjgvhjv");
    throw new Error("Image Upload Failed");
  }
};

const CreateClient = async (data, files) => {
  console.log(data, files, "bjbbj");

  try {
    if (files?.image_url?.length > 0) {
      const UploadData = await uploadfiles([files.image_url[0]]);
      console.log(UploadData, "jhdbhmn");
      data.image_url = UploadData.image_url;
    }
    const client = await Clients.create(data);
    return client;
  } catch (error) {
    console.log(error, "gfghf");

    throw new Error("Client Creation Failed");
  }
};

const getAllClients = async () => {
  try {
    const clients = await Clients.findAll();
    return clients;
  } catch (error) {
    throw new Error("Error Getting Clients");
  }
};

const getAllClientsbyorganizationId = async (id) => {
  console.log(id, "fromgetAllClientsss");

  try {
    const Client = await Clients.findAll({
      where: { organizationID: id },
    });
    console.log(Client,"clientssssss")
    return Client;
  } catch (error) {
    console.log(error, "Error Getting Clientttttt");
    throw new Error("Error Getting Client");
  }
};

const getClientsById = async (id) => {
  try {
    const Client = await Clients.findByPk(id);
    return Client;
  } catch (err) {
    console.log(err, "hvghjg");

    throw new Error("Error Getting Client");
  }
};

const updateClients = async (id, data, files) => {
  console.log(id, "id", data, "dadddta", files.image_url, "hhhhhhh");

  try {
    if (files.image_url?.length > 0 && files.image_url) {
      const UploadData = await uploadfiles([files.image_url[0]]);
      console.log(UploadData, "jhdbhmn");
      data.image_url = UploadData.image_url;
    }

    const client = await Clients.update(data, {
      where: { id: id },
      returning: true,
    });
    console.log(client, "ghvfvgh");

    if (client[0] === 0) {
      throw new Error("Client not found");
    }
    return client[1];
  } catch (err) {
    console.log(err, "jhjbjb");

    throw new Error("Client Updation Failed");
  }
};

const deleteClient = async (id) => {
  try {
    const deleted = Clients.destroy({
      where: { id: id },
    });
    if (deleted === 0) {
      throw new Error("Client Not Found");
    }
  } catch (err) {
    throw new Error("Error facing Client Deletion");
  }
};

module.exports = {
  CreateClient,
  getAllClients,
  getClientsById,
  updateClients,
  deleteClient,
  getAllClientsbyorganizationId,
};
