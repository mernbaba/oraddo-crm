const { check, validationResult } = require('express-validator');

const validateSalaryAdvance = [
  check('emp_id')
    .notEmpty()
    .withMessage('Employee ID is required')
    .isString()
    .withMessage('Employee ID must be a string'),

  check('emp_name')
    .notEmpty()
    .withMessage('Employee name is required')
    .isString()
    .withMessage('Employee name must be a string'),

  check('department')
    .notEmpty()
    .withMessage('Department is required')
    .isString()
    .withMessage('Department must be a string'),

  check('date_of_request')
    .notEmpty()
    .withMessage('Date of request is required')
    .isISO8601()
    .withMessage('Date of request must be a valid ISO 8601 date'),

  check('request_type')
    .notEmpty()
    .withMessage('Request type is required')
    .isString()
    .withMessage('Request type must be a string'),

  check('amount_request')
    .notEmpty()
    .withMessage('Amount request is required')
    .isFloat({ min: 0 })
    .withMessage('Amount request must be a positive number'),

  check('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isString()
    .withMessage('Reason must be a string'),

  check('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Pending', 'Approved', 'Declined'])
    .withMessage('Status must be one of "Pending", "Approved", or "Declined"'),

  check('comments')
    .optional()
    .isString()
    .withMessage('Comments must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateSalaryAdvance };
