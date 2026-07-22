import Joi from 'joi';

export const updateEmployeeSalarySchema = Joi.object({
    baseSalary: Joi.number()
      .positive()
      .precision(2)
      .required(),
  
    currency: Joi.string()
      .trim()
      .uppercase()
      .length(3)
      .required(),
  
    effectiveFrom: Joi.date()
      .iso()
      .required(),
  
    reason: Joi.string()
      .trim()
      .max(255)
      .allow(null, '')
      .optional(),
  });