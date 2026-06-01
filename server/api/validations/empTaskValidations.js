const { check, validationResult } = require('express-validator');

const validateEmployeeTasks = [
  check('pending')
    .notEmpty()
    .withMessage('Pending task is required')
    .isString()
    .withMessage('Pending task must be a string'),

  check('inprogres')
    .notEmpty()
    .withMessage('In-progress task is required')
    .isString()
    .withMessage('In-progress task must be a string'),

  check('completed')
    .optional()
    .isString()
    .withMessage('Completed task must be a string'),

//   check('employeeid')
//     .optional()
//     .isInt({ min: 1 })
//     .withMessage('Employee ID must be a positive integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateEmployeeTasks };
