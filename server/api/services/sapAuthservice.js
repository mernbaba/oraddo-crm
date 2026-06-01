require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SapEmployee = require('../models/sapAuthModel');

const blacklist = new Set(); // Example of an in-memory blacklist


const SapsignUp = async (data) => {
    const { email_id, password } = data;
    console.log(email_id, "bvhmvb");
  
    try {
      const existingAdmin = await SapEmployee.findOne({ where: { email_id } });
      if (existingAdmin) {
        console.log(existingAdmin, "existingAdmin");
        throw new Error("User Already Exist");
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const adminData = {
          ...data,
          password: hashedPassword, // Replace plain password with hashed password
        };
  
        const admin = await SapEmployee.create(adminData);
  
        return admin;
      }
    } catch (error) {
      // Log the exact error
      console.error("Error:", error.message);
      
      // Re-throw the same error so the calling function gets the specific message
      throw new Error(error.message);
    }
  };
  

    const SapsignIn = async (email_id, password) => {
        try {
          // console.log('nameeeandpassword', emp_id,password);
          console.log(email_id, password, "from frntend")
      
        //   const SapEmployee = await SapEmployee.findOne({ where: { email_id: email_id } })
      
        //   if (!SapEmployee) {
        //     throw new Error('Invalid Organization ID');
        //   }
      
          console.log(SapEmployee, "orggggEmppp")
          const userdata = await SapEmployee.findOne({ where: { email_id: email_id } })
      
          if (!userdata) {
            throw new Error('Invalid UserID');
          }
      
          if (userdata) {
        
      
            // console.log('userrrr DDDDetailssss', userDetails.dataValues);
            let user = userdata;
            console.log("departmentssss", user);
      
            // user.empDepartment = userDepartment.departentsOfEmp.name
            // console.log("employeeedepartment", user.empDepartment, userDepartment.departentsOfEmp.name);
            console.log("passwordddd", user.password);
      
            const hashpass = await bcrypt.compare(password, user.password);
            console.log("hasssss", hashpass);
      
            if (user && hashpass) {
              console.log("servvvvvvvvv");
      
              try {
                const token = jwt.sign({ user }, "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9");
                console.log(token, "vhjjwgdasxziuadsc")
                return token;
              } catch (error) {
                console.log("jjjjj", error);
      
              }
              // { expiresIn: '1h' }
            } else {
              throw new Error('Invalid password');
            }
          }
         
      
        } catch (error) {
          console.log('errrrrr', error);
          throw error;
        }
      };

      const SapsignOut = (token) => {
        blacklist.add(token);
      };

      const SapisTokenBlacklisted = (token) => {
        return blacklist.has(token);
      };

      module.exports = {
        SapsignIn,
        SapsignOut,
        SapsignUp,
        SapisTokenBlacklisted
      }