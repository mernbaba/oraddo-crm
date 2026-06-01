const { check, validationResult } = require('express-validator');

const validateHolidayCreation = [
  check('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),

  check('occation')
    .notEmpty()
    .withMessage('Occasion is required')
    .isString()
    .withMessage('Occasion must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateHolidayCreation };
