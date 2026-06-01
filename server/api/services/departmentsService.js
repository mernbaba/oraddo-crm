const dep_modules = require('../models/Modules');
const Department = require('../models/Department');
// const depModules = require('../models/depModules');

const createDepartment = async (data) => {
  try {
    const department = await Department.create(data);
    return department;
  } catch (error) {
    throw error;
  }
};

function getAllFuncs(toCheck) {
    const props = [];
    let obj = toCheck;
    try {
      do {
        props.push(...Object.getOwnPropertyNames(obj));
      } while ((obj = Object.getPrototypeOf(obj)));
      return props.sort().filter((e, i, arr) => {
        if (e != arr[i + 1] && typeof toCheck[e] == "function") return true;
      });
    } catch (error) {
      console.log("errorrrrr",error);
    }
    
  }


const updateDepModule = async (data) => {
    try {
      console.log('daaataaaa',data);
      let departments = data;
      for(const key in departments){
        const department = await Department.findByPk(key);
        if (!department) {
          console.log(`Department with id ${key} not found`);
          continue;
        }
        console.log("jsdidfjeif",department);
        
        const functions = getAllFuncs(department);
        console.log("All functions of department:", functions);
        console.log("depkeyyy",departments[key]);
        
        await department.setModules(departments[key]);
      } 
      return {success:true, departmentModules : departments};
    } catch (error) {
      throw error;
    }
  };

 
const getAllDepartments = async () => {
  try {
    const departments = await Department.findAll({
      include:[{
        model: dep_modules,
        attributes:["id","name"]
    }
    ]
    });
    return departments;
  } catch (error) {
    throw error;
  }
};

const getDepartmentById = async (id) => {
  try {
    const department = await Department.findByPk(id);
    return department;
  } catch (error) {
    throw error;
  }
};

const updateDepartment = async (id, data) => {
  try {
    const department = await Department.update(data, {
      where: { id: id },
    });
    return department;
  } catch (error) {
    throw error;
  }
};

const deleteDepartment = async (id) => {
  try {
    await Department.destroy({
      where: { id: id },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepModule,
  updateDepartment,
  deleteDepartment,
  getAllFuncs
};
