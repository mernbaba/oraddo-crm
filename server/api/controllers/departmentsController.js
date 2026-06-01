const departmentService = require('../services/departmentsService');
const bcrypt = require("bcryptjs");

const createDepartment = async (req, res) => {
  
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const updateDepModule = async (req, res) =>{
//   console.log(req.body,'body');
  
//     try {
//       const data = req.body.departmentData;
//       console.log(data,'controller');
      
//         const updateDepModule = await departmentService.updateDepModule(data);
//         res.status(201).json(updateDepModule);
//     } catch (error) {
//         res.status(500).json({ error: error.message});
//     }
// }

const updateDepModule = async (req, res) => {
  console.log(req.body, 'Entire request body');
  
  try {
    const data = req.body.departmentData;
    console.log(data, 'Data in controller');
    
    const updateDepModule = await departmentService.updateDepModule(data);
    res.status(201).json(updateDepModule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getDepartments = async (req, res) => {
 

// Your bcrypt hash
// const hash = "$2a$10$3u9HTJpfn7whsGQxmQdR1.2hOu3kszoC074EbkF/HYD7FHipa/J1i";

// // Function to check if an input password matches the stored hash
// const verifyPassword = async (inputPassword) => {
//   const isMatch = await bcrypt.compare(inputPassword, hash);
//   return isMatch;
// };

// Example usage
// verifyPassword("your_original_password")
//   .then(isMatch => {
//     if (isMatch) {
//       console.log("Password is correct!");
//     } else {
//       console.log("Password is incorrect.");
//     }
//   })
//   .catch(err => console.error("Error verifying password:", err));

  try {
    const departments = await departmentService.getAllDepartments();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    if (department) {
      res.status(200).json(department);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    await departmentService.deleteDepartment(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepModule,
  updateDepartment,
  deleteDepartment,
};
