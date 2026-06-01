const servicesMeetimgMom = require("../services/meetingMOMservices");

const creationMeetingMom = async(req,res)=>{
    const data = req.body;
    try {
        const creationResponse = await servicesMeetimgMom.meetingMomCreation(data);
        res.status(201).json(creationResponse);
    } catch (error) {
        console.log(error);  
    }
};

const getAllMeetingMomData = async(req,res)=>{
    try {
        const allResponseData = await servicesMeetimgMom.getMeetingMomData();
        res.status(200).json(allResponseData);
    } catch (error) {
        console.log(error);
    }
};

const getByIdMeetingMom = async(req,res)=>{
    const ID = req.params;
    try {
        const responseById = servicesMeetimgMom.meetingMomById(ID);
        res.status(200).json(responseById);
    } catch (error) {
        console.log(error);
    }
};

const meetingMomUpdate = async(req,res)=>{
    const id = req.params;
    const data = req.body;
    try {
        const updateResponse = await servicesMeetimgMom.updateMeetingMom(id,data);
        res.status(200).json(updateResponse);
    } catch (error) {
        console.log(error);
    }
};

const deleteMeetingMom = async(req,res)=>{
    const id = req.params;
    try {
        const responseDelete = await servicesMeetimgMom.deleteMeetingMom(id);
        res.status(204).json(responseDelete);
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    creationMeetingMom,
    getAllMeetingMomData,
    getByIdMeetingMom,
    meetingMomUpdate,
    deleteMeetingMom
}