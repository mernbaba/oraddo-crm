const ContactDetails = require("../models/contactform");

const CreateConData = async (data) => {
  try {
    const Data = await ContactDetails.create(data);
    return Data;
  } catch (err) {
    throw err;
  }
};

const getAllContacts = async () => {
    try {
      const Conatcts = await ContactDetails.findAll();
      return Conatcts;
    } catch (error) {
      throw new Error("Error Getting Contacts");
    }
  };
  const updateContact = async (id, ContactData) => {
    
    try {
      const updated = await ContactDetails.update(ContactData, { where: { id } });
      if (updated) {
        const updatedContact = await ContactDetails.findByPk(id);
        return updatedContact;
      }
      throw new Error('Contact not found');
    } catch (error) {
      throw new Error('Error updating Contact');
    }
  };

  const getContatById = async (id) => {
    try {
      const Contact = await ContactDetails.findByPk(id);
      return Contact;
    } catch (err) {
      console.log(err, "hvghjg");
  
      throw new Error("Error Getting Contact");
    }
  };

  const deleteContact = async (id) => {
    try {
      const deleted = ContactDetails.destroy({
        where: { id:id },
      });
     return deleted
    } catch (err) {
      throw new Error("Error facing Client Deletion");
    }
  };

module.exports = {
  CreateConData,
  getAllContacts,
  getContatById,
  deleteContact,
  updateContact
};
