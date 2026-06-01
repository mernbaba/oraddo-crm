const express = require('express')
const router = express.Router()
const InboundLeadsController = require('../controllers/InboundLeadsController')

router.post('/InbounLeadCreation',InboundLeadsController.createInboundlead)
router.get('/InbounLeadCreation',InboundLeadsController.getAllInboundLeads)
router.get('/InboundLeadcreationbyorganization/:id',InboundLeadsController.getAllInboundLeadsbyOrganization )
router.get('/inboundLeadsFromOrganization/:id',InboundLeadsController.getAllInboundLeadsfromOrganization)
router.get('/InbounLeadCreation/:id',InboundLeadsController.getInboundLeadById)
router.put('/InbounLeadCreation/:id',InboundLeadsController.UpdatedInboundLead)
router.delete('/InbounLeadCreation/:id',InboundLeadsController.DeleteInbounLead)


module.exports = router;