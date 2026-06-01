const Module = require('../models/trainingModule')
const Emp_Details = require("../models/Emp_onboarding");
const Lesson = require("../models/lessionsModule")
const TraineeLessonStatus = require("../models/moduleTraineLessionStatus")

async function createModuleWithLessons(data) {
  const { name, description, traineeIds, lessons, team_lead, organizationID } = data;

  const module = await Module.create({ name, description, team_lead , organizationID});

  let trainees = [];
  if (traineeIds && traineeIds.length > 0) {
    trainees = await Emp_Details.findAll({ where: { id: traineeIds } });
    await module.addTrainees(trainees);
  }

  const createdLessons = await Promise.all(
    lessons.map((lesson) =>
      Lesson.create({
        moduleId: module.id,
        title: lesson.title,
        lesson_description: lesson.lesson_description,
        reward_points: lesson.reward_points,
        organizationID:lesson.organizationID,
      })
    )
  );

  const traineeLessonStatusPromises = [];
  for (const lesson of createdLessons) {
    for (const trainee of trainees) {
      traineeLessonStatusPromises.push(
        TraineeLessonStatus.create({
          lessonId: lesson.id,
          traineeId: trainee.id,
          status: 'pending',
        })
      );
    }
  }
  await Promise.all(traineeLessonStatusPromises);

  return { module, lessons: createdLessons };
}


const getModuleWithLessons = async (req, res) => {
  try {
    // const { moduleId } = req.params;

    // Fetch module with lessons
    const module = await Module.findAll({
      // where: { id: moduleId },
      include: [
        {
          model: Lesson,
          as: "lessons",
          include: [
            {
              model: TraineeLessonStatus,
              as: "statuses",
              include: [
                {
                  model: Emp_Details,
                  attributes: ["id", "emp_name", "image_URL"], // Trainee information
                },
              ],
              attributes: ["status", "traineeId", "lessonId"], // Lesson status
            },
          ],
        },
      ],
    });

    if (!module) {
      return res.status(404).json({ error: "Module not found." });
    }

    res.status(200).json(module);
  } catch (error) {
    console.error("Error fetching module with lessons:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getModuleByOrgId = async (req, res) => {
  try {
    const { id } = req.params; // Ensure you extract 'id' from the correct source.
    console.log("Organization ID:", id);
    const module = await Module.findAll({
      where: { organizationID: id },
      include: [
        {
          model: Lesson,
          as: "lessons",
          include: [
            {
              model: TraineeLessonStatus,
              as: "statuses",
              include: [
                {
                  model: Emp_Details,
                  attributes: ["id", "emp_name", "image_URL"],
                },
              ],
            },
          ],
        },
      ],
    });
    res.status(200).json(module);
  } catch (error) {
    console.error("Error fetching module by organization ID:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


async function updateLessonStatus(traineeId, lessonId, status) {
  if (!['pending', 'running', 'completed'].includes(status)) {
    throw new Error('Invalid status value.');
  }

  const traineeLessonStatus = await TraineeLessonStatus.findOne({
    where: { traineeId, lessonId },
  });

  if (!traineeLessonStatus) {
    throw new Error('Trainee lesson status not found.');
  }

  traineeLessonStatus.status = status;
  await traineeLessonStatus.save();

  return traineeLessonStatus;
}

// module.exports = { updateLessonStatus };



// const assignTraineeAndUpdateLessons = async (req, res) => {
//   try {
//     const { moduleId } = req.params; // Module ID from URL
//     const { traineeId, newLessons } = req.body; // Trainee ID and new lessons from request body

//     // Check if the module exists
//     const module = await Module.findByPk(moduleId);
//     if (!module) {
//       return res.status(404).json({ error: "Module not found" });
//     }

//     let responseMessage = {};
//     let lessons;

//     // Handle trainee assignment
//     if (traineeId) {
//       // Check if the trainee exists
//       const trainee = await Emp_Details.findByPk(traineeId);
//       if (!trainee) {
//         return res.status(404).json({ error: "Trainee not found" });
//       }

//       // Get all lessons in the module
//       lessons = await Lesson.findAll({ where: { moduleId } });

//       // Check existing assignments
//       const existingAssignments = await TraineeLessonStatus.findAll({
//         where: { traineeId, lessonId: lessons.map((l) => l.id) },
//       });

//       const existingLessonIds = existingAssignments.map((ta) => ta.lessonId);

//       // Filter lessons not already assigned
//       const unassignedLessons = lessons.filter(
//         (lesson) => !existingLessonIds.includes(lesson.id)
//       );

//       // Assign the unassigned lessons to the trainee
//       const newAssignments = unassignedLessons.map((lesson) => ({
//         traineeId,
//         lessonId: lesson.id,
//         status: "pending", // Default status
//       }));

//       await TraineeLessonStatus.bulkCreate(newAssignments);

//       responseMessage.traineeAssignment = {
//         message: "Trainee successfully assigned to module lessons",
//         traineeId,
//         moduleId,
//         newAssignments,
//       };
//     }

//     // Handle adding new lessons
//     if (newLessons && newLessons.length > 0) {
//       // Add the new lessons to the module
//       const createdLessons = await Lesson.bulkCreate(
//         newLessons.map((lesson) => ({
//           ...lesson,
//           moduleId,
//         }))
//       );

//       // Get all trainees assigned to this module
//       const assignedTrainees = await TraineeLessonStatus.findAll({
//         where: { lessonId: lessons.map((l) => l.id) },
//         attributes: ["traineeId"],
//         group: ["traineeId"],
//       });

//       const traineeIds = assignedTrainees.map((t) => t.traineeId);

//       // Assign the new lessons to all existing trainees
//       const newTraineeLessonAssignments = [];
//       createdLessons.forEach((lesson) => {
//         traineeIds.forEach((traineeId) => {
//           newTraineeLessonAssignments.push({
//             traineeId,
//             lessonId: lesson.id,
//             status: "pending",
//           });
//         });
//       });

//       await TraineeLessonStatus.bulkCreate(newTraineeLessonAssignments);

//       responseMessage.newLessonAddition = {
//         message: "New lessons added and assigned to all module trainees",
//         newLessons: createdLessons,
//         newAssignments: newTraineeLessonAssignments,
//       };
//     }

//     // Send a combined response
//     res.status(201).json(responseMessage);
//   } catch (error) {
//     console.error("Error assigning trainee or adding lessons:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


const assignTraineeAndUpdateLessons = async (req, res) => {
  try {
    const { moduleId } = req.params; // Module ID from URL
    const { traineeIds, newLessons } = req.body; // Array of trainee IDs and new lessons from request body

    // Check if the module exists
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    let responseMessage = {};
    const lessons = await Lesson.findAll({ where: { moduleId } });

    // Handle multiple trainee assignments
    if (traineeIds && traineeIds?.length > 0) {
      // Check if all trainees exist
      const trainees = await Emp_Details.findAll({
        where: { id: traineeIds },
      });
      const existingTraineeIds = trainees.map((trainee) => trainee.id);
      const missingTrainees = traineeIds.filter(
        (id) => !existingTraineeIds.includes(id)
      );

      if (missingTrainees.length > 0) {
        return res.status(404).json({
          error: "Some trainees not found",
          missingTrainees,
        });
      }

      // Get all lessons in the module
      

      // Assign lessons to each trainee
      const newAssignments = [];
      for (const traineeId of traineeIds) {
        const existingAssignments = await TraineeLessonStatus.findAll({
          where: { traineeId, lessonId: lessons?.map((l) => l.id) },
        });

        const existingLessonIds = existingAssignments?.map(
          (assignment) => assignment.lessonId
        );

        const unassignedLessons = lessons?.filter(
          (lesson) => !existingLessonIds.includes(lesson.id)
        );

        const traineeAssignments = unassignedLessons?.map((lesson) => ({
          traineeId,
          lessonId: lesson.id,
          status: "pending", // Default status
        }));

        newAssignments.push(...traineeAssignments);
      }

      // Bulk create all new assignments
      await TraineeLessonStatus.bulkCreate(newAssignments);

      responseMessage.traineeAssignment = {
        message: "Trainees successfully assigned to module lessons",
        traineeIds,
        moduleId,
        newAssignments,
      };
    }

    // Handle adding new lessons
    if (newLessons && newLessons.length > 0) {
      // Add the new lessons to the module
      console.log(newLessons, "frommmmmmmmmm")
      const createdLessons = await Lesson.bulkCreate(
        newLessons?.map((lesson) => ({
          ...lesson,
          moduleId,
        }))
      );
      console.log(createdLessons, "createdLessons")
      // Get all trainees assigned to this module
      const assignedTrainees = await TraineeLessonStatus.findAll({
        where: { lessonId: lessons.map((l) => l.id) },
        attributes: ["traineeId"],
        group: ["traineeId"],
      });
      console.log(assignedTrainees, "assignedTrainees")
      const traineeIds = assignedTrainees?.map((t) => t.traineeId);
      console.log(traineeIds, "traineeIds")
      // Assign the new lessons to all existing trainees
      const newTraineeLessonAssignments = [];
      createdLessons.forEach((lesson) => {
        traineeIds.forEach((traineeId) => {
          newTraineeLessonAssignments.push({
            traineeId,
            lessonId: lesson.id,
            status: "pending",
          });
        });
      });

      await TraineeLessonStatus.bulkCreate(newTraineeLessonAssignments);

      responseMessage.newLessonAddition = {
        message: "New lessons added and assigned to all module trainees",
        newLessons: createdLessons,
        newAssignments: newTraineeLessonAssignments,
      };
    }

    // Send a combined response
    res.status(201).json(responseMessage);
  } catch (error) {
    console.error("Error assigning trainees or adding lessons:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};









module.exports = { createModuleWithLessons, getModuleWithLessons, getModuleByOrgId, updateLessonStatus,assignTraineeAndUpdateLessons };