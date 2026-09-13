# Leaf Village Food Delivery

A Naruto-inspired food delivery web application with a shared backend and two separate frontends:

- User storefront for browsing restaurants, foods, cart, checkout, and profile
- Admin dashboard for managing catalog and orders
- Single Express backend serving both apps through the same PostgreSQL database

## Project structure

```bash
Food-Delivery/
├── backend/
│   ├── .env
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   ├── package.json
│   └── server.js
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
├── user-frontend/
│   ├── .env
│   ├── package.json
│   └── src/
├── admin-frontend/
│   ├── .env
│   ├── package.json
│   └── src/
├── README.md
└── .gitignore
```

## Tech stack

- React + Vite for both frontends
- Express + Node.js for the shared backend
- PostgreSQL with raw SQL queries
- JWT + bcrypt for authentication
- Axios for API calls

## Environment setup

### Backend

Create a PostgreSQL database named `naruto_food` and update `backend/.env` if needed:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=naruto_food
JWT_SECRET=super_secure_naruto_secret_key
```

Then initialize the schema and seed data:

```bash
cd backend
npm install
node -e "console.log('ready')"
```

Create database tables using the SQL files:

```bash
createdb naruto_food
psql -d naruto_food -f ../database/schema.sql
psql -d naruto_food -f ../database/seed.sql
```

Seed the admin account and demo menu data:

```bash
cd backend
npm run seed
```

The admin account created by the seed is:

- Email: `admin@leafvillage.com`
- Password: `admin123`

## Run the app

### Backend

```bash
cd backend
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

### User Frontend

```bash
cd user-frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

### Admin Frontend

```bash
cd admin-frontend
npm install
npm run dev
```

Admin app runs at:

```text
http://localhost:5174
```

## API overview

Shared backend routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/restaurants`
- `GET /api/categories`
- `GET /api/foods`
- `GET /api/orders`
- `GET /api/users`
- `GET /api/cart`

## Notes

- The app is intentionally built with raw SQL instead of an ORM for clarity and beginner-friendly onboarding.
- The entire app is designed around a single backend serving both storefront and admin experiences.
- The styling is inspired by a warm, modern anime-inspired palette while avoiding direct copyrighted imagery.

## Verification status

This workspace successfully built both Vite frontends:

- user-frontend production build passed
- admin-frontend production build passed

The local PostgreSQL service was not installed in the current environment, so the database smoke test could not be completed here. Once PostgreSQL is available locally, run the schema and seed scripts above, then launch the backend and frontends together.
