const marketingStrategiesService = require("../services/marketingStrategiesServices");

const createStrategy = async (req, res) => {
  try {
    const strategyData = req.body;
    const newStrategy = await marketingStrategiesService.createStrategy(
      strategyData
    );
    res.status(201).json(newStrategy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStrategies = async (req, res) => {
  try {
    const strategies = await marketingStrategiesService.getStrategies();
    res.status(200).json(strategies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStrategiesByOrganization = async (req, res) => {
  try {
    const id = req.params.id;
    const { page = 0, pageSize = 10 } = req.query;
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const strategies =
      await marketingStrategiesService.getStrategiesbyorganization(
        id,
        pageInt,
        pageSizeInt
      );
    if (strategies) {
      res.status(200).json(strategies);
    } else {
      res.status(404).json({ message: "Strategies not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStrategyById = async (req, res) => {
  try {
    const id = req.params.id;
    const strategy = await marketingStrategiesService.getStrategyById(id);
    res.status(200).json(strategy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStrategy = async (req, res) => {
  try {
    const id = req.params.id;
    const strategyData = req.body;
    const updatedStrategy = await marketingStrategiesService.updateStrategy(
      id,
      strategyData
    );
    res.status(200).json(updatedStrategy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStrategy = async (req, res) => {
  try {
    const id = req.params.id;
    await marketingStrategiesService.deleteStrategy(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createStrategy,
  getStrategies,
  getStrategyById,
  updateStrategy,
  deleteStrategy,
  getStrategiesByOrganization
};
