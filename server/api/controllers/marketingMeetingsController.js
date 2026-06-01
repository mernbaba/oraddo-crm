const MarketingMeetingService = require("../services/marketingEventsMeetingsService");

const creationMeetingMark = async (req, res) => {
  const data = req.body;
  console.log(data, "controller");

  try {
    const creationResponse =
      await MarketingMeetingService.createCalenderMeetings(data);
    res.status(201).json(creationResponse);
  } catch (error) {
    console.log(error);
  }
};

const getAllMeetingMark = async (req, res) => {
  try {
    const allResponseData =
      await MarketingMeetingService.getMarketingMeetings();
    res.status(200).json(allResponseData);
  } catch (error) {
    console.log(error);
  }
};

const getAllMeetingMarkbyorganisation = async (req, res) => {
  const { id } = req.params;
  try {
    const responseById =
      await MarketingMeetingService.getMarketingMeetingsbyorganisationid(id);
    res.status(200).json(responseById);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

const getByIdMeetingMark = async (req, res) => {
  const { id } = req.params;
  try {
    const responseById = await MarketingMeetingService.getByIdMarketingMeetings(
      id
    );
    res.status(200).json(responseById);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const meetingMarkUpdate = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updateResponse =
      await MarketingMeetingService.updateMarketingMeetings(id, data);
    res.status(200).json(updateResponse);
  } catch (error) {
    console.log(error);
  }
};

const deleteMeetingMark = async (req, res) => {
  const { id } = req.params;
  try {
    const responseDelete = await MarketingMeetingService.deleteMarketingMeeting(
      id
    );
    res.status(204).json(responseDelete);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  creationMeetingMark,
  getAllMeetingMark,
  getByIdMeetingMark,
  meetingMarkUpdate,
  deleteMeetingMark,
  getAllMeetingMarkbyorganisation
};
