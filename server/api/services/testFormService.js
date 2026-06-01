const testFormModel = require("../models/testFormName");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const testCandidate = require("../models/testCandidate");
const questionModel = require("../models/questionsModel");
const CandidateQuestions = require("../models/candidateQuestions");
const figmaAssetsImages = require("../models/assetsImageModel");
const figmaImages = require("../models/imagesModel");
const { Op } = require("sequelize");


require("dotenv").config(); // Load env variables
const JWT_SECRET = process.env.JWT_SECRET;


const assignRandomQuestions = async (CandidateDetailId, jobType, numQuestions = 30) => {
  try {
    const allQuestions = await questionModel.findAll({
      where: { question_type: jobType },
      attributes: ["id"]
    });

    if (allQuestions.length === 0) throw new Error(`No ${jobType} questions available.`);

    // Shuffle and select 30 random questions
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, numQuestions).map((q) => q.id);

    // Store assigned questions in many-to-many table
    const assignments = selectedQuestions.map((QuestionsTableId) => ({
      CandidateDetailId,
      QuestionsTableId,
    }));

    await CandidateQuestions.bulkCreate(assignments);
    return selectedQuestions;
  } catch (error) {
    console.error("Error assigning random questions:", error);
    throw error;
  }
};


const createCandidate = async (data) => {
  try {
    if (!data.email_address) {
      throw new Error("Email address is required");
    }
    // Hash the email (Use password hashing if needed instead)
    const hashedPassword = await bcrypt.hash(data.email_address, 10);
    data.hashed_password = hashedPassword;
    // Create candidate in the database
    const candidate = await testFormModel.create(data);
    if (!candidate || !candidate.id) {
      throw new Error("Candidate creation failed");
    }
    // Assign random questions
    // const assignedQuestions = await assignRandomQuestions(candidate.id);
    const assignedQuestions = await assignRandomQuestions(candidate.id, data.job_type);
    const token = jwt.sign(
      { id: candidate.id, email: data.email_address },
      JWT_SECRET,
    );

    return { candidate, assignedQuestions, token };
  } catch (error) {
    console.error("Error creating candidate:", error);
    throw error;
  }
};


const getCandidateWithQuestions = async (CandidateDetailId) => {
  try {
    const candidate = await testFormModel.findByPk(CandidateDetailId, {
      include: {
        model: questionModel,
        through: { attributes: [] }, // Exclude join table fields
      },
    });

    if (!candidate) throw new Error("Candidate not found.");
    const token = jwt.sign(
      { id: candidate.id, email: candidate.email_address },
      JWT_SECRET,
    );
    // return candidate;
    return { candidate };
  } catch (error) {
    console.error("Error fetching candidate:", error);
    throw error;
  }
};
// const createCandidate = async (data) => {
//   try {
//     const candidate = await testFormModel.create(data);
//     return candidate;
//   } catch (error) {
//     console.log(error, "creation error");
//     throw new Error("Error creating. Please try again.");
//   }
// };

const getCandidates = async () => {
  try {
    const candidate = await testFormModel.findAll({
      include:[
        {
          model:figmaAssetsImages,
          as:"figmaTask"

        }
      ]
    });
    return candidate;
  } catch (error) {
    console.log(error, "errorrrrr");
    throw new Error("Error fetching. Please try again.");
  }
};

const getCandidatesById = async (id) => {
  try {
    const candidate = await testFormModel.findByPk(id,{
      include: [
        {
          model: figmaAssetsImages, // Main image (AssetsImagesModel)
          as: "figmaTask",
          include: [
            {
              model: figmaImages, // Nested under images (mainImages)
              as: "assetsImage",
            },
          ],
        },
      ],
    });
    return candidate;
  } catch (error) {
    console.log(error, "errrorrrr");
    throw new Error("error getting");
  }
};

// const updateMarks = async (id, data) => {
//   try {
//     if (data.marks <= 10) {
//       data.status = "DisQualified";
//       const candidate = await testFormModel.update(data, {
//         where: { id: id },
//       });
//       return candidate;
//     } else {
//       const alltasks = await figmaAssetsImages.findAll();

//       if (alltasks.length > 0) {
//         // Select a random task
//         const randomTask = alltasks[Math.floor(Math.random() * alltasks.length)];
//         data.taskId = randomTask.id; // Assign the random task ID
//       }

//       data.status = "Qualified";

//       // Update the candidate with the assigned taskId
//       const candidate = await testFormModel.update(data, {
//         where: { id: id },
//       });

//       return candidate;
//     }
//   } catch (error) {
//     console.error("Error updating marks:", error);
//   }
// };



const updateMarks = async (id, data) => {
  try {
    const student = await testFormModel.findOne({ where: { id } });

    if (!student) {
      throw new Error("Student not found");
    }

    if (student.job_type === "NonTechnical") {
      if (data.marks <= 15) {
        data.status = "DisQualified";
      } else {
        // Get the highest batch number, ensuring NULL is treated as 0
        const lastBatchStudent = await testFormModel.findOne({
          where: { job_type: "NonTechnical", GD_batch: { [Op.ne]: null } }, // Ignore NULL batches
          order: [["GD_batch", "DESC"]],
        });

        let currentBatch = lastBatchStudent && lastBatchStudent.GD_batch ? lastBatchStudent.GD_batch : 1;

        // Count students in the current batch
        const batchCount = await testFormModel.count({
          where: { job_type: "NonTechnical", GD_batch: currentBatch },
        });

        console.log(`Current Batch: ${currentBatch}, Batch Count: ${batchCount}`);

        // If the current batch has 10 students, move to the next batch
        if (batchCount >= 10) {
          currentBatch++;
        }

        data.GD_batch = currentBatch;
        data.status = "Qualified";
      }
    } else {
      if (data.marks <= 15) {
        data.status = "DisQualified";
      } else {
        const alltasks = await figmaAssetsImages.findAll();
        if (alltasks.length > 0) {
          const randomTask = alltasks[Math.floor(Math.random() * alltasks.length)];
          data.taskId = randomTask.id;
        }
        data.status = "Qualified";
      }
    }

    // Update the candidate with assigned batch/task
    const candidate = await testFormModel.update(data, { where: { id } });
    console.log(candidate,"candidateeeee")
    return {candidate, data};
  } catch (error) {
    console.error("Error updating marks:", error);
  }
};


const updateTaskLink = async (id, data) => {
  try {
    if (data) {
      const candidate = await testFormModel.update(data, {
        where: { id: id },
      });
      return candidate;
    }
  }
  catch (error) {
    console.error("Error updating marks:", error);
  }
}


module.exports = {
  createCandidate,
  getCandidateWithQuestions,
  getCandidates,
  getCandidatesById,
  updateMarks,
  updateTaskLink
};
