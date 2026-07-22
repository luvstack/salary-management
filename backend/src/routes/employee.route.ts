import { Router } from 'express';

import { EmployeeController } from '@src/controllers';
import { validateBody, validateParams, validateQuery } from '@src/middlewares';
import {
  employeesQuerySchema,
  getEmployeeParamsSchema
} from '@src/validators';
import { updateEmployeeSalarySchema } from '@src/validators/employee-salary.validator';

const router = Router();


router.get(
  '/',
  validateQuery(employeesQuerySchema),
  EmployeeController.Employee.getEmployees,
);

router.get(
  '/:id',
  validateParams(getEmployeeParamsSchema),
  EmployeeController.Employee.getEmployee,
);

router.put(
  '/:id/salary',
  validateParams(getEmployeeParamsSchema),
  validateBody(updateEmployeeSalarySchema),
  EmployeeController.Employee.updateSalary,
);

export default router;