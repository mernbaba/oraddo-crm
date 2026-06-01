const express = require('express')
const contactFormController = require('../controllers/contactFormController')

const router = express.Router()

router.post('/ContactForm',contactFormController.CreateContact)
router.get('/ContactForm',contactFormController.getAllConatcts)
router.get('/ContactForm/:id',contactFormController.getConatctById)
router.put('/ContactForm/:id',contactFormController.UpdatedConatct)
router.delete('/ContactForm/:id',contactFormController.DeleteContact)

module.exports = router;