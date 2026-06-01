const LeavesCreation = require("../models/leavesCreation");
const Emp_Details = require("../models/Emp_onboarding");
const Emp_onboarding = require("../models/Emp_onboarding");
const { Op, Sequelize } = require("sequelize");
const HrPanel = require("../models/HrPanel");

const createLeave = async (data) => {
  try {
    console.log("llllllllll", data);
    const leave = await LeavesCreation.create(data);
    return leave;
  } catch (error) {
    throw error;
  }
};

const getLeaves = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const leaves = await LeavesCreation.findAll({
      // limit, offset,
      include: [
        {
          model: Emp_Details,
          as: "LeaveCreation",
        },
      ],
    });
    return leaves;
  } catch (error) {
    throw error;
  }
};

const getMonthNumber = (monthName) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.indexOf(monthName) + 1; // Months are 1-based in SQL
};

// const getLeavesforLeaveManagement = async (id, page, pageSize) => {
//   try {
//     const offset = page * pageSize;
//     const leaves = await LeavesCreation.findAll({
//       where: { organizationId: id },
//       limit: pageSize,
//       offset: offset,
//       order: [["updatedAt", "Desc"]],
//       include: [
//         {
//           model: Emp_Details,
//           as: "LeaveCreation",
//         },
//       ],
//     });
//     return leaves;
//   } catch (error) {
//     throw error;
//   }
// };

const getLeavesforLeaveManagement = async (id, page, pageSize, emp_id) => {
  try {
    const offset = page * pageSize;

    const leaves = await LeavesCreation.findAll({
      where: {
        organizationId: id,
        empOnboardingId: {
          [Op.ne]: emp_id,
        },
      },

      limit: pageSize,
      offset: offset,
      order: [
        [
          Sequelize.literal(`CASE WHEN status = 'Pending' THEN 1 ELSE 2 END`),
          "ASC",
        ], // Prioritize 'Pending' status first
        ["updatedAt", "DESC"], // Then sort by updatedAt
      ],
      include: [
        {
          model: Emp_Details,
          as: "LeaveCreation",
        },
      ],
    });

    return leaves;
  } catch (error) {
    console.error("Error fetching leave data:", error);
    throw error;
  }
};

const getLeavesByOrganizationId = async (
  id,
  page,
  pageSize,
  year,
  monthName,
  search = ""
) => {
  console.log("Fetching leaves for:", {
    id,
    page,
    pageSize,
    year,
    monthName,
    search,
  });

  try {
    const offset = page * pageSize;
    const month = parseInt(getMonthNumber(monthName), 10);

    let whereCondition = {
      organizationId: id,
      status: "Approved", // Only approved leaves
      leave_type: { [Op.ne]: "Work From Home" }, 
    };

    // Add filtering for year and month
    if (year && month !== undefined) {
      whereCondition[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("from_date")),
          year
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("from_date")),
          month
        ),
      ];
    } else if (year) {
      whereCondition.salary_date = Sequelize.where(
        Sequelize.fn("DATE_PART", "year", Sequelize.col("from_date")),
        year
      );
    } else if (month !== undefined) {
      whereCondition.salary_date = Sequelize.where(
        Sequelize.fn("DATE_PART", "month", Sequelize.col("from_date")),
        month
      );
    }

    // Define whereClause for employee search
    let whereClause = {};
    if (search) {
      whereClause.emp_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    // Get total count with filters
    const totalLeaves = await LeavesCreation.count({
      where: whereCondition,
      include: [
        {
          model: Emp_Details,
          as: "LeaveCreation",
          where: whereClause, // Apply employee name search
        },
      ],
    });

    // Fetch leaves with employee details
    const leaves = await LeavesCreation.findAll({
      where: whereCondition,
      limit: pageSize,
      offset: offset,
      order: [["from_date", "DESC"]],
      include: [
        {
          model: Emp_Details,
          as: "LeaveCreation",
          where: whereClause, // Apply employee name search
        },
      ],
    });

    console.log({ leaves, totalLeaves }, "from leaves");
    return { leaves, totalLeaves };
  } catch (error) {
    console.error("Error fetching leaves:", error);
    throw error;
  }
};

