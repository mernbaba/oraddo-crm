const MarketingStrategies = require("../models/marketingStrategies");

const createStrategy = async (data) => {
  try {
    const strategy = await MarketingStrategies.create(data);
    return strategy;
  } catch (error) {
    throw error;
  }
};

const getStrategies = async () => {
  try {
    const strategies = await MarketingStrategies.findAll();
    return strategies;
  } catch (error) {
    throw error;
  }
};

const getStrategiesbyorganization = async (id, page, pageSize) => {

  try {
    const offset = page * pageSize
    const totalStrategies = await MarketingStrategies.count({ where: { organizationID: id } });

    const strategy = await MarketingStrategies.findAll({
      where: { organizationID: id },
      offset: offset,
      limit: pageSize,
      order: [['date', 'DESC']],
    });

    console.log(MarketingStrategies, "MarketingStrategiessssss");
    return { strategy, totalStrategies };
  } catch (error) {
    console.log(error, "Strategy not found");
    throw new error("Strategy not found");
  }
};

const getStrategyById = async (id) => {
  try {
    const strategy = await MarketingStrategies.findByPk(id);
    if (!strategy) {
      throw new Error("Strategy not found");
    }
    return strategy;
  } catch (error) {
    throw error;
  }
};

const updateStrategy = async (id, data) => {
  try {
    const [updated] = await MarketingStrategies.update(data, {
      where: { id: id },
    });
    if (!updated) {
      throw new Error("Strategy not found");
    }
    const updatedStrategy = await MarketingStrategies.findByPk(id);
    return updatedStrategy;
  } catch (error) {
    throw error;
  }
};

const deleteStrategy = async (id) => {
  try {
    const deleted = await MarketingStrategies.destroy({
      where: { id: id },
    });
    if (!deleted) {
      throw new Error("Strategy not found");
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createStrategy,
  getStrategies,
  getStrategyById,
  updateStrategy,
  deleteStrategy,
  getStrategiesbyorganization
};
