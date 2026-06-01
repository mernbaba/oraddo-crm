const contactformService = require("../services/contactformService");

const CreateContact = async (req, res) => {
  try {
    const ContactData = req.body;
    const data = await contactformService.CreateConData(ContactData);
    res.status(201).json(data);
  } catch (err) {
    console.log(err, "Errsssor");

    res.status(500).json({ err: err.message });
  }
};
const getAllConatcts = async (req, res) => {
  try {
    const AllConatcts = await contactformService.getAllContacts();
    res.status(200).json(AllConatcts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getConatctById = async (req, res) => {
  try {
    const Contacts = await contactformService.getContatById(req.params.id);
    if (Contacts) {
      res.status(200).json(Contacts);
    } else {
      res.status(404).json({ message: "Inbound Lead Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const UpdatedConatct = async (req, res) => {
  try {
    const UpdateContact = await contactformService.updateContact(
      req.params.id,
      req.body
    );
    if (UpdateContact) {
      res.status(200).json(UpdateContact);
    } else {
      res.status(404).json({ message: "Contact Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const DeleteContact = async (req, res) => {
  try {
     await contactformService.deleteContact(req?.params?.id);
      res.status(200).json({ message: "Contact Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  CreateContact,
  getAllConatcts,
  getConatctById,
  UpdatedConatct,
  DeleteContact,
};
