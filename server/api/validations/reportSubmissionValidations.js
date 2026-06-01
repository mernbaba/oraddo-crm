const { check, validationResult } = require('express-validator');

const validateReportSubmission = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),

  check('emp_id')
    .notEmpty()
    .withMessage('Employee ID is required')
    .isString()
    .withMessage('Employee ID must be a string'),

  check('department')
    .notEmpty()
    .withMessage('Department is required')
    .isString()
    .withMessage('Department must be a string'),

  check('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),

  check('task')
    .notEmpty()
    .withMessage('Task is required')
    .isString()
    .withMessage('Task must be a string'),

  check('comments')
    .optional()
    .isString()
    .withMessage('Comments must be a string'),

  check('status')
    .optional()
    .isIn(['Pending', 'Approved', 'Declined'])
    .withMessage('Status must be one of "Pending", "Approved", or "Declined"'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateReportSubmission };
