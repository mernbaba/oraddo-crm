const Report_Submission = require('../models/report_submission');
const Emp_Details = require('../models/Emp_onboarding');
const { Op, Sequelize } = require('sequelize');
const createReport = async (data) => {
  try {
    const report = await Report_Submission.create(data);
    return report;
  } catch (error) {
    throw error;
  }
};

const getReports = async () => {
  try {
    const reports = await Report_Submission.findAll({
      include: [
        {
          model: Emp_Details,
          as: 'reportSubmission',
        }
      ]
    });
    return reports;
  } catch (error) {
    throw error;
  }
};

const getMonthNumber = (monthName) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.indexOf(monthName) + 1; // Months are 1-based in SQL
};

const getReportsByOrgId = async (id, page, pageSize, search, year, monthName) => {

  try {
    const offset = page * pageSize

    const month = parseInt(getMonthNumber(monthName), 10);

    let empWhereCondition = {};
    let whereCondition = { organizationID: id };

    if (year && month !== undefined) {
      whereCondition[Op.and] = [
        Sequelize.where(Sequelize.fn("DATE_PART", "year", Sequelize.col("date")), year),
        Sequelize.where(Sequelize.fn("DATE_PART", "month", Sequelize.col("date")), month),
      ];
    } else if (year) {
      whereCondition.date = Sequelize.where(
        Sequelize.fn("DATE_PART", "year", Sequelize.col("date")),
        year
      );
    } else if (month !== undefined) {
      whereCondition.date = Sequelize.where(
        Sequelize.fn("DATE_PART", "month", Sequelize.col("date")),
        month
      );
    }

    if (search) {
      empWhereCondition.emp_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }


    const reportCount = await Report_Submission.count({
      where: whereCondition,
      // offset: offset,
      // limit: pageSize,
      include: [
        {
          model: Emp_Details,
          as: 'reportSubmission',
          where: empWhereCondition
        }
      ]
    })

    const reports = await Report_Submission.findAll({
      where: whereCondition,
      offset: offset,
      limit: pageSize,
      order: [['date', 'DESC']],
      include: [
        {
          model: Emp_Details,
          as: 'reportSubmission',
          attributes: ['emp_name', 'id'],
          where: empWhereCondition
        }
      ]
    });
    console.log(reports, "form reportsss")
    return { reports, reportCount };
  } catch (error) {
    throw error;
  }
}

const getReportById = async (id, page, pageSize) => {
  // console.log("kkklllllllllll",id)

  try {
    const offset = page * pageSize;
    const reportCount = await Report_Submission.count({ where: { empOnboardingId: id } });
    const report = await Report_Submission.findAll({ where: { empOnboardingId: id }, limit: pageSize, offset: offset, order: [['date', 'DESC']] });
    return { report, reportCount };
  } catch (error) {
    throw error;
  }
};

const updateReport = async (id, data) => {
  try {
    const report = await Report_Submission.update(data, {
      where: { id: id },
    });
    return report;
  } catch (error) {
    throw error;
  }
};

const deleteReport = async (id) => {
  try {
    await Report_Submission.destroy({
      where: { id: id },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createReport,
  getReports,
  getReportsByOrgId,
  getReportById,
  updateReport,
  deleteReport,
};
