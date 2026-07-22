# Frontend

React frontend for the ACME Employee Salary Management system, built with **React, TypeScript, and Vite**.

## Prerequisites

* Node.js
* npm
* Running backend API

## Setup

Install dependencies:

```bash
npm install
```

Configure the backend API base URL in the environment file:

```env
VITE_API_BASE_URL=http://localhost:<BACKEND_PORT>/api
```

Use the actual backend port and API prefix configured in the project.

## Run

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in the terminal.

## Build

Create a production build:

```bash
npm run build
```

## Features

* Employee directory with server-side pagination
* Employee search and filters
* Employee details and salary history
* Effective-dated salary updates
* Compensation summary
* Department and country compensation breakdowns
* Salary distribution visualization

## API Integration

The frontend communicates with the backend through REST APIs.

Local API:

`http://localhost:<BACKEND_PORT>/api`

Production API:

`<deployed-backend-url>`

## Project Structure

```text
src/
├── api/
├── components/
├── pages/
├── types/
└── App.tsx
```
