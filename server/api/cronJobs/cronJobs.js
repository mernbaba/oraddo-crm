// const cron = require("node-cron");
// const HrPanel = require("../models/HrPanel");
// const { renewalEmployeeBalances } = require("../services/employeeService");

// const getLastDayOfMonth = (date) => {
//   return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
// };

// // cron.schedule(
// //   "0, 0, * * *",
// //   async () => {
// //     try {
// //       const today = new Date();
// //       const currentDay = today.getDate();
// //       const currentMonth = today.toLocaleString("default", { month: "long" });
// //       const lastDayOfMonth = getLastDayOfMonth(today);

// //       if (currentDay === lastDayOfMonth) {
// //         console.log("Last day of the month. Renewal required.");
// //         // Call the renewal function here
// //         const hrPanels = await HrPanel.findAll({
// //           attributes: ["organizationID", "renewalMonth"],
// //         });

// //         for (const hr of hrPanels) {
// //           if (hr.renewalMonth === currentMonth) {
// //             await renewalEmployeeBalances(hr.organizationID);
// //             console.log(
// //               `Renewed balances for organization ${hr.organizationID} on ${currentMonth} ${lastDayOfMonth}`
// //             );
// //           }
// //         }
// //         console.log(
// //           `Renewal check completed for ${currentMonth} ${lastDayOfMonth}`
// //         );
// //       }
// //     } catch (error) {
// //       console.error("Cron renewal failed:", error);
// //     }
// //   },
// //   {
// //     scheduled: true,
// //     timezone: "Asia/Kolkata", // Adjust to your timezone (e.g., IST)
// //   }
// // );

// cron.schedule("* * * * *", async () => {
//     try {
//       const today = new Date();
//       const currentDay = today.getDate();
//       const currentMonth = today.toLocaleString("en-US", { month: "long" });
//       const lastDayOfMonth = getLastDayOfMonth(today);

//       // Pretend today is the last day for testing (remove this line later)
//       // const currentDay = lastDayOfMonth;

//       if (currentDay === lastDayOfMonth) { // Comment this out for testing
//         const hrPanels = await HrPanel.findAll({
//           // attributes: ["organizationID", "renewalMonth",],
//         });
//         for (const hr of hrPanels) {
//           if (hr.renewalMonth === currentMonth) {
//             await renewalEmployeeBalances(hr.organizationID);
//             console.log(`Renewed balances for organization ${hr.organizationID} on ${currentMonth} ${lastDayOfMonth}`);
//           }
//         }
//         console.log(`Renewal check completed for ${currentMonth} ${lastDayOfMonth}`);
//       }
//     } catch (error) {
//       console.error("Cron renewal failed:", error);
//     }
//   }, {
//     scheduled: true,
//     timezone: "Asia/Kolkata"
//   });

const cron = require("node-cron");
const HrPanel = require("../models/HrPanel"); // Adjust the model import as per your structure
const Employee = require("../models/Emp_onboarding"); // Adjust the model import as per your structure
const {
  startInvoiceAutomation,
} = require("../services/invoiceModuleSerService");
const { CreateAutoAttendance } = require("../controllers/attendenceController");
const Organization = require("../models/OrganizationModule");
// Function to get the last day of the current month
function getLastDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

cron.schedule(
  "0 0 28-31 * *",
  async () => {
    // cron.schedule("* * * * *", async () => {
    try {
      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.toLocaleString("en-US", { month: "long" });
      const lastDayOfMonth = getLastDayOfMonth(today);

      // Run only if today is the last day of the month
      console.log(`Running renewal process for ${currentMonth} ${currentDay}`);
      if (currentDay === lastDayOfMonth) {
        console.log(
          `Running renewal process for ${currentMonth} ${currentDay}`
        );

        const hrPanels = await HrPanel.findAll();
        for (const hr of hrPanels) {
          if (hr.renewalMonth === currentMonth) {
            try {
              // Fetch all employees of the organization
              const employees = await Employee.findAll({
                where: { orgnaizationId: hr.organizationID },
              });

              // Update leave balance and work-from-home data
              for (const employee of employees) {
                await Employee.update(
                  {
                    leave_balance: hr.leaveBuckets, // Adjust the field names as per your model
                    wfh_no_ofdays: hr.wfhDays, // Adjust as needed
                  },
                  {
                    where: { id: employee.id },
                  }
                );
                console.log(
                  `Updated balances for employee ${employee.id} from organization ${hr.organizationID}`
                );
              }

              console.log(
                `Renewed balances for organization ${hr.organizationID} on ${currentMonth} ${lastDayOfMonth}`
              );
            } catch (updateError) {
              console.error(
                `Failed to update balances for organization ${hr.organizationID}:`,
                updateError
              );
            }
          }
        }

        console.log(
          `Renewal check completed for ${currentMonth} ${lastDayOfMonth}`
        );
      }
    } catch (error) {
      console.error("Cron renewal failed:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

// cron.schedule("* * * * *", async () => {
//   startInvoiceAutomation()
// })

cron.schedule("0 58 23 * * *", async () => {
  try {
    await startInvoiceAutomation();
    console.log("Invoice automation completed successfully at 23:58");
  } catch (error) {
    console.error("Error running invoice automation:", error);
  }
});

cron.schedule(
  "0 8 * * *",
  async () => {
    try {
      console.log("started auto generating attendance by cron job");
      const organizations = await Organization.findAll({
        include: [
          {
            model: HrPanel,
            attributes: ["organizationID", "follow_punchin_system"],
            as: "panel_data",
            required: false, 
          },
        ],
      });
      console.log(organizations.length, "organizationsssszz");
      if (!organizations.length === 0) {
        console.log("No organizations found");
        return;
      }

      for (const org of organizations) {
        console.log(org.panel_data, "orgiddddddd in")
        const hrSettings = org.panel_data;
        console.log(hrSettings[0]?.follow_punchin_system, "hrsetttingggssss")
        if (hrSettings && hrSettings[0]?.follow_punchin_system === false) {
          console.log(org.id, "orgiddddddd in if")
          const result = await CreateAutoAttendance(org.id);
        }
      }
    } catch (error) {
      console.error("Cron job error:", error.message);
    }
  },
  { timezone: "Asia/Kolkata" }
);
