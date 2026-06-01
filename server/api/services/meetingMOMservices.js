const meetingMom = require("../models/meetingMOM");

const meetingMomCreation = async (data) => {
  try {
    const meetingMomResponse = await meetingMom.create(data);
    return meetingMomResponse;
  } catch (error) {
    console.log(error);
  }
};

const getMeetingMomData = async () => {
  try {
    const meetingMomsData = await meetingMom.findAll();
    return meetingMomsData;
  } catch (error) {
    console.log(error);
  }
};

const meetingMomById = async (id)=>{
    try {
        const responseById = await meetingMom.findByPk(id)
        return responseById;
    } catch (error) {
        console.log(error);
    }
};

const updateMeetingMom = async(id,data)=>{
    try {
        const updateResponse = await meetingMom.update(data,{
            where:{id:id}
        });
        if (!updateResponse) {
            throw new Error("meeting mom not update");
        }
        const updatedData = await meetingMom.findByPk(id);
        return updatedData;
    } catch (error) {
        console.log(error)
    }
};

const deleteMeetingMom = async (id) =>{
    try {
        const deleteMeeting = await meetingMom.destroy({
            where:{id:id}
        });
        if (!deleteMeeting) {
            throw new Error("meeting is not destroy");   
        }
    } catch (error) {
        console.log(error);      
    }
}

module.exports = {
  meetingMomCreation,
  getMeetingMomData,
  meetingMomById,
  updateMeetingMom,
  deleteMeetingMom
};
