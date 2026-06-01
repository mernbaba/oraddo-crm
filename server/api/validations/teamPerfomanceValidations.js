const { check, validationResult } = require('express-validator');

const validateTeamPerformance = [
  check('department')
    .optional()
    .isString()
    .withMessage('Department must be a string'),

  check('availability')
    .notEmpty()
    .withMessage('Availability is required')
    .isString()
    .withMessage('Availability must be a string'),

  check('behaviour')
    .notEmpty()
    .withMessage('Behaviour is required')
    .isString()
    .withMessage('Behaviour must be a string'),

  check('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),

  check('position')
    .notEmpty()
    .withMessage('Position is required')
    .isString()
    .withMessage('Position must be a string'),

  check('work_perfomance')
    .notEmpty()
    .withMessage('Work performance is required')
    .isString()
    .withMessage('Work performance must be a string'),

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

module.exports = { validateTeamPerformance };
