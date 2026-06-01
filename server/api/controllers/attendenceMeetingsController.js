const meetingService = require('../services/attendenceMeetingService');

const createMeeting = async (req, res) => {
  try {
    const meeting = await meetingService.createMeeting(req.body);
    
    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createMeetingsBulk = async (req, res) => {
  try {
    const meetings = await meetingService.createMeetingsBulk(req.body);
    res.status(201).json({ success: true, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMeetings = async (req, res) => {
  try {
    const meetings = await meetingService.getMeetings();
    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getMeetingsbyOrganizationId = async (req, res) => {

  try {
    const id=req.params.id
    const meetings = await meetingService.getMeetingsbyOrganizationId(id);
    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



const getMeetingById = async (req, res) => {
  try {
    const meeting = await meetingService.getMeetingById(req.params.id);
    if (meeting) {
      res.status(200).json({ success: true, data: meeting });
    } else {
      res.status(404).json({ success: false, message: 'Meeting not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const meeting = await meetingService.updateMeeting(req.params.id, req.body);
    if (meeting[0] === 1) { // Sequelize update returns an array with the number of affected rows
      res.status(200).json({ success: true, message: 'Meeting updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Meeting not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const result = await meetingService.deleteMeeting(req.params.id);
    if (result) {
      res.status(200).json({ success: true, message: 'Meeting deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Meeting not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createMeeting,
  createMeetingsBulk,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  getMeetingsbyOrganizationId
};
