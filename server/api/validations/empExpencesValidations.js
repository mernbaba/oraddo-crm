const { check, validationResult } = require('express-validator');

const validateEmployeeExpenses = [
  check('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string'),

  check('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),

  check('expenseTitle')
    .optional()
    .isString()
    .withMessage('Expense title must be a string'),

  check('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date format'),

  check('receipt')
    .optional()
    .isString()
    .withMessage('Receipt must be a string'),

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

module.exports = { validateEmployeeExpenses };
