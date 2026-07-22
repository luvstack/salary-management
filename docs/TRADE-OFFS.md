# ACME Employee Salary Management — Engineering Trade-offs

This document summarizes the key engineering trade-offs made while building the solution.

## 1. PostgreSQL over SQLite

**Decision:** PostgreSQL was chosen for stronger relational constraints, indexing, and analytics capabilities such as `PERCENTILE_CONT` and `WIDTH_BUCKET`.

**Trade-off:** It requires more setup than SQLite but provides better support for the required compensation analytics and future scalability.

## 2. Sequelize + Raw SQL

**Decision:** Sequelize is used for models, migrations, and standard operations, while raw SQL is used for complex employee queries and analytics.

**Trade-off:** Raw SQL introduces PostgreSQL-specific code, but provides better control and clarity for complex queries than forcing everything through ORM abstractions.

## 3. Effective-Dated Salary History

**Decision:** Salary changes create new records instead of overwriting existing salaries.

The current salary is the latest record where:

`effective_from <= CURRENT_DATE`

**Trade-off:** Current salary retrieval becomes slightly more complex, but historical data is preserved and future salary changes can be scheduled.

## 4. Server-Side Pagination and Filtering

**Decision:** Pagination, search, filtering, and sorting are handled by the backend instead of loading all 10,000 employees into React.

**Trade-off:** This requires more backend query logic and API requests, but significantly reduces payload size and frontend processing.

`LIMIT/OFFSET` pagination was chosen because it is simple and sufficient for the current 10,000-employee scale. Keyset pagination could be considered for much larger datasets.

## 5. Currency-Specific Analytics

**Decision:** Compensation analytics are grouped by currency instead of calculating one global payroll or average.

**Trade-off:** The system does not provide a single normalized global compensation figure, but avoids misleading calculations without a defined FX-rate and conversion-date policy.

## 6. Database-Side Analytics

**Decision:** PostgreSQL performs payroll, average, median, breakdown, and salary-distribution calculations.

**Trade-off:** Queries are more SQL-heavy and database-specific, but avoid transferring thousands of records to Node.js for application-level aggregation.

## 7. No Premature Caching or Infrastructure

**Decision:** Redis, microservices, and analytics caching were not introduced.

**Trade-off:** Analytics queries execute against PostgreSQL on each request, but the architecture remains simpler and is sufficient for the current scale. Caching or materialized views can be introduced later based on measured performance.

## 8. Simple React Architecture

**Decision:** React local state and lightweight CSS-based visualizations are used instead of Redux and a charting library.

**Trade-off:** The UI has fewer advanced state-management and visualization features, but avoids unnecessary dependencies and complexity for the current scope.

## 9. Fast Unit Tests with Mocked Database Access

**Decision:** Core service tests mock database interactions.

**Trade-off:** Tests are fast and deterministic but do not fully validate SQL against a real PostgreSQL instance. Integration tests with a temporary database would be a logical next step for a production system.

## 10. Focused MVP Scope

**Decision:** Features such as authentication/RBAC, payroll processing, approval workflows, FX conversion, bonuses/equity, and bulk import/export were deliberately excluded.

**Trade-off:** The application is not a complete HRIS platform, but development remains focused on the core assessment goal: enabling an HR Manager to manage employee salaries and understand how the organization pays people.
