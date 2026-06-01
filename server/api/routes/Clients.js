const express = require('express')
const ClientsController = require('../controllers/ClientController')

const router = express.Router()

router.post('/clients',ClientsController.CreateClient)
router.get('/clients',ClientsController.getClients)
router.get('/clientsbyorganization/:id', ClientsController.getAllClientsbyorganizationId)
router.get('/clients/:id',ClientsController.getClientsById)
router.put('/clients/:id',ClientsController.updateClient)
router.delete('/client/:id',ClientsController.deleteClient)

module.exports = router;