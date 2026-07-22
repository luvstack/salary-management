# AI Development Prompts

AI tools were used throughout development to accelerate planning, implementation, debugging, testing, and frontend development.

Below are representative prompts/instructions used during the project.

## Planning & Architecture

- Analyze the assessment requirements and suggest an MVP scope for an employee salary management system supporting 10,000 employees.
- Suggest a backend architecture using Node.js, TypeScript, Express, Sequelize, and PostgreSQL.
- Design a relational database schema for employees and salary history.
- How should salary history be modeled so historical and future-dated salary changes are supported?
- What should be deliberately left out of the MVP to avoid overengineering?

## Backend Development

- Design APIs for employee listing, employee details, salary updates, and compensation analytics.
- Implement server-side pagination, search, filtering, and sorting for 10,000 employees.
- Optimize the employee query to efficiently retrieve only the current effective salary.
- How should the current salary be determined when future-dated salary records exist?
- Review this Sequelize/raw PostgreSQL query for correctness and performance.
- How should duplicate salary records for the same employee and effective date be handled?

## Compensation Analytics

- Design compensation analytics that help an HR manager understand how the organization pays employees.
- Calculate headcount, total payroll, average salary, median salary, minimum salary, and maximum salary.
- Create compensation breakdowns by department and country.
- Design salary-distribution buckets using PostgreSQL.
- How should compensation analytics handle employees paid in different currencies?
- Optimize analytics queries for larger employee datasets.

## Testing

- Create unit tests for the employee service while mocking database access.
- Ensure tests do not execute real database queries.
- Add test cases for pagination, search, filters, employee details, and salary updates.
- Test future-dated salaries so they do not incorrectly become the current salary.
- Test duplicate effective-date salary updates and conflict handling.
- Create deterministic unit tests for compensation analytics.

## Debugging

- Diagnose PostgreSQL SQL errors from the provided runtime error and query.
- Analyze PostgreSQL EXPLAIN ANALYZE output and suggest whether optimization is necessary.
- Fix Sequelize/raw SQL column-name mismatches between camelCase model attributes and snake_case database columns.
- Diagnose Joi validation errors for minimum and maximum salary query parameters.
- Diagnose Vitest configuration and mocking issues after removing unused starter-code files.

## Frontend Development

- Build a React employee directory connected to the existing backend API.
- Add server-side pagination with First, Previous, Next, and Last navigation.
- Add debounced employee search.
- Add country, department, status, and salary-range filters.
- Build an employee details page showing current compensation and salary history.
- Add an update-salary form and refresh employee data after a successful update.
- Build a compensation analytics dashboard for summary, department, country, and salary-distribution data.

## Review & Refinement

- Review the implementation against the original assessment requirements.
- Identify missing requirements versus optional enhancements.
- Suggest performance considerations for supporting 10,000 employees and potentially larger datasets.
- Identify unnecessary features that should not be added to keep the solution appropriately scoped.
- Suggest final documentation and artifacts needed for submission.