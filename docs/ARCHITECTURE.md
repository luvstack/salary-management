# Architecture

## Overview

The application is a full-stack employee salary management system designed for an organization with 10,000 employees.

The system consists of:

- React frontend
- Node.js + TypeScript + Express backend
- Sequelize ORM
- PostgreSQL relational database

## High-Level Architecture

React Frontend
        |
        | REST APIs
        v
Node.js / Express Backend
        |
        |-- Request Validation
        |-- Employee Service
        |-- Analytics Service
        |
        v
Sequelize / Raw SQL
        |
        v
PostgreSQL

The frontend communicates with the backend through REST APIs.

The backend is responsible for validation, business logic, salary management, and compensation analytics.

PostgreSQL is the source of truth for employee and salary data.

---

## Data Model

The system mainly uses two entities:

### Employee

Stores employee information such as:

- Employee code
- First name
- Last name
- Email
- Department
- Job title
- Country
- Hire date
- Status

### Employee Salary

Stores salary records separately from employees.

Each salary record contains:

- Employee ID
- Base salary
- Currency
- Effective date
- Reason

An employee can have multiple salary records.

Employee
  |
  |-- Salary Record 1
  |-- Salary Record 2
  |-- Salary Record 3

This allows the system to maintain complete salary history instead of overwriting the previous salary.

---

## Effective-Dated Salary Design

Salary updates are append-only.

When an employee receives a salary change, a new salary record is created instead of updating the existing record.

The current salary is determined using the latest salary where:

effective_from <= CURRENT_DATE

This also allows future salary changes to be scheduled.

Example:

Jan 2025 - 1,000,000 INR
Jan 2026 - 1,200,000 INR   <- Current
Jan 2027 - 1,500,000 INR   <- Future

A unique constraint on:

(employee_id, effective_from)

prevents multiple salary records for the same employee on the same effective date.

---

## Employee Directory

The Employee Directory supports:

- Server-side pagination
- Search
- Country filtering
- Department filtering
- Status filtering
- Salary-range filtering
- Sorting

Pagination and filtering are performed in the database instead of loading all 10,000 employees into the frontend.

The current salary is retrieved using the latest currently effective salary record for each employee.

Search requests are debounced on the frontend to reduce unnecessary API calls.

---

## Compensation Analytics

The analytics dashboard provides:

- Headcount
- Total payroll
- Average salary
- Median salary
- Minimum salary
- Maximum salary
- Department breakdown
- Country breakdown
- Salary distribution

Analytics calculations are performed directly in PostgreSQL instead of loading thousands of salary records into Node.js.

PostgreSQL functions are used for calculations such as:

- PERCENTILE_CONT for median salary
- WIDTH_BUCKET for salary distribution
- GROUP BY for compensation breakdowns

Independent analytics queries are executed concurrently using Promise.all().

---

## Multi-Currency Handling

Employees are paid in multiple currencies.

The application does not combine different currencies into a single payroll or average salary.

For example:

INR + USD + EUR

would not produce a meaningful financial value without defining exchange rates and a conversion date.

Therefore, compensation analytics are grouped by currency.

Currency conversion was deliberately kept outside the scope of this assessment.

---

## Performance Considerations

The system was designed to efficiently handle the seeded dataset of 10,000 employees.

Key decisions include:

- Server-side pagination instead of loading all employees.
- Database-side search and filtering.
- Parameterized SQL queries.
- Database indexes for frequently queried fields.
- Efficient lookup of the latest effective salary.
- PostgreSQL aggregation for analytics.
- Concurrent execution of independent analytics queries.

For significantly larger datasets, possible future improvements include:

- Keyset pagination.
- Materialized views for expensive analytics.
- Additional indexes based on production query patterns.
- Caching frequently requested analytics.

These optimizations were not added because they are unnecessary for the current scale without evidence from production usage.

---

## Testing

Core backend functionality is covered by unit tests.

Database interactions are mocked so tests remain:

- Fast
- Deterministic
- Independent of a running database

Tests cover important scenarios including:

- Employee retrieval and pagination
- Search and filters
- Current salary calculation
- Future-dated salaries
- Salary updates
- Missing employees
- Duplicate salary effective dates
- Compensation analytics
- Database failure handling

---

## Key Technical Decisions

### PostgreSQL

A relational database was chosen because employee and salary data have clear relationships and require strong data integrity.

### Sequelize + Raw SQL

Sequelize is used for models and standard database operations.

Raw SQL is used for complex employee queries and compensation analytics where greater SQL control and PostgreSQL-specific functionality are useful.

### Effective-Dated Salary History

Salary records are appended instead of overwritten to preserve historical data and support future salary changes.

### Server-Side Pagination

Only the required page of employees is returned to the frontend, making the application efficient for 10,000 employees.

### Simple Frontend State

React local state is sufficient for the current application scope, so an additional global state-management library was not introduced.

---

## Deliberately Avoided Complexity

The solution intentionally avoids unnecessary complexity such as:

- Microservices
- Redis caching
- Redux
- Dedicated search infrastructure
- Complex charting libraries
- Premature database optimization

The architecture focuses on solving the assessment requirements with a maintainable design while leaving clear paths for future scaling.