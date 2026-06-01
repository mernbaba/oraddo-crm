const { check, validationResult } = require('express-validator');

const validateTasks = [
  check('task_name')
    .notEmpty()
    .withMessage('Task name is required')
    .isString()
    .withMessage('Task name must be a string'),

  check('fromdate')
    .notEmpty()
    .withMessage('From date is required')
    .isISO8601()
    .withMessage('From date must be a valid ISO 8601 date'),

  check('todate')
    .notEmpty()
    .withMessage('To date is required')
    .isISO8601()
    .withMessage('To date must be a valid ISO 8601 date'),

  check('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isString()
    .withMessage('Duration must be a string'),

  check('task_description')
    .optional()
    .isString()
    .withMessage('Task description must be a string'),

  check('target')
    .notEmpty()
    .withMessage('Target is required')
    .isString()
    .withMessage('Target must be a string'),

  check('status')
    .optional()
    .isIn(['pending', 'approval', 'progress'])
    .withMessage('Status must be one of the following: pending, approval, progress'),

  check('team_lead_status')
    .optional()
    .isIn(['Approved', 'Declined'])
    .withMessage('Team lead status must be one of the following: Approved, Declined'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateTasks };
