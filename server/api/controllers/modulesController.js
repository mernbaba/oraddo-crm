const depModulesService = require('../services/dep_moduleService');

const createModule = async (req, res) => {
  try {
    const depModule = await depModulesService.createDepModule(req.body);
    res.status(201).json(depModule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createModulesBulk = async (req, res) => {
    try {
      const depModules = await depModulesService.createModulesBulk(req.body);
      res.status(201).json(depModules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  

const getModules = async (req, res) => {
  try {
    const depModules = await depModulesService.getModules();
    res.status(200).json(depModules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getModuleById = async (req, res) => {
  try {
    const depModule = await depModulesService.getModuleById(req.params.id);
    if (depModule) {
      res.status(200).json(depModule);
    } else {
      res.status(404).json({ message: 'DepModule not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateModule = async (req, res) => {
  try {
    const depModule = await depModulesService.updateDepModule(req.params.id, req.body);
    res.status(200).json(depModule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteModule = async (req, res) => {
  try {
    await depModulesService.deleteDepModule(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createModule,
  getModules,
  getModuleById,
  updateModule,
  deleteModule,
  createModulesBulk
};
