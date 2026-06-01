const { check, validationResult } = require('express-validator');

const validateSalaryManagement = [
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

  check('date_of_joining')
    .notEmpty()
    .withMessage('Date of joining is required')
    .isISO8601()
    .withMessage('Date of joining must be a valid ISO 8601 date'),

  check('department')
    .notEmpty()
    .withMessage('Department is required')
    .isString()
    .withMessage('Department must be a string'),

  check('working_days')
    .notEmpty()
    .withMessage('Working days are required')
    .isString()
    .withMessage('Working days must be a string'),

  check('bank_name')
    .notEmpty()
    .withMessage('Bank name is required')
    .isString()
    .withMessage('Bank name must be a string'),

  check('designation')
    .notEmpty()
    .withMessage('Designation is required')
    .isString()
    .withMessage('Designation must be a string'),

  check('pf_account')
    .optional()
    .isString()
    .withMessage('PF account must be a string'),

  check('bank_ac_number')
    .notEmpty()
    .withMessage('Bank account number is required')
    .isString()
    .withMessage('Bank account number must be a string'),

  check('leaves')
    .optional()
    .isString()
    .withMessage('Leaves must be a string'),

  check('lop')
    .optional()
    .isString()
    .withMessage('LOP must be a string'),

  check('leave_balance')
    .notEmpty()
    .withMessage('Leave balance is required')
    .isString()
    .withMessage('Leave balance must be a string'),

  check('basic')
    .notEmpty()
    .withMessage('Basic is required')
    .isString()
    .withMessage('Basic must be a string'),

  check('profetional_tax')
    .notEmpty()
    .withMessage('Professional tax is required')
    .isString()
    .withMessage('Professional tax must be a string'),

  check('house_rent_allowance')
    .optional()
    .isString()
    .withMessage('House rent allowance must be a string'),

  check('income_tax')
    .notEmpty()
    .withMessage('Income tax is required')
    .isString()
    .withMessage('Income tax must be a string'),

  check('convaynce_allowance')
    .optional()
    .isString()
    .withMessage('Conveyance allowance must be a string'),

  check('perfomance_incentives')
    .optional()
    .isString()
    .withMessage('Performance incentives must be a string'),

  check('other_deductions')
    .optional()
    .isString()
    .withMessage('Other deductions must be a string'),

  check('insentives')
    .optional()
    .isString()
    .withMessage('Incentives must be a string'),

  check('special_allowance')
    .optional()
    .isString()
    .withMessage('Special allowance must be a string'),

  check('gratuity')
    .optional()
    .isString()
    .withMessage('Gratuity must be a string'),

  check('net_pay')
    .notEmpty()
    .withMessage('Net pay is required')
    .isString()
    .withMessage('Net pay must be a string'),

  check('amount_in_words')
    .notEmpty()
    .withMessage('Amount in words is required')
    .isString()
    .withMessage('Amount in words must be a string'),

  check('loss_of_pay')
    .optional()
    .isString()
    .withMessage('Loss of pay must be a string'),

  check('gross_pay')
    .optional()
    .isString()
    .withMessage('Gross pay must be a string'),

  check('gross_deduction')
    .optional()
    .isString()
    .withMessage('Gross deduction must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateSalaryManagement };
