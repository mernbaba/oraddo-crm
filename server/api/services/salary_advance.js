// const { Op } = require("sequelize");
// const moment = require('moment');
// const Salary_advance = require("../models/salary_advance_loan");
// const Emp_onboarding = require("../models/Emp_onboarding");

// const createSalaryAdvance = async (data,res) => {
//   try {
//     const checkEmployee = await Emp_onboarding.findOne({where:{id:data.empOnboardingId}});
//     console.log("lloossss",checkEmployee.date_of_joining);

//     const joiningDate = moment(checkEmployee.date_of_joining);
//     console.log("Parsed Joining Date:", joiningDate.format());

//     const sixMonthsLater = joiningDate.clone().add(6, 'months');
//     console.log("Date Six Months Later:", sixMonthsLater.format());

//     const hasCompletedSixMonths = sixMonthsLater.isBefore(moment());
//     console.log("Has completed six months:", hasCompletedSixMonths);

//     if (!hasCompletedSixMonths) {
//       return res.status(400).json({
//         error: "Employee has not completed six months of employment."
//       })
//     }

//     // const hasCompletedSixMonths = joiningDate.add(6, 'months').isBefore(moment());
//     if(hasCompletedSixMonths){
//       const recentLoan = await Salary_advance.findOne({
//         where:{
//           empOnboardingId: data.empOnboardingId,
//           createdAt:{
//             [Op.gte]: moment().subtract(3, 'months').toDate()
//           }
//         }
//       });
//       // if (recentLoan) {
//       //   return  new Error("Employee is not eligible for a new salary advance as they have an outstanding loan taken within the last three months.");
//       // }

//       if (recentLoan) {
//         return res.status(400).json({
//           error: "Employee is not eligible for a new salary advance as they have an outstanding loan taken within the last three months."
//         });
//       }
//       const salaryAdvance = await Salary_advance.create(data);
//       return salaryAdvance;
//     }

//   } catch (error) {
//     throw new Error(error.message || "Error creating salary advance.");
//   }
// };

// const getSalaryAdvances = async (page, limit) => {
//   try {
//     const offset = (page - 1) * limit
//     const salaryAdvances = await Salary_advance.findAll(
//       {
//         include:[
//           {
//             model:Emp_onboarding,
//             as:"salary_advance"
//           }
//         ]
//       }
//     )
//     return salaryAdvances;
//   } catch (error) {
//     throw error;
//   }
// };

// const getSalaryAdvanceById = async (id) => {
//   try {
//     const salaryAdvance = await Salary_advance.findByPk(id,{
//       include:[
//         {
//           model:Emp_onboarding,
//           as:"salary_advance"
//         }
//       ]
//     });
//     return salaryAdvance;
//   } catch (error) {
//     throw error;
//   }
// };

// const updateSalaryAdvance = async (id, data) => {
//   console.log(data,"from daaaaaaaaaaa")
//   try {
//     const salaryAdvance = await Salary_advance.update(data, {
//       where: { id: id },
//     });
//     console.log(salaryAdvance,"from salRYYYYYYYY")
//     return salaryAdvance;
//   } catch (error) {
//     throw error;
//   }
// };

// const deleteSalaryAdvance = async (id) => {
//   try {
//     await Salary_advance.destroy({
//       where: { id: id },
//     });
//   } catch (error) {
//     throw error;
//   }
// };

// module.exports = {
//   createSalaryAdvance,
//   getSalaryAdvances,
//   getSalaryAdvanceById,
//   updateSalaryAdvance,
//   deleteSalaryAdvance,
// };



const Emp_onboarding = require("../models/Emp_onboarding");
const Salary_advance = require("../models/salary_advance_loan");

const createSalaryAdvance = async (data) => {
  try {
    const salaryAdvance = await Salary_advance.create(data);
    return salaryAdvance;
  } catch (error) {
    throw error;
  }
};

const getSalaryAdvances = async (page, limit) => {
  try {
    const offset = (page - 1) * limit
    const salaryAdvances = await Salary_advance.findAll(
      {
        include: [
          {
            model: Emp_onboarding,
            as: "salary_advance"
          }
        ]
      }
    )
    return salaryAdvances;
  } catch (error) {
    throw error;
  }
};

const getSalaryAdvancesByOrganizationId = async (id, page, pageSize) => {
  try {
    const offset = page * pageSize;
    const salaryAdvances = await Salary_advance.findAll(
      {
        where: { organizationId: id },
        limit: pageSize,
        offset: offset,
        // order: [["status", "DESC"]],
        include: [
          {
            model: Emp_onboarding,
            as: "salary_advance"
          }
        ]
      }
    )
    return salaryAdvances;
  } catch (error) {
    throw error;
  }
};

const getSalaryAdvanceById = async (id) => {
  try {
    const salaryAdvance = await Salary_advance.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
          as: "salary_advance"
        }
      ]
    });
    return salaryAdvance;
  } catch (error) {
    throw error;
  }
};

// const updateSalaryAdvance = async (id, data) => {
//   console.log(data, "from daaaaaaaaaaa")
//   try {
//     const salaryAdvance = await Salary_advance.update(data, {
//       where: { id: id },
//     });
//     console.log(salaryAdvance, "from salRYYYYYYYY")
//     return salaryAdvance;
//   } catch (error) {
//     throw error;
//   }
// };

const updateSalaryAdvance = async (id, data) => {
  console.log(data, "from daaaaaaaaaaa");
  try {
    const [affectedRows] = await Salary_advance.update(data, {
      where: { id: id },
    });
    console.log(affectedRows, "from salRYYYYYYYY");
    if (affectedRows === 0) {
      throw new Error("No salary advance found with this ID");
    }
    // Fetch the updated record after update
    const updatedSalaryAdvance = await Salary_advance.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
          as: "salary_advance",
        },
      ],
    });
    return updatedSalaryAdvance;
  } catch (error) {
    throw error;
  }
};

const deleteSalaryAdvance = async (id) => {
  try {
    await Salary_advance.destroy({
      where: { id: id },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createSalaryAdvance,
  getSalaryAdvances,
  getSalaryAdvanceById,
  updateSalaryAdvance,
  deleteSalaryAdvance,
  getSalaryAdvancesByOrganizationId
};
