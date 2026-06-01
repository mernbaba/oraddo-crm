const { check, validationResult } = require('express-validator');

const validateLeavesCreation = [
  check('leave_type')
    .notEmpty()
    .withMessage('Leave type is required')
    .isString()
    .withMessage('Leave type must be a string'),

  check('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isString()
    .withMessage('Reason must be a string'),

  check('number_of_days')
    .notEmpty()
    .withMessage('Number of days is required')
    .isString()
    .withMessage('Number of days must be a string'),

  check('from_date')
    .notEmpty()
    .withMessage('From date is required')
    .isISO8601()
    .withMessage('From date must be a valid ISO 8601 date'),

  check('to_date')
    .notEmpty()
    .withMessage('To date is required')
    .isISO8601()
    .withMessage('To date must be a valid ISO 8601 date'),

  check('leave_bucket')
    .optional()
    .isString()
    .withMessage('Leave bucket must be a string'),

  check('status')
    .notEmpty()
    .withMessage('Status is required')
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

module.exports = { validateLeavesCreation };
