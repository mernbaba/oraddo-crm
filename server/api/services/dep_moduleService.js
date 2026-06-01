const Module = require('../models/Modules');
const Department = require('../models/Department');

const createDepModule = async (data) => {
  try {
    const depModule = await Module.create(data);
    return depModule;
  } catch (error) {
    throw error;
  }
};

const createModulesBulk = async (data) => {
    try {
      const depModules = await Module.bulkCreate(data);
      return depModules;
    } catch (error) {
      throw error;
    }
  };
  

const getModules = async () => {
  try {
    const depModules = await Module.findAll({
        include:[
            {
                module: Department,
                as: 'Dep_modules'
            }
        ]
    });
    return depModules;
  } catch (error) {
    throw error;
  }
};

const getModuleById = async (id) => {
  try {
    const depModule = await Module.findByPk(id);
    return depModule;
  } catch (error) {
    throw error;
  }
};

const updateDepModule = async (id, data) => {
  try {
    const depModule = await Module.update(data, {
      where: { id: id }
    });
    return depModule;
  } catch (error) {
    throw error;
  }
};

const deleteDepModule = async (id) => {
  try {
    await Module.destroy({
      where: { id: id }
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createDepModule,
  getModules,
  getModuleById,
  updateDepModule,
  deleteDepModule,
  createModulesBulk
};
