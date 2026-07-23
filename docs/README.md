# ACME Employee Salary Management

A full-stack employee salary management system for ACME's HR team to manage compensation data for **10,000 employees** across multiple countries.

## Features

* Employee directory with pagination, search, and filters
* Employee details and current compensation
* Effective-dated salary updates with complete salary history
* Future-dated salary support
* Compensation analytics by currency, department, and country
* Salary distribution visualization

## Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | React, TypeScript            |
| Backend  | Node.js, Express, TypeScript |
| Database | PostgreSQL                   |
| ORM      | Sequelize                    |
| Testing  | Vitest                       |

## Project Structure

```text
├── backend/
├── frontend/
├── docs/
│   ├── REQUIREMENTS.md
│   ├── ARCHITECTURE.md
│   ├── TRADEOFFS.md
│   └── AI-DEVELOPMENT.md
└── README.md
```

## Getting Started

See the individual setup instructions:

* `backend/README.md` — database, environment, migrations, seeding, and backend setup
* `frontend/README.md` — frontend setup and configuration

## Testing

```bash
cd backend
npm test
```

## Documentation

Detailed requirements, architecture, engineering trade-offs, and representative AI prompts are available in the `docs/` directory.

## Deployment

**Application:** https://salary-management-iota.vercel.app

**Video Demo:** https://www.loom.com/share/441b78d668ae4ab4ba83f8a59d492d0c