const getLeavesbyId = async (id) => {
  try {
    const leaves = await LeavesCreation.findByPk(id, {
      include: [
        {
          model: Emp_Details,
          as: "LeaveCreation",
        },
      ],
    });
    return leaves;
  } catch (error) {
    throw error;
  }
};

const getLeaveById = async (id) => {
  try {
    const leave = await Emp_Details.findByPk(id, {
      include: [
        {
          model: LeavesCreation,
          as: "teamMembersLeaves",
          include: [
            {
              model: Emp_Details,
              as: "LeaveCreation",
            },
          ],
        },
      ],
    });
    console.log("leavvvv", leave.empOnboardingId);

    return leave;
  } catch (error) {
    throw error;
  }
};

// const updateLeave = async (id, data) => {
//   try {
//     console.log("Updating Leave Request:", { id, data });

//     const employeeID = data.empOnboardingId;
//     const requestedLeaves = parseInt(data.number_of_days);
//     const Status = data.status;

//     console.log("Leave Status:", Status);

//     const updateLeave = await LeavesCreation.findOne({
//       where: { id: id },
//       include: [{ model: Emp_Details, as: "LeaveCreation" }],
//     });

//     const hrMonthlyLeaves = await HrPanel.findOne({
//       where:{
//         organizationID: updateLeave.organizationId,

//       }
//     })
//     console.log("hrMonthlyLeavessss", hrMonthlyLeaves);

//     if (!updateLeave) {
//       throw new Error(`Leave with ID ${id} not found.`);
//     }

//     if (Status === "Declined") {
//       await LeavesCreation.update({ status: Status }, { where: { id: id } });
//       return updateLeave;
//     }

//     const employeeLeave = await Emp_Details.findByPk(employeeID);
//     if (!employeeLeave) {
//       throw new Error(`Employee with ID ${employeeID} not found.`);
//     }

//     let lop = 0;
//     let lopDaysArray = [];

//     if (!updateLeave.from_date) {
//       throw new Error("Missing from_date in request data.");
//     }

//     let startDate = new Date(updateLeave.from_date);
//     if (isNaN(startDate.getTime())) {
//       throw new Error(`Invalid from_date format: ${updateLeave.from_date}`);
//     }

//     if (Status === "Approved") {
//       let leaveBalance = parseInt(employeeLeave.leave_balance);
//       const empidd = employeeLeave.id;
//       const leavesForMonth = parseInt(hrMonthlyLeaves.leaves_for_month) || 0;

//       // Generate all leave days excluding Sundays
//       let leaveDaysArray = [];
//       let tempDate = new Date(startDate);
//       let daysCount = 0;

//       while (daysCount < requestedLeaves) {
//         if (tempDate.getDay() !== 0) {
//           // Exclude Sundays
//           leaveDaysArray.push(tempDate.toISOString().split("T")[0]);
//           daysCount++;
//         }
//         tempDate.setDate(tempDate.getDate() + 1);
//       }
//       console.log("Leave Days Array:", leaveDaysArray);

//       if (leaveBalance === 0) {
//         lop = requestedLeaves;
//         lopDaysArray = leaveDaysArray.slice(-lop); // Last 'lop' days
//       } else if (leaveBalance > 0) {
//         if (requestedLeaves <= leaveBalance) {
//           leaveBalance -= requestedLeaves;
//         } else {
//           let remainingLeaves = requestedLeaves - leaveBalance;
//           lop = remainingLeaves;
//           leaveBalance = 0;
//           lopDaysArray = leaveDaysArray.slice(-lop); // Assign LOP to last 'lop' days
//         }
//       }

//       console.log("Updated Leave Balance:", leaveBalance);
//       console.log("LOP Days Array:", lopDaysArray);

