const nodemailer = require("nodemailer");
const contactformService = require("../services/contactformService");
const AdminSettings = require("../models/AdminSettings");

const CreateContact = async (req, res) => {
  try {
    const ContactData = req.body;
    const data = await contactformService.CreateConData(ContactData);
    res.status(201).json(data);
  } catch (err) {
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
      res.status(404).json({ message: "Contact Not found" });
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
      // Send email reply when admin provides a response
      if (req.body.adminResponse && UpdateContact.Email) {
        try {
          const [settings] = await AdminSettings.findOrCreate({
            where: { id: 1 },
            defaults: { id: 1 },
          });
          if (settings.smtpHost && settings.smtpUser && settings.smtpPassword) {
            const transporter = nodemailer.createTransport({
              host: settings.smtpHost,
              port: parseInt(settings.smtpPort) || 587,
              secure: false,
              auth: {
                user: settings.smtpUser,
                pass: settings.smtpPassword,
              },
            });
            await transporter.sendMail({
              from: `"${settings.siteName || "Support"}" <${settings.smtpUser}>`,
              to: UpdateContact.Email,
              subject: `Re: Your query — ${UpdateContact.CompanyName || "Support Request"}`,
              text: req.body.adminResponse,
              html: `<p>${req.body.adminResponse.replace(/\n/g, "<br>")}</p>`,
            });
          }
        } catch (emailErr) {
          console.error("Email send failed:", emailErr.message);
          // Don't fail the request if email fails
        }
      }
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
