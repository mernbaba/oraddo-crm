const { body, validationResult } = require('express-validator');

const employeeValidationRules = () => {
  return [
    body('emp_name').notEmpty().withMessage('Employee name is required'),
    // body('emp_id').notEmpty().withMessage('Employee ID is required'),
    body('salary').isFloat({ gt: 0 }).withMessage('Salary must be a positive number'),
    body('date_of_birth').notEmpty().isDate().withMessage('Valid date of birth is required'),
    body('position').notEmpty().withMessage('Position is required'),
    // body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('date_of_joining').notEmpty().isDate().withMessage('Valid date of joining is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('contact_number').notEmpty().isMobilePhone().withMessage('Valid contact number is required'),
    body('permanent_address').notEmpty().withMessage('Permanent address is required'),
    body('current_address').notEmpty().withMessage('Current address is required'),
    body('education_qualification').notEmpty().withMessage('Education qualification is required'),
    body('adharnumber').notEmpty().withMessage('Aadhar number is required'),
    body('bank_account').notEmpty().withMessage('Bank account is required'),
    body('bank_name').notEmpty().withMessage('Bank name is required'),
    body('IFSC_code').notEmpty().withMessage('IFSC code is required'),
    // Optional fields validation
    body('alternative_number').optional().isMobilePhone().withMessage('Valid alternative number is required'),
    body('father_or_husband_name').optional().isString().withMessage('Valid name is required'),
    body('father_or_husband_number').optional().isMobilePhone().withMessage('Valid contact number is required'),
    body('mother_name').optional().isString().withMessage('Valid name is required'),
    body('mother_number').optional().isMobilePhone().withMessage('Valid contact number is required'),
    body('pancard').optional().isString().withMessage('Valid PAN card number is required'),
    body('other_documents').optional().isString().withMessage('Valid documents are required'),
    body('UPI_Id').optional().isString().withMessage('Valid UPI ID is required')
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  employeeValidationRules,
  validate,
};
