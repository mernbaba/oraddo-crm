const { Op,Sequelize, Model } = require('sequelize');
const Meeting = require('../models/meetingsEvents');
const Emp_onboarding = require('../models/Emp_onboarding');
const {getAllFuncs} = require('../services/departmentsService');


const setAttendeesForMeetings = async (attendees) => { 
  try {
    for (const meetingId in attendees) {
      if (Object.hasOwnProperty.call(attendees, meetingId)) {
        const employeeIds = attendees[meetingId];

        // Find the meeting by its ID
        const meeting = await Meeting.findByPk(meetingId);

        if (!meeting) {
          console.log(`Meeting with id ${meetingId} not found`);
          continue;
        }

        // Set the attendees for the meeting
        // This will update the many-to-many relationship table
        await meeting.setEmp_onboardings(employeeIds);

        console.log(`Attendees set for meeting ${meetingId}: ${employeeIds}`);
      }
    }

    return { success: true, message: 'Attendees set for all meetings'};
  } catch (error) {
    console.error('Error setting attendees:', error.message);
    throw error;
  }
};



const createMeeting = async (data) => {
  try {
    console.log("dataaaaaa", data);
    const { attendees, ...meetingData } = data;

    console.log("atteeee", attendees);
    console.log("meetingdaaaa", meetingData);

    // Check if there are any meetings in the database
    const existingMeetingsCount = await Meeting.count();
    if (existingMeetingsCount === 0) {
      // No meetings exist, so create the first meeting
      const firstMeeting = await Meeting.create(meetingData);
      console.log("First meeting created:", firstMeeting);

      // Set the attendees for the first meeting
      const attendencestructure = { [firstMeeting.id]: attendees };
      const meetings = await setAttendeesForMeetings(attendencestructure);
      console.log("atteeeendeeessstructureee", meetings, attendencestructure);

      return { meeting: firstMeeting, meetingData: meetings };
    }

    // Check for overlapping meetings for the employee
    // const conflictingMeetings = await Meeting.findAll({
    //   where: {
    //     [Op.or]: [
    //       {
    //         start_time: {
    //           [Op.lte]: data.end_time,
    //         },
    //         end_time: {
    //           [Op.gte]: data.start_time,
    //         },
    //       },
    //     ],
    //   },
    // });

    const conflictingMeetings = await Meeting.findAll({
      where: {
        [Op.and]: [
          // Filter by the same date
          { date: data.date },
    
          // Check for overlapping times on the same day
          {
            [Op.or]: [
              {
                start_time: {
                  [Op.lte]: data.end_time, // Meeting starts before or at the end of the new meeting
                },
                end_time: {
                  [Op.gte]: data.start_time, // Meeting ends after or at the start of the new meeting
                },
              },
            ],
          },
        ],
      },
    });
    

    console.log("meeeetttssss", conflictingMeetings[0]?.id);

    if (conflictingMeetings.length > 0) {
      const emp = await Meeting.findByPk(conflictingMeetings[0].id, {
        include: [
          {
            model: Emp_onboarding,
            as: "Meeting",
          },
        ],
      });
      console.log("emplonnnaammeess", emp.Meeting.emp_name);

      throw new Error(`A meeting is already scheduled during this time for ${emp.Meeting.emp_name}.`);
    }

    // const conflictingLocationMeetings = await Meeting.findOne({
    //   where: {
    //     location: data.location,
    //     [Op.or]: [
    //       {
    //         start_time: {
    //           [Op.lte]: data.end_time,
    //         },
    //         end_time: {
    //           [Op.gte]: data.start_time,
    //         },
    //       },
    //     ],
    //   },
    // });

    const conflictingLocationMeetings = await Meeting.findOne({
      where: {
        location: data.location, // Ensure the location matches
        date: data.date, // Ensure the meeting is on the same date
        [Op.or]: [
          {
            start_time: {
              [Op.lte]: data.end_time, // Check if the meeting starts before or at the new meeting's end time
            },
            end_time: {
              [Op.gte]: data.start_time, // Check if the meeting ends after or at the new meeting's start time
            },
          },
        ],
      },
    });

    if (conflictingLocationMeetings) {
      throw new Error("A meeting is already scheduled at this location during this time.");
    }

    const meeting = await Meeting.create(meetingData);
    console.log("createeee", meeting);

    let setmeetingss;
    try {
      const attendencestructure = { [meeting.id]: attendees };
      const meetingData = await setAttendeesForMeetings(attendencestructure);
      console.log("atteeeendeeessstructureee", meetingData, attendencestructure);
    } catch (error) {
      console.log("errrrrrrrrr", error);
      throw error;
    }

    return { meeting, meetings: setmeetingss };
  } catch (error) {
    throw error;
  }
};


// const createMeeting = async (data) => {
//   try {
//     console.log("dataaaaaa", data);
//     const { attendees, ...meetingData } = data;

//     console.log("atteeee", attendees);
//     console.log("meetingdaaaa", meetingData);
    
    
    
//        // Check for overlapping meetings for the employee
//        const conflictingMeetings = await Meeting.findAll(
//       {
//         where: {
//           // createdBy: data.createdBy,
//           // Check if the meeting time overlaps
//           [Op.or]: [
//             {
//               start_time: {
//                 [Op.lte]: data.end_time
//               },
//               end_time: {
//                 [Op.gte]: data.start_time
//               }
//             }
//           ]
//         }
//       }
//     );

//     console.log("meeeetttssss",conflictingMeetings[0].id);
    


//       const emp = await Meeting.findByPk(conflictingMeetings[0].id,{
//         include:[
//           {
//             model: Emp_onboarding,
//             as: "Meeting"
//           }
//         ]
//       })
//       console.log("emplonnnaammeess",emp.Meeting.emp_name);
      
//       if (conflictingMeetings) {
//         throw new Error(`A meeting is already scheduled during this time for ${emp.Meeting.emp_name}.`);
//       }


//       const conflictingLocationMeetings = await Meeting.findOne({
//         where: {
//           location: data.location,
//           // Check if the meeting time overlaps
//           [Op.or]: [
//             {
//               start_time: {
//                 [Op.lte]: data.end_time
//               },
//               end_time: {
//                 [Op.gte]: data.start_time
//               }
//             }
//           ]
//         }
//       });
  
//       if (conflictingLocationMeetings) {
//         throw new Error("A meeting is already scheduled at this location during this time.");
//       }
//     const meeting = await Meeting.create(meetingData);
//     console.log("createeee", meeting);
//     let setmeetingss;
//     try {
//       const attendencestructure = {[meeting.id]: attendees};
//       const meetingData = await setAttendeesForMeetings(attendencestructure)
//       console.log("atteeeendeeessstructureee",meetingData, attendencestructure);
      
//     } catch (error) {
//       console.log("errrrrrrrrr", error);
//       throw error;
//     }
  
//     return {meeting, meetings : setmeetingss};
//   } catch (error) {
//     throw error;
//   }
// };

const createMeetingsBulk = async (data) => {
  try {
    const meetings = await Meeting.bulkCreate(data);
    return meetings;
  } catch (error) {
    throw error;
  }
};

const getMeetings = async () => {
  try {
    const meetings = await Meeting.findAll({ include:[
      {
        model: Emp_onboarding,
      }
    ]
  });
    return meetings;
  } catch (error) {
    throw error;
  }
};


const getMeetingsbyOrganizationId = async (id) => {
  try {
    const meetings = await Meeting.findAll({ where:{organizationId:id}, include:[
      {
        model: Emp_onboarding,
      }
    ]
  });
    return meetings;
  } catch (error) {
    throw error;
  }
};



const getMeetingById = async (id) => {
  try {
    const meeting = await Meeting.findByPk(id,
     { include:[
        {
          model: Emp_onboarding,
        }
      ]
    }
    );
    return meeting;
  } catch (error) {
    throw error;
  }
};

const updateMeeting = async (id, data) => {
  try {
    const meeting = await Meeting.update(data, {
      where: { id: id }
    });
    return meeting;
  } catch (error) {
    throw error;
  }
};

const deleteMeeting = async (id) => {
  try {
    await Meeting.destroy({
      where: { id: id }
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createMeeting,
  createMeetingsBulk,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  getMeetingsbyOrganizationId
};
