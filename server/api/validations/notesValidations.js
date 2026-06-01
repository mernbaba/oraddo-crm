const { check, validationResult } = require('express-validator');

const validateEmpNotes = [
  check('notes')
    .notEmpty()
    .withMessage('Notes are required')
    .isString()
    .withMessage('Notes must be a string'),

  check('isedited')
    .optional()
    .isBoolean()
    .withMessage('Isedited must be a boolean'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateEmpNotes };
