# ACME Employee Salary Management — Requirements (v1)

## Goal

Build web-based employee salary management software for ACME, an organization with **10,000 employees** across multiple countries. Replace error-prone Excel workflows so an HR Manager can maintain salary data and answer questions about how the organization pays people.

## Persona & Problem

**Persona:** HR Manager at ACME.

**Problem:** Salary data for ~10,000 employees is spread across spreadsheets. Updating records is slow, search is painful, and answering org-level pay questions requires manual pivot tables. We need a single system to manage records and surface compensation insights.

## Scope & Features (v1)

### Employee directory
- Paginated list with search (name, email, employee ID)
- Filter by country, department, status, and salary range
- View and edit employee profile (name, department, country, job title, hire date, status)

### Salary management
- View current salary per employee (latest effective record)
- Update salary with effective date — **append-only history**, no silent overwrites
- View full salary history for an employee

### Compensation insights
- Org summary: headcount, total payroll, average / median / min / max salary
- Breakdown by **department** and **country** (count, average, median, total payroll)
- Salary distribution chart (histogram with configurable buckets)

### Platform
| Layer | Choice |
|-------|--------|
| Backend | Express + TypeScript, REST API |
| Database | PostgreSQL (relational, indexed for 10k+ rows) |
| ORM | Sequelize (models, migrations, seed scripts) |
| Frontend | React (separate phase) |
| Seed data | Script generating 10,000 realistic employees |

## Deliberately Out of Scope (v1)

| Excluded | Reason |
|----------|--------|
| Authentication / RBAC | Core HR workflows are the focus; auth is straightforward to add later without changing domain logic. |
| Multi-currency normalization | Salaries stored in local currency; comparisons are per-currency to avoid FX rate dependencies. |
| Bonuses, equity, benefits | Annual base salary answers the primary "how we pay" question; total comp is a follow-on. |
| Raise approval workflows | HR Manager updates directly; workflow engine is a separate product feature. |
| Payroll execution (tax, payslips) | This is **compensation management**, not payroll processing. |
| Bulk CSV import/export | Seed script covers demo data; import/export once schema is stable. |
| Audit log UI | Salary history table provides data-layer audit trail; dedicated UI deferred. |

## Non-Functional Requirements

- Employee list/search under **500 ms** at 10k scale (indexed queries, server-side pagination)
- Fast, deterministic tests for services and API routes
- Layered architecture: routes → services → repositories → Sequelize → PostgreSQL
- Incremental git commits showing design evolution

## Success Criteria

An HR Manager can find any employee in seconds, update a salary with history preserved, and answer org-level compensation questions — without opening Excel.
