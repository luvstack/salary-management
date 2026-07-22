import { UniqueConstraintError } from 'sequelize';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { sequelize } from '@src/db';
import { EmployeeModel } from '@src/models/employee.model';
import { EmployeeSalaryModel } from '@src/models/employee-salary.model';
import { Employee } from '@src/services/employee.service';

/******************************************************************************
                                Constants
******************************************************************************/

const EMPLOYEE_ID =
  '81eee360-3350-499d-a562-479a9a7c1217';

const { NOT_FOUND, CONFLICT } =
  HttpStatusCodes;

/******************************************************************************
                                  Tests
******************************************************************************/

describe('Employee Service', () => {
  beforeEach(() => {
    /*
     * Freeze time so effective-date tests
     * are deterministic.
     */
    vi.useFakeTimers();

    vi.setSystemTime(
      new Date('2026-07-23T12:00:00Z'),
    );
  });

  afterEach(() => {
    /*
     * Restore every spied method back to
     * the original implementation.
     */
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  /****************************************************************************
                              getEmployees
  ****************************************************************************/

  describe('getEmployees', () => {
    it(
      'should return employees with pagination',
      async () => {
        const employees = [
          {
            id: EMPLOYEE_ID,
            employeeCode: 'EMP000001',
            firstName: 'Aarav',
            lastName: 'Sharma',
            email:
              'aarav.sharma.1@acme.com',
            department: 'Engineering',
            jobTitle:
              'Software Engineer',
            country: 'India',
            hireDate: '2015-01-01',
            status: 'ACTIVE',

            currentSalary: {
              baseSalary:
                '1500000.00',
              currency: 'INR',
              effectiveFrom:
                '2026-01-01',
            },
          },
        ];

        /*
         * Mock raw DB queries.
         *
         * First call  -> employee query
         * Second call -> count query
         */
        const querySpy = vi.spyOn(
          sequelize,
          'query',
        );

        querySpy
          .mockResolvedValueOnce(
            employees as never,
          )
          .mockResolvedValueOnce(
            [{ total: 1 }] as never,
          );

        const result =
          await Employee.getEmployees({
            page: 1,
            limit: 20,
          });

        expect(result.data).toEqual(
          employees,
        );

        expect(
          result.pagination,
        ).toEqual({
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        });

        expect(
          querySpy,
        ).toHaveBeenCalledTimes(2);
      },
    );

    it(
      'should use default pagination when query is empty',
      async () => {
        const querySpy = vi.spyOn(
          sequelize,
          'query',
        );

        querySpy
          .mockResolvedValueOnce(
            [] as never,
          )
          .mockResolvedValueOnce(
            [{ total: 0 }] as never,
          );

        const result =
          await Employee.getEmployees({});

        expect(
          result.pagination,
        ).toEqual({
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        });

        /*
         * Check employee query options.
         */
        const firstCall =
          querySpy.mock.calls[0];

        const options =
          firstCall[1] as {
            replacements: Record<
              string,
              string | number
            >;
          };

        expect(
          options.replacements,
        ).toEqual({
          limit: 20,
          offset: 0,
        });
      },
    );

    it(
      'should apply search and filters as query replacements',
      async () => {
        const querySpy = vi.spyOn(
          sequelize,
          'query',
        );

        querySpy
          .mockResolvedValueOnce(
            [] as never,
          )
          .mockResolvedValueOnce(
            [{ total: 0 }] as never,
          );

        await Employee.getEmployees({
          page: 2,
          limit: 10,
          search: 'Aarav',
          country: 'India',
          department: 'Engineering',
          status: 'ACTIVE',
          minSalary: '500000',
          maxSalary: '2000000',
        });

        const firstCall =
          querySpy.mock.calls[0];

        const options =
          firstCall[1] as {
            replacements: Record<
              string,
              string | number
            >;
          };

        expect(
          options.replacements,
        ).toEqual(
          expect.objectContaining({
            limit: 10,
            offset: 10,

            search: '%Aarav%',

            country: 'India',

            department:
              'Engineering',

            status: 'ACTIVE',

            minSalary: '500000',

            maxSalary: '2000000',
          }),
        );
      },
    );

    it(
      'should calculate total pages correctly',
      async () => {
        const querySpy = vi.spyOn(
          sequelize,
          'query',
        );

        querySpy
          .mockResolvedValueOnce(
            [] as never,
          )
          .mockResolvedValueOnce(
            [{ total: 45 }] as never,
          );

        const result =
          await Employee.getEmployees({
            page: 1,
            limit: 20,
          });

        expect(
          result.pagination,
        ).toEqual({
          page: 1,
          limit: 20,
          total: 45,
          totalPages: 3,
        });
      },
    );
  });

  /****************************************************************************
                               getEmployee
  ****************************************************************************/

  describe('getEmployee', () => {
    it(
      'should return employee with current salary and salary history',
      async () => {
        const employeeData = {
          id: EMPLOYEE_ID,

          employeeCode: 'EMP000001',

          firstName: 'Aarav',

          lastName: 'Sharma',

          email:
            'aarav.sharma.1@acme.com',

          department: 'Engineering',

          jobTitle:
            'Software Engineer',

          country: 'India',

          hireDate: '2015-01-01',

          status: 'ACTIVE',

          /*
           * Sorted DESC just like the
           * Sequelize query in the service.
           */
          salaryHistory: [
            {
              id: 'salary-future',

              employeeId:
                EMPLOYEE_ID,

              baseSalary:
                '2000000.00',

              currency: 'INR',

              effectiveFrom:
                '2027-01-01',

              reason:
                'Future adjustment',
            },

            {
              id: 'salary-current',

              employeeId:
                EMPLOYEE_ID,

              baseSalary:
                '1500000.00',

              currency: 'INR',

              effectiveFrom:
                '2026-01-01',

              reason:
                'Annual review',
            },

            {
              id: 'salary-old',

              employeeId:
                EMPLOYEE_ID,

              baseSalary:
                '1200000.00',

              currency: 'INR',

              effectiveFrom:
                '2025-01-01',

              reason: null,
            },
          ],
        };

        vi.spyOn(
          EmployeeModel,
          'findOne',
        ).mockResolvedValue({
          get: vi
            .fn()
            .mockReturnValue(
              employeeData,
            ),
        } as unknown as EmployeeModel);

        const result =
          await Employee.getEmployee(
            EMPLOYEE_ID,
          );

        expect(
          EmployeeModel.findOne,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              id: EMPLOYEE_ID,
            },
          }),
        );

        expect(result.id).toBe(
          EMPLOYEE_ID,
        );

        expect(
          result.salaryHistory,
        ).toHaveLength(3);

        /*
         * Future salary must NOT become
         * the current salary.
         */
        expect(
          result.currentSalary,
        ).toEqual({
          baseSalary:
            '1500000.00',

          currency: 'INR',

          effectiveFrom:
            '2026-01-01',
        });
      },
    );

    it(
      'should not use a future salary as current salary',
      async () => {
        const employeeData = {
          id: EMPLOYEE_ID,

          salaryHistory: [
            {
              id: 'salary-future',

              employeeId:
                EMPLOYEE_ID,

              baseSalary:
                '2000000.00',

              currency: 'INR',

              effectiveFrom:
                '2027-01-01',
            },

            {
              id: 'salary-current',

              employeeId:
                EMPLOYEE_ID,

              baseSalary:
                '1500000.00',

              currency: 'INR',

              effectiveFrom:
                '2026-01-01',
            },
          ],
        };

        vi.spyOn(
          EmployeeModel,
          'findOne',
        ).mockResolvedValue({
          get: vi
            .fn()
            .mockReturnValue(
              employeeData,
            ),
        } as unknown as EmployeeModel);

        const result =
          await Employee.getEmployee(
            EMPLOYEE_ID,
          );

        expect(
          result.currentSalary,
        ).toEqual({
          baseSalary:
            '1500000.00',

          currency: 'INR',

          effectiveFrom:
            '2026-01-01',
        });

        expect(
          result.currentSalary
            ?.baseSalary,
        ).not.toBe(
          '2000000.00',
        );
      },
    );

    it(
      'should return null currentSalary when only future salaries exist',
      async () => {
        const employeeData = {
          id: EMPLOYEE_ID,

          salaryHistory: [
            {
              id: 'salary-future',

              employeeId:
                EMPLOYEE_ID,

              baseSalary:
                '2000000.00',

              currency: 'INR',

              effectiveFrom:
                '2027-01-01',
            },
          ],
        };

        vi.spyOn(
          EmployeeModel,
          'findOne',
        ).mockResolvedValue({
          get: vi
            .fn()
            .mockReturnValue(
              employeeData,
            ),
        } as unknown as EmployeeModel);

        const result =
          await Employee.getEmployee(
            EMPLOYEE_ID,
          );

        expect(
          result.currentSalary,
        ).toBeNull();
      },
    );

    it(
      'should throw 404 when employee does not exist',
      async () => {
        vi.spyOn(
          EmployeeModel,
          'findOne',
        ).mockResolvedValue(null);

        await expect(
          Employee.getEmployee(
            EMPLOYEE_ID,
          ),
        ).rejects.toMatchObject({
          status: NOT_FOUND,

          message:
            'Employee not found',
        });
      },
    );
  });

  /****************************************************************************
                               updateSalary
  ****************************************************************************/

  describe('updateSalary', () => {
    const payload = {
      baseSalary: 1500000,

      currency: 'inr',

      effectiveFrom:
        '2026-07-22' as unknown as Date,

      reason:
        'Annual compensation review',
    };

    it(
      'should create a new salary record',
      async () => {
        vi.spyOn(
          EmployeeModel,
          'findByPk',
        ).mockResolvedValue({
          id: EMPLOYEE_ID,
        } as EmployeeModel);

        const salaryResponse = {
          id: 'salary-id',

          employeeId:
            EMPLOYEE_ID,

          baseSalary:
            '1500000.00',

          currency: 'INR',

          effectiveFrom:
            '2026-07-22',

          reason:
            'Annual compensation review',
        };

        vi.spyOn(
          EmployeeSalaryModel,
          'create',
        ).mockResolvedValue({
          get: vi
            .fn()
            .mockReturnValue(
              salaryResponse,
            ),
        } as unknown as EmployeeSalaryModel);

        const result =
          await Employee.updateSalary(
            EMPLOYEE_ID,
            payload,
          );

        expect(
          EmployeeModel.findByPk,
        ).toHaveBeenCalledWith(
          EMPLOYEE_ID,
          {
            attributes: ['id'],
          },
        );

        expect(
          EmployeeSalaryModel.create,
        ).toHaveBeenCalledWith({
          employeeId:
            EMPLOYEE_ID,

          baseSalary:
            '1500000',

          currency: 'INR',

          effectiveFrom:
            payload.effectiveFrom,

          reason:
            'Annual compensation review',
        });

        expect(result).toEqual(
          salaryResponse,
        );
      },
    );

    it(
      'should convert currency to uppercase',
      async () => {
        vi.spyOn(
          EmployeeModel,
          'findByPk',
        ).mockResolvedValue({
          id: EMPLOYEE_ID,
        } as EmployeeModel);

        vi.spyOn(
          EmployeeSalaryModel,
          'create',
        ).mockResolvedValue({
          get: vi
            .fn()
            .mockReturnValue({
              employeeId:
                EMPLOYEE_ID,

              currency: 'USD',
            }),
        } as unknown as EmployeeSalaryModel);

        await Employee.updateSalary(
          EMPLOYEE_ID,
          {
            ...payload,
            currency: 'usd',
          },
        );

        expect(
          EmployeeSalaryModel.create,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            currency: 'USD',
          }),
        );
      },
    );

    it(
      'should set reason to null when reason is not provided',
      async () => {
        vi.spyOn(
          EmployeeModel,
          'findByPk',
        ).mockResolvedValue({
          id: EMPLOYEE_ID,
        } as EmployeeModel);

        vi.spyOn(
          EmployeeSalaryModel,
          'create',
        ).mockResolvedValue({
          get: vi
            .fn()
            .mockReturnValue({}),
        } as unknown as EmployeeSalaryModel);

        const effectiveFrom =
          '2026-07-22' as unknown as Date;

        await Employee.updateSalary(
          EMPLOYEE_ID,
          {
            baseSalary: 1500000,

            currency: 'INR',

            effectiveFrom,

            /*
             * Your current interface requires
             * reason, so explicitly pass undefined.
             *
             * If you change reason to optional,
             * this line can be removed.
             */
            reason: undefined,
          },
        );

        expect(
          EmployeeSalaryModel.create,
        ).toHaveBeenCalledWith({
          employeeId:
            EMPLOYEE_ID,

          baseSalary:
            '1500000',

          currency: 'INR',

          effectiveFrom,

          reason: null,
        });
      },
    );

    it(
      'should throw 404 when employee does not exist',
      async () => {
        vi.spyOn(
          EmployeeModel,
          'findByPk',
        ).mockResolvedValue(null);
        const createSpy = vi.spyOn(
            EmployeeSalaryModel,
            'create',
        );

        await expect(
          Employee.updateSalary(
            EMPLOYEE_ID,
            payload,
          ),
        ).rejects.toMatchObject({
          status: NOT_FOUND,

          message:
            'Employee not found',
        });

        expect(
          createSpy,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      'should throw 409 when salary already exists for effective date',
      async () => {
        vi.spyOn(
          EmployeeModel,
          'findByPk',
        ).mockResolvedValue({
          id: EMPLOYEE_ID,
        } as EmployeeModel);

        vi.spyOn(
          EmployeeSalaryModel,
          'create',
        ).mockRejectedValue(
          new UniqueConstraintError({
            message:
              'Duplicate salary effective date',

            errors: [],
          }),
        );

        await expect(
          Employee.updateSalary(
            EMPLOYEE_ID,
            payload,
          ),
        ).rejects.toMatchObject({
          status: CONFLICT,

          message:
            'A salary record already exists for this effective date',
        });
      },
    );
  });
});