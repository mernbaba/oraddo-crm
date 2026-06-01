const Emp_onboarding = require('../models/Emp_onboarding');
const Sprints = require('../models/projectSprints');

const createSprint = async (data) => {
  try {
    const sprint = await Sprints.create(data);
    return sprint;
  } catch (error) {
    throw error;
  }
};

const getSprints = async () => {
  try {
    const sprints = await Sprints.findAll({
      include: [
        {
          model: Emp_onboarding,
          as: 'SprintsCreation', // Ensure alias matches the association
        }
      ],
    });
    return sprints;
  } catch (error) {
    console.error('Error fetching sprints:', error.message); // Log error
    throw error; // Rethrow error for the calling function to handle
  }
};



const getSprintById = async (id) => {
  try {
    const sprint = await Sprints.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
          as: 'SprintsCreation', // Include associated data
        },
      ],
    });
    if (!sprint) {
      throw new Error('Sprint not found');
    }
    return sprint;
  } catch (error) {
    console.error('Error fetching sprint by ID:', error.message); // Log error
    throw error;
  }
};


// const updateSprint = async (id, data) => {
//   try {
//     const [updated] = await Sprints.update(data, {
//       where: { id: id }
//     });
//     if (!updated) {
//       throw new Error('Sprint not found');
//     }
//     const updatedSprint = await Sprints.findByPk(id);
//     return updatedSprint;
//   } catch (error) {
//     throw error;
//   }
// };


const updateSprint = async (id, data) => {
  try {
    // Attempt to update the sprint
    const [updated] = await Sprints.update(data, {
      where: { id },
    });

    if (!updated) {
      throw new Error(`Sprint with ID ${id} not found or no changes were made.`);
    }

    // Fetch the updated sprint with associated data (if any)
    const updatedSprint = await Sprints.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
          as: 'SprintsCreation', // Ensure alias matches the association
        },
      ],
    });

    return updatedSprint; // Return the updated sprint
  } catch (error) {
    console.error('Error updating sprint:', error.message); // Log error
    throw error; // Rethrow error for the calling function to handle
  }
};




const deleteSprint = async (id) => {
  try {
    const deleted = await Sprints.destroy({
      where: { id: id }
    });
    if (!deleted) {
      throw new Error('Sprint not found');
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createSprint,
  getSprints,
  getSprintById,
  updateSprint,
  deleteSprint
};
