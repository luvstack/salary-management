import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { sequelize } from '@src/db';
import { Analytic } from '@src/services/analytics.service';

describe('Analytic Service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /****************************************************************************
                       getCompensationAnalytics
  ****************************************************************************/

  describe('getCompensationAnalytics', () => {
    it(
      'should return complete compensation analytics',
      async () => {
        const summary = [
          {
            currency: 'INR',
            headcount: 1250,
            totalPayroll: '3260350000.00',
            averageSalary: '2608280.00',
            medianSalary: '2608000.00',
            minSalary: '400000.00',
            maxSalary: '4816000.00',
          },
          {
            currency: 'USD',
            headcount: 1250,
            totalPayroll: '181812500.00',
            averageSalary: '145450.00',
            medianSalary: '145450.00',
            minSalary: '47050.00',
            maxSalary: '243850.00',
          },
        ];

        const byDepartment = [
          {
            name: 'Engineering',
            currency: 'INR',
            headcount: 300,
            totalPayroll: '750000000.00',
            averageSalary: '2500000.00',
            medianSalary: '2400000.00',
          },
        ];

        const byCountry = [
          {
            name: 'India',
            currency: 'INR',
            headcount: 1250,
            totalPayroll: '3260350000.00',
            averageSalary: '2608280.00',
            medianSalary: '2608000.00',
          },
        ];

        const salaryDistribution = [
          {
            currency: 'INR',
            bucket: 1,
            employeeCount: 150,
            rangeStart: '400000.00',
            rangeEnd: '841600.00',
          },
          {
            currency: 'INR',
            bucket: 2,
            employeeCount: 175,
            rangeStart: '841600.00',
            rangeEnd: '1283200.00',
          },
        ];

        const querySpy = vi.spyOn(
          sequelize,
          'query',
        );

        /*
         * Promise.all invokes these queries
         * in the same order they appear
         * in the service.
         */
        querySpy
          .mockResolvedValueOnce(
            summary as never,
          )
          .mockResolvedValueOnce(
            byDepartment as never,
          )
          .mockResolvedValueOnce(
            byCountry as never,
          )
          .mockResolvedValueOnce(
            salaryDistribution as never,
          );

        const result =
          await Analytic.getCompensationAnalytics();

        expect(result).toEqual({
          summary,
          byDepartment,
          byCountry,
          salaryDistribution,
        });

        expect(
          querySpy,
        ).toHaveBeenCalledTimes(4);
      },
    );

    it(
      'should keep compensation data separated by currency',
      async () => {
        const summary = [
          {
            currency: 'INR',
            headcount: 1250,
            totalPayroll: '3260350000.00',
            averageSalary: '2608280.00',
            medianSalary: '2608000.00',
            minSalary: '400000.00',
            maxSalary: '4816000.00',
          },
          {
            currency: 'USD',
            headcount: 1250,
            totalPayroll: '181812500.00',
            averageSalary: '145450.00',
            medianSalary: '145450.00',
            minSalary: '47050.00',
            maxSalary: '243850.00',
          },
        ];

        const querySpy = vi.spyOn(
          sequelize,
          'query',
        );

        querySpy
          .mockResolvedValueOnce(
            summary as never,
          )
          .mockResolvedValueOnce(
            [] as never,
          )
          .mockResolvedValueOnce(
            [] as never,
          )
          .mockResolvedValueOnce(
            [] as never,
          );

        const result =
          await Analytic.getCompensationAnalytics();

        expect(
          result.summary,
        ).toHaveLength(2);

        expect(
          result.summary.map(
            (item) => item.currency,
          ),
        ).toEqual([
          'INR',
          'USD',
        ]);

        expect(
          result.summary[0]
            .totalPayroll,
        ).toBe(
          '3260350000.00',
        );

        expect(
          result.summary[1]
            .totalPayroll,
        ).toBe(
          '181812500.00',
        );
      },
    );

    it(
      'should execute summary, department, country and distribution queries',
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
            [] as never,
          )
          .mockResolvedValueOnce(
            [] as never,
          )
          .mockResolvedValueOnce(
            [] as never,
          );

        await Analytic.getCompensationAnalytics();

        expect(
          querySpy,
        ).toHaveBeenCalledTimes(4);

        /*
         * Verify important SQL behavior
         * without testing PostgreSQL itself.
         */
        const queries =
          querySpy.mock.calls.map(
            ([sql]) => String(sql),
          );

        /*
         * All analytics queries should derive
         * currently effective salaries.
         */
        queries.forEach((sql) => {
          expect(sql).toContain(
            'es.effective_from <= CURRENT_DATE',
          );

          expect(sql).toContain(
            'DISTINCT ON (es.employee_id)',
          );
        });

        /*
         * Summary query.
         */
        expect(queries[0]).toContain(
          'GROUP BY',
        );

        expect(queries[0]).toContain(
          'cs.currency',
        );

        /*
         * Department breakdown.
         */
        expect(queries[1]).toContain(
          'e.department',
        );

        /*
         * Country breakdown.
         */
        expect(queries[2]).toContain(
          'e.country',
        );

        /*
         * Salary distribution.
         */
        expect(queries[3]).toContain(
          'WIDTH_BUCKET',
        );
      },
    );

    it(
      'should throw internal server error when database query fails',
      async () => {
        const querySpy = vi.spyOn(
          sequelize,
          'query',
        );

        /*
         * All four calls are started by
         * Promise.all, so mock all of them.
         */
        querySpy
          .mockRejectedValueOnce(
            new Error(
              'Database unavailable',
            ),
          )
          .mockResolvedValueOnce(
            [] as never,
          )
          .mockResolvedValueOnce(
            [] as never,
          )
          .mockResolvedValueOnce(
            [] as never,
          );

        await expect(
          Analytic.getCompensationAnalytics(),
        ).rejects.toMatchObject({
          status:
            HttpStatusCodes
              .INTERNAL_SERVER_ERROR,

          message:
            'Failed to fetch compensation analytics',
        });

        expect(
          querySpy,
        ).toHaveBeenCalledTimes(4);
      },
    );
  });
});