const MarketingEventsMeetingsCalender = require("../models/marketingEventsMeetings");

const createCalenderMeetings = async (data) => {
  try {
    const createResponse = await MarketingEventsMeetingsCalender.create(data);
    return createResponse;
  } catch (error) {
    console.log(error);
  }
};

const getMarketingMeetings = async () => {
  try {
    const getResponse = await MarketingEventsMeetingsCalender.findAll();
    return getResponse;
  } catch (error) {
    console.log(error);
  }
};

const getMarketingMeetingsbyorganisationid = async (id) => {
  console.log(id, "fromgetMarketingData");
  try {
    const getByResponse = await MarketingEventsMeetingsCalender.findAll({
      where: { organizationID: id },
    });
    return getByResponse;
    console.log(getByResponse, "getByResponsessssssss");
  } catch (error) {
    console.log(error, "Error Getting marketing meetings");
  }
};

const getByIdMarketingMeetings = async (id) => {
  console.log(id, "id server");
  try {
    const getByResponse = await MarketingEventsMeetingsCalender.findByPk(id);
    return getByResponse;
  } catch (error) {
    console.log(error);
  }
};

// const getByIdMarketingMeetings = async (id) => {
//     console.log(id, 'id server'); // Should log the actual ID value now
//     try {
//         const getByResponse = await MarketingEventsMeetingsCalender.findByPk(id); // Find by primary key
//         return getByResponse;
//     } catch (error) {
//         console.log(error);
//         throw error; // Rethrow the error to let the caller handle it
//     }
// };

const updateMarketingMeetings = async (id, data) => {
  console.log(id, "iddddddd");
  console.log(data, "datatatat");

  try {
    const getUpdate = await MarketingEventsMeetingsCalender.update(data, {
      where: { id: id },
    });
    return getUpdate;
  } catch (error) {
    console.log(error);
  }
};

const deleteMarketingMeeting = async (id) => {
  try {
    const deleteResponse = await MarketingEventsMeetingsCalender.destroy({
      where: { id: id },
    });
    return deleteResponse;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createCalenderMeetings,
  getMarketingMeetings,
  getByIdMarketingMeetings,
  updateMarketingMeetings,
  deleteMarketingMeeting,
  getMarketingMeetingsbyorganisationid
};
