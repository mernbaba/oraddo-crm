const Survey = require("../models/formSurvey");
const Question = require("../models/formQuestions");
const Response = require("../models/formResponse");
const Emp_onboarding = require("../models/Emp_onboarding");
const department = require("../models/Department");

// Service to create a new survey
const createSurvey = async (data) => {
  try {
    console.log("kkkkkkkk", data);
    try {
      const survey = await Survey.create(data);
      console.log(survey, "from service create survey");
      return survey;
    } catch (error) {
      console.log("errrrrrrr", error);
    }
  } catch (error) {
    throw new Error("Error creating survey. Please try again.");
  }
};

// Service to add questions to a survey
const addQuestions = async (surveyId, questions) => {
  try {
    const questionPromises = questions.map((question) => ({
      ...question,
      survey_id: surveyId,
    }));
    console.log("efhdfhv", questionPromises);

    return await Question.bulkCreate(questionPromises);
  } catch (error) {
    throw new Error("Error adding questions. Please try again.");
  }
};

// Service to get All survey details
const getAllSurveyDetails = async () => {
  try {
    console.log("hsssssss");

    return await Survey.findAll({
      include: [
        {
          model: Question,
          as: "questions",
          include: [
            {
              model: Response,
              as: "Question_Response",
              include: [
                {
                  model: Emp_onboarding,
                  as: "Users",
                },
              ],
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.log("djfhsduiygw", error);

    throw new Error("Error fetching survey details. Please try again.");
  }
};

// Service to get survey details
const getSurveyDetails = async (surveyId) => {
  console.log(surveyId, "from frontend");
  try {
    return await Survey.findByPk(surveyId, {
      include: [
        {
          model: Question,
          as: "questions",
          include: [
            {
              model: Response,
              as: "Question_Response",
              include: [
                {
                  model: Emp_onboarding,
                  as: "Users",
                },
              ],
            },
          ],
        },
      ],
    });
  } catch (error) {
    throw new Error("Error fetching survey details. Please try again.");
  }
};

// Service to submit responses
// const submitResponses = async (surveyId, userId, responses) => {
//   try {
//     const responsePromises = responses.map((response) => ({
//       QuestionSurvey_id: surveyId,
//       user_id: userId,
//       question_id: response.question_id,
//       response_text: response.response_text,
//       status:response.status
//     }));
//     console.log("usdhsufhu", responsePromises);

//     const res = await Response.bulkCreate(responsePromises);
//     return res;
//   } catch (error) {
//     throw new Error("Error submitting responses. Please try again.");
//   }
// };

const submitResponses = async (surveyId, userId, responses) => {
  try {
    // Check if responses already exist for the given surveyId and userId
    const existingResponses = await Response.findOne({
      where: {
        QuestionSurvey_id: surveyId,
        user_id: userId,
      },
    });

    // If a response exists, throw a custom error
    if (existingResponses) {
      throw new Error("Responses already submitted for this survey.");
    }

    // If no existing responses, create new responses
    const responsePromises = responses.map((response) => ({
      QuestionSurvey_id: surveyId,
      user_id: userId,
      question_id: response.question_id,
      response_text: response.response_text,
      status: response.status,
    }));

    console.log("Response data to be submitted:", responsePromises);

    // Create new responses
    const res = await Response.bulkCreate(responsePromises);
    return res;
  } catch (error) {
    // Check for specific error messages and handle accordingly
    if (error.message === "Responses already submitted for this survey.") {
      console.error(error.message); // You can log this or return a specific response.
      throw error; // Re-throwing the error so it can be handled by the calling function.
    }

    // For other errors, handle them generically
    console.error("Error submitting responses:", error);
    throw new Error("Error submitting responses. Please try again.");
  }
};

// Service to get all responses for a survey
const getSurveyResponses = async (surveyId) => {
  console.log("ydjgedchjduchjhdusaaaaaaa");
  try {
    return await Response.findAll({
      where: { QuestionSurvey_id: surveyId },
      include: [{ model: Question, as: "Questions" }],
    });
  } catch (error) {
    throw new Error("Error fetching survey responses. Please try again.");
  }
};

const getAllResponses = async () => {
  console.log("getALLLLLLL");
  try {
    return await Response
      .findAll
      //   {
      //   where: { QuestionSurvey_id: surveyId },
      //   include: [{ model: Question, as: "Questions" }],
      // }
      ();
  } catch (error) {
    throw new Error("Error fetching all responses. Please try again.");
  }
};

module.exports = {
  createSurvey,
  addQuestions,
  getAllSurveyDetails,
  getSurveyDetails,
  submitResponses,
  getAllResponses,
  getSurveyResponses,
};
