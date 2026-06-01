// const {uploadFile} = require('../../fileUpload/fileupload');
const Allowed_type = require('../../fileUpload/alowedtypes');
const uploadFile = require('../../fileUpload/fileupload');
const Job_Creation = require('../models/JobManagementCreation');


 const uploadFiles = async (files) => {
  const uploadPromises = files.map((file) => uploadFile(file, Allowed_type));
  try {
    const results = await Promise.all(uploadPromises);
    const uploadedData = {
      image_URL: results[0].success ? results[0].url : null,

      // other_documents : results[1].success ? results[1].url : null
    };
    return uploadedData;
  } catch (error) {
    console.log("errorrr", error);
    throw error;
  }
};


const createJob = async (data,files) => {
  console.log("enter into service page")
  try {
    if(files?.image_URL?.length > 0){
    const uploadData = await uploadFiles([
      files.image_URL[0],
      // files.other_documents[0]
    ]);
    console.log("jobbbbbbbbb",uploadData)
    data.image_URL = uploadData.image_URL;
  }
    const job = await Job_Creation.create(data);
    return job;
   
    // if(job && Object.keys(files).length > 0){
    //   console.log("mmm", files)
    // }

  } catch (error) {
    console.error('Error while creating job:', error.message);
    throw new Error('Error creating job. Please try again later.');
  }
};

const getJobs = async () => {
  try {
    const jobs = await Job_Creation.findAll();
    return jobs;
  } catch (error) {
    console.error('Error while fetching jobs:', error.message);
    throw new Error('Error fetching jobs. Please try again later.');
  }
};

const getJobsByOrganizationId=async(id)=>{
  try{
    const jobs=await Job_Creation.findAll({where:{organizationID:id}});
    return jobs;
  }catch(error){
    console.error('Error while fetching jobs:', error.message);
    throw new Error('Error fetching jobs. Please try again later.');
  }
}

const getJobById = async (id) => {
  try {
    const job = await Job_Creation.findByPk(id);
    if (!job) {
      throw new Error('Job not found');
    }
    return job;
  } catch (error) {
    console.error(`Error while fetching job with ID ${id}:`, error.message);
    throw new Error(`Error fetching job with ID ${id}. Please try again later.`);
  }
};

const updateJob = async (id, data,files) => {
  console.log(data,"data.....")
  try {
    // if (files?.image_URL?.length > 0 && files?.image_URL) {
    //   const UploadData = await uploadFiles([files.image_URL[0]]);
    //   console.log(UploadData, "jhdbhmn");
    //   data.image_URL = UploadData.image_URL;
    // }
    const job = await Job_Creation.update(data, {
      where: { id: id },
      returning:true
    });
    if (job[0] === 0) { // If no rows were updated
      throw new Error('Job not found or no changes made');
    }
    return job;
  } catch (error) {
    console.log(error,"jhbjbn");
    
    console.error(`Error while updating job with ID ${id}:`, error.message);
    throw new Error(`Error updating job with ID ${id}. Please try again later.`);
  } 
};

const deleteJob = async (id) => {
  try {
    const rowsDeleted = await Job_Creation.destroy({
      where: { id: id }
    });
    if (rowsDeleted === 0) {
      throw new Error('Job not found');
    }
  } catch (error) {
    console.error(`Error while deleting job with ID ${id}:`, error.message);
    throw new Error(`Error deleting job with ID ${id}. Please try again later.`);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobsByOrganizationId,
  getJobById,
  updateJob,
  deleteJob
};

