import Joi from 'joi';

// import { type IGenericShipmentPayload, PAYMENT_MODES } from '@src/types';

export const employeesQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),

  search: Joi.string()
    .trim()
    .max(100)
    .optional(),

  country: Joi.string()
    .trim()
    .max(100)
    .optional(),

  department: Joi.string()
    .trim()
    .max(100)
    .optional(),

  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE')
    .optional(),

  minSalary: Joi.number()
    .min(0)
    .optional(),

  maxSalary: Joi.number()
    .optional(),

  sortBy: Joi.string()
    .valid(
      'employeeCode',
      'firstName',
      'lastName',
      'hireDate',
    )
    .default('employeeCode'),

  sortOrder: Joi.string()
    .uppercase()
    .valid('ASC', 'DESC')
    .default('ASC'),
});

export const getEmployeeParamsSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Invalid employee ID',
      'any.required': 'Employee ID is required',
    }),
});