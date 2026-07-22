import { NextFunction, Request, Response } from 'express';

import { EmployeeService } from '@src/services';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

export class Employee {
  static async getEmployees(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await EmployeeService.Employee.getEmployees(req.query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEmployee(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await EmployeeService.Employee.getEmployee(req.params.id as string);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateSalary(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await EmployeeService.Employee.updateSalary(req.params.id as string, req.body);

      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}