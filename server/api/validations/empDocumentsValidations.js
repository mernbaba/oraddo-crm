const { check, validationResult } = require('express-validator');

const validateEmployeeDocument = [
  check('form_type')
    .notEmpty()
    .withMessage('Form type is required')
    .isString()
    .withMessage('Form type must be a string'),
  
  check('file_key')
    .isString()
    .withMessage('File key must be a string'),

  check('file_url')
    .optional()
    .isString()
    .withMessage('File URL must be a string'
    .optional())
    .isURL()
    .withMessage('File URL must be a valid URL'),

  check('expensesId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Expenses ID must be a positive integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateEmployeeDocument };
