const { Sequelize, Op } = require("sequelize");
const ManagementCreation = require("../models/LeadManagementCreation");

const createManagement = async (data) => {
  try {
    const management = await ManagementCreation.create(data);
    return management;
  } catch (error) {
    throw error;
  }
};

const getManagements = async () => {
  try {
    const managements = await ManagementCreation.findAll();
    return managements;
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

const getManagementsByOrgId = async (id, page, pageSize, year, monthName) => {
  console.log(id, monthName, year, "monthyearid");
  try {
    const offset = page * pageSize;

    const month = parseInt(getMonthNumber(monthName), 10);
    console.log(month, "monethhhhhhhhhhhhhhh");

    const whereClause = { organizationID: id };
    console.log(whereClause, "whereClauseee");
    if (year && month !== undefined) {
      whereClause[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("createdAt")),
          year
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("createdAt")),
          month
        ),
      ];
    } else if (year) {
      whereClause.createdAt = Sequelize.where(
        Sequelize.fn("DATE_PART", "year", Sequelize.col("createdAt")),
        year
      );
    } else if (month !== undefined) {
      whereClause.createdAt = Sequelize.where(
        Sequelize.fn("DATE_PART", "month", Sequelize.col("createdAt")),
        month
      );
    }
    console.log(whereClause, "whereClauseeedooooo");
    const totalLeads = await ManagementCreation.count({
      where: whereClause ,
    });

    const managements = await ManagementCreation.findAll({
      where: whereClause,
      offset: offset,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
    });
    return { managements, totalLeads };
  } catch (error) {
    throw error;
  }
};

const getManagementById = async (id) => {
  try {
    const management = await ManagementCreation.findByPk(id);
    return management;
  } catch (error) {
    throw error;
  }
};

const updateManagement = async (id, data) => {
  try {
    const management = await ManagementCreation.update(data, {
      where: { id: id },
    });
    return management;
  } catch (error) {
    throw error;
  }
};

const deleteManagement = async (id) => {
  try {
    await ManagementCreation.destroy({
      where: { id: id },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createManagement,
  getManagements,
  getManagementsByOrgId,
  getManagementById,
  updateManagement,
  deleteManagement,
};
