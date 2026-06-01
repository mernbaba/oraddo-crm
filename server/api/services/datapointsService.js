const Datapoints = require("../models/Datapoints");

// Create a new datapoint
const createDatapoint = async (data) => {
  try {
    const datapoint = await Datapoints.create(data);
    return datapoint;
  } catch (error) {
    throw new Error("Error creating datapoint. Please try again.");
  }
};

// Retrieve all datapoints
const getAllDatapoints = async () => {
  try {
    console.log("jdhfjdfhudfh");
    const datapoints = await Datapoints.findAll();
    console.log("datatata", datapoints);
    return datapoints;
  } catch (error) {
    throw new Error("Error fetching datapoints. Please try again.");
  }
};

// Retrieve a datapoint by ID
const getDatapointById = async (id) => {
  try {
    const datapoint = await Datapoints.findByPk(id);
    if (!datapoint) throw new Error("Datapoint not found");
    return datapoint;
  } catch (error) {
    throw new Error(`Error fetching datapoint with ID ${id}`);
  }
};

// Update a datapoint
// const updateDatapoint = async (ids, data) => {
//   try {
//     console.log("idssssbodysss", ids, data);
//     const existingData = await getAllDatapoints();
//     const datapoints = existingData[0];
//     const resetData = {};
//     if (datapoints && datapoints.dataValues) {
//       Object.keys(datapoints.dataValues).forEach((field)=>{
//         if (field.includes('status')) {
//           resetData[field] = 'false';
//         }
//       });
//       const updatedata = await Datapoints.update(resetData, {where:{}});
//       console.log("Status fields reset for all records:",updatedata);
//       const updatedDatapoint = await Datapoints.update(data, { where: { id: ids} });
//       if (updatedDatapoint[0] === 0) throw new Error('Datapoint not found or no changes made');
//       return updatedDatapoint;
//     } else {
//       throw new error('Datapoint or dataValues not found')
//     }
//   } catch (error) {
//     throw new Error(`Error updating datapoint with ID ${id}`);
//   }
// };

// const updateDatapoint = async (ids, data) => {
//   try {
//     console.log("Received IDs and data:", ids, data);

//     // Step 1: Reset `status` and `order` fields for all records
//     const resetData = { status: 'false', order: null };
//     const resetResult = await Datapoints.update(resetData, { where: {} });
//     console.log("Status and order fields reset for all records:", resetResult);

//     // Step 2: Sequentially update specified records
//     for (let i = 0; i < ids.length; i++) {
//       const id = ids[i];
//       const specificData = {
//         status: 'true',
//         order: data.order[i] !== undefined ? data.order[i] : null,
//       };

//       console.log(`Updating record with ID ${id}:`, specificData);

//       // Run update with individual logging
//       try {
//         const updateResult = await Datapoints.update(specificData, { where: { id: id } });
//         console.log(`Update result for ID ${id}:`, updateResult);

//         if (updateResult[0] === 0) {
//           console.warn(`Warning: Datapoint with ID ${id} not found or no changes made.`);
//         }
//       } catch (updateError) {
//         console.error(`Error updating record with ID ${id}:`, updateError.message);
//       }
//     }

//     console.log("All specified records attempted.");
//     return "Update completed.";
//   } catch (error) {
//     console.error(`Error updating datapoint: ${error.message}`);
//     throw new Error(`Error updating datapoint: ${error.message}`);
//   }
// };

const updateDatapoint = async (ids, data) => {
  try {
    console.log("Received IDs and data:", ids, data);
// Step 1: Set `status` to false for all records
await Datapoints.update({ status: false }, { where: {} });

// Step 2: Set `status` to true only for specified IDs
if (ids && ids.length > 0) {
  const statusData = { status: true };
  const statusResult = await Datapoints.update(statusData, { where: { id: ids } });
  console.log("Status field updated to true for specified records:", statusResult);
  
  // Optionally fetch and log updated records to verify the status field
  const updatedRecords = await Datapoints.findAll({ where: { id: ids } });
  console.log("Updated records with status true:", updatedRecords);
}

    // Step 2: Update `isrequired` based on `data.isrequired`, updating only specific IDs without affecting others
    if (data.isrequired && data.isrequired.length > 0) {
      for (const { id, checked } of data.isrequired) {
        try {
          const updateResult = await Datapoints.update({ isrequired: checked }, { where: { id } });
          console.log(`Updated isrequired for ID ${id} to ${checked}:`, updateResult);

          if (updateResult[0] === 0) {
            console.warn(`Warning: Datapoint with ID ${id} not found or no changes made.`);
          }
        } catch (updateError) {
          console.error(`Error updating isrequired for ID ${id}:`, updateError.message);
        }
      }
    }
    await Datapoints.update({ order: null }, { where: {} });
    if (data.order && data.order.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const orderValue = data.order[i];

        await Datapoints.update({ order: orderValue }, { where: { id } });
        console.log(`Updated order for ID ${id} to ${orderValue}`);
      }
    }

    console.log("All specified records attempted.");
    return "Update completed.";
  } catch (error) {
    console.error(`Error updating datapoint: ${error.message}`);
    throw new Error(`Error updating datapoint: ${error.message}`);
  }
};


// const updateDatapoint = async (ids, data, phase) => {
//   try {
//     console.log("Received IDs, data, and phase:", ids, data, phase);

//     const isRequiredMap = new Map(
//       data.isrequired.map((item) => [item.id, item.checked])
//     );

//     for (let i = 0; i < ids.length; i++) {
//       const id = ids[i];
//       const specificData = {};
//       const isChecked = isRequiredMap.get(id);

//       if (isChecked !== undefined) {
//         specificData.isrequired = isChecked;

//         // Set `status` as a boolean value based on phase or other criteria
//         if (phase === "initial") {
//           specificData.status = isChecked; // Set `status` to match `isrequired`
//         } else if (phase === "final") {
//           specificData.status = true; // Assume final phase means completion (true)
//         } else {
//           specificData.status = false; // Default to false if not final or initial
//         }
//       }

//       if (data.order[i] !== undefined) {
//         specificData.order = data.order[i];
//         console.log(`Order value for ID ${id} set to:`, data.order[i]);
//       } else {
//         console.warn(`Order value for ID ${id} is missing or undefined.`);
//       }

//       console.log(`Updating record with ID ${id}:`, specificData);

//       try {
//         const updateResult = await Datapoints.update(specificData, {
//           where: { id: id },
//         });
//         console.log(`Update result for ID ${id}:`, updateResult);

//         if (updateResult[0] === 0) {
//           console.warn(
//             `Warning: Datapoint with ID ${id} not found or no changes made.`
//           );
//         }
//       } catch (updateError) {
//         console.error(
//           `Error updating record with ID ${id}:`,
//           updateError.message
//         );
//       }
//     }

//     console.log("All specified records attempted.");
//     return "Update completed.";
//   } catch (error) {
//     console.error(`Error updating datapoint: ${error.message}`);
//     throw new Error(`Error updating datapoint: ${error.message}`);
//   }
// };

// Delete a datapoint
const deleteDatapoint = async (id) => {
  try {
    const rowsDeleted = await Datapoints.destroy({ where: { id } });
    if (rowsDeleted === 0) throw new Error("Datapoint not found");
  } catch (error) {
    throw new Error(`Error deleting datapoint with ID ${id}`);
  }
};

module.exports = {
  createDatapoint,
  getAllDatapoints,
  getDatapointById,
  updateDatapoint,
  deleteDatapoint,
};