//       if(leavesForMonth < requestedLeaves){
//         const excessLeaves = requestedLeaves - leavesForMonth;
//         console.log("excessLeaves", excessLeaves);
//         lop+= excessLeaves;
//         const additionalLopDays = leaveDaysArray.slice(-excessLeaves); // Assign additional LOP to last 'excessLeaves' days
//         lopDaysArray.push(...additionalLopDays); // Append to existing LOP days
//       }

//       console.log("Updated Leave Balance:", leaveBalance);
//       console.log("Total LOP:", lop);
//       console.log("LOP Days Array:", lopDaysArray);

//       await LeavesCreation.update(
//         {
//           status: data.status,
//           monthly_leave_balance: leaveBalance,
//           LOP: lop,
//           lop_days: lopDaysArray,
//         },
//         { where: { id: id } }
//       );

//       await Emp_Details.update(
//         { leave_balance: leaveBalance },
//         { where: { id: empidd } }
//       );

//       // if (lop > 0) {
//       //   await LeavesCreation.update(
//       //     { LOP: lop, lop_days: lopDaysArray },
//       //     { where: { id: id } }
//       //   );
//       // }

//       if(lop >= requestedLeaves){
//         await LeavesCreation.update(
//           {leave_type: "LOP"},
//           {where:{id:id}}
//         )
//       }

//       return await LeavesCreation.findOne({ where: { id: id } });
//     }

//     if (Status === "Pending") {
//       return await LeavesCreation.update(data, {
//         where: { id: id },
//         returning: true,
//       });
//     }
//   } catch (error) {
//     console.error("Error in updateLeave:", error.message);
//     throw error;
//   }
// };

