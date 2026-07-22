import { QueryTypes, UniqueConstraintError } from 'sequelize';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/utils/route-errors';
import logger from 'jet-logger';
import {
 IEmployeesQuery,
 IGetEmployeeResponse,
 IEmployeesResponse,
 IEmployeeWithSalaryHistory,
 IUpdateEmployeeSalary,
 IEmployeeSalary
} from '@src/types';
import { sequelize } from '@src/db';
import { EmployeeModel } from '@src/models/employee.model';
import { EmployeeSalaryModel } from '@src/models/employee-salary.model';

export class Employee {
  static async getEmployees(
    query: IEmployeesQuery,
  ): Promise<IEmployeesResponse> {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        country,
        department,
        status,
        minSalary,
        maxSalary,
        sortBy = 'employeeCode',
        sortOrder = 'ASC',
      } = query;
  
      const offset = (page - 1) * limit;
  
      const conditions: string[] = [];
      const replacements: Record<
        string,
        string | number
      > = {
        limit,
        offset,
      };
  
      /*
       * Search
       */
      if (search) {
        conditions.push(`
          (
            e."firstName" ILIKE :search
            OR e."lastName" ILIKE :search
            OR CONCAT(
              e."firstName",
              ' ',
              e."lastName"
            ) ILIKE :search
            OR e."email" ILIKE :search
            OR e."employeeCode" ILIKE :search
          )
        `);
  
        replacements.search = `%${search}%`;
      }
  
      /*
       * Employee filters
       */
      if (country) {
        conditions.push(
          `e."country" = :country`,
        );
  
        replacements.country = country;
      }
  
      if (department) {
        conditions.push(
          `e."department" = :department`,
        );
  
        replacements.department =
          department;
      }
  
      if (status) {
        conditions.push(
          `e."status" = :status`,
        );
  
        replacements.status = status;
      }
  
      /*
       * Current salary filters
       */
      if (minSalary !== undefined) {
        conditions.push(
          `s."baseSalary" >= :minSalary`,
        );
  
        replacements.minSalary =
          minSalary;
      }
  
      if (maxSalary !== undefined) {
        conditions.push(
          `s."baseSalary" <= :maxSalary`,
        );
  
        replacements.maxSalary =
          maxSalary;
      }
  
      const whereClause =
        conditions.length > 0
          ? `WHERE ${conditions.join(
              ' AND ',
            )}`
          : '';
  
      /*
       * sortBy and sortOrder are safe because Joi
       * restricts them to whitelisted values.
       */
      const sortColumns = {
        employeeCode:
          'e."employee_code"',
        firstName:
          'e."first_name"',
        lastName:
          'e."last_name"',
        hireDate:
          'e."hire_date"',
      } as const;
  
      const orderColumn =
        sortColumns[sortBy];
  
      /*
       * DISTINCT ON picks the latest effective salary
       * for each employee.
       */
      const baseQuery = `
        FROM employees e
  
        LEFT JOIN LATERAL (
          SELECT
            es."base_salary" AS "baseSalary",
            es."currency",
            es."effective_from" AS "effectiveFrom"
  
          FROM employee_salaries es
  
          WHERE
            es."employee_id" = e.id
            AND es."effective_from" <= CURRENT_DATE
  
          ORDER BY
            es."effective_from" DESC,
            es."created_at" DESC
  
          LIMIT 1
        ) s ON TRUE
  
        ${whereClause}
      `;
  
      const employeesQuery = `
        SELECT
          e.id,
          e."employee_code" AS "employeeCode",
          e."first_name" AS "FirstName",
          e."last_name" AS "LastName",
          e.email,
          e.department,
          e."job_title" AS "jobTitle",
          e.country,
          e."hire_date" AS "hireDate",
          e.status,
          CASE
            WHEN s."baseSalary" IS NOT NULL
            THEN json_build_object(
              'baseSalary', s."baseSalary",
              'currency', s.currency,
              'effectiveFrom', s."effectiveFrom"
            )
            ELSE NULL
          END AS "currentSalary"
  
        ${baseQuery}
  
        ORDER BY
          ${orderColumn} ${sortOrder},
          e.id ASC
  
        LIMIT :limit
        OFFSET :offset
      `;
  
