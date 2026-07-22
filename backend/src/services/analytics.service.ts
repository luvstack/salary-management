import { QueryTypes } from 'sequelize';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/utils/route-errors';
import logger from 'jet-logger';
import {
 ICompensationAnalyticsResponse,
 ICompensationSummary,
 ICompensationBreakdown,
 ISalaryDistribution
} from '@src/types';
import { sequelize } from '@src/db';

export class Analytic {
    static async getCompensationAnalytics():Promise<ICompensationAnalyticsResponse> {
        try {
            /*
            * Select exactly one currently effective salary
            * for each employee.
            *
            * Future-dated salaries are excluded.
            */

            const CURRENT_SALARIES_CTE = `
                WITH current_salaries AS (
                    SELECT DISTINCT ON (es.employee_id)
                    es.employee_id,
                    es.base_salary,
                    es.currency

                    FROM employee_salaries es

                    WHERE
                    es.effective_from <= CURRENT_DATE

                    ORDER BY
                    es.employee_id,
                    es.effective_from DESC,
                    es.created_at DESC
                )
                `;

            const query = `
                ${CURRENT_SALARIES_CTE}

                SELECT
                cs.currency,

                COUNT(*)::int AS "headcount",

                SUM(cs.base_salary)::text
                    AS "totalPayroll",

                ROUND(
                    AVG(cs.base_salary),
                    2
                )::text AS "averageSalary",

                ROUND(
                    PERCENTILE_CONT(0.5)
                    WITHIN GROUP (
                        ORDER BY cs.base_salary
                    )::numeric,
                    2
                )::text AS "medianSalary",

                MIN(cs.base_salary)::text
                    AS "minSalary",

                MAX(cs.base_salary)::text
                    AS "maxSalary"

                FROM current_salaries cs

                GROUP BY
                cs.currency

                ORDER BY
                cs.currency ASC
            `;

            const departmentQuery = `
                ${CURRENT_SALARIES_CTE}

                SELECT
                e.department AS name,
                cs.currency,

                COUNT(*)::int
                    AS "headcount",

                SUM(cs.base_salary)::text
                    AS "totalPayroll",

                ROUND(
                    AVG(cs.base_salary),
                    2
                )::text AS "averageSalary",

                ROUND(
                    PERCENTILE_CONT(0.5)
                    WITHIN GROUP (
                        ORDER BY cs.base_salary
                    )::numeric,
                    2
                )::text AS "medianSalary"

                FROM current_salaries cs

                INNER JOIN employees e
                ON e.id = cs.employee_id

                GROUP BY
                e.department,
                cs.currency

                ORDER BY
                e.department,
                cs.currency;
            `;

            const countryQuery = `
                ${CURRENT_SALARIES_CTE}
            
                SELECT
                e.country AS name,
                cs.currency,
            
                COUNT(*)::int
                    AS "headcount",
            
                SUM(cs.base_salary)::text
                    AS "totalPayroll",
            
                ROUND(
                    AVG(cs.base_salary),
                    2
                )::text AS "averageSalary",
            
                ROUND(
                    PERCENTILE_CONT(0.5)
                    WITHIN GROUP (
                        ORDER BY cs.base_salary
                    )::numeric,
                    2
                )::text AS "medianSalary"
            
                FROM current_salaries cs
            
                INNER JOIN employees e
                ON e.id = cs.employee_id
            
                GROUP BY
                e.country,
                cs.currency
            
                ORDER BY
                e.country,
                cs.currency
            `;

            const distributionQuery = `
                ${CURRENT_SALARIES_CTE}

                salary_ranges AS (
                    SELECT
                    currency,
                    MIN(base_salary) AS min_salary,
                    MAX(base_salary) AS max_salary

                    FROM current_salaries

                    GROUP BY currency
                ),

                bucketed AS (
                    SELECT
                    cs.currency,

                    WIDTH_BUCKET(
                        cs.base_salary,
                        sr.min_salary,
                        sr.max_salary + 1,
                        10
                    ) AS bucket,

                    sr.min_salary,
                    sr.max_salary

                    FROM current_salaries cs

                    INNER JOIN salary_ranges sr
                    ON sr.currency = cs.currency
                )

                SELECT
                    currency,

                    bucket,

                    COUNT(*)::int AS "employeeCount",

                    ROUND(
                    MIN(min_salary) +
                    (
                        (bucket - 1) *
                        (
                        (
                            MAX(max_salary) -
                            MIN(min_salary)
                        ) / 10
                        )
                    ),
                    2
                    )::text AS "rangeStart",

                    ROUND(
                    MIN(min_salary) +
                    (
                        bucket *
                        (
                        (
                            MAX(max_salary) -
                            MIN(min_salary)
                        ) / 10
                        )
                    ),
                    2
                    )::text AS "rangeEnd"

                FROM bucketed

                GROUP BY
                    currency,
                    bucket

                ORDER BY
                    currency,
                    bucket
                `;

            const [summary, byDepartment, byCountry, salaryDistribution] = await Promise.all([
                sequelize.query<ICompensationSummary>(query,{type: QueryTypes.SELECT}),
                sequelize.query<ICompensationBreakdown>(departmentQuery, {type: QueryTypes.SELECT}),
                sequelize.query<ICompensationBreakdown>(countryQuery, {type: QueryTypes.SELECT}),
                sequelize.query<ISalaryDistribution>(distributionQuery, {type: QueryTypes.SELECT})
            ]);

            return {
                summary,
                byDepartment,
                byCountry,
                salaryDistribution,
            };
        } catch (error) {
            if (error instanceof RouteError) {
                throw error;
            }

            logger.err(error as Error);

            throw new RouteError(
                HttpStatusCodes.INTERNAL_SERVER_ERROR,
                'Failed to fetch compensation analytics',
            );
        }
    }
}

