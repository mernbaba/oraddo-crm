const faqService = require('../services/faqService');

const createFaq = async (req, res) => {
  try {
    const faqData = req.body;
    const newFaq = await faqService.createFaq(faqData);
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFaqs = async (req, res) => {
  try {
    const {page= 0, pageSize = 10} = req.query;
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);

    const faqs = await faqService.getAllFaqs(pageInt, pageSizeInt);
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFaqById = async (req, res) => {
  try {
    const { id } = req.params;
    const {page= 0, pageSize = 10} = req.query;
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);

    const faq = await faqService.getFaqById(id, pageInt, pageSizeInt);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedFaq = await faqService.updateFaq(id, req.body);
    if (!updatedFaq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.status(200).json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await faqService.deleteFaq(id);
    if (!deleted) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createFaq,
    getAllFaqs,
    getFaqById,
    deleteFaq,
    updateFaq
}