      const countQuery = `
        SELECT COUNT(*)::int AS total
  
        ${baseQuery}
      `;
  
      const [employees, countResult] =
        await Promise.all([
          sequelize.query(
            employeesQuery,
            {
              replacements,
              type: QueryTypes.SELECT,
            },
          ),
  
          sequelize.query<{
            total: number;
          }>(
            countQuery,
            {
              replacements,
              type: QueryTypes.SELECT,
            },
          ),
        ]);
  
      const total =
        countResult[0]?.total ?? 0;
  
      return {
        data: employees as IEmployeesResponse['data'],
  
        pagination: {
          page,
          limit,
          total,
          totalPages:
            Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if (error instanceof RouteError) {
        throw error;
      }
      throw new RouteError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to retrieve employee: ${(error as Error).message}`,
      );
    }
  }

  static async getEmployee(
    id: string,
  ): Promise<IGetEmployeeResponse> {
    try {
      const employee = await EmployeeModel.findOne({
        where: {
          id,
        },
  
        attributes: [
          'id',
          'employeeCode',
          'firstName',
          'lastName',
          'email',
          'department',
          'jobTitle',
          'country',
          'hireDate',
          'status',
          'createdAt',
          'updatedAt',
        ],
  
        include: [
          {
            model: EmployeeSalaryModel,
            as: 'salaryHistory',
  
            attributes: [
              'id',
              'baseSalary',
              'currency',
              'effectiveFrom',
              'reason',
              'createdAt',
            ],
  
            required: false,
          },
        ],
  
        order: [
          [
            {
              model: EmployeeSalaryModel,
              as: 'salaryHistory',
            },
            'effectiveFrom',
            'DESC',
          ],
          [
            {
              model: EmployeeSalaryModel,
              as: 'salaryHistory',
            },
            'createdAt',
            'DESC',
          ],
        ],
      });
  
      if (!employee) {
        throw new RouteError(
          HttpStatusCodes.NOT_FOUND,
          'Employee not found',
        );
      }
  
      const data = employee.get({
        plain: true,
      }) as unknown as IEmployeeWithSalaryHistory;
  
      /*
       * Salary history is sorted by effectiveFrom DESC.
       * Find the latest salary that is currently effective.
       *
       * We don't simply use salaryHistory[0] because
       * an employee may have a future-dated salary record.
       */
      const today = new Date()
        .toISOString()
        .slice(0, 10);
  
      const currentSalaryRecord =
        data.salaryHistory?.find(
          (salary) =>
            String(salary.effectiveFrom) <= today,
        );
  
      return {
        ...data,
  
        currentSalary: currentSalaryRecord
          ? {
              baseSalary:
                currentSalaryRecord.baseSalary,
  
              currency:
                currentSalaryRecord.currency,
  
              effectiveFrom:
                currentSalaryRecord.effectiveFrom,
            }
          : null,
      } as IGetEmployeeResponse;
    } catch (error) {
      if (error instanceof RouteError) {
        throw error;
      }
  
      logger.err(error as Error);
  
      throw new RouteError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to fetch employee',
      );
    }
  }

  static async updateSalary(id: string, payload: IUpdateEmployeeSalary): Promise<IEmployeeSalary> {
    try {
      const {baseSalary, currency, effectiveFrom, reason} = payload;
      const employee = await EmployeeModel.findByPk(
        id,
        {
          attributes: ['id'],
        },
      );
  
      if (!employee) {
        throw new RouteError(
          HttpStatusCodes.NOT_FOUND,
          'Employee not found',
        );
      }
  
      const salary =
        await EmployeeSalaryModel.create({
          employeeId: id,
          baseSalary: baseSalary.toString(),
          currency: currency.toUpperCase(),
          effectiveFrom,
          reason:reason || null,
        });
  
      return salary.get({
        plain: true,
      });
    } catch (error) {

      if(error instanceof UniqueConstraintError) {
        throw new RouteError(
          HttpStatusCodes.CONFLICT,
          'A salary record already exists for this effective date',
        );
      }

      if (error instanceof RouteError) {
        throw error;
      }
  
      logger.err(error as Error);
  
      throw new RouteError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to fetch employee',
      );
    }
  }
}

