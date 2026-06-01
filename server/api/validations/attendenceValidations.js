const { check, validationResult } = require("express-validator");

const validateAttendance = [
  check("punch_in")
    .optional()
    .isISO8601()
    .withMessage("Punch in must be a valid date-time format"),
  check("punch_out")
    .optional()
    .isISO8601()
    .withMessage("Punch out must be a valid date-time format"),
  check("duration")
    .optional()
    .isString()
    .withMessage("Duration must be a string")
    .isLength({ min: 1 })
    .withMessage("Duration cannot be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateAttendance };
