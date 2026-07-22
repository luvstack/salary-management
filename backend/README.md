# Backend

REST API for the ACME Employee Salary Management system built with **Node.js, Express, TypeScript, Sequelize, and PostgreSQL**.

## Prerequisites

* Node.js
* npm
* PostgreSQL

## Setup

Install dependencies:

```bash
npm install
```

Create the environment file and configure your PostgreSQL connection:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=<database_name>
DB_USER=<database_user>
DB_PASSWORD=<database_password>
```

Update the variable names above if your local `.env` configuration uses different names.

## Database

Create the PostgreSQL database, then run migrations:

```bash
npm run migrate:up
```

Seed the database with **10,000 employees and salary records**:

```bash
npm run seed
```

> Use the migration and seed commands defined in `package.json` if they differ from the commands above.

## Run

Start the development server:

```bash
npm run dev
```

## API Base URL

Local development:

`http://localhost:<PORT>/api/v1`

Production:

`<deployed-backend-url>`

## Tests

Run unit tests:

```bash
npm test
```

Tests use mocked database interactions to remain fast and deterministic.

## Core APIs

The backend provides APIs for:

* Employee listing, search, filtering, sorting, and pagination
* Employee details and salary history
* Effective-dated salary updates
* Compensation analytics

## Project Structure

```text
src/
├── controllers/
├── services/
├── models/
├── routes/
├── migrations/
├── seeders/
├── common/
└── types/
```

## Key Design

Salary changes are stored as **effective-dated records** instead of overwriting previous salaries.

The current salary is determined from the latest salary record effective on or before the current date, preserving complete salary history and supporting future-dated salary changes.
