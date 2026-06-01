const cron = require('node-cron');
const moment = require('moment'); // Ensure moment.js is installed
const { calculateMonthlyLOP } = require('../controllers/attendenceController');

// Schedule the LOP calculation at 11:59 PM on the last day of the month
// cron.schedule('59 23 28-31 * *', async () => {
    // Run every minute for testing purposes
cron.schedule('* * * * *', async () => {
    console.log("Running test LOP calculation...");
  const today = moment();
  const isMonthEnd = today.endOf('month').isSame(today, 'day');

  if (isMonthEnd) {
    console.log("Running monthly LOP calculation...");
    try {
      await calculateMonthlyLOP();
      console.log("Monthly LOP calculation completed successfully.");
    } catch (error) {
      console.error("Error in monthly LOP calculation:", error);
    }
  }
});

// module.exports = { calculateMonthlyLOP };
