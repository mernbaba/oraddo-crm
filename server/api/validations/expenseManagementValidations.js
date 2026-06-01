const { check, validationResult } = require('express-validator');

const validateEmployeeDocument = [
  check('moduleName')
    .notEmpty()
    .withMessage('Module name is required')
    .isIn(['Module1', 'Module2', 'Module3'])
    .withMessage('Module name must be one of "Module1", "Module2", or "Module3"'),

  check('date_Of_Purchesing')
    .notEmpty()
    .withMessage('Date of purchasing is required')
    .isISO8601()
    .withMessage('Date of purchasing must be a valid date'),

  check('price')
    .optional()
    .isString()
    .withMessage('Price must be a string'),

  check('plan_mode')
    .optional()
    .isString()
    .withMessage('Plan mode must be a string'),

  check('purchasing_mode')
    .notEmpty()
    .withMessage('Purchasing mode is required')
    .isIn(['One Time', 'Renew'])
    .withMessage('Purchasing mode must be one of "One Time" or "Renew"'),

  check('payment_mode')
    .notEmpty()
    .withMessage('Payment mode is required')
    .isIn([
      'Credit Card',
      'Debit Card',
      'Net Banking',
      'UPI',
      'Wallets (e.g., Paytm, Google Pay, PhonePe)',
      'Bank Transfer (NEFT/RTGS/IMPS)',
      'Cash',
      'Cheque',
      'EMI through Bank',
      'Direct Debit (Auto Debit from Bank Account)',
    ])
    .withMessage(
      'Payment mode must be one of "Credit Card", "Debit Card", "Net Banking", "UPI", "Wallets (e.g., Paytm, Google Pay, PhonePe)", "Bank Transfer (NEFT/RTGS/IMPS)", "Cash", "Cheque", "EMI through Bank", "Direct Debit (Auto Debit from Bank Account)"'
    ),

  check('status')
    .optional()
    .isIn(['Pending', 'Approved'])
    .withMessage('Status must be one of "Pending" or "Approved"'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateEmployeeDocument };
