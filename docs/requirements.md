# ACME Employee Salary Management — Requirements (v1)

## Goal

Build web-based employee salary management software for ACME, an organization with **10,000 employees** across multiple countries. Replace error-prone Excel workflows so an HR Manager can maintain salary data and answer questions about how the organization pays people.

## Persona & Problem

**Persona:** HR Manager at ACME.

**Problem:** Salary data for ~10,000 employees is spread across spreadsheets. Updating records is slow, search is painful, and answering org-level pay questions requires manual pivot tables. We need a single system to manage records and surface compensation insights.

## Scope & Features (v1)

### Employee directory

* Paginated list with search (name, email, employee ID)
* Filter by country, department, status, and salary range
* View employee profile (name, department, country, job title, hire date, status)

### Salary management

* View current salary per employee (latest currently effective record)
* Update salary with effective date — **append-only history**, no silent overwrites
* Support future-dated salary changes without incorrectly treating them as current salary
* View full salary history for an employee

### Compensation insights

* Org summary by currency: headcount, total payroll, average / median / min / max salary
* Breakdown by **department** and **country** (headcount, average, median, total payroll)
* Salary distribution visualization using salary-range buckets

### Platform

| Layer     | Choice                                         |
| --------- | ---------------------------------------------- |
| Backend   | Express + TypeScript, REST API                 |
| Database  | PostgreSQL (relational, indexed for 10k+ rows) |
| ORM       | Sequelize (models, migrations, seed scripts)   |
| Frontend  | React                                          |
| Seed data | Script generating 10,000 realistic employees   |

## Deliberately Out of Scope (v1)

| Excluded                          | Reason                                                                                                                                    |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication / RBAC             | Core HR workflows are the focus; authentication and authorization can be added later without changing the core compensation domain model. |
| Multi-currency normalization      | Salaries are stored in local currency; analytics remain currency-specific to avoid introducing FX rate and conversion-date dependencies.  |
| Bonuses, equity, benefits         | Annual base salary answers the primary "how we pay" question; total compensation is a follow-on feature.                                  |
| Raise approval workflows          | HR Manager updates salaries directly; approval workflows are a separate product capability.                                               |
| Payroll execution (tax, payslips) | This is **compensation management**, not payroll processing.                                                                              |
| Bulk CSV import/export            | Seed scripts provide the assessment dataset; import/export can be added once data migration requirements are defined.                     |
| Audit log UI                      | Append-only salary history preserves compensation changes at the data layer; a dedicated audit interface is deferred.                     |

## Non-Functional Requirements

* Employee listing and search should remain responsive at the **10,000-employee** target scale using indexed queries and server-side pagination
* Fast, deterministic unit tests covering core business logic without requiring a live database
* Layered architecture: routes/controllers → services → Sequelize / SQL → PostgreSQL
* Maintainable, readable code with clear separation of responsibilities
* Incremental git commits showing design and implementation evolution

## Success Criteria

An HR Manager can find any employee quickly, review their compensation history, update or schedule a salary change with history preserved, and answer organization-level compensation questions across currencies, departments, and countries — without opening Excel.
