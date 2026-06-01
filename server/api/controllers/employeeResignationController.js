const parseRequestFiles = require('../../fileUpload/requestedfile');
const employeeResignationService = require('../services/employeeResignationServices');

const createEmployeeResignation = async (req, res) => {
  console.log(req.body,'bodyhello');
  
  try {
    console.log("hsdhsdhsdg");
    
    const payload = await parseRequestFiles(req);
    console.log("jsbchbshcbsc",payload);
    console.log("paloadddfilessss", payload.files);
    
    
    if(payload.files && Object.keys(payload.files).length > 0){
      console.log("enterrrrrrrrr");
      
      req.body = {};
      for (const [key,value] of Object.entries(payload.fields)){
        req.body[key] = value[0];
      }
      console.log("kjksjdkjd");
      
      req.files = payload.files;
      const {body,files} = req;
      
      console.log("bodyyyyfilesssss", body, "fileess", files);
      const employeeResignation = await employeeResignationService.createEmployeeResignation(body,files);
      res.status(201).json(employeeResignation);
   
    }else {
      console.log("jdnjfdifdif");
      
      req.body = {};
      for (const [key, value] of Object.entries(payload.fields)){
        req.body[key] = value[0];;
      }
      const data = req.body
      console.log("dtaaaaaaaqa");
      const employeeResignation = await employeeResignationService.createEmployeeResignation(data);
      res.status(201).json(employeeResignation);
    }
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllEmployeeResignation = async (req, res) => {
  console.log(res,"responce!!!");
  
  try {
    const employeeResignation = await employeeResignationService.getAllEmployeeResignation();
    res.status(200).json(employeeResignation);
    console.log("data....");
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error,"errrr");
    
  }
};

const getAllEmployeeResignationbyOrganizationId = async (req, res) => {
  try {
    const employeeResignation = await employeeResignationService.getAllEmployeeResignationbyOrganizationId(req.params.id);
    if (employeeResignation) {
      res.status(200).json(employeeResignation);
    } else {
      res.status(404).json({ message: 'Employee Resignation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const getEmployeeResignationById = async (req, res) => {
  try {
    const employeeResignation = await employeeResignationService.getEmployeeResignationById(req.params.id);
    if (employeeResignation) {
      res.status(200).json(employeeResignation);
    } else {
      res.status(404).json({ message: 'Employee Resignation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployeeResignation = async (req, res) => {
  try {
    const updatedEmployeeResignation = await employeeResignationService.updateEmployeeResignation(req.params.id, req.body);
      res.status(200).json(updatedEmployeeResignation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployeeResignation = async (req, res) => {
  try {
    await employeeResignationService.deleteEmployeeResignation(req.params.id);
      res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmployeeResignation,
  getAllEmployeeResignation,
  getEmployeeResignationById,
  updateEmployeeResignation,
  deleteEmployeeResignation,
  getAllEmployeeResignationbyOrganizationId
};
