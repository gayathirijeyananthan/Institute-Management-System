cd # Institute Management System

Production-ready MERN foundation for a multi-tenant institute management system.

## Stack

- Frontend: React, React Router DOM, Redux Toolkit, Axios, Tailwind CSS, React Hook Form, Yup, React Toastify, Recharts
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, cookie-parser, cors, multer

## Setup

1. Install dependencies:

```bash
cd backend
npm install
cd ../frontend
npm install
```

2. Configure environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start MongoDB locally, then seed the database:

```bash
cd backend
npm run seed
```

Seed login:

```text
admin@northstar.edu
Password123
```

4. Run the backend and frontend in separate terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`
API: `http://localhost:5000/api`

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- CRUD: `/api/centers`, `/api/cohorts`, `/api/students`, `/api/staff`, `/api/activities`, `/api/attendance`, `/api/announcements`
- Dashboard: `GET /api/dashboard`

All protected resource routes scope reads and writes by `instituteId`.