const updateLeave = async (id, data) => {
  try {
    console.log("Updating Leave Request:", { id, data });

    const employeeID = data.empOnboardingId;
    const requestedLeaves = parseInt(data.number_of_days);
    const Status = data.status;

    console.log("Leave Status:", Status);

    const updateLeave = await LeavesCreation.findOne({
      where: { id: id },
      include: [{ model: Emp_Details, as: "LeaveCreation" }],
    });

    const hrMonthlyLeaves = await HrPanel.findOne({
      where: {
        organizationID: updateLeave.organizationId,
      },
    });
    console.log("hrMonthlyLeavessss", hrMonthlyLeaves);

    if (!updateLeave) {
      throw new Error(`Leave with ID ${id} not found.`);
    }

    if (Status === "Declined") {
      await LeavesCreation.update({ status: Status }, { where: { id: id } });
      return updateLeave;
    }

    const employeeLeave = await Emp_Details.findByPk(employeeID);
    if (!employeeLeave) {
      throw new Error(`Employee with ID ${employeeID} not found.`);
    }

    let lop = 0;
    let lopDaysArray = [];

    if (!updateLeave.from_date) {
      throw new Error("Missing from_date in request data.");
    }

    let startDate = new Date(updateLeave.from_date);
    let endDate = new Date(updateLeave.to_date);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error(
        `Invalid date format: from_date=${updateLeave.from_date}, to_date=${updateLeave.to_date}`
      );
    }

    if (Status === "Approved" && data.leave_type !== "Work From Home") {
      let leaveBalance = parseInt(employeeLeave.leave_balance);
      const empidd = employeeLeave.id;
      const leavesForMonth = parseInt(hrMonthlyLeaves.leaves_for_month) || 0;

      // Generate all leave days excluding Sundays
      let leaveDaysArray = [];
      let tempDate = new Date(startDate);
      let daysCount = 0;

      while (daysCount < requestedLeaves && tempDate <= endDate) {
        if (tempDate.getDay() !== 0) {
          // Exclude Sundays
          leaveDaysArray.push(tempDate.toISOString().split("T")[0]);
          daysCount++;
        }
        tempDate.setDate(tempDate.getDate() + 1);
      }
      console.log("Leave Days Array:", leaveDaysArray);

      // Verify requestedLeaves matches leaveDaysArray length
      if (leaveDaysArray.length !== requestedLeaves) {
        console.warn(
          `Mismatch: requestedLeaves=${requestedLeaves}, calculatedDays=${leaveDaysArray.length}`
        );
        // Adjust requestedLeaves to match actual days (in case of Sundays)
        // requestedLeaves = leaveDaysArray.length;
      }

      // Group leave days by month
      const leaveDaysByMonth = {};
      leaveDaysArray.forEach((date) => {
        const [year, month] = date.split("-").map(Number);
        const monthKey = `${year}-${month}`;
        if (!leaveDaysByMonth[monthKey]) {
          leaveDaysByMonth[monthKey] = [];
        }
        leaveDaysByMonth[monthKey].push(date);
      });
      console.log("Leave Days By Month:", leaveDaysByMonth);

      // Fetch prior approved leaves for the employee in relevant months
      const priorLeaves = await LeavesCreation.findAll({
        where: {
          empOnboardingId: employeeID,
          status: "Approved",
          id: { [Op.ne]: id }, // Exclude the current leave
          [Op.or]: Object.keys(leaveDaysByMonth).map((monthKey) => {
            const [year, month] = monthKey.split("-").map(Number);
            return {
              [Op.or]: [
                {
                  from_date: {
                    [Op.between]: [
                      new Date(year, month - 1, 1),
                      new Date(year, month, 0),
                    ],
                  },
                },
                {
                  to_date: {
                    [Op.between]: [
                      new Date(year, month - 1, 1),
                      new Date(year, month, 0),
                    ],
                  },
                },
              ],
            };
          }),
        },
      });

      // Calculate prior leaves per month (excluding Sundays)
      const priorLeavesByMonth = {};
      for (const leave of priorLeaves) {
        const leaveStart = new Date(leave.from_date);
        const leaveEnd = new Date(leave.to_date);
        let currentDate = new Date(leaveStart);
        while (currentDate <= leaveEnd) {
          if (currentDate.getDay() !== 0) {
            const monthKey = `${currentDate.getFullYear()}-${
              currentDate.getMonth() + 1
            }`;
            if (!priorLeavesByMonth[monthKey]) {
              priorLeavesByMonth[monthKey] = 0;
            }
            priorLeavesByMonth[monthKey]++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      console.log("Prior Leaves By Month:", priorLeavesByMonth);

      // Process each month
      for (const monthKey of Object.keys(leaveDaysByMonth)) {
        const daysInMonth = leaveDaysByMonth[monthKey].length;
        const priorDays = priorLeavesByMonth[monthKey] || 0;
        const remainingAllowedDays = Math.max(0, leavesForMonth - priorDays);
        let leavesToDeduct = Math.min(daysInMonth, remainingAllowedDays);
        const excessDays = daysInMonth - leavesToDeduct;

        // Handle LOP for excess days
        if (excessDays > 0) {
          lop += excessDays;
          lopDaysArray.push(...leaveDaysByMonth[monthKey].slice(-excessDays));
        }

        if (leavesToDeduct > 0) {
          if (leaveBalance === 0) {
            lop += leavesToDeduct;
            lopDaysArray.push(
              ...leaveDaysByMonth[monthKey].slice(0, leavesToDeduct)
            );
          } else if (leaveBalance > 0) {
            if (leavesToDeduct <= leaveBalance) {
              leaveBalance -= leavesToDeduct;
            } else {
              const remainingLeaves = leavesToDeduct - leaveBalance;
              lop += remainingLeaves;
              leaveBalance = 0;
              lopDaysArray.push(
                ...leaveDaysByMonth[monthKey].slice(
                  leavesToDeduct - remainingLeaves,
                  leavesToDeduct
                )
              );
            }
          }
        }

      }

      console.log("Updated Leave Balance:", leaveBalance);
      console.log("Total LOP:", lop);
      console.log("LOP Days Array:", lopDaysArray);

      await LeavesCreation.update(
        {
          status: data.status,
          monthly_leave_balance: leaveBalance,
          LOP: lop,
          lop_days: lopDaysArray,
        },
        { where: { id: id } }
      );

      await Emp_Details.update(
        { leave_balance: leaveBalance },
        { where: { id: empidd } }
      );

      if (lop >= requestedLeaves) {
        await LeavesCreation.update(
          { leave_type: data.leave_type },
          { where: { id: id } }
        );
      }

      return await LeavesCreation.findOne({ where: { id: id } });
    }

    // if(
    //   Status === "Approved" && data.leave_type === "Work From Home"
    // ){   
    // }
    
    if (Status === "Approved" && data.leave_type === "Work From Home") {
      // Calculate valid WFH days excluding Sundays
      let wfhDaysCount = 0;
      let tempDate = new Date(startDate);
      while (tempDate <= endDate && wfhDaysCount < requestedLeaves) {
        if (tempDate.getDay() !== 0) {
          wfhDaysCount++;
        }
        tempDate.setDate(tempDate.getDate() + 1);
      }
    
      // Get employee's WFH balance (default to 0 if missing)
      const currentEmployeeWfh = parseInt(employeeLeave.wfh_no_ofdays || 0);
      const updatedEmployeeWfh = currentEmployeeWfh - wfhDaysCount;
      const finalEmployeeWfh = updatedEmployeeWfh < 0 ? 0 : updatedEmployeeWfh;
    
      console.log("Employee current WFH:", currentEmployeeWfh);

      console.log("WFH Days requested:", wfhDaysCount);

      console.log("Final Employee WFH Balance:", finalEmployeeWfh);
    
      // Update Leave record status and WFH status
      await LeavesCreation.update(
        {
          status: data.status,
          LOP: 0,
          lop_days: [],
        },
        { where: { id: id } }
      );
    
      // Update employee's WFH days balance
      await Emp_Details.update(
        { wfh_no_ofdays: finalEmployeeWfh },
        { where: { id: employeeID } }
      );
    
      return await LeavesCreation.findOne({ where: { id: id } });
    }
    
    if (wfhDaysCount > currentEmployeeWfh) {
  throw new Error(`Insufficient WFH balance. Available: ${currentEmployeeWfh}, Requested: ${wfhDaysCount}`);
}

    
    
    if (Status === "Pending") {
      return await LeavesCreation.update(data, {
        where: { id: id },
        returning: true,
      });
    }
  } catch (error) {
    console.error("Error in updateLeave:", error.message);
    throw error;
  }
};

const deleteLeave = async (id) => {
  try {
    await LeavesCreation.destroy({
      where: { id: id },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createLeave,
  getLeavesbyId,
  getLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
  getLeavesByOrganizationId,
  getLeavesforLeaveManagement,
};

// const updateLeave = async (id, data) => {
//   try {
//     console.log("Updating Leave Request:", { id, data });

//     const employeeID = data.empOnboardingId;
//     const requestedLeaves = parseInt(data.number_of_days);
//     const Status = data.status;

//     console.log("Leave Status:", Status);

//     const updateLeave = await LeavesCreation.findOne({
//       where: { id: id },
//       include: [{ model: Emp_Details, as: "LeaveCreation" }],
//     });

//     const hrMonthlyLeaves = await HrPanel.findOne({
//       where: {
//         organizationID: updateLeave.organizationId,
//       },
//     });
//     console.log("hrMonthlyLeavessss", hrMonthlyLeaves);

//     if (!updateLeave) {
//       throw new Error(`Leave with ID ${id} not found.`);
//     }

//     if (Status === "Declined") {
//       await LeavesCreation.update({ status: Status }, { where: { id: id } });
//       return updateLeave;
//     }

//     const employeeLeave = await Emp_Details.findByPk(employeeID);
//     if (!employeeLeave) {
//       throw new Error(`Employee with ID ${employeeID} not found.`);
//     }

//     let lop = 0;
//     let lopDaysArray = [];

//     if (!updateLeave.from_date) {
//       throw new Error("Missing from_date in request data.");
//     }

//     let startDate = new Date(updateLeave.from_date);
//     let endDate = new Date(updateLeave.to_date);
//     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//       throw new Error(
//         `Invalid date format: from_date=${updateLeave.from_date}, to_date=${updateLeave.to_date}`
//       );
//     }

//     if (Status === "Approved") {
//       let leaveBalance = parseInt(employeeLeave.leave_balance);
//       const empidd = employeeLeave.id;
//       const leavesForMonth = parseInt(hrMonthlyLeaves.leaves_for_month) || 0;

//       // Generate all leave days excluding Sundays
//       let leaveDaysArray = [];
//       let tempDate = new Date(startDate);
//       let daysCount = 0;

//       while (daysCount < requestedLeaves && tempDate <= endDate) {
//         if (tempDate.getDay() !== 0) {
//           // Exclude Sundays
//           leaveDaysArray.push(tempDate.toISOString().split("T")[0]);
//           daysCount++;
//         }
//         tempDate.setDate(tempDate.getDate() + 1);
//       }
//       console.log("Leave Days Array:", leaveDaysArray);

//       // Group leave days by month
//       const leaveDaysByMonth = {};
//       leaveDaysArray.forEach((date) => {
//         const [year, month] = date.split("-").map(Number);
//         const monthKey = `${year}-${month}`;
//         if (!leaveDaysByMonth[monthKey]) {
//           leaveDaysByMonth[monthKey] = [];
//         }
//         leaveDaysByMonth[monthKey].push(date);
//       });
//       console.log("Leave Days By Month:", leaveDaysByMonth);
//       // Process each month
//       for (const monthKey of Object.keys(leaveDaysByMonth)) {
//         const daysInMonth = leaveDaysByMonth[monthKey].length;
//         let leavesToDeduct = Math.min(daysInMonth, leavesForMonth);
//         if (leavesToDeduct > 0) {
//           if (leaveBalance === 0) {
//             lop += leavesToDeduct;
//             lopDaysArray.push(
//               ...leaveDaysByMonth[monthKey].slice(0, leavesToDeduct)
//             );
//           } else if (leaveBalance > 0) {
//             if (leavesToDeduct <= leaveBalance) {
//               leaveBalance -= leavesToDeduct;
//             } else {
//               const remainingLeaves = leavesToDeduct - leaveBalance;
//               lop += remainingLeaves;
//               leaveBalance = 0;
//               lopDaysArray.push(
//                 ...leaveDaysByMonth[monthKey].slice(
//                   leavesToDeduct - remainingLeaves,
//                   leavesToDeduct
//                 )
//               );
//             }
//           }
//         }
//         // Handle excess leaves in the month
//         if (daysInMonth > leavesForMonth) {
//           const excessLeaves = daysInMonth - leavesForMonth;
//           lop += excessLeaves;
//           const additionalLopDays = leaveDaysByMonth[monthKey].slice(
//             -excessLeaves
//           );
//           lopDaysArray.push(...additionalLopDays);
//         }
//       }

//       console.log("Updated Leave Balance:", leaveBalance);
//       console.log("Total LOP:", lop);
//       console.log("LOP Days Array:", lopDaysArray);

//       await LeavesCreation.update(
//         {
//           status: data.status,
//           monthly_leave_balance: leaveBalance,
//           LOP: lop,
//           lop_days: lopDaysArray,
//         },
//         { where: { id: id } }
//       );

//       await Emp_Details.update(
//         { leave_balance: leaveBalance },
//         { where: { id: empidd } }
//       );

//       if (lop >= requestedLeaves) {
//         await LeavesCreation.update(
//           { leave_type: "LOP" },
//           { where: { id: id } }
//         );
//       }

//       return await LeavesCreation.findOne({ where: { id: id } });
//     }

//     if (Status === "Pending") {
//       return await LeavesCreation.update(data, {
//         where: { id: id },
//         returning: true,
//       });
//     }
//   } catch (error) {
//     console.error("Error in updateLeave:", error.message);
//     throw error;
//   }
// };
