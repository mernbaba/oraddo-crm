const { check, validationResult } = require('express-validator');

const validateHiringActivities = [
  check('job_position')
    .notEmpty()
    .withMessage('Job position is required')
    .isString()
    .withMessage('Job position must be a string'),

  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),

  check('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isString()
    .withMessage('Phone must be a string')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters'),

  check('alternative_number')
    .optional()
    .isString()
    .withMessage('Alternative number must be a string')
    .isLength({ min: 10, max: 15 })
    .withMessage('Alternative number must be between 10 and 15 characters'),

  check('current_address')
    .notEmpty()
    .withMessage('Current address is required')
    .isString()
    .withMessage('Current address must be a string'),

  check('department')
    .optional()
    .isString()
    .withMessage('Department must be a string'),

  check('laptop')
    .optional()
    .isString()
    .withMessage('Laptop information must be a string'),

  check('experience')
    .optional()
    .isString()
    .withMessage('Experience must be a string'),

  check('years_of_experience')
    .notEmpty()
    .withMessage('Years of experience is required')
    .isInt({ min: 0 })
    .withMessage('Years of experience must be a positive integer'),

  check('resume')
    .optional()
    .isString()
    .withMessage('Resume must be a string'),

  check('status')
    .optional()
    .isString()
    .withMessage('Status must be a string'),

  check('qualification')
    .notEmpty()
    .withMessage('Qualification is required')
    .isString()
    .withMessage('Qualification must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateHiringActivities };
