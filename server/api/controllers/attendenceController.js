const Attendance = require("../models/attendence");
const moment = require("moment"); // For time formatting and duration calculations
// const moment = require('moment-timezone');
const Emp_onboarding = require("../models/Emp_onboarding");
const { Op, Sequelize } = require("sequelize");
const axios = require("axios");
const updateSalary = require("../services/salaryManagement");
const Salary_Management = require("../models/salaryManagement");
const LeavesCreation = require("../models/leavesCreation");
const Salary_advance = require("../models/salary_advance_loan");
const Report_Submission = require("../models/report_submission");
const { use } = require("../routes/salary_advanceRoutes");
const HrPanel = require("../models/HrPanel");
const Holidays = require("../models/holiday_creation");
const ExcelJS = require("exceljs");
const Organization = require("../models/OrganizationModule");
const Emp_Details = require("../models/Emp_onboarding");
const holiday_creation = require("../models/holiday_creation");
const {
  getHolidaysByOrganizationId,
} = require("../services/holiday_creationService");

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

const getGeocode = async (latitude, longitude) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  // Replace with your API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`; // Asking Money
  // const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
  // const url =`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json` // Free api
  console.log(latitude, longitude, "latitudelongitude");
  try {
    const response = await axios.get(url);
    console.log("responseeee", response, "resultsssss", response.data);

    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].formatted_address; // Return the formatted address
    }
    return "Address not found";
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return "Error fetching address";
  }
};

const punchIn = async (req, res) => {
  try {
    const { empAttendence, latitude, longitude, organizationId } = req.body;

    console.log("employeeid", empAttendence);
    const now = moment.utc();
    const punchInTime = moment(now, "HH:mm");

    // Fetch HR settings
    const hrSettings = await HrPanel.findOne({
      where: { organizationID: organizationId },
    });
    console.log(hrSettings, "hrSettingsssssssssss");
    if (!hrSettings || !hrSettings.punchInTime) {
      return res
        .status(400)
        .json({ error: "Punch-in time not configured for this organization" });
    }

    const punchInTimeFromSettings = moment(hrSettings.punchInTime, "HH:mm");
    const gracePeriod = moment.duration(hrSettings.gracePeriod); // Parse TIME (e.g., "00:15:00") into a duration
    const lateThreshold = moment(hrSettings.gracePeriod, "HH:mm");
    const latePunchIn = hrSettings.late_punchin; // Get late_punchin from HR settings

    console.log(
      "Punch-in time from HR Panel:",
      punchInTimeFromSettings.format("HH:mm")
    );
    console.log("Grace Period:", gracePeriod.asMinutes(), "minutes");
    console.log("Late Threshold:", lateThreshold.format("HH:mm"));
    console.log("Late Punch-in Enabled:", latePunchIn);

    // Check if already punched in today
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const attendance = await Attendance.findOne({
      where: {
        empAttendence,
        punch_out: null,
        punch_in: {
          [Op.gte]: startOfToday,
          [Op.lt]: endOfToday,
        },
      },
    });

    if (attendance) {
      return res.status(400).json({ error: "Already punched in" });
    }

    // Get location from latitude and longitude
    const address = await getGeocode(latitude, longitude);
    console.log("Location:", address);

    let newAttendance;
    if (hrSettings.late_punchin === true) {
      // Determine if punch-in is late based on late_punchin
      const isLate = latePunchIn && punchInTime.isAfter(lateThreshold);
      console.log("Is Late:", isLate);

      // Create new attendance record
      newAttendance = await Attendance.create({
        empAttendence,
        punch_in: now.toDate(),
        isLate: isLate, // Set isLate based on late_punchin logic
        status: "Present",
        location: address,
        organizationId: organizationId,
        longitude,
        latitude,
      });

      console.log("New Attendance Record:", newAttendance);
    } else {
      // Create new attendance record
      newAttendance = await Attendance.create({
        empAttendence,
        punch_in: now.toDate(),
        isLate: false, // Set isLate based on late_punchin logic
        status: "Present",
        location: address,
        organizationId: organizationId,
        longitude,
        latitude,
      });
      console.log("New Attendance Record in else:", newAttendance);
    }

    return res.status(200).json({
      message: "Punched in successfully",
      data: newAttendance,
    });
  } catch (error) {
    console.error("Error in punchIn:", error);
    return res.status(500).json({ error: error.message });
  }
};

const generateSalaryPayslip = async (req, res) => {
  const employees = [{ id: 40 }];

  const salaryPayslip = employees.map(async (employee) => {
    const salaryAdvanceCheck = await Salary_advance.findOne({
      where: {
        empOnboardingId: employee.id, // Filter by employee ID
        [Op.or]: [
          {
            request_type: "Loan",
            loan_status: "Pending", // Check for a pending loan request in the current month
          },
          {
            request_type: "Salary Advance",
            createdAt: {
              [Op.gte]: moment().startOf("month").toDate(), // Start of the current month
              [Op.lte]: moment().endOf("month").toDate(), // End of the current month
            },
          },
        ],
      },
    });

    const Salary_Details = await Salary_Management.findOne({
      where: { empOnboardingId: employee.id },
      order: [["createdAt", "ASC"]], // or whichever column you want to order by
      limit: 1,
    });
    const employeeDetails = await Emp_onboarding.findByPk(employee.id);
    const monthlyWorkingDays = await Attendance.count({
      where: { empAttendence: employee.id },
      punch_in: {
        [Op.gte]: moment().startOf("month").toDate(),
        [Op.lte]: moment().endOf("month").toDate(),
      },
    });
    console.log("employeeiddd", employee.id);

    const presentDates = await Attendance.findAll({
      attributes: ["punch_in"], // Adjust to include the fields you need
      where: {
        empAttendence: employee.id,
        punch_out: {
          [Op.gte]: moment().startOf("month").toDate(),
          [Op.lte]: moment().endOf("month").toDate(),
        },
      },
    });

    const presentDays = presentDates.map((record) =>
      moment(record.punch_in).format("YYYY-MM-DD")
    );
    console.log("llpplplpddddddd", presentDates);

    const uniquePresentDays = [...new Set(presentDays)];
    console.log("uniqueeedateeddddde", uniquePresentDays);

    const reportSubmissions = await Report_Submission.findAll({
      attributes: ["date"],
      where: {
        empOnboardingId: employee.id,
        date: {
          [Op.gte]: moment().startOf("month").toDate(),
          [Op.lte]: moment().endOf("month").toDate(),
        },
      },
    });
    console.log("reporrttssss", reportSubmissions);

    const submittedDays = reportSubmissions.map((record) =>
      moment(record.date).format("YYYY-MM-DD")
    );
    console.log("submittingdddddateeesss", submittedDays);

    const countingDates = uniquePresentDays.filter(
      (date) => !submittedDays.includes(date)
    );

    const reportingLopCount = countingDates.length;
    console.log(
      "countingdatessss",
      countingDates,
      "countttt",
      reportingLopCount
    );

    const employeeLeaves = await LeavesCreation.sum("number_of_days", {
      where: {
        empOnboardingId: employee.id,
        createdAt: {
          [Op.gte]: moment().startOf("month").toDate(),
          [Op.lte]: moment().endOf("month").toDate(),
        },
      },
    });
    console.log(
      "employeeDetailssssdddss",
      Salary_Details,
      "emplooooo",
      employeeDetails,
      "monthlyworkingDaysss",
      monthlyWorkingDays,
      "monthlyemployeeLeaves",
      employeeLeaves
    );

    const LeavesLOP = await LeavesCreation.sum("LOP", {
      where: {
        empOnboardingId: employee.id,
        createdAt: {
          [Op.gte]: moment().startOf("month").toDate(),
          [Op.lte]: moment().endOf("month").toDate(),
        },
      },
    });

    console.log("monthlyyyyloopppspsdddss", LeavesLOP);
    // const LOPLeaves = Math.max(0, LeavesLOP - employeeLeaveBalance);

    // Calculation of Attendence LOP............................

    // if(lastRecordOfAttendance!=null){
    const monthlyAttendenceLOP = await Attendance.count({
      where: {
        empAttendence: employee.id,
        punch_in: {
          [Op.gte]: moment().startOf("month").toDate(),
          [Op.lte]: moment().endOf("month").toDate(),
        },
        isLate: true,
      },
    });

    console.log("siriyyaaaaaawwwww", monthlyAttendenceLOP);
    let attendanceLOP;
    if (monthlyAttendenceLOP > 2) {
      attendanceLOP = (monthlyAttendenceLOP - 2) / 2;
      console.log("liojededeaaaa", attendanceLOP);
    }

    // }
    let profetionalTax;
    let incomeTax;
    let house_rent_allowance;
    let convaynce_allowance;
    let perfomance_incentives;
    let bonusAndIncentives;
    let special_allowance;
    let basic_salary;
    let pf;
    console.log(
      "rfrfrrrffr",
      LeavesLOP ? LeavesLOP : 0,
      "reeeeeeeeeeeeeeee",
      attendanceLOP ? attendanceLOP : 0,
      "reporrrtttt",
      reportingLopCount,
      "repopppoop",
      reportingLopCount ? reportingLopCount : 0
    );

    const totalLOPs = LeavesLOP
      ? LeavesLOP
      : 0 + reportingLopCount
      ? reportingLopCount
      : 0 + attendanceLOP
      ? attendanceLOP
      : 0;
    if (Salary_Details) {
      basic_salary = Salary_Details.basic_salary;
      profetionalTax = Salary_Details.profetional_tax;
      incomeTax = Salary_Details.income_tax;
      house_rent_allowance = Salary_Details.house_rent_allowance;
      convaynce_allowance = Salary_Details.convaynce_allowance;
      perfomance_incentives = Salary_Details.perfomance_incentives;
      bonusAndIncentives = Salary_Details.insentives;
      special_allowance = Salary_Details.special_allowance;
      pf = Salary_Details.PF_Amount;

      console.log(
        "totalloppsssttttt",
        totalLOPs,
        "profetionaltaaxxxx",
        profetionalTax,
        "incometaxx",
        incomeTax,
        "house_rent_allowance",
        house_rent_allowance,
        "convaynce_allowance",
        convaynce_allowance,
        "perfomance_incentives",
        perfomance_incentives,
        "bonusAndIncentives",
        bonusAndIncentives,
        "special_allowance",
        special_allowance
      );
    }

    // let basic_salary = employeeDetails.salary/12;

    console.log("basiccsalardfyy", basic_salary);
    // const providentTax = basic_salary * 0.12;

    if (house_rent_allowance != null) {
      basic_salary += Number(house_rent_allowance);
      console.log("after add houserentallowance", basic_salary);
    }
    if (convaynce_allowance != null) {
      basic_salary += Number(convaynce_allowance);
    }
    if (special_allowance != null) {
      basic_salary += Number(special_allowance);
    }
    if (bonusAndIncentives != null) {
      basic_salary += Number(bonusAndIncentives);
    }

    const grossPay = basic_salary;

    // Calculate the number of days in the current month dynamically
    const daysInMonth = moment().daysInMonth(); // e.g., 31, 30, 28
    console.log("Days in Current Month:", daysInMonth);
    // Calculate per-day salary based on the current month’s total days

    const dailyWage = grossPay / daysInMonth;
    console.log("Per Day Salary:", dailyWage);
    const proRatedSalary = dailyWage * monthlyWorkingDays;
    console.log("proratedsalaryyy", proRatedSalary);

    let pTax;
    let iTax;
    let providentTax;
    if (profetionalTax != null) {
      pTax = Number(profetionalTax) || 0;
    }
    if (incomeTax) {
      iTax = Number(incomeTax != null) || 0;
    }
    if (pf) {
      providentTax = pf;
    }

    let grossDeduction = pTax + iTax + providentTax;
    console.log("grosss1st", grossDeduction);

    let lopDeduction;
    if (totalLOPs > 0) {
      console.log("totalsssffs", totalLOPs);
      lopDeduction = dailyWage * totalLOPs; // Deduction based on LOP days
      grossDeduction += lopDeduction;
      console.log("LOP Deduction:", lopDeduction);
    }
    console.log("Final Gross Deduction:", grossDeduction);

    const net_salary = proRatedSalary - grossDeduction;
    console.log("netsalaaryyy", net_salary);

    function numberToWords(num) {
      const belowTwenty = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ];
      const belowHundred = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ];

      if (num < 20) return belowTwenty[num];
      if (num < 100)
        return (
          belowHundred[Math.floor(num / 10)] +
          (num % 10 ? " " + belowTwenty[num % 10] : "")
        );
      if (num < 1000)
        return (
          belowTwenty[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 ? " and " + numberToWords(num % 100) : "")
        );
      if (num < 1000000)
        return (
          numberToWords(Math.floor(num / 1000)) +
          " Thousand" +
          (num % 1000 ? " " + numberToWords(num % 1000) : "")
        );

      return "";
    }
    // this logic for decimal amount
    // function convertSalaryToWords(amount) {
    //   if (amount === 0) return "Zero";

    //   const words = numberToWords(Math.floor(amount));
    //   const cents = Math.round((amount % 1) * 100);
    //   return cents > 0 ? `${words} and ${cents}/100` : words;
    // }

    function convertSalaryToWords(amount) {
      // Round the amount to the nearest integer
      const roundedAmount = Math.round(amount);
      if (roundedAmount === 0) return "Zero";

      const words = numberToWords(roundedAmount);
      return words; // Return only the whole number in words
    }

    const amountInWords = convertSalaryToWords(net_salary);
    console.log("Amount in Words:", amountInWords);

    try {
      const salaryData = {
        working_days: monthlyWorkingDays,
        leaves: employeeLeaves,
        lop: totalLOPs,
        profetional_tax: profetionalTax,
        house_rent_allowance: house_rent_allowance,
        income_tax: incomeTax,
        convaynce_allowance: convaynce_allowance,
        perfomance_incentives: null,
        other_deductions: null,
        insentives: null,
        special_allowance: null,
        gratuity: null,
        net_pay: net_salary,
        amount_in_words: amountInWords,
        loss_of_pay: lopDeduction,
        gross_pay: proRatedSalary,
        gross_deduction: grossDeduction,
        empOnboardingId: employee.id,
      };
    } catch (error) {
      console.log("dddddddfff", error);
    }

    // }
    console.log("afterifffff");
  });
};

const punchOut = async (req, res) => {
  try {
    const { empAttendence } = req.body;

    // Validate required field
    if (!empAttendence) {
      return res
        .status(400)
        .json({ error: "Employee attendance ID is required" });
    }

    console.log(empAttendence, "empAttendence");

    const now = moment();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the active punch-in record for today
    const attendance = await Attendance.findOne({
      where: {
        empAttendence,
        punch_out: null,
        createdAt: { [Op.gte]: today },
      },
    });

    if (!attendance) {
      return res
        .status(400)
        .json({ error: "No active punch-in record found for today" });
    }

    console.log("Attendance:", attendance);

    const userId = attendance.empAttendence;
    console.log("User ID:", userId);

    // Fetch organizationId (adjust based on your setup)
    const organizationId =
      attendance.organizationId || req.user?.organizationId;
    if (!organizationId) {
      return res.status(400).json({ error: "Organization ID not found" });
    }

    // Fetch HR settings
    const hrSettings = await HrPanel.findOne({
      where: { organizationID: organizationId },
    });
    if (!hrSettings || !hrSettings.punchInTime || !hrSettings.punchOutTime) {
      return res
        .status(400)
        .json({ error: "Punch-in or punch-out time not configured" });
    }

    // Define thresholds from HrPanel
    const punchInTimeFromSettings = moment(hrSettings.punchInTime, "HH:mm:ss");
    const lateThreshold = hrSettings.late_punchin
      ? moment(hrSettings.gracePeriod, "HH:mm:ss")
      : punchInTimeFromSettings; // Add grace period if needed: .clone().add(15, 'minutes');
    const punchOutTimeFromSettings = moment(
      hrSettings.punchOutTime,
      "HH:mm:ss"
    );
    const earlyLeaveThreshold = punchOutTimeFromSettings;
    const considerLOP = hrSettings.considerLOP;

    console.log(
      "Punch-in time from HR Panel:",
      punchInTimeFromSettings.format("HH:mm:ss")
    );
    console.log("Late Threshold:", lateThreshold.format("HH:mm:ss"));
    console.log(
      "Punch-out time from HR Panel:",
      punchOutTimeFromSettings.format("HH:mm:ss")
    );
    console.log(
      "Early Leave Threshold:",
      earlyLeaveThreshold.format("HH:mm:ss")
    );
    console.log("Consider LOP:", considerLOP);

    // Convert punch_in to IST
    const punchInTime = moment(attendance.punch_in).utcOffset("+05:30");
    console.log("Punch-in (IST):", punchInTime.format("HH:mm:ss"));

    // Set punch_out to current time
    attendance.punch_out = now.toDate();
    const punchOutTime = moment(attendance.punch_out).utcOffset("+05:30");
    console.log("Punch-out (IST):", punchOutTime.format("HH:mm:ss"));

    // Calculate duration
    const duration = moment.duration(punchOutTime.diff(punchInTime));
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) % 60;
    const seconds = Math.floor(duration.asSeconds()) % 60;
    const timeDuration = `${hours}:${minutes}:${seconds}`;
    console.log("Duration:", timeDuration);

    // Count monthly late punches
    const monthlyLatePunches = await Attendance.count({
      where: {
        empAttendence: userId,
        punch_in: {
          [Op.gte]: moment().startOf("month").toDate(),
          [Op.lte]: moment().endOf("month").toDate(),
        },
        isLate: true,
      },
    });
    console.log("Monthly late punches:", monthlyLatePunches);

    const isLate = punchInTime.isAfter(lateThreshold);
    const isEarlyLeave = punchOutTime.isBefore(earlyLeaveThreshold);
    console.log("Is Late:", isLate);
    console.log("Is Early Leave:", isEarlyLeave);

    // Determine status (restored from your original code)
    let status;
    if (monthlyLatePunches > 1 && isLate) {
      console.log("attstatatatststa");
      status = "Half Day";
    } else if (hours >= 4 && hours < 6) {
      console.log("halffffdayyyy");
      status = "Half Day";
    } else if (hours >= 8) {
      console.log("fullllldaaaayyy");
      status = "Full Day";
    } else if (hours >= 6 && hours <= 8) {
      console.log("nulllllll");
      status = "Pending"; // Or any other status for less than 4 hours
    } else if (hours >= 2) {
      // New condition for > 2 hours
      console.log("Half Day due to > 2 hours");
      status = "Half Day";
    } else {
      console.log("abseeetttttt");
      status = "Absent";
    }
    console.log("statusssss", status);

    // Update attendance record
    attendance.duration = timeDuration;
    attendance.status = status;
    await attendance.save();
    console.log("Saved attendance:", attendance);

    return res.status(200).json({
      message: `Punched out successfully. Status: ${status}`,
      data: attendance,
    });
  } catch (error) {
    console.error("Error in punchOut:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAttendenceById = async (req, res) => {
  try {
    const id = req.params.id;
    const { page = 0, pageSize = 10, year, month } = req.query;
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const yearInt = parseInt(year, 10);

    const offset = pageInt * pageSizeInt;
    const monthInt = parseInt(getMonthNumber(month), 10);
    let whereCondition = { empAttendence: id };

    if (yearInt && monthInt !== undefined) {
      whereCondition[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("punch_in")),
          yearInt
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("punch_in")),
          monthInt
        ),
      ];
    } else if (yearInt) {
      whereCondition.salary_date = Sequelize.where(
        Sequelize.fn("DATE_PART", "year", Sequelize.col("punch_in")),
        yearInt
      );
    } else if (monthInt !== undefined) {
      whereCondition.salary_date = Sequelize.where(
        Sequelize.fn("DATE_PART", "month", Sequelize.col("punch_in")),
        monthInt
      );
    }

    // Find the most recent attendance record for the employee
    const latestAttendance = await Attendance.findAll({
      where: whereCondition,
      limit: pageSizeInt,
      offset: offset,
      order: [["punch_in", "DESC"]],
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
          attributes: ["emp_name"],
        },
      ],
    });

    const monthlyAttendence = await Attendance.count({ where: whereCondition });

    console.log("counttt", monthlyAttendence);

    console.log("Latest Attendance Record:", latestAttendance);

    if (!latestAttendance) {
      return res
        .status(404)
        .json({ message: "No attendance record found for this employee." });
    }

    res.status(200).json({
      AttendenceData: latestAttendance,
      MonthlyCount: monthlyAttendence,
    });
  } catch (error) {
    console.log("Error fetching attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getRecentAttendenceById = async (req, res) => {
  try {
    const empId = req.params.id;
    console.log("Employee ID:", empId);

    // Find the most recent attendance record for the employee
    const latestAttendance = await Attendance.findOne({
      where: { empAttendence: empId },
      order: [["createdAt", "DESC"]], // Assuming you have a createdAt field to order by the latest punch-in
      include: [
        {
          model: Emp_onboarding, // Assuming you've associated the Attendance with the Employee model
          as: "EmployeeDetails",
          attributes: ["emp_name"], // Specify the employee details you want to retrieve
        },
      ],
    });

    const monthlyAttendence = await Attendance.count({
      where: {
        empAttendence: empId,
        punch_out: {
          [Op.gte]: moment().startOf("month").toDate(),
          [Op.lte]: moment().endOf("month").toDate(),
        },
      },
    });

    console.log("counttt", monthlyAttendence);

    console.log("Latest Attendance Record:", latestAttendance);

    if (!latestAttendance) {
      return res
        .status(404)
        .json({ message: "No attendance record found for this employee." });
    }

    res.status(200).json({
      AttendenceData: latestAttendance,
      MonthlyCount: monthlyAttendence,
    });
  } catch (error) {
    console.log("Error fetching attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAttendenceByYear = async (req, res) => {
  try {
    const id = req.params.id;
    const { year } = req.query;
    const yearInt = parseInt(year, 10);

    if (!yearInt) {
      return res.status(400).json({ message: "Year is required." });
    }

    let whereCondition = {
      empAttendence: id,
      [Sequelize.Op.and]: [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("punch_in")),
          yearInt
        ),
      ],
    };

    // Fetch attendance records for the given year
    const attendanceRecords = await Attendance.findAll({
      where: whereCondition,
      order: [["punch_out", "DESC"]],
      attributes: ["punch_out", "status", "punch_in", "isLate"],
    });

    const yearlyAttendanceCount = await Attendance.count({
      where: whereCondition,
    });

    console.log("Yearly Attendance Count:", yearlyAttendanceCount);
    console.log("Attendance Records:", attendanceRecords);

    res.status(200).json({
      AttendanceData: attendanceRecords,
      YearlyCount: yearlyAttendanceCount,
      message: attendanceRecords.length
        ? "Attendance records found."
        : "No attendance records for this year.",
    });

    // res.status(200).json({
    //   AttendanceData: attendanceRecords,
    //   YearlyCount: yearlyAttendanceCount,
    // });
  } catch (error) {
    console.error("Error fetching attendance by year:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAttendenceData = async (req, res) => {
  try {
    const usersData = await Attendance.findAll({
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
        },
      ],
    });
    res.status(200).json(usersData);
  } catch (error) {
    console.log(error);
  }
};

const getTodaysAttendancebyOrganization = async (req, res) => {
  try {
    const id = req.params.id;

    // Get today's start and end timestamps
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch attendance records with today's punch_in
    const usersData = await Attendance.findAll({
      where: {
        organizationId: id,
        punch_in: {
          [Op.gte]: startOfDay, // punch_in >= start of today
          [Op.lt]: endOfDay, // punch_in < end of today
        },
      },
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
        },
      ],
    });

    res.status(200).json(usersData);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getWeekAttendanceData = async (req, res) => {
  try {
    const id = req.params.id;

    // Get today's date
    const today = new Date();

    // Get the start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    // Get the end of the week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    // Fetch attendance records for the current week (Sunday to Saturday)
    const usersData = await Attendance.findAll({
      where: {
        empAttendence: id,
        punch_in: {
          [Op.gte]: startOfWeek, // punch_in >= start of Sunday
          [Op.lte]: endOfWeek, // punch_in <= end of Saturday
        },
      },
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
        },
      ],
    });
    console.log(usersData, "from week");
    res.status(200).json(usersData);
  } catch (error) {
    console.error("Error fetching weekly attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAttendenceDatabyOrganizationId = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      page = 0,
      pageSize = 10,
      year,
      month,
      date,
      search = "",
    } = req.query;

    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(getMonthNumber(month), 10);
    const dateInt = parseInt(date, 10);

    console.log("dateInttttt", dateInt);

    const offset = pageInt * pageSizeInt;

    // Define main `whereCondition`
    let whereCondition = { organizationId: id, isLate: false };

    // Add conditions for year and month filtering
    if (yearInt && monthInt !== undefined) {
      whereCondition[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("punch_in")),
          yearInt
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("punch_in")),
          monthInt
        ),
      ];
    } else if (yearInt) {
      whereCondition.salary_date = Sequelize.where(
        Sequelize.fn("DATE_PART", "year", Sequelize.col("punch_in")),
        yearInt
      );
    } else if (monthInt !== undefined) {
      whereCondition.salary_date = Sequelize.where(
        Sequelize.fn("DATE_PART", "month", Sequelize.col("punch_in")),
        monthInt
      );
    }

    // Add condition for date filtering
    if (!isNaN(dateInt)) {
      if (!whereCondition[Op.and]) {
        whereCondition[Op.and] = [];
      }
      whereCondition[Op.and].push(
        Sequelize.where(
          Sequelize.fn("DATE_PART", "day", Sequelize.col("punch_in")),
          dateInt
        )
      );
    }

    // Define `whereClause` for Employee name search
    let whereClause = {};
    if (search) {
      whereClause.emp_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    // Count total attendance
    const totalAttendance = await Attendance.count({
      where: whereCondition,
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
          where: whereClause, // Apply employee name search here
        },
      ],
    });

    // Fetch attendance data with employee details
    const usersData = await Attendance.findAll({
      where: whereCondition,
      limit: pageSizeInt,
      offset: offset,
      order: [["punch_in", "DESC"]],
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
          attributes: ["emp_name"],
          where: whereClause, // Apply employee name search here
        },
      ],
    });

    console.log(usersData.length, totalAttendance, "from attendance");
    res.status(200).json({ usersData, totalAttendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLatePunchInByOrganization = async (req, res) => {
  try {
    const id = req.params.id;
    const { page = 0, pageSize = 10, year, month, search = "" } = req.query;

    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(getMonthNumber(month), 10);

    const offset = pageInt * pageSizeInt;

    // Define main `whereCondition`
    let whereCondition = { organizationId: id, isLate: true };

    // Add conditions for year and month filtering
    if (yearInt && monthInt !== undefined) {
      whereCondition[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("punch_in")),
          yearInt
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("punch_in")),
          monthInt
        ),
      ];
    } else if (yearInt) {
      whereCondition.salary_date = Sequelize.where(
        Sequelize.fn("DATE_PART", "year", Sequelize.col("punch_in")),
        yearInt
      );
    } else if (monthInt !== undefined) {
      whereCondition.salary_date = Sequelize.where(
        Sequelize.fn("DATE_PART", "month", Sequelize.col("punch_in")),
        monthInt
      );
    }

    // Define `whereClause` for Employee name search
    let whereClause = {};
    if (search) {
      whereClause.emp_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    // Count total attendance
    const totalAttendance = await Attendance.count({
      where: whereCondition,
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
          where: whereClause, // Apply employee name search here
        },
      ],
    });

    // Fetch attendance data with employee details
    const usersData = await Attendance.findAll({
      where: whereCondition,
      limit: pageSizeInt,
      offset: offset,
      order: [["punch_in", "DESC"]],
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
          attributes: ["emp_name"],
          where: whereClause, // Apply employee name search here
        },
      ],
    });

    console.log(usersData.length, totalAttendance, "from attendance");
    res.status(200).json({ usersData, totalAttendance });
  } catch (error) {
    console.log(error);
  }
};

const getWeeklyAttendenceOfOrganization = async (req, res) => {
  try {
    const id = req.params.id;
    const { weekOffset = 0 } = req.query;

    const weekOffsetInt = parseInt(weekOffset, 10) || 0; // Default to 0 if not provided

    // Calculate the start (Sunday) and end (Saturday) dates for the selected week
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + weekOffsetInt * 7); // Move to Sunday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Saturday

    // Format the dates to YYYY-MM-DD (PostgreSQL-compatible)
    const startDate = startOfWeek.toISOString().split("T")[0];
    const endDate = endOfWeek.toISOString().split("T")[0];

    console.log(`Fetching attendance from ${startDate} to ${endDate}`);

    // Define `whereCondition` for weekly attendance
    let whereCondition = {
      organizationId: id,
      punch_in: {
        [Op.between]: [startDate, endDate], // Attendance within the selected week
      },
    };

    // Fetch attendance data for the week
    const usersData = await Attendance.findAll({
      where: whereCondition,
      order: [["punch_in", "DESC"]],
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
          attributes: ["emp_name"],
        },
      ],
    });

    console.log(usersData.length, "records fetched from weekly attendance");
    res.status(200).json(usersData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMonthlyAttendanceData = async (req, res) => {
  try {
    const { employeeID, month, year } = req.body; // Expecting `month` and `year` in the request body

    // Calculate start and end dates for the provided month and year
    const startDate = moment(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = moment(`${year}-${month}-01`).endOf("month").toDate();

    console.log(startDate, endDate, "from date");

    const presentDates = await Attendance.findAll({
      attributes: ["punch_in", "punch_out", "createdAt"], // Add any additional fields you need
      where: {
        empAttendence: employeeID,
        punch_in: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });

    const presentDays = presentDates.map((record) =>
      moment(record.punch_in).format("YYYY-MM-DD")
    );
    console.log("Present Dates:", presentDates);

    const uniquePresentDays = [...new Set(presentDays)];
    console.log("Unique Present Days:", uniquePresentDays);

    // Get report submissions within the month
    const reportSubmissions = await Report_Submission.findAll({
      attributes: ["date"],
      where: {
        empOnboardingId: employeeID,
        date: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });
    console.log("Report Submissions:", reportSubmissions);

    const submittedDays = reportSubmissions.map((record) =>
      moment(record.date).format("YYYY-MM-DD")
    );
    console.log("Submitted Dates:", submittedDays);

    // Fetch leave days for the employee within the month
    const leaveRecords = await LeavesCreation.findAll({
      attributes: ["from_date", "to_date", "monthly_leave_balance"],
      where: {
        empOnboardingId: employeeID,
        from_date: {
          [Op.lte]: endDate, // Start date is on or before the end of the month
        },
        to_date: {
          [Op.gte]: startDate, // End date is on or after the start of the month
        },
      },
    });

    let lastLeaveRecord;
    if (leaveRecords.length > 0) {
      // Get the last record
      lastLeaveRecord = leaveRecords[leaveRecords.length - 1];
    }
    console.log(
      lastLeaveRecord?.dataValues?.monthly_leave_balance,
      "Last leave record:",
      lastLeaveRecord
    );
    const monthlyLeaveBalance =
      lastLeaveRecord?.dataValues?.monthly_leave_balance;

    // Generate all leave dates within the specified range
    let leaveDays = [];
    leaveRecords.forEach((record) => {
      const leaveStart = moment(record.start_date);
      const leaveEnd = moment(record.end_date);
      // Add each day in the leave range to leaveDays
      while (leaveStart.isSameOrBefore(leaveEnd)) {
        leaveDays.push(leaveStart.format("YYYY-MM-DD"));
        leaveStart.add(1, "day");
      }
    });
    leaveDays = [...new Set(leaveDays)]; // Ensure unique dates
    console.log("Leave Days (all days within each leave range):", leaveDays);

    // Exclude Sundays from the unique present days
    const countingDates = uniquePresentDays.filter((date) => {
      const isSunday = moment(date).day() === 0; // Check if the day is Sunday (0 = Sunday)
      return (
        !submittedDays.includes(date) && !leaveDays.includes(date) && !isSunday
      );
    });

    const reportingLopCount = countingDates.length;
    console.log(
      "Counting Dates Excluding Submissions, Leaves, and Sundays:",
      countingDates,
      "Count:",
      reportingLopCount
    );

    const LeavesLOP = await LeavesCreation.sum("LOP", {
      where: {
        empOnboardingId: employeeID,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });

    const leavesCount = await LeavesCreation.sum("number_of_days", {
      where: { empOnboardingId: employeeID },
      status: "Approved",
      createdAt: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    });

    console.log("monthlyyyyleavesssscountttt:", leavesCount);

    const monthlyAttendenceLOP = await Attendance.count({
      where: {
        empAttendence: employeeID,
        punch_in: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
        isLate: true,
      },
    });

    console.log("siriyyaaaaaawwwww", monthlyAttendenceLOP);
    let attendanceLOP = 0;
    if (monthlyAttendenceLOP > 2) {
      attendanceLOP = (monthlyAttendenceLOP - 2) / 2;
      console.log("liojededeaaaa", attendanceLOP);
    }
    console.log(
      "atteeeendenceeeLOP",
      attendanceLOP,
      "LeaveessssLOP",
      LeavesLOP,
      "reportinglopp",
      reportingLopCount
    );
    console.log(
      "atteeeendenceeeLOP",
      Number(attendanceLOP),
      "LeaveessssLOP",
      Number(LeavesLOP),
      "reportinglopp",
      Number(reportingLopCount)
    );

    const totalLOPs = attendanceLOP
      ? attendanceLOP
      : 0 + LeavesLOP
      ? LeavesLOP
      : 0 + reportingLopCount
      ? reportingLopCount
      : 0;
    console.log("totalLOPPPSS", totalLOPs);

    const monthlyWorkingDays = await Attendance.count({
      where: {
        empAttendence: employeeID,
        punch_in: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });

    // Respond with attendance data
    res.status(200).json({
      employeeTotalLOP: attendanceLOP,
      totalWorkingDays: monthlyWorkingDays,
      monthlyLeaveBlanace: monthlyLeaveBalance,
    });
  } catch (error) {
    console.error("Error fetching monthly attendance data:", error);
    res.status(500).json({ error: "Failed to fetch monthly attendance data" });
  }
};

const updateAttences = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    console.log("Request Data:", id, data);

    const getUpdate = await Attendance.findByPk(id);

    if (!getUpdate) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    if (!data.punch_out) {
      return res.status(400).json({ message: "Punch-out time is required" });
    }

    const punchIn = new Date(getUpdate.punch_in);
    const punchOut = new Date(data.punch_out);

    if (isNaN(punchIn.getTime()) || isNaN(punchOut.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format for punch_in or punch_out" });
    }

    const durationMs = punchOut - punchIn;

    if (durationMs < 0) {
      return res
        .status(400)
        .json({ message: "Punch-out time is before punch-in time" });
    }

    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor(
      (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    const durationSeconds = Math.floor((durationMs % (1000 * 60)) / 1000);

    console.log(
      `Duration: ${durationHours} hours and ${durationMinutes} minutes`
    );
    const totaDuration = `${durationHours}:${durationMinutes}:${durationSeconds}`;

    let dayStatus;

    const totalMinutes = durationHours * 60 + durationMinutes;

    if (totalMinutes > 300 && totalMinutes <= 480) {
      dayStatus = "Half Day";
    } else if (totalMinutes > 480) {
      dayStatus = "Full Day";
    } else {
      dayStatus = "Absent";
    }

    console.log(`Duration: ${totaDuration}, Status: ${dayStatus}`);
    const updateData = {
      punch_out: data.punch_out,
      status: dayStatus,
      duration: totaDuration,
    };

    const response = await Attendance.update(updateData, { where: { id } });

    res.status(200).json({
      message: "Attendance updated successfully",
      response,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLateAttendance = async (req, res) => {
  try {
    const id = req.params.id;
    const { isLate } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Attendance ID is required" });
    }

    if (typeof isLate !== "boolean") {
      return res
        .status(400)
        .json({ message: "isLate must be a boolean value" });
    }

    const attendanceRecord = await Attendance.findByPk(id);
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    await Attendance.update({ isLate }, { where: { id } });
    const updatedRecord = await Attendance.findByPk(id);

    res.status(200).json({
      message: "Late attendance status updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating late attendance:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllAttendanceByOrganization = async (req, res) => {
  try {
    const id = req.params.id;
    const { page = 0, pageSize = 10, year, month, search = "" } = req.query;
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const yearInt = parseInt(year, 10);
    const offset = pageInt * pageSizeInt;
    const monthInt = parseInt(getMonthNumber(month), 10);

    let whereCondition = { organizationId: id };
    if (yearInt && monthInt !== undefined) {
      whereCondition[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("punch_in")),
          yearInt
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("punch_in")),
          monthInt
        ),
      ];
    } else if (yearInt) {
      whereCondition.salary_date = Sequelize.where(
        Sequelize.fn("DATE_PART", "year", Sequelize.col("punch_in")),
        yearInt
      );
    } else if (monthInt !== undefined) {
      whereCondition.salary_date = Sequelize.where(
        Sequelize.fn("DATE_PART", "month", Sequelize.col("punch_in")),
        monthInt
      );
    }

    let whereClause = { isDelete: false, orgnaizationId: id };
    if (search) {
      whereClause.emp_name = { [Op.iLike]: `%${search}%` };
    }

    const employeesCount = await Emp_onboarding.count({
      where: whereClause,
      // offset: offset,
      // limit: pageSizeInt,
      // attributes: ["emp_name", "id", "leave_bucket", "leave_balance"],
    });

    const employees = await Emp_onboarding.findAll({
      where: whereClause,
      offset: offset,
      limit: pageSizeInt,
      order: [["createdAt", "ASC"]],
      attributes: ["emp_name", "id", "leave_bucket", "leave_balance"],
    });

    const holidays = await Holidays.count({
      where: {
        organizationId: id,
        [Op.or]: [
          {
            date: { [Op.lte]: new Date(yearInt, monthInt, 0) }, // End of month
            date: { [Op.gte]: new Date(yearInt, monthInt - 1, 1) }, // Start of month
          },
        ],
      }, // Fetch holidays for the month of the year
    });

    let employeeWiseData = [];

    for (const employee of employees) {
      const { id, emp_name, leave_balance } = employee;

      const presentCount = await Attendance.count({
        where: {
          ...whereCondition,
          empAttendence: id,
          status: { [Op.in]: ["Present", "Full Day"] },
        },
      });

      const halfDayCount = await Attendance.count({
        where: {
          ...whereCondition,
          empAttendence: id,
          status: "Half Day",
        },
      });

      const leaves = await LeavesCreation.findAll({
        where: {
          empOnboardingId: id,
          status: "Approved",
          [Op.or]: [
            {
              from_date: { [Op.lte]: new Date(yearInt, monthInt, 0) }, // End of month
              to_date: { [Op.gte]: new Date(yearInt, monthInt - 1, 1) }, // Start of month
            },
          ],
        },
      });

      const leavesPending = await LeavesCreation.count({
        where: {
          empOnboardingId: id,
          status: "Pending",
          [Op.or]: [
            {
              from_date: { [Op.lte]: new Date(yearInt, monthInt, 0) }, // End of month
              to_date: { [Op.gte]: new Date(yearInt, monthInt - 1, 1) }, // Start of month
            },
          ],
        },
      });

      let leaveCount = 0;
      let unpaidLeaveCount = 0;
      // let remainingBalance = availableLeaveBalance;
      // Month boundaries (UTC)
      const monthStart = new Date(Date.UTC(yearInt, monthInt - 1, 1));
      const monthEnd = new Date(
        Date.UTC(yearInt, monthInt, 0, 23, 59, 59, 999)
      );

      leaves.forEach((leave) => {
        // Only process if this leave has LOP days
        if (leave.lop_days && leave.lop_days.length > 0) {
          leave.lop_days.forEach((lopDate) => {
            const date = new Date(lopDate);
            if (date >= monthStart && date <= monthEnd) {
              unpaidLeaveCount++;
            }
          });
        }

        // Count all leave days (including non-LOP) for leaveCount
        const startDate = new Date(leave.from_date);
        const endDate = new Date(leave.to_date);
        const actualStart = startDate < monthStart ? monthStart : startDate;
        const actualEnd = endDate > monthEnd ? monthEnd : endDate;

        for (
          let d = new Date(actualStart);
          d <= actualEnd;
          d.setDate(d.getDate() + 1)
        ) {
          if (d.getDay() !== 0) {
            leaveCount++;
          }
        }
      });

      console.log("Total Leave Count:", leaveCount);
      console.log("Total Unpaid Leave Count:", unpaidLeaveCount);

      const totalDaysInMonth = new Date(yearInt, monthInt, 0).getDate();
      const totalWorkingDays =
        presentCount + halfDayCount + leaveCount + unpaidLeaveCount + holidays;
      const NoData = totalDaysInMonth - totalWorkingDays;
      employeeWiseData.push({
        id,
        emp_name,
        presentCount,
        halfDayCount,
        leaveCount,
        unpaidLeaveCount,
        leavesPending,
        holidays,
        NoData,
      });
    }

    res.status(200).json({ employeeWiseData, employeesCount });
  } catch (error) {
    console.log("Error Fetching all attendance by organization", error);
    res.status(500).json({ message: "Server error" });
  }
};

const exportAttendanceData = async (req, res) => {
  try {
    const id = req.params.id;
    const { year, month, search = "" } = req.query;
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(getMonthNumber(month), 10);

    let whereCondition = { organizationId: id };
    if (yearInt && monthInt !== undefined) {
      whereCondition[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("punch_in")),
          yearInt
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("punch_in")),
          monthInt
        ),
      ];
    } else if (yearInt) {
      whereCondition.salary_date = Sequelize.where(
        Sequelize.fn("DATE_PART", "year", Sequelize.col("punch_in")),
        yearInt
      );
    } else if (monthInt !== undefined) {
      whereCondition.salary_date = Sequelize.where(
        Sequelize.fn("DATE_PART", "month", Sequelize.col("punch_in")),
        monthInt
      );
    }

    let whereClause = { isDelete: false, orgnaizationId: id };
    if (search) {
      whereClause.emp_name = { [Op.iLike]: `%${search}%` };
    }

    const employees = await Emp_onboarding.findAll({
      where: whereClause,
      order: [["createdAt", "ASC"]],
      attributes: ["emp_name", "id", "leave_bucket", "leave_balance"],
    });

    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet("Employee Attendance");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Employee Name", key: "emp_name", width: 20 },
      { header: "Present", key: "presentCount", width: 15 },
      { header: "Half Days", key: "halfDayCount", width: 15 },
      { header: "Leaves Taken", key: "leaveCount", width: 15 },
      { header: "Unpaid Leaves", key: "unpaidLeaveCount", width: 15 },
      { header: "Pending Leaves", key: "leavesPending", width: 15 },
      { header: "Holidays", key: "holidays", width: 10 },
      { header: "No Data", key: "NoData", width: 10 },
    ];

    const holidays = await Holidays.count({
      where: {
        organizationId: id,
        [Op.or]: [
          {
            date: { [Op.lte]: new Date(yearInt, monthInt, 0) }, // End of month
            date: { [Op.gte]: new Date(yearInt, monthInt - 1, 1) }, // Start of month
          },
        ],
      }, // Fetch holidays for the month of the year
    });

    // let employeeWiseData = [];

    for (const employee of employees) {
      const { id, emp_name, leave_balance } = employee;

      const presentCount = await Attendance.count({
        where: {
          ...whereCondition,
          empAttendence: id,
          status: { [Op.in]: ["Present", "Full Day"] },
        },
      });

      const halfDayCount = await Attendance.count({
        where: {
          ...whereCondition,
          empAttendence: id,
          status: "Half Day",
        },
      });

      const leaves = await LeavesCreation.findAll({
        where: {
          empOnboardingId: id,
          status: "Approved",
          [Op.or]: [
            {
              from_date: { [Op.lte]: new Date(yearInt, monthInt, 0) }, // End of month
              to_date: { [Op.gte]: new Date(yearInt, monthInt - 1, 1) }, // Start of month
            },
          ],
        },
      });

      const leavesPending = await LeavesCreation.count({
        where: {
          empOnboardingId: id,
          status: "Pending",
          [Op.or]: [
            {
              from_date: { [Op.lte]: new Date(yearInt, monthInt, 0) }, // End of month
              to_date: { [Op.gte]: new Date(yearInt, monthInt - 1, 1) }, // Start of month
            },
          ],
        },
      });

      let leaveCount = 0;
      let unpaidLeaveCount = 0;
      // let remainingBalance = availableLeaveBalance;
      // Month boundaries (UTC)
      const monthStart = new Date(Date.UTC(yearInt, monthInt - 1, 1));
      const monthEnd = new Date(
        Date.UTC(yearInt, monthInt, 0, 23, 59, 59, 999)
      );

      leaves.forEach((leave) => {
        // Only process if this leave has LOP days
        if (leave.lop_days && leave.lop_days.length > 0) {
          leave.lop_days.forEach((lopDate) => {
            const date = new Date(lopDate);
            if (date >= monthStart && date <= monthEnd) {
              unpaidLeaveCount++;
            }
          });
        }

        // Count all leave days (including non-LOP) for leaveCount
        const startDate = new Date(leave.from_date);
        const endDate = new Date(leave.to_date);
        const actualStart = startDate < monthStart ? monthStart : startDate;
        const actualEnd = endDate > monthEnd ? monthEnd : endDate;

        for (
          let d = new Date(actualStart);
          d <= actualEnd;
          d.setDate(d.getDate() + 1)
        ) {
          if (d.getDay() !== 0) {
            leaveCount++;
          }
        }
      });

      console.log("Total Leave Count:", leaveCount);
      console.log("Total Unpaid Leave Count:", unpaidLeaveCount);

      const totalDaysInMonth = new Date(yearInt, monthInt, 0).getDate();
      const totalWorkingDays =
        presentCount + halfDayCount + leaveCount + unpaidLeaveCount + holidays;
      const NoData = totalDaysInMonth - totalWorkingDays;
      // employeeWiseData.push({
      //   id,
      //   emp_name,
      //   presentCount,
      //   halfDayCount,
      //   leaveCount,
      //   unpaidLeaveCount,
      //   leavesPending,
      //   holidays,
      //   NoData,
      // });

      worksheet.addRow({
        id,
        emp_name,
        presentCount,
        halfDayCount,
        leaveCount,
        unpaidLeaveCount,
        leavesPending,
        holidays,
        NoData,
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="attendance_data_${id}.xlsx"`
    );

    // Write to response
    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.log("Error exporting attendance data", error);
    res.status(500).json({ message: "Server error" });
  }
};
// const CreateAutoAttendance = async (organizationId) => {
//   console.log(organizationId, "organization id in auto create");
//   try {
//     const attendanceDate = moment.tz("Asia/Kolkata").startOf("day").toDate();
//     const formattedDate = moment(attendanceDate).format("YYYY-MM-DD");

//     // Check if the attendance date is a Sunday
//     const isSunday = moment(attendanceDate).day() === 0; // 0 represents Sunday
//     if (isSunday) {
//       console.log(`Skipping auto-attendance for organization ${organizationId} on ${formattedDate} (Sunday)`);
//       return {
//         message: `Auto-attendance skipped for ${formattedDate} (Sunday)`,
//         data: [],
//       };
//     }

//     const employeesToCreateAutoAtt = await Emp_onboarding.findAll({
//       where: {
//         orgnaizationId: organizationId,
//         isDelete: false,
//       },
//       attributes: ["id"],
//     });
//     if (!employeesToCreateAutoAtt.length) {
//       console.log(
//         `No active employees found for organization ${organizationId}`
//       );
//     }

//     const attendanceRecords = [];

//     // Check for existing attendance records
//     for (employee of employeesToCreateAutoAtt) {
//       const existingAttendance = await Attendance.findOne({
//         where: {
//           empAttendence: employee.id,
//           createdAt: {
//             [Op.gte]: moment(formattedDate).startOf("day").toDate(),
//             [Op.lte]: moment(formattedDate).endOf("day").toDate(),
//           },
//         },
//       });
//       if (existingAttendance) {
//         console.log(
//           `Attendance records already exist for ${employee.id} organization ${organizationId} on ${formattedDate}`
//         );
//       } else {
//         // Prepare attendance records
//         const employeeRecords = {
//           empAttendence: employee.id,
//           punch_in: null,
//           punch_out: null,
//           status: "Pending",
//           isLate: false,
//           location: null,
//           latitude: null,
//           longitude: null,
//           organizationId,
//           duration: null,
//           attendance_lop: null,
//           createdAt: attendanceDate,
//         };
//         attendanceRecords.push(employeeRecords);
//       }
//     }

//     // Bulk create attendance records
//     await Attendance.bulkCreate(attendanceRecords);
//     console.log(
//       `Auto-generated attendance for ${attendanceRecords.length} employees on ${formattedDate}`
//     );

//     return {
//       message: "Auto-attendance generated successfully",
//       data: attendanceRecords,
//     };
//   } catch (error) {
//     console.log("Error generating auto attendance", error);
//   }
// };
//controller for pending data

const CreateAutoAttendance = async (organizationId) => {
  console.log(organizationId, "organization id in auto create");
  try {
    const attendanceDate = moment.tz("Asia/Kolkata").startOf("day").toDate();
    console.log(attendanceDate, "attendanceDate");
    const formattedDate = moment(attendanceDate).format("YYYY-MM-DD");
    const currentYear = moment(attendanceDate).year();

    // Check if the attendance date is a Sunday
    const isSunday = moment(attendanceDate).day() === 0; // 0 represents Sunday
    if (isSunday) {
      console.log(
        `Skipping auto-attendance for organization ${organizationId} on ${formattedDate} (Sunday)`
      );
      return {
        message: `Auto-attendance skipped for ${formattedDate} (Sunday)`,
        data: [],
      };
    }

    // Fetch holidays for the organization for the current year
    const holidays = await getHolidaysByOrganizationId(
      organizationId,
      currentYear
    );
    const isHoliday = holidays.some((holiday) =>
      moment(holiday.date).isSame(attendanceDate, "day")
    );
    if (isHoliday) {
      const holiday = holidays.find((h) =>
        moment(h.date).isSame(attendanceDate, "day")
      );
      console.log(
        `Skipping auto-attendance for organization ${organizationId} on ${formattedDate} (Holiday: ${holiday.occation})`
      );
      return {
        message: `Auto-attendance skipped for ${formattedDate} (Holiday: ${holiday.occation})`,
        data: [],
      };
    }

    // Fetch all active employees for the organization
    const employeesToCreateAutoAtt = await Emp_onboarding.findAll({
      where: {
        orgnaizationId: organizationId, // Fixed typo: orgnaizationId -> organizationId
        isDelete: false,
      },
      attributes: ["id"],
    });

    if (!employeesToCreateAutoAtt.length) {
      console.log(
        `No active employees found for organization ${organizationId}`
      );
      return {
        message: `No active employees found for organization ${organizationId}`,
        data: [],
      };
    }
    // let whereClause = {};
    // Fetch all approved leaves (excluding WFH) for the attendance date

    const attendanceRecords = [];

    // Process each employee
    for (const employee of employeesToCreateAutoAtt) {
      // Check if the employee has an approved leave (excluding WFH)
      // if (employeesOnLeave.has(employee.id)) {
      //   console.log(
      //     `Skipping attendance for employee ${employee.id} on ${formattedDate} (Approved Leave)`
      //   );
      //   continue; // Skip this employee
      // }

      // Check for existing attendance records
      const existingAttendance = await Attendance.findOne({
        where: {
          empAttendence: employee.id, // Fixed typo: empAttendence -> empAttendance
          createdAt: {
            [Op.gte]: moment(formattedDate).startOf("day").toDate(),
            [Op.lte]: moment(formattedDate).endOf("day").toDate(),
          },
        },
      });

      if (existingAttendance) {
        console.log(
          `Attendance records already exist for employee ${employee.id} in organization ${organizationId} on ${formattedDate}`
        );
        continue; // Skip this employee
      }
      const formattedAttendanceDate = attendanceDate
        .toISOString()
        .split("T")[0]; // e.g., "2025-04-19"

      // const approvedLeaves = await LeavesCreation.findOne({
      //   where: {
      //     empOnboardingId: employee.id,
      //     organizationId,
      //     status: "Approved",
      //     leave_type: { [Op.ne]: "Work From Home" }, // Exclude WFH leaves
      //     // [Op.and]: [
      //     //   { from_date: { [Op.gte]: formattedAttendanceDate } },
      //     //   { to_date: { [Op.lte]: formattedAttendanceDate } },
      //     // ],
      //     // from_date: { [Op.gte]: "2025-04-19" },
      //     // to_date: { [Op.lte]: "2025-04-23" },
      //   },
      // });
      const startOfDay = new Date(attendanceDate);
      startOfDay.setUTCHours(0, 0, 0, 0); // Normalize to UTC midnight if DB stores in UTC

      // Check if the employee has an approved leave (excluding WFH) for the attendance date
      const approvedLeaves = await LeavesCreation.findOne({
        where: {
          empOnboardingId: employee.id,
          organizationId,
          status: "Approved",
          leave_type: { [Op.ne]: "Work From Home" },
          // Ensure attendanceDate is between from_date and to_date (inclusive)
          [Op.and]: [
            {
              from_date: {
                [Op.lte]: moment(formattedDate).endOf("day").toDate(),
              },
            },
            {
              to_date: {
                [Op.gte]: moment(formattedDate).startOf("day").toDate(),
              },
            },
          ],
        },
      });

      console.log(
        `Checking leave for employee ${employee.id} on ${formattedDate}: `,
        approvedLeaves
          ? {
              id: approvedLeaves.id,
              from_date: approvedLeaves.from_date,
              to_date: approvedLeaves.to_date,
              leave_type: approvedLeaves.leave_type,
              status: approvedLeaves.status,
            }
          : "No leave found"
      );

      if (approvedLeaves) {
        console.log(
          `leave records already exist for employee ${employee.id} in organization ${organizationId} on ${formattedDate}`
        );
        continue;
      }

      // Prepare attendance record
      const employeeRecords = {
        empAttendence: employee.id, // Fixed typo
        punch_in: null,
        punch_out: null,
        status: "Pending",
        isLate: false,
        location: null,
        latitude: null,
        longitude: null,
        organizationId,
        duration: null,
        attendance_lop: null,
        createdAt: attendanceDate,
      };
      attendanceRecords.push(employeeRecords);
    }

    // Bulk create attendance records
    if (attendanceRecords.length > 0) {
      await Attendance.bulkCreate(attendanceRecords);
      console.log(
        `Auto-generated attendance for ${attendanceRecords.length} employees on ${formattedDate}`
      );
    } else {
      console.log(
        `No attendance records created for organization ${organizationId} on ${formattedDate}`
      );
    }

    return {
      message: "Auto-attendance generated successfully",
      data: attendanceRecords,
    };
  } catch (error) {
    console.error("Error generating auto attendance:", error);
    throw error; // Rethrow to allow cron job to handle
  }
};

const getAutoCreatedAttendanceByOrgId = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id, "id in get auto");
    const {
      page = 0,
      pageSize = 10,
      year,
      month,
      date,
      search = "",
    } = req.query;

    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const yearInt = parseInt(year, 10) || new Date().getFullYear();
    const monthInt =
      parseInt(getMonthNumber(month), 10) || new Date().getMonth() + 1;
    const dateInt = date ? parseInt(date, 10) : null;
    console.log(dateInt, "date value in auto att");

    if (isNaN(pageInt) || isNaN(pageSizeInt)) {
      return res.status(400).json({ error: "Invalid page or pageSize" });
    }

    const offset = pageInt * pageSizeInt;

    // Build where condition for Attendance
    let whereCondition = {
      organizationId: id,
      status: "Pending",
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn(
            "DATE_PART",
            "year",
            Sequelize.col("Attendance.createdAt")
          ),
          yearInt
        ),
        Sequelize.where(
          Sequelize.fn(
            "DATE_PART",
            "month",
            Sequelize.col("Attendance.createdAt")
          ),
          monthInt
        ),
      ],
    };

    // Add date filter if provided
    if (dateInt && !isNaN(dateInt)) {
      whereCondition[Op.and].push(
        Sequelize.where(
          Sequelize.fn(
            "DATE_PART",
            "day",
            Sequelize.col("Attendance.createdAt")
          ),
          dateInt
        )
      );
    }

    // Build where clause for EmployeeDetails (search)
    let whereClause = {};
    console.log(search, "searchhhhhh query");
    if (search) {
      whereClause.emp_name = { [Op.iLike]: `%${search}%` };
    }

    // Count total records
    const totalAttendance = await Attendance.count({
      where: whereCondition,
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
          where: whereClause,
          required: true,
        },
      ],
    });

    // Fetch paginated records
    const autoAttendance = await Attendance.findAll({
      where: whereCondition,
      limit: pageSizeInt,
      offset: offset,
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
          attributes: ["emp_name", "department"],
          where: whereClause,
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log(
      autoAttendance.length,
      totalAttendance,
      "From Auto created attendance fetch"
    );
    res.status(200).json({ autoAttendance, totalAttendance });
  } catch (error) {
    console.error("Error fetching auto created attendance:", error.stack);
    res.status(500).json({ error: error.message });
  }
};

const updateAutoCreatedAttendanceById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    console.log(id, data, "id and data in update auto");

    const updateAutoAtt = await Attendance.findByPk(id);

    if (!updateAutoAtt) {
      return res
        .status(404)
        .json({ message: "auto created Attendance record not found" });
    }

    await Attendance.update(data, { where: { id } });
    const updateRecord = await Attendance.findByPk(id);

    res.status(200).json({
      message: "auto attendance status updated successfully",
      data: updateRecord,
    });
  } catch (error) {
    console.log(error, "Error updating auto created attednance by id");
    res.status(500).json({ error: error.message });
  }
};

const updateAutoCreatedAttendanceByOrgId = async (req, res) => {
  console.log(req.params, req.body, req.query, "request details");
  try {
    const { id: orgId } = req.params;
    const { ids, status } = req.body;
    const { year, month, date } = req.query;

    // Validate inputs
    if (!orgId || !status || !ids || !Array.isArray(ids)) {
      return res.status(400).json({
        message: "Invalid request: orgId, status, and ids array are required",
      });
    }

    // Build query
    const query = {
      organizationId: orgId,
      id: { [Op.in]: ids }, // Filter by provided IDs
      status: "Pending", // Only update Pending records
    };

    // Add date filter if provided
    if (year && month && date) {
      const startDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(date)
      );
      const endDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(date),
        23,
        59,
        59
      );
      query.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Update records
    const [updatedCount] = await Attendance.update(
      { status },
      { where: query }
    );

    if (updatedCount === 0) {
      return res.status(404).json({
        message: "No pending records found for the provided IDs and date",
      });
    }

    res.status(200).json({
      message: "Auto attendance updated successfully",
      updatedCount,
    });
  } catch (error) {
    console.error("Error updating auto attendance by org id:", error);
    res.status(500).json({
      message: "Failed to update auto attendance",
      error: error.message,
    });
  }
};

const getAutoAttendanceByOrgId = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id, "id in get auto");
    const {
      page = 0,
      pageSize = 10,
      year,
      month,
      date,
      search = "",
    } = req.query;

    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const yearInt = parseInt(year, 10) || new Date().getFullYear();
    const monthInt =
      parseInt(getMonthNumber(month), 10) || new Date().getMonth() + 1;
    const dateInt = date ? parseInt(date, 10) : null;
    console.log(dateInt, "date value in auto att");

    if (isNaN(pageInt) || isNaN(pageSizeInt)) {
      return res.status(400).json({ error: "Invalid page or pageSize" });
    }

    const offset = pageInt * pageSizeInt;

    // Build where condition for Attendance
    let whereCondition = {
      organizationId: id,
      status: "Full Day",
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn(
            "DATE_PART",
            "year",
            Sequelize.col("Attendance.createdAt")
          ),
          yearInt
        ),
        Sequelize.where(
          Sequelize.fn(
            "DATE_PART",
            "month",
            Sequelize.col("Attendance.createdAt")
          ),
          monthInt
        ),
      ],
    };

    // Add date filter if provided
    if (dateInt && !isNaN(dateInt)) {
      whereCondition[Op.and].push(
        Sequelize.where(
          Sequelize.fn(
            "DATE_PART",
            "day",
            Sequelize.col("Attendance.createdAt")
          ),
          dateInt
        )
      );
    }

    // Build where clause for EmployeeDetails (search)
    let whereClause = {};
    console.log(search, "searchhhhhh query of present");
    if (search) {
      whereClause.emp_name = { [Op.iLike]: `%${search}%` };
    }

    // Count total records
    const totalAttendance = await Attendance.count({
      where: whereCondition,
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
          where: whereClause,
          required: true,
        },
      ],
    });

    // Fetch paginated records
    const autoAttendance = await Attendance.findAll({
      where: whereCondition,
      limit: pageSizeInt,
      offset: offset,
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
          attributes: ["emp_name", "department"],
          where: whereClause,
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log(
      autoAttendance.length,
      totalAttendance,
      "From Auto created attendance fetch of present data"
    );
    res.status(200).json({ autoAttendance, totalAttendance });
  } catch (error) {
    console.log(
      error,
      "Error fetching auto attendance by organziation of present data"
    );
    res.status(500).json({ error: error.message });
  }
};

const getAbsentAutoAttendanceByOrgId = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 0,
      pageSize = 10,
      year,
      month,
      date,
      search = "",
    } = req.query;

    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const yearInt = parseInt(year, 10) || new Date().getFullYear();
    const monthInt =
      parseInt(getMonthNumber(month), 10) || new Date().getMonth() + 1;
    const dateInt = date ? parseInt(date, 10) : null;

    console.log("Query Parameters:", {
      id,
      pageInt,
      pageSizeInt,
      yearInt,
      monthInt,
      dateInt,
      search,
    });

    if (isNaN(pageInt) || isNaN(pageSizeInt)) {
      return res.status(400).json({ error: "Invalid page or pageSize" });
    }

    const offset = pageInt * pageSizeInt;

    // Fetch leaves
    let leavesWhereCondition = {
      organizationId: id,
      status: "Approved",
      leave_type: { [Op.ne]: "WFH" },
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("from_date")),
          yearInt
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("from_date")),
          monthInt
        ),
      ],
    };

    let leavesWhereClause = {};
    if (search) {
      leavesWhereClause.emp_name = { [Op.iLike]: `%${search}%` };
    }

    console.log("Leaves Where Conditions:", {
      leavesWhereCondition,
      leavesWhereClause,
    });

    const leaves = await LeavesCreation.findAll({
      where: leavesWhereCondition,
      include: [
        {
          model: Emp_Details,
          as: "LeaveCreation",
          where: leavesWhereClause,
          required: true,
          attributes: ["emp_name", "department"], // Include department
        },
      ],
      order: [["from_date", "DESC"]],
    });

    console.log("Leaves Fetched:", leaves.length);

    // Fetch absent attendance
    let attendanceWhereCondition = {
      organizationId: id,
      status: "Absent",
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn(
            "DATE_PART",
            "year",
            Sequelize.col("Attendance.createdAt")
          ),
          yearInt
        ),
        Sequelize.where(
          Sequelize.fn(
            "DATE_PART",
            "month",
            Sequelize.col("Attendance.createdAt")
          ),
          monthInt
        ),
      ],
    };

    if (dateInt && !isNaN(dateInt)) {
      attendanceWhereCondition[Op.and].push(
        Sequelize.where(
          Sequelize.fn(
            "DATE_PART",
            "day",
            Sequelize.col("Attendance.createdAt")
          ),
          dateInt
        )
      );
    }

    let attendanceWhereClause = {};
    if (search) {
      attendanceWhereClause.emp_name = { [Op.iLike]: `%${search}%` };
    }

    console.log("Attendance Where Conditions:", {
      attendanceWhereCondition,
      attendanceWhereClause,
    });

    const attendance = await Attendance.findAll({
      where: attendanceWhereCondition,
      include: [
        {
          model: Emp_onboarding,
          as: "EmployeeDetails",
          where: attendanceWhereClause,
          required: true,
          attributes: ["emp_name", "department"], // Include department
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log("Attendance Fetched:", attendance.length);

    // Merge and format data
    const mergedData = [];

    // Process leaves
    leaves.forEach((leave, index) => {
      mergedData.push({
        id: `leave-${leave.id || index}`, // Unique ID for leaves
        createdAt: leave.from_date, // Use from_date as createdAt
        // status: leave.status,
        EmployeeDetails: {
          emp_name: leave.LeaveCreation.emp_name,
          department: leave.LeaveCreation.department || "-",
        },
        fromDate: leave.from_date,
        toDate: leave.to_date,
        leaveType: leave.leave_type,
        reason: leave.reason,
        number_of_days: leave.number_of_days,
      });
    });

    // Process attendance
    attendance.forEach((record, index) => {
      mergedData.push({
        id: record.id || `attendance-${index}`, // Unique ID for attendance
        createdAt: record.createdAt,
        // status: record.status,
        EmployeeDetails: {
          emp_name: record.EmployeeDetails.emp_name,
          department: record.EmployeeDetails.department || "-",
        },
        fromDate: record.createdAt, // Set fromDate to createdAt
        toDate: record.createdAt, // Set toDate to createdAt
        leaveType: "-",
        reason: record.reason || "-",
        number_of_days: record.number_of_days || "-",
      });
    });

    // Sort by createdAt (descending)
    mergedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const totalRecords = mergedData.length;
    const paginatedData = mergedData.slice(offset, offset + pageSizeInt);

    console.log(
      { records: paginatedData.length, totalRecords },
      "Merged attendance and leaves"
    );

    res.status(200).json({ records: paginatedData, totalRecords });
  } catch (error) {
    console.log(error, "Error fetching absent auto created data");
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  punchIn,
  punchOut,
  getAttendenceById,
  getAttendenceData,
  getMonthlyAttendanceData,
  generateSalaryPayslip,
  generateSalaryPayslip,
  getMonthlyAttendanceData,
  // getAttendenceDataById
  updateAttences,
  getAttendenceDatabyOrganizationId,
  getRecentAttendenceById,
  getTodaysAttendancebyOrganization,
  getWeekAttendanceData,
  getWeeklyAttendenceOfOrganization,
  getLatePunchInByOrganization,
  updateLateAttendance,
  getAllAttendanceByOrganization,
  getAttendenceByYear,
  exportAttendanceData,
  CreateAutoAttendance,
  getAutoCreatedAttendanceByOrgId,
  updateAutoCreatedAttendanceById,
  updateAutoCreatedAttendanceByOrgId,
  getAutoAttendanceByOrgId,
  getAbsentAutoAttendanceByOrgId,
};
